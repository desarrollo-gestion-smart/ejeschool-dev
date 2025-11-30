param(
  [string]$AvdName = ""
)

$projectRoot = Split-Path -Parent $PSScriptRoot
Set-Location $projectRoot

# Ensure NODE_ENV is set for Metro and tooling
if (-not $env:NODE_ENV -or $env:NODE_ENV -eq "") {
  $env:NODE_ENV = "development"
}

if (-not $env:ANDROID_SDK_ROOT -and -not $env:ANDROID_HOME) {
  $defaultSdk = "$env:LOCALAPPDATA\Android\Sdk"
  if (Test-Path $defaultSdk) { $env:ANDROID_SDK_ROOT = $defaultSdk }
}

$androidSdk = $env:ANDROID_SDK_ROOT
if (-not $androidSdk) { $androidSdk = $env:ANDROID_HOME }

$env:Path += ";$androidSdk\platform-tools;$androidSdk\emulator"

$metroRunning = netstat -ano | Select-String ":8081"
if (-not $metroRunning) {
  Start-Process -NoNewWindow -FilePath "cmd.exe" -ArgumentList "/c","npm start"
  Start-Sleep -Seconds 3
}

$avds = & emulator -list-avds
if ($AvdName -eq "" -and $avds) {
  $preferred = $avds | Where-Object { $_ -eq 'EjeSchool_API_36_Play' }
  if ($preferred) { $AvdName = $preferred } else { $AvdName = $avds[0] }
}
if ($AvdName) {
  $running = (& adb devices) -match "device$"
  if (-not $running) {
    Start-Process -FilePath "$androidSdk\emulator\emulator.exe" -ArgumentList "-avd $AvdName"
    Start-Sleep -Seconds 10
    & adb wait-for-device
  }
}

& adb reverse tcp:8081 tcp:8081

Set-Location "$projectRoot\android"
& .\gradlew :app:installDebug --warning-mode all
