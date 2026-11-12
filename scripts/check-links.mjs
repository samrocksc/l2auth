import { readdir, readFile, stat } from "node:fs/promises";
import path from "node:path";
import process from "node:process";

const ROOT = process.cwd();
const SKIP_PREFIXES = ["http://", "https://", "mailto:", "tel:", "data:", "#"];

async function walk(directory) {
  const entries = await readdir(directory, { withFileTypes: true });
  const files = [];

  for (const entry of entries) {
    if (entry.name === "node_modules" || entry.name === ".git") {
      continue;
    }
    const fullPath = path.join(directory, entry.name);
    if (entry.isDirectory()) {
      files.push(...(await walk(fullPath)));
    } else {
      files.push(fullPath);
    }
  }

  return files;
}

function stripTarget(target) {
  return target.split("#")[0].split("?")[0];
}

function isExternal(target) {
  return SKIP_PREFIXES.some((prefix) => target.startsWith(prefix));
}

async function exists(target) {
  try {
    await stat(target);
    return true;
  } catch {
    return false;
  }
}

async function checkReference(sourceFile, target) {
  const clean = stripTarget(target);
  if (!clean || isExternal(clean)) {
    return null;
  }

  const resolved = path.resolve(path.dirname(sourceFile), clean);
  if (await exists(resolved)) {
    return null;
  }

  if (
    clean.endsWith("/") &&
    (await exists(path.join(resolved, "index.html")))
  ) {
    return null;
  }

  return { sourceFile, target };
}

function pageForContentFile(filePath) {
  const relative = path.relative(path.join(ROOT, "content"), filePath);
  if (relative.startsWith("concepts/")) {
    return path.join(
      ROOT,
      "concepts",
      relative.replace(/^concepts\//, "").replace(/\.md$/, ".html"),
    );
  }
  return path.join(ROOT, relative.replace(/\.md$/, ".html"));
}

const problems = [];
const files = await walk(ROOT);

for (const file of files) {
  const relative = path.relative(ROOT, file);

  if (file.endsWith(".html")) {
    const text = await readFile(file, "utf8");
    for (const match of text.matchAll(/(?:href|src)="([^"]+)"/g)) {
      const problem = await checkReference(file, match[1]);
      if (problem) {
        problems.push({ ...problem, from: relative });
      }
    }
  }

  if (file.endsWith(".md") && file.startsWith(path.join(ROOT, "content"))) {
    const page = pageForContentFile(file);
    const text = await readFile(file, "utf8");
    for (const match of text.matchAll(
      /\[[^\]]*\]\(([^)\s]+)(?:\s+"[^"]*")?\)/g,
    )) {
      const problem = await checkReference(page, match[1]);
      if (problem) {
        problems.push({ ...problem, from: relative });
      }
    }
  }

  if (relative === "sw.js") {
    const text = await readFile(file, "utf8");
    for (const match of text.matchAll(/"\.\/([^"]*)"/g)) {
      const target = path.join(ROOT, match[1]);
      if (match[1] && !(await exists(target))) {
        problems.push({ sourceFile: file, target: match[1], from: "sw.js" });
      }
    }
  }
}

if (problems.length > 0) {
  for (const problem of problems) {
    console.error(`${problem.from}: missing ${problem.target}`);
  }
  process.exitCode = 1;
} else {
  console.log(`Link check passed (${files.length} files scanned).`);
}
