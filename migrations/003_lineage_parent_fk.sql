BEGIN;

ALTER TABLE lineage_edge
  ADD CONSTRAINT lineage_edge_parent_asset_fk
  FOREIGN KEY (parent_asset_id)
  REFERENCES asset(asset_id)
  ON DELETE RESTRICT
  ON UPDATE CASCADE
  NOT VALID;

ALTER TABLE lineage_edge
  VALIDATE CONSTRAINT lineage_edge_parent_asset_fk;

COMMIT;
