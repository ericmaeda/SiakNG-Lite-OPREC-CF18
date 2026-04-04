/**
 * Fix Vercel deployment by copying workspace packages to backend node_modules
 * This solves the "Cannot find module" error for monorepo workspace packages
 */
const fs = require('fs');
const path = require('path');

const backendDist = path.resolve(__dirname, '../apps/backend/dist');
const packagesDir = path.resolve(__dirname, '../packages');
const backendNodeModules = path.resolve(__dirname, '../apps/backend/node_modules/@siakng');

// Create @siakng folder in node_modules
fs.mkdirSync(backendNodeModules, { recursive: true });

// Copy each workspace package
['types', 'validators'].forEach(pkg => {
  const src = path.join(packagesDir, pkg, 'src');
  const dest = path.join(backendNodeModules, pkg);
  
  // Remove existing if any
  if (fs.existsSync(dest)) {
    fs.rmSync(dest, { recursive: true });
  }
  
  // Copy src to node_modules/@siakng/pkg
  fs.mkdirSync(path.dirname(dest), { recursive: true });
  fs.cpSync(src, dest, { recursive: true });
  
  console.log(`Copied @siakng/${pkg} to node_modules`);
});

console.log('Vercel paths fix complete!');
