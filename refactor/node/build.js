const fs = require('fs');
const path = require('path');
const uglifyJS = require('uglify-js');

const folders = [ '../source/global', '../source/main', '../source/game', '../source/classes', '../source/data', '../source/util'];

// fs.writeFileSync('../build/b.js', uglifyJS.minify(
//   folders.map(dir => fs.readdirSync(dir).map(file => fs.readFileSync(path.join(dir, file), 'utf8')).join('')).join(''),
//   { 
//     toplevel: true,
//     output: {
//       comments: /^!/
//     }
//    }
// ).code);


fs.writeFileSync(
    '../build/b.js',
    folders.map(dir =>
        fs.readdirSync(dir)
        .map(file =>
            fs.readFileSync(path.join(dir, file), 'utf8')
        )
        .join('\n') 
        )
    .join('\n'),
  'utf8'
);

// Setup: 
// 'npm install' if package.json is already there, else:
// npm init 
// npm install uglify-js --save