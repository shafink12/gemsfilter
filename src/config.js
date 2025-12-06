// Diamond and Gemstone Filter Configuration

export const DIAMOND_SHAPES = [
  { id: 'round', name: 'Round', icon: '◯' },
  { id: 'oval', name: 'Oval', icon: '⬭' },
  { id: 'cushion', name: 'Cushion', icon: '▢' },
  { id: 'princess', name: 'Princess', icon: '◇' },
  { id: 'emerald', name: 'Emerald', icon: '▭' },
  { id: 'pear', name: 'Pear', icon: '◊' },
  { id: 'marquise', name: 'Marquise', icon: '◇' },
  { id: 'asscher', name: 'Asscher', icon: '▣' },
  { id: 'radiant', name: 'Radiant', icon: '◈' },
  { id: 'heart', name: 'Heart', icon: '♡' }
];

export const DIAMOND_COLORS = ['D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L'];

export const DIAMOND_CLARITY = ['SI2', 'SI1', 'VS2', 'VS1', 'VVS2', 'VVS1', 'IF', 'FL'];

export const DIAMOND_CUT = ['Good', 'Very Good', 'Excellent', 'Ideal'];

export const DIAMOND_POLISH = ['Good', 'Very Good', 'Excellent'];

export const DIAMOND_SYMMETRY = ['Good', 'Very Good', 'Excellent'];

export const DIAMOND_FLUORESCENCE = ['None', 'Faint', 'Medium', 'Strong'];

export const DIAMOND_CERTIFICATIONS = ['GIA', 'IGI', 'AGS', 'HRD'];

// Gemstone configurations
export const GEMSTONE_TYPES = [
  { id: 'sapphire', name: 'Sapphire', color: '#0f52ba' },
  { id: 'ruby', name: 'Ruby', color: '#e0115f' },
  { id: 'emerald', name: 'Emerald', color: '#50c878' },
  { id: 'morganite', name: 'Morganite', color: '#f4c2c2' },
  { id: 'tanzanite', name: 'Tanzanite', color: '#4d4dff' },
  { id: 'garnet', name: 'Garnet', color: '#ff4040' },
  { id: 'alexandrite', name: 'Alexandrite', color: '#8b8589' },
  { id: 'topaz', name: 'Topaz', color: '#ffc87c' },
  { id: 'citrine', name: 'Citrine', color: '#e4d00a' },
  { id: 'moissanite', name: 'Moissanite', color: '#e8e8e8' },
  { id: 'amethyst', name: 'Amethyst', color: '#9966cc' },
  { id: 'ametrine', name: 'Ametrine', color: '#d4af37' },
  { id: 'spinel', name: 'Spinel', color: '#ff0080' },
  { id: 'tourmaline', name: 'Tourmaline', color: '#ff69b4' },
  { id: 'aquamarine', name: 'Aquamarine', color: '#7fffd4' },
  { id: 'peridot', name: 'Peridot', color: '#9ab973' },
  { id: 'zircon', name: 'Zircon', color: '#add8e6' },
  { id: 'fancy-sapphire', name: 'Fancy Sapphire', color: '#ffc0cb' },
  { id: 'opal', name: 'Opal', color: '#a8c3bc' },
  { id: 'pearl', name: 'Pearl', color: '#eae0c8' }
];

export const GEMSTONE_INTENSITY = [
  { id: 'dark', name: 'Dark', abbr: 'D' },
  { id: 'deep', name: 'Deep', abbr: 'DP' },
  { id: 'vivid', name: 'Vivid', abbr: 'V' },
  { id: 'intense', name: 'Intense', abbr: 'I' },
  { id: 'medium', name: 'Medium Intense', abbr: 'MI' },
  { id: 'light', name: 'Light', abbr: 'L' },
  { id: 'very-light', name: 'Very Light', abbr: 'VL' }
];

export const GEMSTONE_CLARITY = [
  { id: 'ec1', name: 'Eye Clean 1', abbr: 'EC1' },
  { id: 'ec2', name: 'Eye Clean 2', abbr: 'EC2' },
  { id: 'vs1', name: 'Visible Inclusions 1', abbr: 'VS1' },
  { id: 'v1', name: 'Visible 1', abbr: 'V1' },
  { id: 'v2', name: 'Visible 2', abbr: 'V2' },
  { id: 'i1', name: 'Included 1', abbr: 'I1' },
  { id: 'i2', name: 'Included 2', abbr: 'I2' },
  { id: 't1', name: 'Translucent 1', abbr: 'T1' },
  { id: 'translucent', name: 'Translucent', abbr: 'TL' },
  { id: 'opaque', name: 'Opaque', abbr: 'O' }
];

export const GEMSTONE_SHAPES = [
  { id: 'round', name: 'Round' },
  { id: 'oval', name: 'Oval' },
  { id: 'cushion', name: 'Cushion' },
  { id: 'radiant', name: 'Radiant' },
  { id: 'pear', name: 'Pear' },
  { id: 'princess', name: 'Princess' },
  { id: 'emerald', name: 'Emerald' },
  { id: 'marquise', name: 'Marquise' },
  { id: 'asscher', name: 'Asscher' },
  { id: 'heart', name: 'Heart' }
];

export const GEMSTONE_ORIGINS = ['Natural', 'Lab-Grown'];

// Default filter values
export const DEFAULT_DIAMOND_FILTERS = {
  shapes: [],
  caratMin: 0.25,
  caratMax: 10,
  colors: [],
  clarity: [],
  cut: [],
  priceMin: 0,
  priceMax: 500000,
  polish: [],
  symmetry: [],
  fluorescence: [],
  certification: [],
  lwRatioMin: 1.0,
  lwRatioMax: 2.5
};

export const DEFAULT_GEMSTONE_FILTERS = {
  type: 'natural', // 'natural' or 'lab'
  gemstoneTypes: [],
  shapes: [],
  intensity: [],
  clarity: [],
  caratMin: 0.1,
  caratMax: 50,
  priceMin: 0,
  priceMax: 100000,
  reportNumber: ''
};
