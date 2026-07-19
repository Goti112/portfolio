import { spawn } from "node:child_process";
import type { ChildProcess } from "node:child_process";
import path from "node:path";

const serverUrl = "http://127.0.0.1:3000";
const readinessAttempts = 60;
const readinessDelayMs = 250;
const shutdownTimeoutMs = 5_000;

function delay(milliseconds: number): Promise<void> {
  return new Promise((resolve): void => {
    setTimeout(resolve, milliseconds);
  });
}

async function assertPortIsAvailable(): Promise<void> {
  try {
    const response = await fetch(serverUrl);
    throw new Error(`Playwright server port is already in use: ${response.status} ${serverUrl}`);
  } catch (cause: unknown) {
    if (cause instanceof Error && cause.message.startsWith("Playwright server port is already in use")) {
      throw cause;
    }

    const connectionError = cause instanceof TypeError ? cause.cause : undefined;
    const errorCode = connectionError instanceof Error && "code" in connectionError
      ? connectionError.code
      : undefined;

    if (errorCode !== "ECONNREFUSED") {
      throw new Error(`Could not verify Playwright server port availability: ${serverUrl}`, { cause });
    }
  }
}

async function waitForServer(server: ChildProcess): Promise<void> {
  let lastError: unknown = new Error("The server did not answer any readiness request");

  for (let attempt = 1; attempt <= readinessAttempts; attempt += 1) {
    if (server.exitCode !== null) {
      throw new Error(`Playwright server exited before becoming ready with code ${server.exitCode}`);
    }

    try {
      const response = await fetch(serverUrl);
      if (response.ok) {
        return;
      }

      lastError = new Error(`Playwright server returned HTTP ${response.status}`);
    } catch (cause: unknown) {
      lastError = cause;
    }

    if (attempt % 10 === 0) {
      console.warn("Playwright server is not ready", { attempt, serverUrl });
    }
    await delay(readinessDelayMs);
  }

  throw new Error(`Playwright server did not become ready at ${serverUrl}`, { cause: lastError });
}

function waitForExit(server: ChildProcess): Promise<void> {
  if (server.exitCode !== null) {
    return Promise.resolve();
  }

  return new Promise((resolve, reject): void => {
    const timeout = setTimeout((): void => {
      reject(new Error(`Playwright server did not stop within ${shutdownTimeoutMs}ms`));
    }, shutdownTimeoutMs);

    server.once("exit", (): void => {
      clearTimeout(timeout);
      resolve();
    });
  });
}

async function stopServer(server: ChildProcess): Promise<void> {
  if (server.exitCode !== null) {
    return;
  }

  if (server.pid === undefined) {
    throw new Error("Playwright server has no process identifier");
  }

  const signal = process.platform === "win32" ? "SIGKILL" : "SIGTERM";
  if (!server.kill(signal)) {
    throw new Error(`Could not signal Playwright server process ${server.pid}`);
  }

  await waitForExit(server);
}

export default async function globalSetup(): Promise<() => Promise<void>> {
  await assertPortIsAvailable();

  const serverBinary = path.resolve(".server", "serve-static-portfolio.js");
  const server = spawn(process.execPath, [serverBinary], {
    cwd: process.cwd(),
    stdio: "inherit",
    windowsHide: true,
  });

  try {
    await waitForServer(server);
  } catch (cause: unknown) {
    await stopServer(server);
    throw new Error("Could not start the Playwright production server", { cause });
  }

  return async (): Promise<void> => {
    await stopServer(server);
  };
}
