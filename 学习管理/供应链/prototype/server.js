/**
 * 智链 SCM 原型 — 本地静态资源服务（Node.js 内置模块，无需额外依赖）
 * 用法：在「供应链」目录执行 node prototype/server.js
 */

const http = require("http");
const fs = require("fs");
const path = require("path");

const rootDir = __dirname;
const port = Number(process.env.PORT) || 8080;

const mimeByExtension = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "application/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".gif": "image/gif",
  ".svg": "image/svg+xml",
  ".ico": "image/x-icon",
  ".woff": "font/woff",
  ".woff2": "font/woff2",
};

function safeResolvePath(requestPath) {
  const decodedPath = decodeURIComponent(requestPath.split("?")[0] || "/");
  const relativePath = decodedPath === "/" ? "/index.html" : decodedPath;
  const normalized = path.normalize(relativePath).replace(/^(\.\.(\/|\\|$))+/, "");
  const absolutePath = path.join(rootDir, normalized);
  if (!absolutePath.startsWith(rootDir)) {
    return null;
  }
  return absolutePath;
}

const server = http.createServer(function (request, response) {
  if (request.method !== "GET" && request.method !== "HEAD") {
    response.writeHead(405, { "Content-Type": "text/plain; charset=utf-8" });
    response.end("仅支持 GET / HEAD");
    return;
  }

  const filePath = safeResolvePath(request.url || "/");
  if (!filePath) {
    response.writeHead(403, { "Content-Type": "text/plain; charset=utf-8" });
    response.end("禁止访问");
    return;
  }

  fs.stat(filePath, function (statError, stats) {
    if (statError || !stats.isFile()) {
      response.writeHead(404, { "Content-Type": "text/plain; charset=utf-8" });
      response.end("未找到文件");
      return;
    }

    const extension = path.extname(filePath).toLowerCase();
    const contentType = mimeByExtension[extension] || "application/octet-stream";

    response.writeHead(200, { "Content-Type": contentType });
    if (request.method === "HEAD") {
      response.end();
      return;
    }

    const readStream = fs.createReadStream(filePath);
    readStream.on("error", function () {
      response.writeHead(500, { "Content-Type": "text/plain; charset=utf-8" });
      response.end("读取文件失败");
    });
    readStream.pipe(response);
  });
});

server.listen(port, function () {
  console.log("========================================");
  console.log("智链 SCM 原型 - 本地预览 (Node.js)");
  console.log("浏览器访问: http://localhost:" + port + "/");
  console.log("按 Ctrl+C 可停止服务");
  console.log("========================================");
});
