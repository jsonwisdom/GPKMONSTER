[CmdletBinding()]
param(
  [string]$GpkRoot = (Resolve-Path "$PSScriptRoot\.."),
  [string]$ZoraRoot = "$env:USERPROFILE\github\jay-zora-portal",
  [Parameter(Mandatory=$true)][string]$DriveRoot,
  [string]$Output = "$env:USERPROFILE\GPKMONSTER_OUT"
)
$ErrorActionPreference = 'Stop'
foreach ($p in @($GpkRoot,$ZoraRoot,$DriveRoot)) { if (-not (Test-Path -LiteralPath $p)) { throw "Missing required root: $p" } }
$script = Join-Path $GpkRoot 'tools\build_gpkmonster_vault.py'
$config = Join-Path $GpkRoot 'config\packages.v1.json'
if (Get-Command py -ErrorAction SilentlyContinue) {
  & py -3 $script --config $config --gpk-root $GpkRoot --zora-root $ZoraRoot --drive-root $DriveRoot --output $Output
} else {
  & python $script --config $config --gpk-root $GpkRoot --zora-root $ZoraRoot --drive-root $DriveRoot --output $Output
}
if ($LASTEXITCODE -ne 0) { throw "GPKMONSTER build failed closed ($LASTEXITCODE)" }
Get-FileHash -Algorithm SHA256 (Join-Path $Output '*.zip') | Sort-Object Path | Format-Table -AutoSize
Write-Host "HOLD: review hashes before any upload, publish, mint, or merge."
