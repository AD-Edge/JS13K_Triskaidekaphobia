@echo off
REM Define source & destination paths
set "sourceIndex=index.html"
set "sourceJS=index.js"
set "sourceCSS=style.css"
set "sourceJSFolder=src"
REM Build directory for code to be processed
set "targetDir=WebPackBuild\src"

echo.
echo Prepping build automation...
echo.
REM Check if the directory exists
if not exist "%targetDir%" ( REM if not, create it
    echo Directory "%targetDir%" does not exist. Creating it now...
    mkdir "%targetDir%"
) else (
    echo Directory "%targetDir%" exists.
    echo Deleting previous files...
    del /q "%targetDir%\*.*"
)

REM Copy files to the target directory
echo Copying "%sourceIndex%" to "%targetDir%"...
copy "%sourceIndex%" "%targetDir%"
echo Copying "%sourceJS%" to "%targetDir%"...
copy "%sourceJS%" "%targetDir%"
echo Copying "%sourceCSS%" to "%targetDir%"...
copy "%sourceCSS%" "%targetDir%"
REM Copy all JS files from sourceJSFolder to targetDir
echo Copying folder "%sourceJSFolder%" to "%targetDir%"...
mkdir "%targetDir%\src"
xcopy "%sourceJSFolder%" "%targetDir%\src\" /s /e /i /y

echo.
echo Modifying source files....
echo.

@echo off
REM Move to WebPackBuild directory
cd WebPackBuild

@echo off
REM Run custom PowerShell script
powershell -ExecutionPolicy Bypass -File "replace_line.ps1"

echo.
echo Starting build process....
echo.

REM Run npm build command
npm run build

REM END