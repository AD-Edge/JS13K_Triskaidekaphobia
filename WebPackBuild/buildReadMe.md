# JS13K 2024 Webpack Build/Automation

Config put together by Alex Delderfield (Alex_ADEdge), 2024
Pulls all required HTML/CSS/JS from working project directory, into WebPackBuild, and then minifies and optimizes all files into 2x:

index.html (contains minified HTML and CSS)
bundle.min.js (contains all minified and optimized javascript files as one)

These can then be zipped, 

## Required Setup (Project Structure)


/Project-Root
    /WebPackBuild
        webpack.config.js
        replace_line.ps1 (can be ignored - custom requirements)

        /dist
            style.css
            main.js
        /src
            (source is automatically copied here from /src)

    /src
        math.js
        graphics.js
        etc ..
    index.html
    index.js
    style.css



## Required (package.json)

"scripts": {
"test": "echo \"Error: no test specified\" && exit 1",
"build": "webpack --config webpack.config.js"
},


## Required (Setup)

Move to /WebPackBuild:

> cd /WebPackBuild

Install npm modules

> npm install


## Modify build.bat



## Running build

To run execute:

> ./build.bat
