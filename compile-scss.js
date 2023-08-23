const sass = require('node-sass');
const path = require('path');
const fs = require('fs');

const sourcePath = path.join(__dirname, 'src', 'styles', 'main.scss');
const outputPath = path.join(__dirname, 'css', 'main.css');

sass.render(
  {
    file: sourcePath,
  },
  (error, result) => {
    if (!error) {
      fs.writeFile(outputPath, result.css, (err) => {
        if (!err) {
          console.log('SCSS compiled successfully.');
        } else {
          console.error('Error writing CSS file:', err);
        }
      });
    } else {
      console.error('Error compiling SCSS:', error);
    }
  }
);
