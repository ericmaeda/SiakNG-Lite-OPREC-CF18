/**
 * Copy workspace packages to node_modules/@siakng before build
 */
const fs = require('fs');
const path = require('path');

const packagesDir = path.resolve(__dirname, '../../../packages');
const nodeModulesDir = path.resolve(__dirname, '../node_modules/@siakng');

console.log('Copying workspace packages...');
console.log('From:', packagesDir);
console.log('To:', nodeModulesDir);

fs.mkdirSync(nodeModulesDir, { recursive: true });

['types', 'validators'].forEach(pkg => {
  const src = path.join(packagesDir, pkg, 'src');
  const dest = path.join(nodeModulesDir, pkg);
  
  if (fs.existsSync(src)) {
    if (fs.existsSync(dest)) {
      fs.rmSync(dest, { recursive: true });
    }
    fs.cpSync(src, dest, { recursive: true });
    console.log(`✓ Copied @siakng/${pkg}`);
  } else {
    console.log(`✗ @siakng/${pkg} not found at ${src}`);
  }
});

console.log('Done!');
