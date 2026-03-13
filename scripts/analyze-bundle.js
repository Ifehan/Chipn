#!/usr/bin/env node

/**
 * Bundle Size Analysis Script
 * Analyzes the production build and provides insights on bundle composition
 */

const fs = require('fs');
const path = require('path');

const DIST_DIR = path.join(__dirname, '..', 'dist');
const SIZE_THRESHOLD_MB = 0.3; // 300KB warning threshold
const CHUNK_THRESHOLD_MB = 0.15; // 150KB per chunk warning

function formatBytes(bytes) {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
}

function getDirectorySize(dir) {
  let size = 0;
  const files = fs.readdirSync(dir);

  files.forEach((file) => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);

    if (stat.isDirectory()) {
      size += getDirectorySize(filePath);
    } else {
      size += stat.size;
    }
  });

  return size;
}

function analyzeBundle() {
  if (!fs.existsSync(DIST_DIR)) {
    console.error('❌ Build directory not found. Run "pnpm build" first.');
    process.exit(1);
  }

  console.log('\n📦 Bundle Analysis Report\n');
  console.log('=' .repeat(60));

  // Total size
  const totalSize = getDirectorySize(DIST_DIR);
  console.log(`\n📊 Total Bundle Size: ${formatBytes(totalSize)}`);

  if (totalSize > SIZE_THRESHOLD_MB * 1024 * 1024) {
    console.log(`⚠️  WARNING: Bundle exceeds ${SIZE_THRESHOLD_MB * 1024}KB threshold!`);
  }

  // Analyze individual files
  console.log('\n📄 File Breakdown:\n');

  const files = [];
  function walkDir(dir, relative = '') {
    const entries = fs.readdirSync(dir);
    entries.forEach((entry) => {
      const fullPath = path.join(dir, entry);
      const relPath = path.join(relative, entry);
      const stat = fs.statSync(fullPath);

      if (stat.isFile()) {
        files.push({
          path: relPath,
          size: stat.size,
        });
      } else if (stat.isDirectory() && entry !== '.vitepress') {
        walkDir(fullPath, relPath);
      }
    });
  }

  walkDir(DIST_DIR);

  // Sort by size
  files.sort((a, b) => b.size - a.size);

  // Show top 15 largest files
  files.slice(0, 15).forEach((file, i) => {
    const sizeFormatted = formatBytes(file.size);
    const isChunk = file.path.includes('chunk');
    const isBig = file.size > CHUNK_THRESHOLD_MB * 1024 * 1024;

    let icon = '  ';
    if (isChunk && isBig) {
      icon = '⚠️ ';
    } else if (isChunk) {
      icon = '📦 ';
    }

    console.log(`${icon}${i + 1}. ${file.path.padEnd(40)} ${sizeFormatted.padStart(12)}`);
  });

  // Summary statistics
  const jsFiles = files.filter((f) => f.path.endsWith('.js'));
  const cssFiles = files.filter((f) => f.path.endsWith('.css'));

  const jsSize = jsFiles.reduce((sum, f) => sum + f.size, 0);
  const cssSize = cssFiles.reduce((sum, f) => sum + f.size, 0);

  console.log('\n📈 Summary:');
  console.log(`   JavaScript Files: ${formatBytes(jsSize)} (${jsFiles.length} files)`);
  console.log(`   CSS Files: ${formatBytes(cssSize)} (${cssFiles.length} files)`);

  console.log('\n' + '='.repeat(60));
  console.log('\n💡 Optimization Tips:\n');
  console.log('1. Code Splitting: Chunks are already optimized with vendor splitting');
  console.log('2. Lazy Loading: Consider lazy loading routes not immediately needed');
  console.log('3. Dependencies: Review package.json for unused dependencies');
  console.log('4. Tree Shaking: Ensure all imports are used');
  console.log('5. Compression: Enable gzip compression on your server');
  console.log('\n');
}

analyzeBundle();
