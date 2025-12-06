# GemsFilter - Diamond & Gemstone Search Engine

A fully-featured diamond and gemstone search filter widget that can be embedded into any Shopify store.

## Features

### Diamond Filters
- Shape (Round, Oval, Cushion, Princess, Emerald, Pear, Marquise, Asscher, Radiant, Heart)
- Carat range
- Color (D-L grades)
- Clarity (FL, IF, VVS1, VVS2, VS1, VS2, SI1, SI2)
- Cut (Good, Very Good, Excellent, Ideal)
- Polish (Good, Very Good, Excellent)
- Symmetry (Good, Very Good, Excellent)
- Fluorescence (None, Faint, Medium, Strong)
- L/W Ratio
- Price range
- Certification (GIA, IGI, AGS, HRD)

### Gemstone Filters
- Natural vs Lab-grown toggle
- Gemstone types (Sapphire, Ruby, Emerald, Morganite, Tanzanite, Garnet, Alexandrite, Topaz, Citrine, Moissanite, Amethyst, and more)
- Intensity (Dark, Deep, Vivid, Intense, Medium, Light, Very Light)
- Clarity grades
- Shape
- Carat range
- Price range
- Report number search

### Display Features
- Grid and List view toggle
- Sortable columns
- Pagination
- Compare functionality (up to 4 items)
- Recently viewed tracking
- Applied filters display with remove option
- Reset all filters

## Installation

### Development Setup

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

### Shopify Integration

#### Option 1: Direct Script Include

1. Upload the built files (`dist/gemsfilter.iife.js` and `dist/gemsfilter.css`) to your Shopify theme's assets folder.

2. Add this code to your Shopify page or template:

```html
<!-- Add to your theme's layout or page template -->
<link rel="stylesheet" href="{{ 'gemsfilter.css' | asset_url }}">

<div id="gems-filter-app"></div>

<script src="{{ 'gemsfilter.iife.js' | asset_url }}"></script>
<script>
  // Initialize with custom options
  const gemsFilter = new GemsFilter('#gems-filter-app', {
    mode: 'all', // 'diamonds', 'gemstones', or 'all'
    currency: '€',
    itemsPerPage: 12,
    defaultView: 'grid',

    // Callback when item is clicked
    onItemClick: function(item) {
      // Navigate to product page
      window.location.href = '/products/' + item.handle;
    },

    // Callback when add to cart is clicked
    onAddToCart: function(item) {
      // Add to Shopify cart
      fetch('/cart/add.js', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: item.variantId,
          quantity: 1
        })
      }).then(function() {
        // Update cart UI or show notification
        alert('Added to cart!');
      });
    }
  });
</script>
```

#### Option 2: Shopify App Integration

For full Shopify integration with product sync:

```javascript
// Fetch products from Shopify and set them
async function loadProducts() {
  // Fetch diamonds from your collection
  const diamondsResponse = await fetch('/collections/diamonds/products.json');
  const diamondsData = await diamondsResponse.json();

  // Transform Shopify products to GemsFilter format
  const diamonds = diamondsData.products.map(product => ({
    id: product.id,
    handle: product.handle,
    variantId: product.variants[0].id,
    shape: product.metafields?.custom?.shape || 'round',
    carat: parseFloat(product.metafields?.custom?.carat) || 1.0,
    color: product.metafields?.custom?.color || 'G',
    clarity: product.metafields?.custom?.clarity || 'VS1',
    cut: product.metafields?.custom?.cut || 'Excellent',
    polish: product.metafields?.custom?.polish || 'Excellent',
    symmetry: product.metafields?.custom?.symmetry || 'Excellent',
    fluorescence: product.metafields?.custom?.fluorescence || 'None',
    certification: product.metafields?.custom?.certification || 'GIA',
    price: parseFloat(product.variants[0].price),
    currency: '€',
    lwRatio: parseFloat(product.metafields?.custom?.lw_ratio) || 1.0,
    image: product.images[0]?.src || null,
    reportNumber: product.metafields?.custom?.report_number || ''
  }));

  gemsFilter.setDiamonds(diamonds);
}

loadProducts();
```

## API Reference

### Constructor Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `mode` | string | `'all'` | Display mode: `'diamonds'`, `'gemstones'`, or `'all'` |
| `currency` | string | `'€'` | Currency symbol for prices |
| `itemsPerPage` | number | `12` | Number of items per page |
| `defaultView` | string | `'grid'` | Default view: `'grid'` or `'list'` |
| `showSteps` | boolean | `false` | Show step indicator |
| `onItemClick` | function | `null` | Callback when item is clicked |
| `onAddToCart` | function | `null` | Callback when add to cart is clicked |

### Methods

```javascript
// Set diamond data
gemsFilter.setDiamonds(diamondsArray);

// Set gemstone data
gemsFilter.setGemstones(gemstonesArray);

// Get current filter selections
const filters = gemsFilter.getSelectedFilters();

// Get items selected for comparison
const compareItems = gemsFilter.getCompareItems();

// Reset all filters
gemsFilter.resetFilters();
```

### Data Format

#### Diamond Object
```javascript
{
  id: 'D001',
  handle: 'diamond-001', // Shopify handle
  variantId: 123456789, // Shopify variant ID
  shape: 'round',
  carat: 1.5,
  color: 'D',
  clarity: 'VVS1',
  cut: 'Excellent',
  polish: 'Excellent',
  symmetry: 'Excellent',
  fluorescence: 'None',
  certification: 'GIA',
  price: 5000,
  currency: '€',
  lwRatio: 1.0,
  image: 'https://...',
  reportNumber: 'GIA1234567890'
}
```

#### Gemstone Object
```javascript
{
  id: 'G001',
  handle: 'sapphire-001',
  variantId: 123456789,
  type: 'natural', // or 'lab'
  gemstoneType: 'sapphire',
  shape: 'oval',
  carat: 2.5,
  color: 'Blue',
  intensity: 'vivid',
  clarity: 'ec1',
  certification: 'GRS',
  price: 3000,
  currency: '€',
  image: 'https://...',
  reportNumber: 'GRS789012'
}
```

## Shopify Metafields Setup

For optimal integration, set up these metafields for your diamond/gemstone products:

| Metafield Key | Type | Description |
|---------------|------|-------------|
| `custom.shape` | Single line text | round, oval, cushion, etc. |
| `custom.carat` | Decimal | Weight in carats |
| `custom.color` | Single line text | D, E, F, G, etc. |
| `custom.clarity` | Single line text | FL, IF, VVS1, etc. |
| `custom.cut` | Single line text | Good, Very Good, Excellent, Ideal |
| `custom.polish` | Single line text | Good, Very Good, Excellent |
| `custom.symmetry` | Single line text | Good, Very Good, Excellent |
| `custom.fluorescence` | Single line text | None, Faint, Medium, Strong |
| `custom.certification` | Single line text | GIA, IGI, AGS, HRD |
| `custom.lw_ratio` | Decimal | Length/Width ratio |
| `custom.report_number` | Single line text | Certificate number |

## Customization

### CSS Variables

Override these CSS variables to match your store's theme:

```css
.gf-container {
  --gf-primary: #1a365d;
  --gf-secondary: #2d4a6f;
  --gf-accent: #c9a227;
  --gf-text: #333;
  --gf-border: #e0e0e0;
  --gf-background: #f8f9fa;
}
```

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## License

MIT License
