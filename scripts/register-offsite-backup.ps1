param([string]$DailyAt = '02:30', [switch]$RunBackup, [string]$NodePath, [string]$LogPath)
$ErrorActionPreference = 'Stop'
$repositoryRoot = [IO.Path]::GetFullPath((Join-Path $PSScriptRoot '..'))
$profilePath = Join-Path $repositoryRoot '.env.backup.local'
if (-not (Test-Path -LiteralPath $profilePath)) { throw 'Configure .env.backup.local first.' }
$rootLine = Get-Content -LiteralPath $profilePath | Where-Object { $_ -match '^BACKUP_ROOT=' } | Select-Object -First 1
if (-not $rootLine) { throw 'The backup root is missing.' }
$rawValue = $rootLine.Substring('BACKUP_ROOT='.Length).Trim()
if (($rawValue.StartsWith('"') -and $rawValue.EndsWith('"')) -or ($rawValue.StartsWith("'") -and $rawValue.EndsWith("'"))) {
  $backupRoot = $rawValue.Substring(1, $rawValue.Length - 2)
} else {
  $backupRoot = $rawValue
}
if (-not [IO.Path]::IsPathRooted($backupRoot) -or [IO.Path]::GetFileName($backupRoot) -ne 'tac-xpress-dr') { throw 'The dedicated backup root is invalid.' }
if ($RunBackup) {
  if (-not $LogPath) { $LogPath = Join-Path $backupRoot 'scheduled-backup.log' }
  try {
    if (-not $NodePath) { $NodePath = (Get-Command node -ErrorAction Stop).Source }
    Set-Location -LiteralPath $repositoryRoot
    & $NodePath --max-old-space-size=384 --import tsx scripts/offsite-backup.ts *> $LogPath
    exit $LASTEXITCODE
  } catch {
    $_ | Out-File -LiteralPath $LogPath
    exit 1
  }
}
$nodeExecutable = (Get-Command node -ErrorAction Stop).Source
$taskName = 'TAC-XPRESS Encrypted Offsite Backup'
$taskMarker = 'TAC-XPRESS owned encrypted offsite backup.'
if (-not (Test-Path -LiteralPath (Join-Path $repositoryRoot '.env.backup.local'))) {
  throw 'Configure the ignored .env.backup.local file before registering backups.'
}
$existing = Get-ScheduledTask -TaskName $taskName -ErrorAction SilentlyContinue
if ($existing -and $existing.Description -notlike "$taskMarker*") {
  throw 'An unrelated task uses the requested name. Review it before proceeding.'
}
$identity = [Security.Principal.WindowsIdentity]::GetCurrent().Name
$principal = New-ScheduledTaskPrincipal -UserId $identity -LogonType Interactive -RunLevel Limited
$powershellExecutable = (Get-Command powershell.exe -ErrorAction Stop).Source
$workerLog = Join-Path $backupRoot 'scheduled-backup.log'
if (-not (Test-Path -LiteralPath (Split-Path -Parent $workerLog))) {
  throw 'Prepare the private backup directory before registering backups.'
}
$arguments = '-NoProfile -NonInteractive -WindowStyle Hidden -ExecutionPolicy RemoteSigned -File "{0}" -RunBackup -NodePath "{1}" -LogPath "{2}"' -f $PSCommandPath,$nodeExecutable,$workerLog
$action = New-ScheduledTaskAction -Execute $powershellExecutable -Argument $arguments -WorkingDirectory $repositoryRoot
$trigger = New-ScheduledTaskTrigger -Daily -At ([DateTime]::Today.Add([TimeSpan]::ParseExact($DailyAt, 'hh\:mm', [Globalization.CultureInfo]::InvariantCulture)))
$settings = New-ScheduledTaskSettingsSet -StartWhenAvailable -MultipleInstances IgnoreNew -ExecutionTimeLimit (New-TimeSpan -Minutes 45) -RestartCount 3 -RestartInterval (New-TimeSpan -Minutes 15) -AllowStartIfOnBatteries -DontStopIfGoingOnBatteries
Register-ScheduledTask -TaskName $taskName -Description "$taskMarker Read-only production capture; encrypted R2 copies; seven daily periods and four weeks." -Principal $principal -Action $action -Trigger $trigger -Settings $settings -Force | Out-Null
$registered = Get-ScheduledTask -TaskName $taskName
if ($registered.Actions.Execute -ne $powershellExecutable -or $registered.Actions.WorkingDirectory -ne $repositoryRoot) {
  throw 'The registered backup action does not match this workspace.'
}
[pscustomobject]@{
  TaskName = $registered.TaskName
  State = [string]$registered.State
  DailyLocalTime = $DailyAt
  TimeZone = [TimeZoneInfo]::Local.Id
  RunsOnlyWhileOwnerIsLoggedIn = $true
  StartWhenAvailable = $registered.Settings.StartWhenAvailable
} | ConvertTo-Json -Compress
