import fs from 'fs';
import path from 'path';

const footerPath = path.join(process.cwd(), 'layout/footer.tsx');
let content = fs.readFileSync(footerPath, 'utf8');

const replacements = [
  ['href="#"', 'Air Cargo', 'href="/operations/air-cargo"'],
  ['href="#"', 'Surface Cargo', 'href="/operations/surface-cargo"'],
  ['href="#"', 'Live Tracking', 'href="/operations/live-tracking"'],
  ['href="#"', 'Network Map', 'href="/operations/network-map"'],
  ['href="#"', 'Warehouse', 'href="/operations/warehouse"'],
  ['href="#"', 'About Us', 'href="/company/about"'],
  ['href="#"', 'Our Fleet', 'href="/company/fleet"'],
  ['href="#"', 'Careers', 'href="/company/careers"'],
  ['href="#"', 'Investors', 'href="/company/investors"'],
  ['href="#"', 'Contact', 'href="/company/contact"'],
  ['href="#"', 'API Reference', 'href="/resources/api"'],
  ['href="#"', 'Documentation', 'href="/resources/docs"'],
  ['href="#"', 'Webhooks', 'href="/resources/webhooks"'],
  ['href="#"', 'Support', 'href="/resources/support"'],
];

replacements.forEach(([findRef, anchorText, replaceRef]) => {
  // Regex looks for href="#" followed by anything, then the anchor text
  const regex = new RegExp(`href="#"([^>]*>\\s*${anchorText})`, 'g');
  content = content.replace(regex, `${replaceRef}$1`);
});

fs.writeFileSync(footerPath, content);
console.log('Updated footer links.');
