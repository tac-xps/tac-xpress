const fs = require('fs');
const path = require('path');

const DIRS = [
  path.join(__dirname, '../app'),
  path.join(__dirname, '../components')
];

const REGEX_REPLACEMENTS = [
  { pattern: /text-\[10px\]/g, replacement: 'text-micro' },
  { pattern: /text-\[11px\]/g, replacement: 'text-mini' },
  { pattern: /text-\[0\.8rem\]/g, replacement: 'text-xs' },
  { pattern: /text-\[12\.5px\]/g, replacement: 'text-xs' },
  
  // Widths
  { pattern: /w-\[150px\]/g, replacement: 'w-36' },
  { pattern: /w-\[160px\]/g, replacement: 'w-40' },
  { pattern: /w-\[180px\]/g, replacement: 'w-44' },
  { pattern: /w-\[200px\]/g, replacement: 'w-48' },
  { pattern: /w-\[250px\]/g, replacement: 'w-64' },
  { pattern: /w-\[300px\]/g, replacement: 'w-72' },
  { pattern: /w-\[350px\]/g, replacement: 'w-80' },
  { pattern: /w-\[400px\]/g, replacement: 'w-96' },
  { pattern: /w-\[800px\]/g, replacement: 'w-[800px]' }, 
  { pattern: /w-\[100px\]/g, replacement: 'w-24' },
  { pattern: /w-\[120px\]/g, replacement: 'w-28' },
  { pattern: /w-\[80px\]/g, replacement: 'w-20' },
  { pattern: /min-w-\[800px\]/g, replacement: 'min-w-[800px]' }, // leave table bounds
  { pattern: /min-w-\[160px\]/g, replacement: 'min-w-40' },
  { pattern: /min-w-\[200px\]/g, replacement: 'min-w-48' },
  
  // Heights
  { pattern: /h-\[140px\]/g, replacement: 'h-36' }, 
  { pattern: /h-\[250px\]/g, replacement: 'h-64' }, 
  { pattern: /h-\[300px\]/g, replacement: 'h-72' }, 
  { pattern: /h-\[320px\]/g, replacement: 'h-80' }, 
  { pattern: /h-\[400px\]/g, replacement: 'h-96' }, 
  { pattern: /min-h-\[100px\]/g, replacement: 'min-h-24' },
  { pattern: /min-h-\[120px\]/g, replacement: 'min-h-32' },
  { pattern: /min-h-\[150px\]/g, replacement: 'min-h-36' },
  { pattern: /min-h-\[240px\]/g, replacement: 'min-h-60' },
  { pattern: /min-h-\[250px\]/g, replacement: 'min-h-64' },
  { pattern: /min-h-\[350px\]/g, replacement: 'min-h-80' },
  { pattern: /min-h-\[400px\]/g, replacement: 'min-h-96' },
  { pattern: /min-h-\[600px\]/g, replacement: 'min-h-[600px]' },
  
  // Max Widths
  { pattern: /max-w-\[240px\]/g, replacement: 'max-w-xs' },
  { pattern: /max-w-\[400px\]/g, replacement: 'max-w-md' },
  { pattern: /max-w-\[425px\]/g, replacement: 'max-w-md' },
  { pattern: /max-w-\[600px\]/g, replacement: 'max-w-xl' },
  { pattern: /max-w-\[1200px\]/g, replacement: 'max-w-6xl' },
  { pattern: /max-w-\[1600px\]/g, replacement: 'max-w-7xl' },
];

function processDir(dir) {
  if (!fs.existsSync(dir)) return;
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      processDir(fullPath);
    } else if (fullPath.endsWith('.tsx') || fullPath.endsWith('.jsx') || fullPath.endsWith('.ts')) {
      // Exclude print specific
      const normalizedPath = fullPath.replace(/\\/g, '/');
      if (normalizedPath.includes('invoice-document.tsx') || 
          normalizedPath.includes('label/page.tsx') || 
          normalizedPath.includes('shipping-label-preview.tsx')) {
         continue;
      }
      
      let content = fs.readFileSync(fullPath, 'utf8');
      let modified = false;
      
      for (const {pattern, replacement} of REGEX_REPLACEMENTS) {
        if (pattern.test(content)) {
          content = content.replace(pattern, replacement);
          modified = true;
        }
      }
      
      if (modified) {
        fs.writeFileSync(fullPath, content, 'utf8');
        console.log('Updated', fullPath);
      }
    }
  }
}

DIRS.forEach(processDir);
console.log('Tailwind normalization complete.');
