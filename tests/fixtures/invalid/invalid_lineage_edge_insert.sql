INSERT INTO asset (asset_id, title, authority)
VALUES ('LIL-ASSET-EXAMPLE-PARENT', 'Lineage parent fixture', FALSE);

INSERT INTO lineage_edge (
  lineage_edge_id,
  parent_asset_id,
  child_asset_id,
  authority
)
VALUES (
  'LIL-EDGE-INVALID-001',
  'LIL-ASSET-EXAMPLE-PARENT',
  'LIL-ASSET-NONEXISTENT-CHILD',
  FALSE
);
