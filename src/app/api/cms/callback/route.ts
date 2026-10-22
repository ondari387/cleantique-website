import { cookies } from "next/headers";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/** Step 2 of the GitHub OAuth flow: exchanges the code and hands the token to Decap CMS. */
export async function GET(req: Request) {
  const url = new URL(req.url);
  const code = url.searchParams.get("code");
  const state = url.searchParams.get("state");
  const jar = await cookies();
  const expected = jar.get("cms_oauth_state")?.value;

  const respond = (status: "success" | "error", content: Record<string, string>) => {
    const payload = JSON.stringify(`authorization:github:${status}:${JSON.stringify(content)}`);
    const html = `<!doctype html><html><body><script>
      (function () {
        function receive(e) {
          window.opener.postMessage(${payload}, e.origin);
          window.removeEventListener("message", receive, false);
        }
        window.addEventListener("message", receive, false);
        window.opener.postMessage("authorizing:github", "*");
      })();
    </script></body></html>`;
    return new Response(html, { headers: { "Content-Type": "text/html; charset=utf-8" } });
  };

  if (!code || !state || state !== expected) return respond("error", { error: "Invalid sign-in state. Please try again." });

  const res = await fetch("https://github.com/login/oauth/access_token", {
    method: "POST",
    headers: { Accept: "application/json", "Content-Type": "application/json" },
    body: JSON.stringify({
      client_id: process.env.GITHUB_OAUTH_CLIENT_ID,
      client_secret: process.env.GITHUB_OAUTH_CLIENT_SECRET,
      code,
    }),
  });
  const data = (await res.json().catch(() => ({}))) as { access_token?: string; error_description?: string };
  if (!data.access_token) return respond("error", { error: data.error_description || "GitHub sign-in failed." });
  return respond("success", { token: data.access_token, provider: "github" });
}
