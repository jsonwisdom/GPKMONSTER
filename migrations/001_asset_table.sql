BEGIN;

CREATE TABLE asset (
  asset_id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  authority BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT asset_id_format CHECK (
    asset_id ~ '^LIL-ASSET-[A-Z0-9]+(-[A-Z0-9]+)*$'
  ),
  CONSTRAINT asset_authority_false CHECK (authority = FALSE)
);

COMMIT;
