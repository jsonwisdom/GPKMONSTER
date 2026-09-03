#!/usr/bin/env python3
import argparse, hashlib, json, struct, sys, zipfile
from pathlib import Path

FIXED_TIME = (1980, 1, 1, 0, 0, 0)

def sha256(data): return hashlib.sha256(data).hexdigest()

def extra_ids(extra):
    ids=[]; p=0
    while p < len(extra):
        if p+4 > len(extra): raise ValueError("truncated extra header")
        tag,n=struct.unpack_from("<HH",extra,p); p+=4
        if p+n > len(extra): raise ValueError("truncated extra payload")
        ids.append(tag); p+=n
    return ids

def collect(spec, roots):
    chosen={}
    for source, patterns in spec["sources"].items():
        root=roots.get(source)
        if not root: continue
        for pattern in patterns:
            for path in root.glob(pattern):
                if path.is_file():
                    rel=path.relative_to(root).as_posix()
                    chosen[f"{source}/{rel}"]=path
    return sorted(chosen.items())

def info(name):
    z=zipfile.ZipInfo(name, FIXED_TIME)
    z.compress_type=zipfile.ZIP_DEFLATED
    z.create_system=0
    z.external_attr=0
    z.extra=b""; z.comment=b""; z.flag_bits=0x800
    return z

def verify(path):
    raw=path.read_bytes()
    start=max(0,len(raw)-65557); eocd=-1
    for p in range(len(raw)-22,start-1,-1):
        if raw[p:p+4]==b"PK\x05\x06" and p+22+struct.unpack_from("<H",raw,p+20)[0]==len(raw): eocd=p; break
    if eocd < 0: raise ValueError("end-aligned classic EOCD not found")
    disk,cd_disk,n_disk,n_total,cd_size,cd_off=struct.unpack_from("<HHHHII",raw,eocd+4)
    if 0xffff in (disk,cd_disk,n_disk,n_total) or 0xffffffff in (cd_size,cd_off): raise ValueError("classic EOCD sentinel found")
    if eocd>=20 and raw[eocd-20:eocd-16]==b"PK\x06\x07": raise ValueError("ZIP64 locator found")
    with zipfile.ZipFile(path) as z:
        if z.comment: raise ValueError("zip comment must be empty")
        for m in z.infolist():
            if m.flag_bits & ((1<<3)|(1<<13)): raise ValueError(f"forbidden GPBF on {m.filename}")
            if 0x0001 in extra_ids(m.extra): raise ValueError(f"ZIP64 extra on {m.filename}")
            p=m.header_offset
            if raw[p:p+4]!=b"PK\x03\x04": raise ValueError(f"bad local header: {m.filename}")
            flags=struct.unpack_from("<H",raw,p+6)[0]
            n,x=struct.unpack_from("<HH",raw,p+26)
            if flags & ((1<<3)|(1<<13)): raise ValueError(f"forbidden local GPBF on {m.filename}")
            if 0x0001 in extra_ids(raw[p+30+n:p+30+n+x]): raise ValueError(f"local ZIP64 extra on {m.filename}")
    return sha256(raw),len(raw)

def main():
    ap=argparse.ArgumentParser()
    ap.add_argument("--config",type=Path,required=True)
    ap.add_argument("--zora-root",type=Path,required=True)
    ap.add_argument("--drive-root",type=Path,required=True)
    ap.add_argument("--gpk-root",type=Path,required=True)
    ap.add_argument("--output",type=Path,required=True)
    a=ap.parse_args(); cfg=json.loads(a.config.read_text(encoding="utf-8"))
    if cfg.get("allow_zip64") is not False: raise SystemExit("allow_zip64 must be false")
    roots={"zora":a.zora_root.resolve(),"drive":a.drive_root.resolve(),"gpk":a.gpk_root.resolve()}
    a.output.mkdir(parents=True,exist_ok=True); sums=[]
    for spec in cfg["packages"]:
        files=collect(spec,roots)
        if not files: raise SystemExit(f"empty package forbidden: {spec['id']}")
        rows=[]
        for arc,path in files:
            data=path.read_bytes(); rows.append({"path":arc,"bytes":len(data),"sha256":sha256(data)})
        manifest=(json.dumps({"format":cfg["format"],"package":spec["id"],"files":rows},sort_keys=True,separators=(",",":"))+"\n").encode()
        target=a.output/spec["file"]
        with zipfile.ZipFile(target,"w",compression=zipfile.ZIP_DEFLATED,compresslevel=9,allowZip64=False) as z:
            z.writestr(info("PACKAGE_MANIFEST.json"),manifest,compresslevel=9)
            for arc,path in files: z.writestr(info(arc),path.read_bytes(),compresslevel=9)
        digest,size=verify(target); sums.append(f"{digest}  {target.name}")
        print(f"BUILT {target.name} bytes={size} sha256={digest}")
    (a.output/"GPKMONSTER_FILE_MANIFEST_V1.sha256").write_text("\n".join(sums)+"\n",encoding="ascii",newline="\n")

if __name__=="__main__":
    try: main()
    except (OSError,ValueError,zipfile.BadZipFile) as e:
        print(f"FAIL_CLOSED: {e}",file=sys.stderr); raise SystemExit(1)
