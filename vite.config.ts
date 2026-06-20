// vite.config.ts
import { defineConfig } from "@lovable.dev/vite-tanstack-config";
import { nitro } from "nitro/vite"; // Nitro adapter helper

export default defineConfig({
  tanstackStart: {
    // Redirect TanStack Start's bundled server entry to src/server.ts (our SSR error wrapper).
    server: { entry: "server" },
  },
  vite: {
    plugins: [
      // Force the underlying engine to export files structured exactly for Vercel
      nitro({
        preset: "vercel",
      }),
    ],
  },
});