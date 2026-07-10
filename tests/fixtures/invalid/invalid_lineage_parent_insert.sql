INSERT INTO asset (asset_id, title, authority)
VALUES ('LIL-ASSET-VALID-CHILD-P06', 'PR-06 valid child', FALSE);

INSERT INTO lineage_edge (
  lineage_edge_id,
  parent_asset_id,
  child_asset_id,
  authority
)
VALUES (
  'LIL-EDGE-INVALID-PARENT-001',
  'LIL-ASSET-NONEXISTENT-PARENT',
  'LIL-ASSET-VALID-CHILD-P06',
  FALSE
);
