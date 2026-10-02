// scripts/release.mjs
//
// Invoked as the changesets/action `publish` step, i.e. right after the
// "Release packages" PR merges and no changesets remain pending.
//
// The app is private, so nothing is published to npm. This script is the
// single owner of the git tag + GitHub Release: it cuts `vX.Y.Z` (`-beta.N`
// in pre-mode) from package.json, with notes taken from the latest
// CHANGELOG.md section, and signals `released=true` + `tag=...` on
// $GITHUB_OUTPUT.
//
// Idempotent: if a Release for the tag already exists, it is skipped, so
// re-running is safe.
//
// Set RELEASE_DRY_RUN=1 to log the tag/Release that WOULD be created without
// touching git or the GitHub API.

import { readFileSync, writeFileSync, appendFileSync, existsSync } from "node:fs";
import { execSync } from "node:child_process";
import path from "node:path";

const root = process.cwd();
const DRY_RUN = process.env.RELEASE_DRY_RUN === "1";

const run = (cmd) => execSync(cmd, { stdio: "inherit" });
const capture = (cmd) => execSync(cmd, { encoding: "utf8" }).trim();

// Surface a value to the GitHub Actions step so later steps/jobs can read it
// via steps.changesets.outputs.<key>. No-op when run outside Actions.
const setOutput = (key, value) => {
  const file = process.env.GITHUB_OUTPUT;
  if (file) appendFileSync(file, `${key}=${value}\n`);
};

// Latest (top-most) version section of a Changesets CHANGELOG.
function latestSection(changelog) {
  if (!existsSync(changelog)) return null;
  const lines = readFileSync(changelog, "utf8").split("\n");
  const start = lines.findIndex((l) => /^## /.test(l));
  if (start === -1) return null;
  const version = lines[start].replace(/^##\s*/, "").trim();
  let end = lines.findIndex((l, i) => i > start && /^## /.test(l));
  if (end === -1) end = lines.length;
  const body = lines.slice(start + 1, end).join("\n").trim();
  return { version, body };
}

// True if a GitHub Release already exists for this tag. Read-only, so it runs
// even in dry-run; returns false if gh is unavailable.
function releaseExists(tag) {
  try {
    execSync(`gh release view "${tag}"`, { stdio: "ignore" });
    return true;
  } catch {
    return false;
  }
}

const { version } = JSON.parse(readFileSync(path.join(root, "package.json"), "utf8"));
const section = latestSection(path.join(root, "CHANGELOG.md"));

if (!section || section.version !== version) {
  // Never released through Changesets yet, or package.json was bumped by hand.
  console.log(`No CHANGELOG.md entry for ${version}; nothing to release.`);
  process.exit(0);
}

const tag = `v${version}`;
const title = `Release - ${tag}`;

if (releaseExists(tag)) {
  console.log(`Release ${tag} already exists; skipping.`);
  process.exit(0);
}

if (DRY_RUN) {
  console.log(`[dry-run] would create tag + Release: ${tag} (title: ${title})`);
  console.log(section.body);
  process.exit(0);
}

run(`git config user.name "github-actions[bot]"`);
run(`git config user.email "github-actions[bot]@users.noreply.github.com"`);
if (!capture(`git tag --list ${tag}`)) {
  run(`git tag "${tag}"`);
}
run(`git push origin "refs/tags/${tag}"`);

const notesFile = path.join(root, "RELEASE_NOTES.md");
writeFileSync(notesFile, section.body || `Release ${tag}`);
const prerelease = tag.includes("-") ? "--prerelease " : "";
run(`gh release create "${tag}" ${prerelease}--title "${title}" --notes-file ${notesFile}`);

setOutput("released", "true");
setOutput("tag", tag);
console.log(`Released ${tag}`);
