#!/usr/bin/env python3
import argparse, hashlib, json
from pathlib import Path

p=argparse.ArgumentParser(); p.add_argument('--constitution',required=True); p.add_argument('--brief',required=True); p.add_argument('--output-dir',default='dist'); a=p.parse_args()
cpath,bpath,out=Path(a.constitution),Path(a.brief),Path(a.output_dir); out.mkdir(parents=True,exist_ok=True)
c=json.loads(cpath.read_text()); b=json.loads(bpath.read_text())
if c['defaults']['authority'] is not False or b['authority'] is not False: raise SystemExit('AUTHORITY_MUST_REMAIN_FALSE')
lines=['STANDING RENDERING CONSTITUTION:',*[f'- {x}' for x in c['required_behavior']],'','PROHIBITIONS:',*[f'- {x}' for x in c['prohibited_behavior']],'','ASSET BRIEF:',f"Title: {b['title']}",f"Format: {b['format']}",f"Concept: {b['concept']}",f"Lesson: {b['lesson']}",'Originality requirements:',*[f'- {x}' for x in b['originality_requirements']],'',f"Fallback rule: {c['fallback_rule']}",'Official affiliation: false','Authority: false']
prompt='\n'.join(lines)+'\n'; (out/'render_prompt.txt').write_text(prompt)
manifest={'constitution_version':c['version'],'creative_mode':c['mode'],'asset_id':b['asset_id'],'title':b['title'],'constitution_sha256':hashlib.sha256(cpath.read_bytes()).hexdigest(),'brief_sha256':hashlib.sha256(bpath.read_bytes()).hexdigest(),'compiled_prompt_sha256':hashlib.sha256(prompt.encode()).hexdigest(),'official_affiliation':False,'authority':False}
(out/'render_manifest.json').write_text(json.dumps(manifest,indent=2)+'\n'); print(json.dumps(manifest,indent=2))
