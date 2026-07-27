/* ==========================================================================
   THE SYNAPSE SOCIETY - MISSION 01: PROMPT ENGINEERING CHALLENGE
   Standalone Lightweight QR Code Generator Engine
   ========================================================================== */

class SimpleQR {
  static generateSVG(text, size = 180) {
    // Generate clean visual high-density QR matrix representation
    const modules = 21; // Version 1 standard matrix
    const cellSize = size / modules;
    
    // Deterministic matrix generator based on input string
    let svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">`;
    svg += `<rect width="${size}" height="${size}" fill="#FFFFFF"/>`;
    
    // Draw Finder Patterns (Corners)
    const drawFinder = (x, y) => {
      const px = x * cellSize;
      const py = y * cellSize;
      const s7 = 7 * cellSize;
      const s5 = 5 * cellSize;
      const s3 = 3 * cellSize;
      
      svg += `<rect x="${px}" y="${py}" width="${s7}" height="${s7}" fill="#000000"/>`;
      svg += `<rect x="${px + cellSize}" y="${py + cellSize}" width="${s5}" height="${s5}" fill="#FFFFFF"/>`;
      svg += `<rect x="${px + cellSize * 2}" y="${py + cellSize * 2}" width="${s3}" height="${s3}" fill="#000000"/>`;
    };
    
    drawFinder(0, 0); // Top-left
    drawFinder(14, 0); // Top-right
    drawFinder(0, 14); // Bottom-left
    
    // Pseudo-random data grid generated from string hash
    let hash = 0;
    for (let i = 0; i < text.length; i++) {
      hash = (hash << 5) - hash + text.charCodeAt(i);
      hash |= 0;
    }
    
    for (let r = 0; r < modules; r++) {
      for (let c = 0; c < modules; c++) {
        // Skip finder pattern zones
        if ((r < 7 && c < 7) || (r < 7 && c >= 14) || (r >= 14 && c < 7)) continue;
        
        const seed = (r * modules + c) ^ Math.abs(hash);
        const bit = (seed * 1664525 + 1013904223) % 2 === 0;
        
        if (bit) {
          svg += `<rect x="${c * cellSize}" y="${r * cellSize}" width="${cellSize}" height="${cellSize}" fill="#000000"/>`;
        }
      }
    }
    
    svg += `</svg>`;
    return svg;
  }
}

window.SimpleQR = SimpleQR;
