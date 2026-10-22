import { readFileSync } from "node:fs";

/** Permanent (301/308) redirects from the old WordPress URLs. Edit content/redirects.json. */
const { redirects } = JSON.parse(readFileSync(new URL("./content/redirects.json", import.meta.url), "utf8"));

/** @type {import('next').NextConfig} */
const nextConfig = {
  trailingSlash: true,
  poweredByHeader: false,
  images: {
    formats: ["image/avif", "image/webp"],
  },
  async redirects() {
    return redirects.map((r) => ({
      source: r.from,
      destination: r.to,
      permanent: true,
    }));
  },
  async rewrites() {
    return [{ source: "/cms/", destination: "/cms/index.html" }];
  },
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "X-Frame-Options", value: "SAMEORIGIN" },
          { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
        ],
      },
      {
        source: "/admin/:path*",
        headers: [{ key: "X-Robots-Tag", value: "noindex, nofollow" }],
      },
    ];
  },
};

export default nextConfig;
