INSERT INTO asset (asset_id, title, authority)
VALUES
  ('LIL-ASSET-VALID-PARENT', 'Valid lineage parent', FALSE),
  ('LIL-ASSET-VALID-CHILD', 'Valid lineage child', FALSE);

INSERT INTO lineage_edge (
  lineage_edge_id,
  parent_asset_id,
  child_asset_id,
  authority
)
VALUES (
  'LIL-EDGE-VALID-001',
  'LIL-ASSET-VALID-PARENT',
  'LIL-ASSET-VALID-CHILD',
  FALSE
);
