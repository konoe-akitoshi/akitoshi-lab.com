import assert from "node:assert/strict";
import test from "node:test";

import worker from "./worker.js";

async function runWithFetch(responses, callback) {
  const originalFetch = globalThis.fetch;
  const calls = [];

  globalThis.fetch = async (request) => {
    calls.push(new Request(request));
    const response = responses.shift();
    if (response instanceof Error) throw response;
    return response;
  };

  try {
    return await callback(calls);
  } finally {
    globalThis.fetch = originalFetch;
  }
}

test("returns successful and 404 primary responses without failing over", async () => {
  for (const status of [200, 404]) {
    await runWithFetch([new Response(null, { status })], async (calls) => {
      const response = await worker.fetch(new Request("https://akitoshi-lab.com/test"));

      assert.equal(response.status, status);
      assert.equal(response.headers.get("X-Akitoshi-Origin"), "onprem");
      assert.equal(calls.length, 1);
    });
  }
});

test("fails over GET requests when the Tunnel returns an origin error", async () => {
  await runWithFetch(
    [new Response(null, { status: 522 }), new Response("fallback", { status: 200 })],
    async (calls) => {
      const response = await worker.fetch(
        new Request("https://akitoshi-lab.com/works?from=test"),
      );

      assert.equal(await response.text(), "fallback");
      assert.equal(response.headers.get("X-Akitoshi-Origin"), "vercel");
      assert.equal(calls.length, 2);
      assert.equal(
        calls[1].url,
        "https://akitoshi-lab-com.vercel.app/works?from=test",
      );
    },
  );
});

test("fails over GET requests when the primary fetch rejects", async () => {
  await runWithFetch(
    [new Error("primary unavailable"), new Response(null, { status: 204 })],
    async (calls) => {
      const response = await worker.fetch(new Request("https://akitoshi-lab.com/"));

      assert.equal(response.status, 204);
      assert.equal(response.headers.get("X-Akitoshi-Origin"), "vercel");
      assert.equal(calls.length, 2);
    },
  );
});

test("does not replay non-idempotent requests against Vercel", async () => {
  await runWithFetch([new Response(null, { status: 503 })], async (calls) => {
    const response = await worker.fetch(
      new Request("https://akitoshi-lab.com/form", { method: "POST" }),
    );

    assert.equal(response.status, 503);
    assert.equal(response.headers.get("X-Akitoshi-Origin"), "onprem");
    assert.equal(calls.length, 1);
  });
});

test("rewrites Vercel redirects back to the public hostname", async () => {
  await runWithFetch(
    [
      new Response(null, { status: 503 }),
      new Response(null, {
        status: 302,
        headers: { Location: "https://akitoshi-lab-com.vercel.app/about" },
      }),
    ],
    async () => {
      const response = await worker.fetch(new Request("https://akitoshi-lab.com/old"));

      assert.equal(response.headers.get("Location"), "https://akitoshi-lab.com/about");
      assert.equal(response.headers.get("X-Akitoshi-Origin"), "vercel");
    },
  );
});
