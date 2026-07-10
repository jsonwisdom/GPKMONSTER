package living_image_ledger

default allow := false

deny contains "UNAPPROVED_EXECUTION" if {
  input.state == "EXECUTED"
  input.human_approved == false
}

deny contains "UNAPPROVED_PUBLICATION" if {
  input.state == "PUBLISHED"
  input.human_approved == false
}

deny contains "MISSING_PARENT_LINEAGE" if {
  input.asset_role == "DERIVED"
  input.parent_exists == false
}

deny contains "AUTHORITY_MUST_REMAIN_FALSE" if {
  input.authority != false
}

allow if {
  count(deny) == 0
}
