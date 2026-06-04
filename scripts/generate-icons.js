const fs = require('fs');
const path = require('path');

const outputDir = path.join(__dirname, '../src/static/nav');

const crc32Table = (() => {
  const table = [];
  for (let n = 0; n < 256; n++) {
    let c = n;
    for (let k = 0; k < 8; k++) {
      c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
    }
    table.push(c >>> 0);
  }
  return table;
})();

const crc32 = (data) => {
  let crc = 0xffffffff;
  for (const byte of data) {
    crc = crc32Table[(crc ^ byte) & 0xff] ^ (crc >>> 8);
  }
  return (crc ^ 0xffffffff) >>> 0;
};

const deflate = (data) => {
  const result = [0x78, 0x01];
  const blockSize = 65535;
  
  for (let i = 0; i < data.length; i += blockSize) {
    const block = data.slice(i, Math.min(i + blockSize, data.length));
    const isLast = i + blockSize >= data.length;
    result.push(isLast ? 1 : 0);
    const len = block.length;
    result.push(len & 0xFF, (len >> 8) & 0xFF);
    result.push((~len) & 0xFF, ((~len) >> 8) & 0xFF);
    result.push(...block);
  }
  
  let a = 1, b = 0;
  for (const byte of data) {
    a = (a + byte) % 65521;
    b = (b + a) % 65521;
  }
  const adler = ((b << 16) | a) >>> 0;
  result.push((adler >> 24) & 0xFF, (adler >> 16) & 0xFF, (adler >> 8) & 0xFF, adler & 0xFF);
  return result;
};

const intToBytes = (val) => [
  (val >> 24) & 0xFF, (val >> 16) & 0xFF, (val >> 8) & 0xFF, val & 0xFF
];

const createPng = (width, height, drawFn) => {
  const png = [];
  png.push(0x89, 0x50, 0x4E, 0x47, 0x0D, 0x0A, 0x1A, 0x0A);
  
  const ihdr = [
    (width >> 24) & 0xFF, (width >> 16) & 0xFF, (width >> 8) & 0xFF, width & 0xFF,
    (height >> 24) & 0xFF, (height >> 16) & 0xFF, (height >> 8) & 0xFF, height & 0xFF,
    8, 6, 0, 0, 0
  ];
  const ihdrCrc = crc32([0x49, 0x48, 0x44, 0x52, ...ihdr]);
  png.push(0, 0, 0, 13, 0x49, 0x48, 0x44, 0x52, ...ihdr, ...intToBytes(ihdrCrc));
  
  const rawData = [];
  for (let y = 0; y < height; y++) {
    rawData.push(0);
    for (let x = 0; x < width; x++) {
      const [r, g, b, a] = drawFn(x, y, width, height);
      rawData.push(r, g, b, a);
    }
  }
  
  const compressed = deflate(rawData);
  const idatCrc = crc32([0x49, 0x44, 0x41, 0x54, ...compressed]);
  const len = compressed.length;
  png.push((len >> 24) & 0xFF, (len >> 16) & 0xFF, (len >> 8) & 0xFF, len & 0xFF);
  png.push(0x49, 0x44, 0x41, 0x54, ...compressed, ...intToBytes(idatCrc));
  
  const iendCrc = crc32([0x49, 0x45, 0x4E, 0x44]);
  png.push(0, 0, 0, 0, 0x49, 0x45, 0x4E, 0x44, ...intToBytes(iendCrc));
  return Buffer.from(png);
};

const icons = [
  { name: 'nav1-1.png', color: [153, 153, 153], type: 'dashboard' },
  { name: 'nav1-2.png', color: [59, 126, 255], type: 'dashboard' },
  { name: 'nav2-1.png', color: [153, 153, 153], type: 'research' },
  { name: 'nav2-2.png', color: [59, 126, 255], type: 'research' },
  { name: 'nav3-1.png', color: [153, 153, 153], type: 'lab' },
  { name: 'nav3-2.png', color: [59, 126, 255], type: 'lab' },
  { name: 'nav4-1.png', color: [153, 153, 153], type: 'iot' },
  { name: 'nav4-2.png', color: [59, 126, 255], type: 'iot' },
  { name: 'nav5-1.png', color: [153, 153, 153], type: 'user' },
  { name: 'nav5-2.png', color: [59, 126, 255], type: 'user' },
];

const drawIcon = (type, color) => (x, y, w, h) => {
  const cx = w / 2, cy = h / 2;
  const scale = Math.min(w, h) / 32;
  
  const isWhite = color[0] > 200 && color[1] > 200 && color[2] > 200;
  const bg = isWhite ? [245, 245, 245, 255] : [255, 255, 255, 0];
  
  let draw = false;
  
  switch(type) {
    case 'dashboard': {
      const rx = cx - 10 * scale, ry = cy - 8 * scale;
      const rw = 20 * scale, rh = 16 * scale;
      if (x >= rx && x <= rx + rw && y >= ry && y <= ry + rh) {
        const bar1 = ry + rh - ((x - rx) / rw) * rh * 0.8;
        const bar2 = ry + rh - ((x - rx + 3 * scale) / rw) * rh * 0.6;
        const bar3 = ry + rh - ((x - rx + 6 * scale) / rw) * rh * 0.9;
        const bar4 = ry + rh - ((x - rx + 9 * scale) / rw) * rh * 0.5;
        if (y >= bar1 && y <= ry + rh && (x - rx) % (3 * scale) < 2 * scale) draw = true;
        else if (y >= bar2 && y <= ry + rh && ((x - rx - 3 * scale) % (3 * scale)) < 2 * scale) draw = true;
        else if (y >= bar3 && y <= ry + rh && ((x - rx - 6 * scale) % (3 * scale)) < 2 * scale) draw = true;
        else if (y >= bar4 && y <= ry + rh && ((x - rx - 9 * scale) % (3 * scale)) < 2 * scale) draw = true;
      }
      break;
    }
    case 'research': {
      const rx = cx - 8 * scale, ry = cy - 10 * scale;
      const rw = 16 * scale, rh = 20 * scale;
      if (x >= rx && x <= rx + rw && y >= ry && y <= ry + rh) {
        const centerX = cx;
        const topWidth = 4 * scale;
        const bottomWidth = 12 * scale;
        const topY = ry;
        const bottomY = ry + rh;
        
        const slope1 = (bottomWidth - topWidth) / (bottomY - topY);
        const leftEdge = centerX - topWidth/2 - slope1 * (y - topY);
        const rightEdge = centerX + topWidth/2 + slope1 * (y - topY);
        
        if (x >= leftEdge && x <= rightEdge) draw = true;
      }
      const lidY = ry - 2 * scale;
      if (x >= cx - 5 * scale && x <= cx + 5 * scale && y >= lidY - 3 * scale && y <= lidY) draw = true;
      break;
    }
    case 'lab': {
      const innerW = 12 * scale, innerH = 14 * scale;
      const rx = cx - innerW/2, ry = cy - innerH/2;
      if (x >= rx && x <= rx + innerW && y >= ry && y <= ry + innerH) {
        const bottomY = ry + innerH;
        const yRatio = 1 - (y - ry) / innerH;
        const wave = Math.sin((x - rx) / innerW * Math.PI * 4) * 2 * scale * yRatio;
        if (y >= bottomY - 6 * scale + wave) draw = true;
      }
      const rimW = 16 * scale;
      if (x >= cx - rimW/2 && x <= cx + rimW/2 && y >= ry - 3 * scale && y <= ry) draw = true;
      break;
    }
    case 'iot': {
      const radius = 8 * scale;
      if (Math.sqrt((x - cx) ** 2 + (y - cy) ** 2) <= radius) {
        draw = true;
      }
      const dotRadius = 2 * scale;
      const dots = [
        [cx + radius * 1.5, cy],
        [cx - radius * 1.5, cy],
        [cx, cy + radius * 1.5],
        [cx, cy - radius * 1.5],
      ];
      for (const [dx, dy] of dots) {
        if (Math.sqrt((x - dx) ** 2 + (y - dy) ** 2) <= dotRadius) draw = true;
      }
      break;
    }
    case 'user': {
      const headRadius = 6 * scale;
      if (Math.sqrt((x - cx) ** 2 + (y - cy + 4 * scale) ** 2) <= headRadius) {
        draw = true;
      }
      const bodyTop = cy + 3 * scale;
      const bodyW = 10 * scale, bodyH = 12 * scale;
      if (x >= cx - bodyW/2 && x <= cx + bodyW/2 && y >= bodyTop && y <= bodyTop + bodyH) {
        draw = true;
      }
      break;
    }
  }
  
  return draw ? [...color, 255] : bg;
};

if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

icons.forEach(icon => {
  const png = createPng(48, 48, drawIcon(icon.type, icon.color));
  fs.writeFileSync(path.join(outputDir, icon.name), png);
  console.log(`Generated: ${icon.name}`);
});

console.log('All icons generated!');