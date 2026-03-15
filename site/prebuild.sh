#!/bin/bash
# Copy web-data to public/data for static serving
SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
PROJECT_ROOT="$(dirname "$SCRIPT_DIR")"
DATA_SRC="$PROJECT_ROOT/web-data"
DATA_DEST="$SCRIPT_DIR/public/data"

# On Vercel, web-data/ is outside the deployed directory.
# If it doesn't exist but public/data/ already has the files (from git), skip the copy.
if [ ! -d "$DATA_SRC" ]; then
  if [ -f "$DATA_DEST/article-index.json" ]; then
    echo "web-data/ not found but public/data/ already populated — skipping copy."
    exit 0
  else
    echo "ERROR: web-data/ not found and public/data/ is empty." >&2
    exit 1
  fi
fi

echo "Copying data from $DATA_SRC to $DATA_DEST ..."

rm -rf "$DATA_DEST"
mkdir -p "$DATA_DEST/articles"

cp "$DATA_SRC/graph-view.json" "$DATA_DEST/"
cp "$DATA_SRC/article-index.json" "$DATA_DEST/"
cp "$DATA_SRC/leaderboards.json" "$DATA_DEST/"
cp "$DATA_SRC"/articles/*.json "$DATA_DEST/articles/"

echo "Done. Copied $(ls "$DATA_DEST/articles/" | wc -l | tr -d ' ') article files + 3 index files."
