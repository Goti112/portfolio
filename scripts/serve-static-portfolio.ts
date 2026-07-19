import { readFile } from "node:fs/promises";
import { createServer } from "node:http";
import type { IncomingMessage, ServerResponse } from "node:http";
import { extname, resolve, sep } from "node:path";
import { brotliCompressSync, constants as zlibConstants } from "node:zlib";

const host = "127.0.0.1";
const port = 3000;
const origin = `http://${host}:${port}`;
const outputRoot = resolve("out");

const contentTypes: Readonly<Record<string, string>> = Object.freeze({
  ".css": "text/css; charset=utf-8",
  ".html": "text/html; charset=utf-8",
  ".ico": "image/x-icon",
  ".js": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".png": "image/png",
  ".svg": "image/svg+xml",
  ".webp": "image/webp",
  ".woff2": "font/woff2",
});

type EncodedContent = Readonly<{
  body: Buffer;
  contentEncoding: "br" | null;
}>;

function encodeContent(content: Buffer, acceptEncoding: string | undefined): EncodedContent {
  if (acceptEncoding?.split(",").some((encoding: string): boolean => encoding.trim().startsWith("br")) !== true) {
    return { body: content, contentEncoding: null };
  }

  return {
    body: brotliCompressSync(content, {
      params: {
        [zlibConstants.BROTLI_PARAM_QUALITY]: 4,
      },
    }),
    contentEncoding: "br",
  };
}

function resolveRequestPath(requestUrl: string): string {
  const pathname = decodeURIComponent(new URL(requestUrl, origin).pathname);
  const normalizedPath = pathname.replace(/\/+$/, "") || "/";
  const relativePath = normalizedPath === "/" ? "index.html" : normalizedPath.slice(1);
  const filePath = extname(relativePath) === "" ? `${relativePath}.html` : relativePath;
  const resolvedPath = resolve(outputRoot, filePath);
  const outputPrefix = `${outputRoot}${sep}`;

  if (resolvedPath !== outputRoot && !resolvedPath.startsWith(outputPrefix)) {
    throw new Error(`Static server rejected path outside output root: ${requestUrl}`);
  }

  return resolvedPath;
}

function writeText(response: ServerResponse, statusCode: number, body: string): void {
  response.writeHead(statusCode, { "content-type": "text/plain; charset=utf-8" });
  response.end(body);
}

function isFileNotFoundError(cause: unknown): boolean {
  return cause instanceof Error && "code" in cause && cause.code === "ENOENT";
}

async function serveRequest(request: IncomingMessage, response: ServerResponse): Promise<void> {
  if (request.method !== "GET" && request.method !== "HEAD") {
    writeText(response, 405, "Method not allowed");
    return;
  }

  if (request.url === undefined) {
    throw new Error("Static server received a request without a URL");
  }

  const filePath = resolveRequestPath(request.url);
  let content: Buffer;

  try {
    content = await readFile(filePath);
  } catch (cause: unknown) {
    if (isFileNotFoundError(cause)) {
      writeText(response, 404, "Not found");
      return;
    }
    throw new Error(`Static server could not read ${filePath}`, { cause });
  }

  const contentType = contentTypes[extname(filePath)] ?? "application/octet-stream";
  const staticAssetsDirectory = `${sep}_next${sep}static${sep}`;
  const cacheControl = filePath.includes(staticAssetsDirectory)
    ? "public, max-age=31536000, immutable"
    : "no-cache";
  const encodedContent = encodeContent(content, request.headers["accept-encoding"]);
  const headers: Record<string, string | number> = {
    "cache-control": cacheControl,
    "content-length": encodedContent.body.byteLength,
    "content-type": contentType,
    vary: "accept-encoding",
  };

  if (encodedContent.contentEncoding !== null) {
    headers["content-encoding"] = encodedContent.contentEncoding;
  }

  response.writeHead(200, headers);
  response.end(request.method === "HEAD" ? undefined : encodedContent.body);
}

const server = createServer((request, response): void => {
  void serveRequest(request, response).catch((cause: unknown): void => {
    console.error("Static server request failed", { cause, method: request.method, url: request.url });
    if (!response.headersSent) {
      writeText(response, 500, "Internal server error");
    } else {
      response.destroy(cause instanceof Error ? cause : new Error("Unknown static server failure"));
    }
  });
});

function closeServer(): void {
  server.close((cause?: Error): void => {
    if (cause !== undefined) {
      throw new Error("Static server could not close cleanly", { cause });
    }
  });
}

server.once("error", (cause: Error): void => {
  throw new Error(`Static server could not listen at ${origin}`, { cause });
});
server.listen(port, host, (): void => {
  console.log(`Ready: static portfolio at ${origin}`);
});

process.once("SIGINT", closeServer);
process.once("SIGTERM", closeServer);
