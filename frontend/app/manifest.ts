import type { MetadataRoute } from "next";

// Without a manifest, Android "Add to home screen" and the PWA install prompt
// fall back to a screenshot of the page rather than the LOC mark. Same mark as
// the favicon, at the sizes Android asks for. `purpose: 'maskable'` lets Android
// crop to its own shape without eating into the letterforms — the mark already
// sits on a full-bleed copper ground.
//
// Colours track the light theme in globals.css: --background (37 50% 98%) and
// --primary (#A16036), not the org's dark copper-on-black. LOC is a light site.
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "LOC — Discover the World | Experiences, Stays & Hidden Gems",
    short_name: "LOC",
    description:
      "Discover the best tourism experiences, stays, and hidden gems around the world.",
    start_url: "/",
    display: "standalone",
    background_color: "#FCFAF7",
    theme_color: "#A16036",
    icons: [
      {
        src: "/icon.png",
        sizes: "256x256",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/icons/loc-mark.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable",
      },
      {
        src: "/apple-icon.png",
        sizes: "180x180",
        type: "image/png",
        purpose: "any",
      },
    ],
  };
}
