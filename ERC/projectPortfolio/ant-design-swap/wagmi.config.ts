import { defineConfig } from "@wagmi/cli";
import { hardhat } from "@wagmi/cli/plugins";
import { react } from "@wagmi/cli/plugins";

export default defineConfig({
  out: "utils/contracts1.ts",
  plugins: [
    hardhat({
      project: "../demo-contract",
    }),
    react(),
  ],
});