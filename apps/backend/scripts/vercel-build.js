/**
 * Vercel Build Script for NestJS Backend
 * Uses esbuild to bundle for serverless
 */
const esbuild = require('esbuild');
const fs = require('fs');
const path = require('path');

const isProd = process.env.NODE_ENV === 'production';

async function build() {
  console.log('Building NestJS for Vercel...');
  
  // Copy workspace packages to node_modules first
  const packagesDir = path.resolve(__dirname, '../packages');
  const nodeModulesDir = path.resolve(__dirname, '../node_modules/@siakng');
  
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
    }
  });
  
  // Bundle with esbuild
  try {
    await esbuild.build({
      entryPoints: ['src/main.ts'],
      bundle: true,
      platform: 'node',
      target: 'node18',
      outfile: 'dist/main.js',
      format: 'cjs',
      sourcemap: isProd ? false : true,
      minify: isProd,
      external: [
        '@nestjs/microservices',
        '@nestjs/websockets',
        '@nestjs/platform-socket.io',
        'class-transformer',
        'class-validator',
        'reflect-metadata'
      ],
      loader: {
        '.ts': 'ts',
        '.json': 'copy',
      },
      resolveExtensions: ['.ts', '.js', '.json'],
      tsconfig: './tsconfig.json',
      logLevel: 'info',
    });
    
    console.log('✓ Build complete!');
  } catch (error) {
    console.error('Build failed:', error);
    process.exit(1);
  }
}

build();
