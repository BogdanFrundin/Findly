import type { CapacitorConfig } from "@capacitor/cli";

// The native iOS/Android app loads the deployed FINDLY site.
// Change SITE_URL to your own domain before publishing to the stores.
const SITE_URL = process.env.FINDLY_URL || "https://findly-inky.vercel.app";

const config: CapacitorConfig = {
  appId: "ua.findly.app",
  appName: "FINDLY",
  webDir: "public",
  server: { url: SITE_URL, cleartext: false },
  ios: { contentInset: "always", backgroundColor: "#F6F0E8" },
  android: { backgroundColor: "#F6F0E8" },
};

export default config;
