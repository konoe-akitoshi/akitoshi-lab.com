const FALLBACK_ORIGIN = "https://akitoshi-lab-com.vercel.app";
const FAILOVER_STATUSES = new Set([
  500, 502, 503, 504,
  521, 522, 523, 524, 525, 526, 530,
]);

function withOriginHeader(response, origin) {
  const result = new Response(response.body, response);
  result.headers.set("X-Akitoshi-Origin", origin);
  return result;
}

export default {
  async fetch(request) {
    const canFailOver = request.method === "GET" || request.method === "HEAD";

    try {
      const primaryResponse = await fetch(request);
      if (!canFailOver || !FAILOVER_STATUSES.has(primaryResponse.status)) {
        return withOriginHeader(primaryResponse, "onprem");
      }
    } catch (error) {
      if (!canFailOver) {
        throw error;
      }
    }

    const publicUrl = new URL(request.url);
    const fallbackUrl = new URL(
      publicUrl.pathname + publicUrl.search,
      FALLBACK_ORIGIN,
    );
    const fallbackRequest = new Request(fallbackUrl, request);
    const fallbackResponse = await fetch(fallbackRequest);
    const response = withOriginHeader(fallbackResponse, "vercel");

    const location = response.headers.get("Location");
    if (location) {
      const redirectUrl = new URL(location, fallbackUrl);
      if (redirectUrl.origin === FALLBACK_ORIGIN) {
        redirectUrl.protocol = publicUrl.protocol;
        redirectUrl.host = publicUrl.host;
        response.headers.set("Location", redirectUrl.toString());
      }
    }

    return response;
  },
};
