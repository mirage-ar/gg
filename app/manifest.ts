import { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "GG",
    short_name: "GG",
    description: "GG",
    start_url: "/",
    display: "standalone",
    orientation: "portrait",
    background_color: "#000",
    theme_color: "#000",
    icons: [
      {
        src: "/icons/icon-120.png",
        sizes: "120x120",
        type: "image/png",
      },
      {
        src: "/icons/icon-180.png",
        sizes: "180x180",
        type: "image/png",
      },
      {
        src: "/icons/icon-192.png",
        sizes: "192x192",
        type: "image/png",
      },
      {
        src: "/icons/icon-512.png",
        sizes: "512x512",
        type: "image/png",
      },
      {
        src: "/favicon.ico",
        sizes: "any",
        type: "image/x-icon",
      },
    ],
  };
}
