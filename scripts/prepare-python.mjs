import { cp, mkdir, readdir } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import path from "node:path";

const root = fileURLToPath(new URL("../", import.meta.url));
const source = path.join(root, "node_modules/pyodide");
const target = path.join(root, "public/python");
await mkdir(target, { recursive: true });
const assets = (await readdir(source)).filter((name) =>
  /^(pyodide(?:\.asm)?\.(?:js|wasm)|python_stdlib\.zip|pyodide-lock\.json)$/.test(
    name,
  ),
);
if (
  !assets.includes("pyodide.js") ||
  !assets.includes("pyodide.asm.wasm") ||
  !assets.includes("python_stdlib.zip")
) {
  throw new Error(
    "Pyodide runtime assets are missing. Run npm install before preparing Python.",
  );
}
await Promise.all(
  assets.map((name) => cp(path.join(source, name), path.join(target, name))),
);
console.log(`Prepared ${assets.length} local Python runtime assets.`);
