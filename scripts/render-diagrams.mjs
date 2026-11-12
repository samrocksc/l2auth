import { mkdir, readdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import process from "node:process";
import excalirender from "excalirender";

const root = process.cwd();
const sourceDir = path.join(root, "diagrams");
const outputDir = path.join(root, "assets", "diagrams");

await mkdir(outputDir, { recursive: true });

const titles = {
  "oauth2-authorization-code": "OAuth 2.0 Authorization Code flow",
  "oidc-token-flow": "OpenID Connect token flow",
  "refresh-token-flow": "Refresh token flow",
  "jwt-authentication-flow": "JWT authentication flow",
  "discovery-bootstrapping": "OIDC discovery bootstrapping",
  "id-token-vs-access-token": "ID token vs access token",
};

const scenes = (await readdir(sourceDir)).filter((file) =>
  file.endsWith(".excalidraw"),
);

if (scenes.length === 0) {
  console.log("No .excalidraw files found in diagrams/.");
  process.exit(0);
}

for (const scene of scenes) {
  const name = path.basename(scene, ".excalidraw");
  const output = path.join(outputDir, `${name}.svg`);

  await excalirender(path.join(sourceDir, scene), { output });

  // The renderer embeds both Virgil and the much larger ZCOOL font. This site
  // only uses Latin text, so drop ZCOOL to keep the SVGs small.
  let svg = await readFile(output, "utf8");
  svg = svg.replace(
    /@font-face \{ font-family: "ZCOOL KuaiLe";[\s\S]*?\}\n/,
    "",
  );
  svg = svg.replace(/, &quot;ZCOOL KuaiLe&quot;/g, "");
  svg = svg.replace(
    /(<svg[^>]*>)/,
    `$1\n<title>${titles[name] ?? name}</title>`,
  );
  await writeFile(output, svg);

  console.log(`Rendered ${path.relative(root, output)}`);
}
