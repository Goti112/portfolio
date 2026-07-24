import { spawn } from "node:child_process";
import { resolve } from "node:path";
import { startStaticPortfolioServer } from "./serve-static-portfolio";

function runLighthouseCi(): Promise<void> {
  const cliPath = resolve("node_modules", "@lhci", "cli", "src", "cli.js");
  const child = spawn(process.execPath, [cliPath, "autorun"], {
    cwd: process.cwd(),
    stdio: "inherit",
    windowsHide: true,
  });

  return new Promise((resolveRun, rejectRun): void => {
    child.once("error", (cause: Error): void => {
      rejectRun(new Error(`Could not launch Lighthouse CI from ${cliPath}`, { cause }));
    });
    child.once("exit", (exitCode: number | null, signal: NodeJS.Signals | null): void => {
      if (exitCode === 0) {
        resolveRun();
        return;
      }
      rejectRun(new Error(`Lighthouse CI exited unsuccessfully: code=${String(exitCode)} signal=${String(signal)}`));
    });
  });
}

async function auditPerformance(): Promise<void> {
  const server = await startStaticPortfolioServer();
  try {
    await runLighthouseCi();
  } finally {
    await server.close();
  }
}

void auditPerformance().catch((cause: unknown): void => {
  console.error("Performance audit failed", { cause });
  process.exitCode = 1;
});
