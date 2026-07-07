import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      {
        source: "/api/salud/externo/:id",
        destination: `${process.env.NEXT_PUBLIC_SALUD_API_URL}/incidentes-salud/externo/:id`,
        has: [
          {
            type: "header",
            key: "x-api-key",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
