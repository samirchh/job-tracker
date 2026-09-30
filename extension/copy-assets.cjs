// Copies non-TS assets (manifest, popup.html, icons) into dist/ after
// `tsc` compiles the .ts files there. Plain CommonJS so it runs with
// plain `node` regardless of the project's module settings.
const fs = require("fs");
const path = require("path");

const root = __dirname;
const dist = path.join(root, "dist");

function copyFile(src, destRelative) {
  const dest = path.join(dist, destRelative);
  fs.mkdirSync(path.dirname(dest), { recursive: true });
  fs.copyFileSync(src, dest);
  console.log(`copied ${destRelative}`);
}

function copyDir(srcDir, destRelative) {
  const entries = fs.readdirSync(srcDir, { withFileTypes: true });
  for (const entry of entries) {
    const srcPath = path.join(srcDir, entry.name);
    const destPath = path.join(destRelative, entry.name);
    if (entry.isDirectory()) {
      copyDir(srcPath, destPath);
    } else {
      copyFile(srcPath, destPath);
    }
  }
}

copyFile(path.join(root, "manifest.json"), "manifest.json");
copyFile(path.join(root, "popup.html"), "popup.html");

const iconsDir = path.join(root, "icons");
if (fs.existsSync(iconsDir)) {
  copyDir(iconsDir, "icons");
}

console.log("Extension assets copied to dist/. Load dist/ as an unpacked extension.");
