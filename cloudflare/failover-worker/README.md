# akitoshi-lab.com failover Worker

Cloudflare Worker `akitoshi-lab-failover` runs on the route
`akitoshi-lab.com/*` in front of the existing Cloudflare Tunnel origin.

## Routing behavior

- `GET` and `HEAD` normally pass through to the origin configured by the
  existing proxied DNS record (the on-premises Cloudflare Tunnel).
- Statuses `500`, `502`, `503`, `504`, `521`-`526`, and `530`, or a failed
  primary `fetch()`, fall back to
  `https://akitoshi-lab-com.vercel.app` with the same path and query string.
- Other methods never fail over. This avoids replaying a potentially
  non-idempotent request against a second origin.
- `404` responses do not fail over because they indicate missing content,
  not an unavailable origin.
- A response header identifies the serving origin:
  `X-Akitoshi-Origin: onprem` or `X-Akitoshi-Origin: vercel`.
- Redirects from the Vercel deployment are rewritten back to the public
  `akitoshi-lab.com` origin.

## Cloudflare settings

- Worker: `akitoshi-lab-failover`
- Route: `akitoshi-lab.com/*`
- Route failure mode: **Fail open**. If the Worker itself reaches its free
  limit or fails to execute, Cloudflare bypasses it and continues to the
  existing Tunnel origin.
- Do not use the wildcard route `*.akitoshi-lab.com/*`; the failover is only
  intended for the apex website.

The Worker uses the Workers Free plan. Check the current Cloudflare limit
before relying on it for a substantially higher traffic volume.

## Smoke tests

```sh
node --test cloudflare/failover-worker/worker.test.mjs
curl -I https://akitoshi-lab.com/
curl -I https://akitoshi-lab.com/this-path-should-not-exist
curl -I https://akitoshi-lab-com.vercel.app/
```

Under normal operation the first response is `200` with
`X-Akitoshi-Origin: onprem`. The intentionally missing path remains `404` and
must not switch to Vercel. During an on-premises outage, the first response
should instead include `X-Akitoshi-Origin: vercel`.

The deployed code is currently managed in the Cloudflare dashboard. Keep
`worker.js` synchronized with dashboard edits until deployment is moved to
version-controlled CI.
