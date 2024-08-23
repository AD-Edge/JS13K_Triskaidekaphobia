@echo off
REM Define source & destination paths
set "sourceIndex=index.html"
set "sourceJS=index.js"
set "sourceCSS=style.css"
set "sourceJSDir=\src"
REM Build directory for code to be processed
set "targetDir=WebPackBuild\src"

echo Prepping build automation...
REM Check if the directory exists
if not exist "%targetDir%" ( REM if not, create it
    echo Directory "%targetDir%" does not exist. Creating it now...
    mkdir "%targetDir%"
) else (
    echo Directory "%targetDir%" exists. Cleaning up all files...
    del /q "%targetDir%\*.*"
)

REM Copy files to the target directory
echo Copying "%sourceIndex%" to "%targetDir%"...
copy "%sourceIndex%" "%targetDir%"
echo Copying "%sourceJS%" to "%targetDir%"...
copy "%sourceJS%" "%targetDir%"
echo Copying "%sourceCSS%" to "%targetDir%"...
copy "%sourceCSS%" "%targetDir%"
REM Copy all JS files from sourceJSDir to targetDir
echo Copying all files from "%sourceJSDir%" to "%targetDir%"...
xcopy "%sourceJSDir%\*" "%targetDir%\" /s /y

echo All files have been copied to "%targetDir%" to build.

echo Starting build process....
@echo off
REM Move to the WebPackBuild directory
@REM cd WebPackBuild

REM Run npm build command
@REM npm run build

REM Provide feedback
@REM echo Build process has been executed.