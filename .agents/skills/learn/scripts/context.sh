#!/usr/bin/env bash
# Prints the context /learn needs: repo identity, where skills go, monorepo layout,
# and the learned skills that already exist for this repo.
set -u

if ROOT=$(git rev-parse --show-toplevel 2>/dev/null); then
  NAME=$(basename "$ROOT")
  COMMIT=$(git -C "$ROOT" rev-parse --short HEAD 2>/dev/null || echo "none")
  BASE="$ROOT"
else
  ROOT=$(pwd)
  NAME=$(basename "$ROOT")
  COMMIT="none (not a git repo)"
  BASE="$HOME"
fi
# Skills are written to .agents/skills (the only skills location for opencode)
AGENTS_SKILLS_DIR="$BASE/.agents/skills"

# oneSquare -> onesquare, My_Repo.web -> my-repo-web
SLUG=$(printf '%s' "$NAME" | tr '[:upper:]' '[:lower:]' | sed -E 's/[^a-z0-9]+/-/g; s/^-+//; s/-+$//')

echo "REPO_NAME=$NAME"
echo "REPO_SLUG=$SLUG"
echo "REPO_ROOT=$ROOT"
echo "AGENTS_SKILLS_DIR=$AGENTS_SKILLS_DIR"
echo "HEAD_COMMIT=$COMMIT"
echo

echo "## Workspaces / apps (monorepo detection)"
found=0
for f in pnpm-workspace.yaml lerna.json nx.json turbo.json settings.gradle settings.gradle.kts; do
  [ -f "$ROOT/$f" ] && { echo "marker: $f"; found=1; }
done
if [ -f "$ROOT/package.json" ] && grep -q '"workspaces"' "$ROOT/package.json"; then
  echo "marker: package.json workspaces"; found=1
fi
for d in apps packages services modules libs; do
  [ -d "$ROOT/$d" ] && for sub in "$ROOT/$d"/*/; do
    [ -d "$sub" ] && { echo "app: ${sub#$ROOT/}"; found=1; }
  done
done
# Top-level folders that look like separate front/back projects
for sub in "$ROOT"/*/; do
  [ -d "$sub" ] || continue
  for m in package.json pom.xml build.gradle build.gradle.kts go.mod pyproject.toml; do
    [ -f "$sub$m" ] && { echo "project: ${sub#$ROOT/} ($m)"; found=1; break; }
  done
done
[ $found -eq 0 ] && echo "single project"
echo

echo "## Existing skills ($AGENTS_SKILLS_DIR)"
any=0
for s in "$AGENTS_SKILLS_DIR"/*/SKILL.md; do
  [ -f "$s" ] || continue
  name=$(basename "$(dirname "$s")")
  desc=$(sed -n 's/^description: *//p' "$s" | head -1 | cut -c1-160)
  echo "- $name: $desc"
  any=1
done
[ $any -eq 0 ] && echo "(none)"
exit 0
