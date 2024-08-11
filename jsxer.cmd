@echo off
setlocal enabledelayedexpansion

REM Rename all .tsx files to .jsx
for /r %%f in (*.tsx) do (
    set "filename=%%~nf"
    ren "%%f" "!filename!.jsx"
)

REM Rename all .ts files to .js
for /r %%f in (*.ts) do (
    set "filename=%%~nf"
    ren "%%f" "!filename!.js"
)

endlocal