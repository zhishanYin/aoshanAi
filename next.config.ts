import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // next/image 远程图片白名单：出于安全考虑，远程域名必须显式声明，
  // 否则 <Image src="https://..." /> 会直接报错（防止被当图片代理滥用）
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "picsum.photos",
      },
    ],
  },
};

export default nextConfig;
