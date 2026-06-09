import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "ClubRun — Running Club Management",
    short_name: "ClubRun",
    description: "Manage runs, pace groups, RSVPs and members for your Australian running club.",
    start_url: "/member",
    display: "standalone",
    background_color: "#1a2e4a",
    theme_color: "#1a2e4a",
    orientation: "portrait",
    icons: [
      { src: "/icon-192.png", sizes: "192x192", type: "image/png" },
      { src: "/icon-512.png", sizes: "512x512", type: "image/png" },
    ],
    categories: ["sports", "productivity"],
  };
}
