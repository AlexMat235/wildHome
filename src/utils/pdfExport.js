// PDF / CSV export utilities for WildHome.
// Uses jsPDF (lazy-loaded) to generate planting guides.

// ── Helpers ───────────────────────────────────────────────────────────────────

function drawSectionHeading(doc, title, x, y) {
  doc.setFillColor(74, 124, 89);
  doc.rect(x, y - 4, 3, 6, 'F');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.setTextColor(74, 124, 89);
  doc.text(title, x + 6, y);
  doc.setDrawColor(212, 232, 212);
  doc.line(x + 6 + doc.getTextWidth(title) + 2, y - 1, x + 178, y - 1);
}

function loadImageAsDataURL(url) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = img.width;
      canvas.height = img.height;
      canvas.getContext('2d').drawImage(img, 0, 0);
      resolve(canvas.toDataURL('image/jpeg', 0.8));
    };
    img.onerror = reject;
    img.src = url;
  });
}

/**
 * Draw one flower's planting guide onto an existing jsPDF document,
 * starting at the top of the current page.
 */
function drawFlowerPage(doc, flower, photoDataUrl = null) {
  const PAGE_W = 215.9;
  const MARGIN = 18;
  const CONTENT_W = PAGE_W - MARGIN * 2;
  let y = 0;

  // ── Header banner ──────────────────────────────────────────────────────────
  doc.setFillColor(74, 124, 89); // forest-500
  doc.rect(0, 0, PAGE_W, 32, 'F');

  doc.setTextColor(255, 255, 255);
  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  doc.text('WILDHOME · NATIVE WILDFLOWER PLANTING GUIDE', MARGIN, 11);

  doc.setFontSize(20);
  doc.setFont('helvetica', 'bold');
  doc.text(flower.commonName, MARGIN, 22);

  doc.setFontSize(10);
  doc.setFont('helvetica', 'italic');
  doc.text(flower.scientificName, MARGIN, 29);

  y = 40;

  // ── Photo (if available) ───────────────────────────────────────────────────
  if (photoDataUrl) {
    try {
      doc.addImage(photoDataUrl, 'JPEG', MARGIN, y, 80, 60, undefined, 'MEDIUM');
      y += 66;
    } catch {
      // Skip photo if loading fails
    }
  }

  // ── Description ───────────────────────────────────────────────────────────
  doc.setTextColor(44, 44, 44);
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  const descLines = doc.splitTextToSize(flower.description || '', CONTENT_W);
  doc.text(descLines, MARGIN, y);
  y += descLines.length * 5 + 6;

  // ── Quick Facts grid ──────────────────────────────────────────────────────
  drawSectionHeading(doc, 'Quick Facts', MARGIN, y);
  y += 7;

  const facts = [
    ['Family',           flower.family           || '—'],
    ['Bloom Season',     flower.bloomSeason       || '—'],
    ['Height',           flower.height            || '—'],
    ['Spread',           flower.spread            || '—'],
    ['Sun Preference',   flower.sunPreference     || '—'],
    ['Water Needs',      flower.waterNeeds        || '—'],
    ['Soil',             flower.soilPreference    || '—'],
    ['USDA Zones',       flower.usdaZones         || '—'],
    ['Pollinator Value', flower.pollinatorValue   || '—'],
    ['Colors',           (flower.colors || []).join(', ')],
  ];

  const COL   = 2;
  const ROW_H = 8;
  const COL_W = CONTENT_W / COL;

  facts.forEach(([label, val], i) => {
    const col  = i % COL;
    const row  = Math.floor(i / COL);
    const xBase = MARGIN + col * COL_W;
    const yBase = y + row * ROW_H;

    if (col === 0 && row % 2 === 0) {
      doc.setFillColor(244, 240, 232); // cream-100
      doc.rect(MARGIN, yBase - 3, CONTENT_W, ROW_H, 'F');
    }

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8);
    doc.setTextColor(74, 124, 89);
    doc.text(label.toUpperCase(), xBase, yBase);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9);
    doc.setTextColor(44, 44, 44);
    doc.text(val, xBase, yBase + 4);
  });

  y += Math.ceil(facts.length / COL) * ROW_H + 8;

  // ── Growing Tips ──────────────────────────────────────────────────────────
  if (flower.growingTips) {
    drawSectionHeading(doc, 'Growing Tips', MARGIN, y);
    y += 7;
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9.5);
    doc.setTextColor(44, 44, 44);
    const tipLines = doc.splitTextToSize(flower.growingTips, CONTENT_W);
    doc.text(tipLines, MARGIN, y);
    y += tipLines.length * 5 + 6;
  }

  // ── Native States ─────────────────────────────────────────────────────────
  if (flower.nativeStatesExpanded && flower.nativeStatesExpanded.length) {
    drawSectionHeading(doc, 'Native States', MARGIN, y);
    y += 7;
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9);
    doc.setTextColor(44, 44, 44);
    const stateLines = doc.splitTextToSize(flower.nativeStatesExpanded.join(', '), CONTENT_W);
    doc.text(stateLines, MARGIN, y);
    y += stateLines.length * 5 + 6;
  }

  // ── Tags ──────────────────────────────────────────────────────────────────
  if (flower.tags && flower.tags.length) {
    doc.setFont('helvetica', 'italic');
    doc.setFontSize(8.5);
    doc.setTextColor(155, 99, 48); // terra-600
    doc.text('Tags: ' + flower.tags.join(' · '), MARGIN, y);
    y += 8;
  }

  // ── Footer ────────────────────────────────────────────────────────────────
  const footerY = 267;
  doc.setFillColor(212, 232, 212); // forest-100
  doc.rect(0, footerY, PAGE_W, 12, 'F');
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.5);
  doc.setTextColor(74, 124, 89);
  doc.text(
    `Generated by WildHome · wildhome.app · ${new Date().toLocaleDateString()}`,
    PAGE_W / 2,
    footerY + 7,
    { align: 'center' }
  );
}

// ── Single-flower PDF (used by FlowerModal) ───────────────────────────────────

/**
 * Generate and download a planting guide PDF for a wildflower.
 * @param {Object} flower    Flower object from wildflowers.js
 * @param {string} [photoUrl]  Hero photo URL (may be null for text-only PDF)
 */
export async function exportFlowerPDF(flower, photoUrl = null) {
  const { jsPDF } = await import('jspdf');
  const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'letter' });

  let photoDataUrl = null;
  if (photoUrl) {
    try { photoDataUrl = await loadImageAsDataURL(photoUrl); } catch { /* skip */ }
  }

  drawFlowerPage(doc, flower, photoDataUrl);
  doc.save(`${flower.commonName.replace(/\s+/g, '_')}_Planting_Guide.pdf`);
}

// ── Garden PDF (multi-page, one flower per page) ──────────────────────────────

/**
 * Generate and download a multi-page PDF planting plan for all garden flowers.
 * Photos are fetched concurrently; flowers without photos get a text-only page.
 * @param {Object[]} flowers  Array of flower objects from the garden
 */
export async function exportGardenPDF(flowers) {
  if (!flowers.length) return;

  const { jsPDF } = await import('jspdf');

  // Fetch all photos concurrently (silent failures → null)
  const { fetchFlowerMedia } = await import('../services/iNaturalistService');
  const photoDataUrls = await Promise.all(
    flowers.map(async f => {
      try {
        const media = await fetchFlowerMedia(f.scientificName, f.iNaturalistTaxonId);
        if (!media?.photoUrl) return null;
        return await loadImageAsDataURL(media.photoUrl);
      } catch {
        return null;
      }
    })
  );

  const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'letter' });

  flowers.forEach((flower, i) => {
    if (i > 0) doc.addPage();
    drawFlowerPage(doc, flower, photoDataUrls[i]);
  });

  const date = new Date().toISOString().slice(0, 10);
  doc.save(`WildHome-Garden-${date}.pdf`);
}

// ── Garden CSV ────────────────────────────────────────────────────────────────

/**
 * Generate and download a CSV planting plan for all garden flowers.
 * @param {Object[]} flowers  Array of flower objects from the garden
 */
export function exportGardenCSV(flowers) {
  if (!flowers.length) return;

  const esc = v => `"${String(v ?? '').replace(/"/g, '""')}"`;

  const headers = [
    'Common Name', 'Scientific Name', 'Family',
    'USDA Zones', 'Bloom Season', 'Height', 'Spread',
    'Sun Preference', 'Water Needs', 'Soil Preference',
    'Colors', 'Pollinator Value', 'Conservation Status',
    'Edible', 'Edible Notes',
    'Invasive in Some States', 'Invasive Notes',
    'Toxic to Humans', 'Toxic to Pets',
    'Tags',
  ];

  const rows = flowers.map(f => [
    esc(f.commonName),
    esc(f.scientificName),
    esc(f.family),
    esc(f.usdaZones),
    esc(f.bloomSeason),
    esc(f.height),
    esc(f.spread),
    esc(f.sunPreference),
    esc(f.waterNeeds),
    esc(f.soilPreference),
    esc((f.colors || []).join(', ')),
    esc(f.pollinatorValue),
    esc(f.conservationStatus),
    esc(f.edible ? 'Yes' : 'No'),
    esc(f.edibleNotes),
    esc(f.invasiveInSomeStates ? 'Yes' : 'No'),
    esc(f.invasiveNotes),
    esc(f.toxicToHumans ? 'Yes' : 'No'),
    esc(f.toxicToPets ? 'Yes' : 'No'),
    esc((f.tags || []).join(', ')),
  ]);

  const csv = [headers.map(esc), ...rows].map(r => r.join(',')).join('\r\n');
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const url  = URL.createObjectURL(blob);
  const a    = document.createElement('a');
  const date = new Date().toISOString().slice(0, 10);
  a.href     = url;
  a.download = `WildHome-Garden-${date}.csv`;
  a.click();
  URL.revokeObjectURL(url);
}
