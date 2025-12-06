// Filter logic for diamonds and gemstones

import { DIAMOND_COLORS, DIAMOND_CLARITY, DIAMOND_CUT } from './config.js';

/**
 * Filter diamonds based on selected criteria
 */
export function filterDiamonds(diamonds, filters) {
  return diamonds.filter(diamond => {
    // Shape filter
    if (filters.shapes.length > 0 && !filters.shapes.includes(diamond.shape)) {
      return false;
    }

    // Carat range
    if (diamond.carat < filters.caratMin || diamond.carat > filters.caratMax) {
      return false;
    }

    // Color filter
    if (filters.colors.length > 0 && !filters.colors.includes(diamond.color)) {
      return false;
    }

    // Clarity filter
    if (filters.clarity.length > 0 && !filters.clarity.includes(diamond.clarity)) {
      return false;
    }

    // Cut filter
    if (filters.cut.length > 0 && !filters.cut.includes(diamond.cut)) {
      return false;
    }

    // Price range
    if (diamond.price < filters.priceMin || diamond.price > filters.priceMax) {
      return false;
    }

    // Polish filter
    if (filters.polish.length > 0 && !filters.polish.includes(diamond.polish)) {
      return false;
    }

    // Symmetry filter
    if (filters.symmetry.length > 0 && !filters.symmetry.includes(diamond.symmetry)) {
      return false;
    }

    // Fluorescence filter
    if (filters.fluorescence.length > 0 && !filters.fluorescence.includes(diamond.fluorescence)) {
      return false;
    }

    // Certification filter
    if (filters.certification.length > 0 && !filters.certification.includes(diamond.certification)) {
      return false;
    }

    // L/W Ratio filter
    if (diamond.lwRatio < filters.lwRatioMin || diamond.lwRatio > filters.lwRatioMax) {
      return false;
    }

    return true;
  });
}

/**
 * Filter gemstones based on selected criteria
 */
export function filterGemstones(gemstones, filters) {
  return gemstones.filter(gemstone => {
    // Natural vs Lab filter
    if (gemstone.type !== filters.type) {
      return false;
    }

    // Gemstone type filter
    if (filters.gemstoneTypes.length > 0 && !filters.gemstoneTypes.includes(gemstone.gemstoneType)) {
      return false;
    }

    // Shape filter
    if (filters.shapes.length > 0 && !filters.shapes.includes(gemstone.shape)) {
      return false;
    }

    // Intensity filter
    if (filters.intensity.length > 0 && !filters.intensity.includes(gemstone.intensity)) {
      return false;
    }

    // Clarity filter
    if (filters.clarity.length > 0 && !filters.clarity.includes(gemstone.clarity)) {
      return false;
    }

    // Carat range
    if (gemstone.carat < filters.caratMin || gemstone.carat > filters.caratMax) {
      return false;
    }

    // Price range
    if (gemstone.price < filters.priceMin || gemstone.price > filters.priceMax) {
      return false;
    }

    // Report number search
    if (filters.reportNumber && !gemstone.reportNumber.toLowerCase().includes(filters.reportNumber.toLowerCase())) {
      return false;
    }

    return true;
  });
}

/**
 * Sort diamonds by a given field
 */
export function sortDiamonds(diamonds, sortBy, sortOrder = 'asc') {
  const sorted = [...diamonds].sort((a, b) => {
    let valueA = a[sortBy];
    let valueB = b[sortBy];

    // Handle special sorting for color (D is best, L is worst)
    if (sortBy === 'color') {
      valueA = DIAMOND_COLORS.indexOf(valueA);
      valueB = DIAMOND_COLORS.indexOf(valueB);
    }

    // Handle special sorting for clarity
    if (sortBy === 'clarity') {
      valueA = DIAMOND_CLARITY.indexOf(valueA);
      valueB = DIAMOND_CLARITY.indexOf(valueB);
    }

    // Handle special sorting for cut
    if (sortBy === 'cut') {
      valueA = DIAMOND_CUT.indexOf(valueA);
      valueB = DIAMOND_CUT.indexOf(valueB);
    }

    if (valueA < valueB) return sortOrder === 'asc' ? -1 : 1;
    if (valueA > valueB) return sortOrder === 'asc' ? 1 : -1;
    return 0;
  });

  return sorted;
}

/**
 * Sort gemstones by a given field
 */
export function sortGemstones(gemstones, sortBy, sortOrder = 'asc') {
  const sorted = [...gemstones].sort((a, b) => {
    let valueA = a[sortBy];
    let valueB = b[sortBy];

    if (valueA < valueB) return sortOrder === 'asc' ? -1 : 1;
    if (valueA > valueB) return sortOrder === 'asc' ? 1 : -1;
    return 0;
  });

  return sorted;
}

/**
 * Get unique values for a field from an array of items
 */
export function getUniqueValues(items, field) {
  return [...new Set(items.map(item => item[field]))].filter(Boolean);
}

/**
 * Calculate price range from items
 */
export function getPriceRange(items) {
  if (items.length === 0) return { min: 0, max: 0 };
  const prices = items.map(item => item.price);
  return {
    min: Math.min(...prices),
    max: Math.max(...prices)
  };
}

/**
 * Calculate carat range from items
 */
export function getCaratRange(items) {
  if (items.length === 0) return { min: 0, max: 0 };
  const carats = items.map(item => item.carat);
  return {
    min: Math.min(...carats),
    max: Math.max(...carats)
  };
}
