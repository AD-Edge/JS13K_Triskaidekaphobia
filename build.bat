@echo off
REM Define the source and destination paths
set "source=index.html"
set "destination=WebPackBuild\src\index.html"

REM Check if the destination directory exists, if not, create it
if not exist "WebPackBuild\src" (
    mkdir "WebPackBuild\src"
)

REM Copy the file
copy "%source%" "%destination%"

REM Provide feedback
echo File "%source%" has been copied to "%destination%".


@echo off
REM Move to the WebPackBuild directory
@REM cd WebPackBuild

REM Run npm build command
@REM npm run build

REM Provide feedback
@REM echo Build process has been executed.