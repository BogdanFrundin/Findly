import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "FINDLY — AI-пошук одягу",
    short_name: "FINDLY",
    description: "Опиши, що хочеш. Ми знайдемо. Пошук одягу в магазинах України.",
    start_url: "/",
    display: "standalone",
    background_color: "#F6F0E8",
    theme_color: "#35251F",
    lang: "uk",
    icons: [
      { src: "/icon.svg", sizes: "any", type: "image/svg+xml" },
      { src: "/icon.svg", sizes: "any", type: "image/svg+xml", purpose: "maskable" },
    ],
  };
}
