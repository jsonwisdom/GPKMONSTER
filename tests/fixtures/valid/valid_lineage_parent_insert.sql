INSERT INTO asset (asset_id, title, authority)
VALUES
  ('LIL-ASSET-VALID-PARENT-P06', 'PR-06 valid parent', FALSE),
  ('LIL-ASSET-VALID-CHILD-P06-CONTROL', 'PR-06 valid child control', FALSE);

INSERT INTO lineage_edge (
  lineage_edge_id,
  parent_asset_id,
  child_asset_id,
  authority
)
VALUES (
  'LIL-EDGE-VALID-PARENT-001',
  'LIL-ASSET-VALID-PARENT-P06',
  'LIL-ASSET-VALID-CHILD-P06-CONTROL',
  FALSE
);
