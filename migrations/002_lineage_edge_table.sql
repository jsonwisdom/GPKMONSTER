BEGIN;

CREATE TABLE lineage_edge (
  lineage_edge_id TEXT PRIMARY KEY,
  parent_asset_id TEXT NOT NULL,
  child_asset_id TEXT NOT NULL,
  authority BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT lineage_edge_child_asset_fk
    FOREIGN KEY (child_asset_id)
    REFERENCES asset(asset_id)
    ON DELETE RESTRICT
    ON UPDATE CASCADE,
  CONSTRAINT lineage_edge_authority_false CHECK (authority = FALSE)
);

COMMIT;
