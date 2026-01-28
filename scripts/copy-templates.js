const fs = require('fs');
const path = require('path');

const sourceDir = path.join(__dirname, '..', 'src', 'infrastructure', 'templates');
const destDir = path.join(__dirname, '..', 'dist', 'infrastructure', 'templates');

// Create destination directory if it doesn't exist
if (!fs.existsSync(destDir)) {
  fs.mkdirSync(destDir, { recursive: true });
}

// Copy all files from source to destination
const files = fs.readdirSync(sourceDir);
files.forEach((file) => {
  const sourceFile = path.join(sourceDir, file);
  const destFile = path.join(destDir, file);
  
  if (fs.statSync(sourceFile).isFile()) {
    fs.copyFileSync(sourceFile, destFile);
    console.log(`Copied: ${file}`);
  }
});

console.log('Templates copied successfully!');
