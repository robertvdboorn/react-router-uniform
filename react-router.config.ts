import { vercelPreset } from "@vercel/react-router/vite";
import type { Config } from "@react-router/dev/config";

export default {
  presets: [vercelPreset()],

  // Root directory for the app
  appDirectory: "app",
  
  // Server-side rendering enabled
  ssr: true,
  
  // Server build directory
  serverBuildFile: "index.js",
  
  // Build complete hook
  async buildEnd() {
    console.log('✅ Server build complete - environment configured');
  },
} satisfies Config;

