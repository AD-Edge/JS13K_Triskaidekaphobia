const fs = require('fs');
const path = require('path');
const uglifyJS = require('uglify-js');

const folders = [ '../source/global', '../source/main', '../source/game', '../source/classes', '../source/util'];

// Minify Combine
fs.writeFileSync('../build/i.js', uglifyJS.minify(
  folders.map(dir => fs.readdirSync(dir).map(file => fs.readFileSync(path.join(dir, file), 'utf8')).join('')).join(''),
  { 
    toplevel: true,
    output: {
        comments: /^!/ // Preserve comments starting with "!"
    }
    // ,
    //     compress: {
    //     drop_console: true // Remove all console.* statements
    // }
}
).code);

// output: {
//   comments: /^!/
// }


// Simple Combine
// fs.writeFileSync(
//     '../build/i.js',
//     folders.map(dir =>
//         fs.readdirSync(dir)
//         .map(file =>
//             fs.readFileSync(path.join(dir, file), 'utf8')
//         )
//         .join('\n') 
//         )
//     .join('\n'),
//   'utf8'
// );

// Setup: 
// 'npm install' if package.json is already there, else:
// npm init 
// npm install uglify-js --save

// Run With:
// node .\build.js