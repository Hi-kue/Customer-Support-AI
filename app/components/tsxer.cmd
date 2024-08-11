setlocal enabledelayedexpansion


REM Rename all .jsx files to .tsx
for /r %%f in (*.jsx) do (
    set "filename=%%~nf"
    ren "%%f" "!filename!.tsx"
)

REM Rename all .js files to .ts
for /r %%f in (*.js) do (
    set "filename=%%~nf"
    ren "%%f" "!filename!.ts"
)

echo "NOTE: Use this within a directy containing .jsx and .js files only."
echo "Renamed all {.jsx, .js} files to {.tsx, .ts} files..."

endlocal