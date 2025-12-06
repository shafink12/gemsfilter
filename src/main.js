// GemsFilter - Diamond and Gemstone Search Filter
// Main Application Entry Point

import './styles.scss';
import {
  DIAMOND_SHAPES,
  DIAMOND_COLORS,
  DIAMOND_CLARITY,
  DIAMOND_CUT,
  DIAMOND_POLISH,
  DIAMOND_SYMMETRY,
  DIAMOND_FLUORESCENCE,
  DIAMOND_CERTIFICATIONS,
  GEMSTONE_TYPES,
  GEMSTONE_INTENSITY,
  GEMSTONE_CLARITY,
  GEMSTONE_SHAPES,
  DEFAULT_DIAMOND_FILTERS,
  DEFAULT_GEMSTONE_FILTERS
} from './config.js';
import { sampleDiamonds, sampleGemstones, generateMoreDiamonds } from './data.js';
import { filterDiamonds, filterGemstones, sortDiamonds, sortGemstones } from './filters.js';

class GemsFilter {
  constructor(container, options = {}) {
    this.container = typeof container === 'string'
      ? document.querySelector(container)
      : container;

    if (!this.container) {
      console.error('GemsFilter: Container not found');
      return;
    }

    // Options
    this.options = {
      mode: 'all', // 'diamonds', 'gemstones', or 'all'
      currency: '€',
      itemsPerPage: 12,
      defaultView: 'grid', // 'grid' or 'list'
      showSteps: false,
      onItemClick: null,
      onAddToCart: null,
      dataSource: null, // Function to fetch data, or null for sample data
      ...options
    };

    // State
    this.state = {
      activeTab: 'diamonds', // 'diamonds' or 'gemstones'
      diamondFilters: { ...DEFAULT_DIAMOND_FILTERS },
      gemstoneFilters: { ...DEFAULT_GEMSTONE_FILTERS },
      viewMode: this.options.defaultView,
      currentPage: 1,
      sortBy: 'price',
      sortOrder: 'asc',
      compareItems: [],
      recentlyViewed: [],
      activeResultsTab: 'results', // 'results', 'recent', 'compare'
      isLoading: false
    };

    // Data
    this.diamonds = generateMoreDiamonds(50);
    this.gemstones = [...sampleGemstones];

    // Initialize
    this.init();
  }

  init() {
    this.render();
    this.bindEvents();
    this.applyFilters();
  }

  render() {
    this.container.innerHTML = `
      <div class="gf-container">
        <div class="gf-wrapper">
          ${this.renderHeader()}
          ${this.options.showSteps ? this.renderSteps() : ''}
          ${this.renderTypeToggle()}
          <div class="gf-content">
            <div class="gf-filters-section">
              ${this.state.activeTab === 'diamonds' ? this.renderDiamondFilters() : this.renderGemstoneFilters()}
            </div>
            ${this.renderAppliedFilters()}
            ${this.renderResultsHeader()}
            <div class="gf-results-section">
              ${this.renderResults()}
            </div>
            ${this.renderPagination()}
          </div>
          ${this.renderComparePanel()}
        </div>
      </div>
    `;
  }

  renderHeader() {
    return `
      <div class="gf-header">
        <h1>Select Your ${this.state.activeTab === 'diamonds' ? 'Natural Diamonds' : 'Natural Gemstones'}</h1>
      </div>
    `;
  }

  renderSteps() {
    return `
      <div class="gf-steps">
        <div class="gf-step completed">
          <span class="gf-step-number">1</span>
          <span class="gf-step-text">Setting</span>
        </div>
        <div class="gf-step-connector completed"></div>
        <div class="gf-step active">
          <span class="gf-step-number">2</span>
          <span class="gf-step-text">Choose A ${this.state.activeTab === 'diamonds' ? 'Diamond' : 'Gemstone'}</span>
        </div>
        <div class="gf-step-connector"></div>
        <div class="gf-step">
          <span class="gf-step-number">3</span>
          <span class="gf-step-text">Complete Your Ring</span>
        </div>
      </div>
    `;
  }

  renderTypeToggle() {
    if (this.options.mode !== 'all') return '';

    return `
      <div class="gf-header">
        <div class="gf-toggle-group" data-toggle="type">
          <button class="gf-toggle-btn ${this.state.activeTab === 'diamonds' ? 'active' : ''}" data-value="diamonds">
            Natural Diamonds
          </button>
          <button class="gf-toggle-btn ${this.state.activeTab === 'gemstones' ? 'active' : ''}" data-value="gemstones">
            Gemstones
          </button>
        </div>
      </div>
    `;
  }

  renderDiamondFilters() {
    const filters = this.state.diamondFilters;

    return `
      <div class="gf-filters">
        <!-- Left Column -->
        <div class="gf-filters-col">
          <!-- Shape -->
          <div class="gf-filter-group">
            <div class="gf-filter-label">
              Shape <span class="gf-info-icon" title="The shape of the diamond">ⓘ</span>
            </div>
            <div class="gf-shapes" data-filter="shapes">
              ${DIAMOND_SHAPES.map(shape => `
                <button class="gf-shape-btn ${filters.shapes.includes(shape.id) ? 'selected' : ''}"
                        data-value="${shape.id}" title="${shape.name}">
                  <span class="gf-shape-icon">${shape.icon}</span>
                  <span class="gf-shape-name">${shape.name}</span>
                </button>
              `).join('')}
            </div>
          </div>

          <!-- Carat -->
          <div class="gf-filter-group">
            <div class="gf-filter-label">
              Carat <span class="gf-info-icon" title="The weight of the diamond">ⓘ</span>
            </div>
            <div class="gf-range-slider">
              <div class="gf-range-inputs">
                <div class="gf-range-input-group">
                  <input type="number" id="caratMin" value="${filters.caratMin}" min="0.25" max="10" step="0.01">
                </div>
                <div class="gf-range-input-group">
                  <input type="number" id="caratMax" value="${filters.caratMax}" min="0.25" max="10" step="0.01">
                </div>
              </div>
            </div>
          </div>

          <!-- Clarity -->
          <div class="gf-filter-group">
            <div class="gf-filter-label">
              Clarity <span class="gf-info-icon" title="The clarity grade of the diamond">ⓘ</span>
            </div>
            <div class="gf-multi-select" data-filter="clarity">
              ${DIAMOND_CLARITY.map(clarity => `
                <button class="gf-select-btn ${filters.clarity.includes(clarity) ? 'selected' : ''}"
                        data-value="${clarity}">${clarity}</button>
              `).join('')}
            </div>
          </div>

          <!-- L/W Ratio -->
          <div class="gf-filter-group">
            <div class="gf-filter-label">
              L/W Ratio <span class="gf-info-icon" title="Length to Width ratio">ⓘ</span>
            </div>
            <div class="gf-range-slider">
              <div class="gf-range-inputs">
                <div class="gf-range-input-group">
                  <input type="number" id="lwRatioMin" value="${filters.lwRatioMin}" min="1.0" max="2.5" step="0.01">
                </div>
                <div class="gf-range-input-group">
                  <input type="number" id="lwRatioMax" value="${filters.lwRatioMax}" min="1.0" max="2.5" step="0.01">
                </div>
              </div>
            </div>
          </div>

          <!-- Polish -->
          <div class="gf-filter-group">
            <div class="gf-filter-label">
              Polish <span class="gf-info-icon" title="The polish grade of the diamond">ⓘ</span>
            </div>
            <div class="gf-multi-select" data-filter="polish">
              ${DIAMOND_POLISH.map(polish => `
                <button class="gf-select-btn ${filters.polish.includes(polish) ? 'selected' : ''}"
                        data-value="${polish}">${polish}</button>
              `).join('')}
            </div>
          </div>
        </div>

        <!-- Right Column -->
        <div class="gf-filters-col">
          <!-- Cut -->
          <div class="gf-filter-group">
            <div class="gf-filter-label">
              Cut <span class="gf-info-icon" title="The cut quality of the diamond">ⓘ</span>
            </div>
            <div class="gf-multi-select" data-filter="cut">
              ${DIAMOND_CUT.map(cut => `
                <button class="gf-select-btn ${filters.cut.includes(cut) ? 'selected' : ''}"
                        data-value="${cut}">${cut}</button>
              `).join('')}
            </div>
          </div>

          <!-- Color -->
          <div class="gf-filter-group">
            <div class="gf-filter-label">
              Color <span class="gf-info-icon" title="The color grade (D is colorless)">ⓘ</span>
            </div>
            <div class="gf-color-grades" data-filter="colors">
              ${DIAMOND_COLORS.map(color => `
                <button class="gf-color-btn ${filters.colors.includes(color) ? 'selected' : ''}"
                        data-value="${color}">${color}</button>
              `).join('')}
            </div>
          </div>

          <!-- Price -->
          <div class="gf-filter-group">
            <div class="gf-filter-label">
              Price <span class="gf-info-icon" title="Price range">ⓘ</span>
            </div>
            <div class="gf-range-slider">
              <div class="gf-range-inputs">
                <div class="gf-range-input-group">
                  <input type="number" id="priceMin" value="${filters.priceMin}" min="0" step="100" placeholder="Min">
                </div>
                <div class="gf-range-input-group">
                  <input type="number" id="priceMax" value="${filters.priceMax}" min="0" step="100" placeholder="Max">
                </div>
              </div>
            </div>
          </div>

          <!-- Fluorescence -->
          <div class="gf-filter-group">
            <div class="gf-filter-label">
              Fluorescence <span class="gf-info-icon" title="UV fluorescence intensity">ⓘ</span>
            </div>
            <div class="gf-multi-select" data-filter="fluorescence">
              ${DIAMOND_FLUORESCENCE.map(fluor => `
                <button class="gf-select-btn ${filters.fluorescence.includes(fluor) ? 'selected' : ''}"
                        data-value="${fluor}">${fluor}</button>
              `).join('')}
            </div>
          </div>

          <!-- Symmetry -->
          <div class="gf-filter-group">
            <div class="gf-filter-label">
              Symmetry <span class="gf-info-icon" title="The symmetry grade">ⓘ</span>
            </div>
            <div class="gf-multi-select" data-filter="symmetry">
              ${DIAMOND_SYMMETRY.map(sym => `
                <button class="gf-select-btn ${filters.symmetry.includes(sym) ? 'selected' : ''}"
                        data-value="${sym}">${sym}</button>
              `).join('')}
            </div>
          </div>

          <!-- Certification -->
          <div class="gf-filter-group">
            <div class="gf-filter-label">
              Certification <span class="gf-info-icon" title="Grading laboratory">ⓘ</span>
            </div>
            <div class="gf-checkbox-group" data-filter="certification">
              ${DIAMOND_CERTIFICATIONS.map(cert => `
                <label class="gf-checkbox">
                  <input type="checkbox" value="${cert}" ${filters.certification.includes(cert) ? 'checked' : ''}>
                  <span>${cert}</span>
                </label>
              `).join('')}
            </div>
          </div>
        </div>
      </div>
    `;
  }

  renderGemstoneFilters() {
    const filters = this.state.gemstoneFilters;

    return `
      <div class="gf-filters">
        <!-- Natural/Lab Toggle -->
        <div class="gf-filter-group" style="grid-column: 1 / -1;">
          <div class="gf-toggle-group" data-toggle="gemstone-type">
            <button class="gf-toggle-btn ${filters.type === 'natural' ? 'active' : ''}" data-value="natural">
              Natural Gemstones
            </button>
            <button class="gf-toggle-btn ${filters.type === 'lab' ? 'active' : ''}" data-value="lab">
              Lab Gemstones
            </button>
          </div>
        </div>

        <!-- Left Column -->
        <div class="gf-filters-col">
          <!-- Intensity -->
          <div class="gf-filter-group">
            <div class="gf-filter-label">
              Intensity <span class="gf-info-icon" title="Color intensity">ⓘ</span>
            </div>
            <div class="gf-intensity-options" data-filter="intensity">
              ${GEMSTONE_INTENSITY.map(int => `
                <button class="gf-intensity-btn ${filters.intensity.includes(int.id) ? 'selected' : ''}"
                        data-value="${int.id}" title="${int.name}">
                  <div class="gf-intensity-circle" style="background: ${this.getIntensityColor(int.id)}"></div>
                  <span class="gf-intensity-label">${int.abbr}</span>
                </button>
              `).join('')}
            </div>
          </div>

          <!-- Shape -->
          <div class="gf-filter-group">
            <div class="gf-filter-label">
              Shape <span class="gf-info-icon" title="Gemstone shape">ⓘ</span>
            </div>
            <div class="gf-shapes" data-filter="shapes">
              ${GEMSTONE_SHAPES.map(shape => `
                <button class="gf-shape-btn ${filters.shapes.includes(shape.id) ? 'selected' : ''}"
                        data-value="${shape.id}" title="${shape.name}">
                  <span class="gf-shape-name">${shape.name}</span>
                </button>
              `).join('')}
            </div>
          </div>

          <!-- Search by Report Number -->
          <div class="gf-filter-group">
            <div class="gf-filter-label">
              Search by Report Number
            </div>
            <div class="gf-search-input">
              <input type="text" id="reportNumber" placeholder="Enter report number..."
                     value="${filters.reportNumber}">
              <button type="button" class="gf-search-btn">Search</button>
            </div>
          </div>
        </div>

        <!-- Right Column -->
        <div class="gf-filters-col">
          <!-- Clarity -->
          <div class="gf-filter-group">
            <div class="gf-filter-label">
              Clarity <span class="gf-info-icon" title="Clarity grade">ⓘ</span>
            </div>
            <div class="gf-multi-select" data-filter="clarity">
              ${GEMSTONE_CLARITY.map(clarity => `
                <button class="gf-select-btn ${filters.clarity.includes(clarity.id) ? 'selected' : ''}"
                        data-value="${clarity.id}">${clarity.abbr}</button>
              `).join('')}
            </div>
          </div>

          <!-- Price & Carat Range -->
          <div class="gf-filter-group">
            <div class="gf-filter-label">Carat</div>
            <div class="gf-range-slider">
              <div class="gf-range-inputs">
                <div class="gf-range-input-group">
                  <input type="number" id="gemCaratMin" value="${filters.caratMin}" min="0.1" step="0.1">
                </div>
                <div class="gf-range-input-group">
                  <input type="number" id="gemCaratMax" value="${filters.caratMax}" min="0.1" step="0.1">
                </div>
              </div>
            </div>
          </div>

          <div class="gf-filter-group">
            <div class="gf-filter-label">Price</div>
            <div class="gf-range-slider">
              <div class="gf-range-inputs">
                <div class="gf-range-input-group">
                  <input type="number" id="gemPriceMin" value="${filters.priceMin}" min="0" step="100">
                </div>
                <div class="gf-range-input-group">
                  <input type="number" id="gemPriceMax" value="${filters.priceMax}" min="0" step="100">
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Gemstone Types (Full Width) -->
        <div class="gf-filter-group" style="grid-column: 1 / -1;">
          <div class="gf-filter-label">
            Gemstone <span class="gf-info-icon" title="Select gemstone type">ⓘ</span>
          </div>
          <div class="gf-gemstone-types" data-filter="gemstoneTypes">
            ${GEMSTONE_TYPES.map(gem => `
              <button class="gf-gemstone-btn ${filters.gemstoneTypes.includes(gem.id) ? 'selected' : ''}"
                      data-value="${gem.id}" title="${gem.name}">
                <div class="gf-gemstone-color" style="background: ${gem.color}"></div>
                <span class="gf-gemstone-name">${gem.name}</span>
              </button>
            `).join('')}
          </div>
        </div>
      </div>
    `;
  }

  getIntensityColor(intensity) {
    const colors = {
      'dark': '#1a1a2e',
      'deep': '#2d3436',
      'vivid': '#0984e3',
      'intense': '#6c5ce7',
      'medium': '#a29bfe',
      'light': '#dfe6e9',
      'very-light': '#f5f6fa'
    };
    return colors[intensity] || '#ccc';
  }

  renderAppliedFilters() {
    const filters = this.state.activeTab === 'diamonds'
      ? this.state.diamondFilters
      : this.state.gemstoneFilters;

    const appliedFilters = [];

    if (this.state.activeTab === 'diamonds') {
      if (filters.shapes.length) {
        appliedFilters.push({ key: 'shapes', label: 'Shape', value: filters.shapes.join(', ') });
      }
      if (filters.colors.length) {
        appliedFilters.push({ key: 'colors', label: 'Color', value: filters.colors.join(', ') });
      }
      if (filters.clarity.length) {
        appliedFilters.push({ key: 'clarity', label: 'Clarity', value: filters.clarity.join(', ') });
      }
      if (filters.cut.length) {
        appliedFilters.push({ key: 'cut', label: 'Cut', value: filters.cut.join(', ') });
      }
      if (filters.polish.length) {
        appliedFilters.push({ key: 'polish', label: 'Polish', value: filters.polish.join(', ') });
      }
      if (filters.symmetry.length) {
        appliedFilters.push({ key: 'symmetry', label: 'Symmetry', value: filters.symmetry.join(', ') });
      }
      if (filters.fluorescence.length) {
        appliedFilters.push({ key: 'fluorescence', label: 'Fluorescence', value: filters.fluorescence.join(', ') });
      }
      if (filters.certification.length) {
        appliedFilters.push({ key: 'certification', label: 'Certification', value: filters.certification.join(', ') });
      }
    } else {
      if (filters.gemstoneTypes.length) {
        appliedFilters.push({ key: 'gemstoneTypes', label: 'Gemstone', value: filters.gemstoneTypes.join(', ') });
      }
      if (filters.shapes.length) {
        appliedFilters.push({ key: 'shapes', label: 'Shape', value: filters.shapes.join(', ') });
      }
      if (filters.intensity.length) {
        appliedFilters.push({ key: 'intensity', label: 'Intensity', value: filters.intensity.join(', ') });
      }
      if (filters.clarity.length) {
        appliedFilters.push({ key: 'clarity', label: 'Clarity', value: filters.clarity.join(', ') });
      }
    }

    if (appliedFilters.length === 0) return '';

    return `
      <div class="gf-applied-filters">
        <span class="gf-applied-label">Applied Filters:</span>
        ${appliedFilters.map(filter => `
          <span class="gf-filter-tag">
            <span class="gf-tag-label">${filter.label}:</span>
            <span class="gf-tag-value">${filter.value}</span>
            <button class="gf-tag-remove" data-key="${filter.key}">×</button>
          </span>
        `).join('')}
        <button class="gf-clear-all">
          <span>↺</span> Reset
        </button>
      </div>
    `;
  }

  renderResultsHeader() {
    const filteredResults = this.getFilteredResults();
    const count = filteredResults.length;

    return `
      <div class="gf-results-header">
        <div>
          <h2>Select Your ${this.state.activeTab === 'diamonds' ? 'Natural Diamonds' : 'Natural Gemstones'}</h2>
          <span class="gf-results-count">${this.state.activeTab === 'diamonds' ? 'Diamonds' : 'Gemstones'} Found (${count})</span>
        </div>
        <div class="gf-results-actions">
          <div class="gf-tabs">
            <button class="gf-tab ${this.state.activeResultsTab === 'results' ? 'active' : ''}" data-tab="results">
              ${this.state.activeTab === 'diamonds' ? 'Diamonds' : 'Gemstones'} Found (${count})
            </button>
            <button class="gf-tab ${this.state.activeResultsTab === 'recent' ? 'active' : ''}" data-tab="recent">
              Recently Viewed <span class="gf-tab-count">${this.state.recentlyViewed.length}</span>
            </button>
            <button class="gf-tab ${this.state.activeResultsTab === 'compare' ? 'active' : ''}" data-tab="compare">
              Compare <span class="gf-tab-count">${this.state.compareItems.length}</span>
            </button>
          </div>
          <div class="gf-view-toggle">
            <button class="gf-view-btn ${this.state.viewMode === 'list' ? 'active' : ''}" data-view="list" title="List view">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <line x1="3" y1="6" x2="21" y2="6"></line>
                <line x1="3" y1="12" x2="21" y2="12"></line>
                <line x1="3" y1="18" x2="21" y2="18"></line>
              </svg>
            </button>
            <button class="gf-view-btn ${this.state.viewMode === 'grid' ? 'active' : ''}" data-view="grid" title="Grid view">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <rect x="3" y="3" width="7" height="7"></rect>
                <rect x="14" y="3" width="7" height="7"></rect>
                <rect x="3" y="14" width="7" height="7"></rect>
                <rect x="14" y="14" width="7" height="7"></rect>
              </svg>
            </button>
          </div>
        </div>
      </div>
    `;
  }

  renderResults() {
    if (this.state.isLoading) {
      return `
        <div class="gf-loading">
          <div class="gf-spinner"></div>
          <p>Loading ${this.state.activeTab}...</p>
        </div>
      `;
    }

    let items = [];

    if (this.state.activeResultsTab === 'results') {
      items = this.getFilteredResults();
    } else if (this.state.activeResultsTab === 'recent') {
      items = this.state.recentlyViewed;
    } else if (this.state.activeResultsTab === 'compare') {
      items = this.state.compareItems;
    }

    // Sort items
    if (this.state.activeTab === 'diamonds') {
      items = sortDiamonds(items, this.state.sortBy, this.state.sortOrder);
    } else {
      items = sortGemstones(items, this.state.sortBy, this.state.sortOrder);
    }

    // Paginate
    const start = (this.state.currentPage - 1) * this.options.itemsPerPage;
    const paginatedItems = items.slice(start, start + this.options.itemsPerPage);

    if (paginatedItems.length === 0) {
      return `
        <div class="gf-empty">
          <div class="gf-empty-icon">💎</div>
          <h3>No ${this.state.activeTab} found</h3>
          <p>Try adjusting your filters to see more results.</p>
        </div>
      `;
    }

    if (this.state.viewMode === 'list') {
      return this.renderTableView(paginatedItems);
    } else {
      return this.renderGridView(paginatedItems);
    }
  }

  renderTableView(items) {
    const isDiamond = this.state.activeTab === 'diamonds';

    return `
      <table class="gf-results-table">
        <thead>
          <tr>
            <th class="gf-compare-cell">Compare</th>
            <th>Image</th>
            <th class="sortable ${this.state.sortBy === 'shape' ? this.state.sortOrder : ''}" data-sort="shape">Shape</th>
            <th class="sortable ${this.state.sortBy === 'carat' ? this.state.sortOrder : ''}" data-sort="carat">Carat</th>
            ${isDiamond ? `
              <th class="sortable ${this.state.sortBy === 'color' ? this.state.sortOrder : ''}" data-sort="color">Color</th>
              <th class="sortable ${this.state.sortBy === 'clarity' ? this.state.sortOrder : ''}" data-sort="clarity">Clarity</th>
            ` : `
              <th>Colour</th>
              <th>Clarity</th>
            `}
            <th>Report</th>
            <th class="sortable ${this.state.sortBy === 'price' ? this.state.sortOrder : ''}" data-sort="price">Price</th>
            <th>View</th>
          </tr>
        </thead>
        <tbody>
          ${items.map(item => `
            <tr data-id="${item.id}">
              <td class="gf-compare-cell">
                <input type="checkbox" class="gf-compare-checkbox" data-id="${item.id}"
                       ${this.state.compareItems.find(c => c.id === item.id) ? 'checked' : ''}>
              </td>
              <td class="gf-image-cell">
                ${item.image
                  ? `<img src="${item.image}" alt="${item.shape}">`
                  : `<div class="gf-placeholder-img">💎</div>`
                }
              </td>
              <td>${this.capitalize(item.shape)}</td>
              <td>${item.carat}</td>
              <td>${isDiamond ? item.color : (item.color || '-')}</td>
              <td>${isDiamond ? item.clarity : this.getGemstoneClarity(item.clarity)}</td>
              <td>${item.certification}</td>
              <td class="gf-price-cell">${item.currency}${item.price.toLocaleString()}</td>
              <td class="gf-view-cell">
                <button class="gf-view-item-btn" data-id="${item.id}">View</button>
              </td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    `;
  }

  renderGridView(items) {
    const isDiamond = this.state.activeTab === 'diamonds';

    return `
      <div class="gf-results-grid">
        ${items.map(item => `
          <div class="gf-grid-card" data-id="${item.id}">
            <div class="gf-card-image">
              ${item.image
                ? `<img src="${item.image}" alt="${item.shape}">`
                : `<div class="gf-placeholder-img">💎</div>`
              }
              <div class="gf-card-compare">
                <input type="checkbox" class="gf-compare-checkbox" data-id="${item.id}"
                       ${this.state.compareItems.find(c => c.id === item.id) ? 'checked' : ''}>
              </div>
              <button class="gf-card-favorite ${this.state.recentlyViewed.find(r => r.id === item.id) ? 'active' : ''}"
                      data-id="${item.id}">♡</button>
            </div>
            <div class="gf-card-body">
              <h3 class="gf-card-title">${item.carat}-Carat ${this.capitalize(item.shape)} ${isDiamond ? 'Diamond' : this.capitalize(item.gemstoneType || '')}</h3>
              <p class="gf-card-specs">
                ${isDiamond
                  ? `${item.color} | ${item.clarity} | ${item.cut} | ${item.polish} | ${item.symmetry}`
                  : `${item.color || ''} | ${this.getGemstoneClarity(item.clarity)} | ${this.capitalize(item.intensity || '')}`
                }
              </p>
              <p class="gf-card-price">${item.currency}${item.price.toLocaleString()}</p>
              <p class="gf-card-cert">${item.certification} Only (incl. VAT)</p>
            </div>
            <div class="gf-card-footer">
              <button class="gf-btn-primary gf-view-item-btn" data-id="${item.id}">View Details</button>
              <button class="gf-btn-secondary gf-add-to-cart-btn" data-id="${item.id}">Add</button>
            </div>
          </div>
        `).join('')}
      </div>
    `;
  }

  renderPagination() {
    const items = this.getFilteredResults();
    const totalPages = Math.ceil(items.length / this.options.itemsPerPage);

    if (totalPages <= 1) return '';

    const pages = [];
    const currentPage = this.state.currentPage;

    // Always show first page
    pages.push(1);

    // Show pages around current
    for (let i = Math.max(2, currentPage - 1); i <= Math.min(totalPages - 1, currentPage + 1); i++) {
      if (!pages.includes(i)) pages.push(i);
    }

    // Always show last page
    if (totalPages > 1) pages.push(totalPages);

    return `
      <div class="gf-pagination">
        <button class="gf-page-btn" data-page="prev" ${currentPage === 1 ? 'disabled' : ''}>‹</button>
        ${pages.map((page, i) => {
          const prev = pages[i - 1];
          const showEllipsis = prev && page - prev > 1;
          return `
            ${showEllipsis ? '<span class="gf-page-info">...</span>' : ''}
            <button class="gf-page-btn ${currentPage === page ? 'active' : ''}" data-page="${page}">${page}</button>
          `;
        }).join('')}
        <button class="gf-page-btn" data-page="next" ${currentPage === totalPages ? 'disabled' : ''}>›</button>
      </div>
    `;
  }

  renderComparePanel() {
    const hasItems = this.state.compareItems.length > 0;

    return `
      <div class="gf-compare-panel ${hasItems ? 'visible' : ''}">
        <div class="gf-compare-header">
          <h3>Compare Items (${this.state.compareItems.length}/4)</h3>
          <button class="gf-compare-btn" ${this.state.compareItems.length < 2 ? 'disabled' : ''}>
            Compare Now
          </button>
        </div>
        <div class="gf-compare-items">
          ${this.state.compareItems.map(item => `
            <div class="gf-compare-item" data-id="${item.id}">
              <button class="gf-compare-remove" data-id="${item.id}">×</button>
              <div class="gf-compare-img">
                ${item.image
                  ? `<img src="${item.image}" alt="${item.shape}">`
                  : `<span>💎</span>`
                }
              </div>
              <div class="gf-compare-info">
                ${item.carat}ct ${this.capitalize(item.shape)}
              </div>
            </div>
          `).join('')}
        </div>
      </div>
    `;
  }

  getFilteredResults() {
    if (this.state.activeTab === 'diamonds') {
      return filterDiamonds(this.diamonds, this.state.diamondFilters);
    } else {
      return filterGemstones(this.gemstones, this.state.gemstoneFilters);
    }
  }

  getGemstoneClarity(clarityId) {
    const clarity = GEMSTONE_CLARITY.find(c => c.id === clarityId);
    return clarity ? clarity.abbr : clarityId;
  }

  capitalize(str) {
    if (!str) return '';
    return str.charAt(0).toUpperCase() + str.slice(1);
  }

  bindEvents() {
    // Type toggle (diamonds/gemstones)
    this.container.addEventListener('click', (e) => {
      const toggleBtn = e.target.closest('[data-toggle="type"] .gf-toggle-btn');
      if (toggleBtn) {
        this.state.activeTab = toggleBtn.dataset.value;
        this.state.currentPage = 1;
        this.render();
        this.bindEvents();
      }
    });

    // Gemstone type toggle (natural/lab)
    this.container.addEventListener('click', (e) => {
      const toggleBtn = e.target.closest('[data-toggle="gemstone-type"] .gf-toggle-btn');
      if (toggleBtn) {
        this.state.gemstoneFilters.type = toggleBtn.dataset.value;
        this.state.currentPage = 1;
        this.applyFilters();
      }
    });

    // Shape filter
    this.container.addEventListener('click', (e) => {
      const shapeBtn = e.target.closest('.gf-shapes .gf-shape-btn');
      if (shapeBtn) {
        const shape = shapeBtn.dataset.value;
        const filters = this.state.activeTab === 'diamonds'
          ? this.state.diamondFilters
          : this.state.gemstoneFilters;

        const index = filters.shapes.indexOf(shape);
        if (index === -1) {
          filters.shapes.push(shape);
        } else {
          filters.shapes.splice(index, 1);
        }
        this.state.currentPage = 1;
        this.applyFilters();
      }
    });

    // Multi-select filters
    this.container.addEventListener('click', (e) => {
      const selectBtn = e.target.closest('.gf-multi-select .gf-select-btn, .gf-color-grades .gf-color-btn');
      if (selectBtn) {
        const filterType = selectBtn.closest('[data-filter]').dataset.filter;
        const value = selectBtn.dataset.value;
        const filters = this.state.activeTab === 'diamonds'
          ? this.state.diamondFilters
          : this.state.gemstoneFilters;

        const index = filters[filterType].indexOf(value);
        if (index === -1) {
          filters[filterType].push(value);
        } else {
          filters[filterType].splice(index, 1);
        }
        this.state.currentPage = 1;
        this.applyFilters();
      }
    });

    // Intensity filter for gemstones
    this.container.addEventListener('click', (e) => {
      const intensityBtn = e.target.closest('.gf-intensity-btn');
      if (intensityBtn) {
        const value = intensityBtn.dataset.value;
        const filters = this.state.gemstoneFilters;

        const index = filters.intensity.indexOf(value);
        if (index === -1) {
          filters.intensity.push(value);
        } else {
          filters.intensity.splice(index, 1);
        }
        this.state.currentPage = 1;
        this.applyFilters();
      }
    });

    // Gemstone type filter
    this.container.addEventListener('click', (e) => {
      const gemBtn = e.target.closest('.gf-gemstone-btn');
      if (gemBtn) {
        const value = gemBtn.dataset.value;
        const filters = this.state.gemstoneFilters;

        const index = filters.gemstoneTypes.indexOf(value);
        if (index === -1) {
          filters.gemstoneTypes.push(value);
        } else {
          filters.gemstoneTypes.splice(index, 1);
        }
        this.state.currentPage = 1;
        this.applyFilters();
      }
    });

    // Checkbox filters (certification)
    this.container.addEventListener('change', (e) => {
      if (e.target.matches('.gf-checkbox-group input[type="checkbox"]')) {
        const filterType = e.target.closest('[data-filter]').dataset.filter;
        const value = e.target.value;
        const filters = this.state.diamondFilters;

        if (e.target.checked) {
          filters[filterType].push(value);
        } else {
          const index = filters[filterType].indexOf(value);
          if (index !== -1) filters[filterType].splice(index, 1);
        }
        this.state.currentPage = 1;
        this.applyFilters();
      }
    });

    // Range inputs
    this.container.addEventListener('change', (e) => {
      if (e.target.matches('#caratMin, #caratMax, #priceMin, #priceMax, #lwRatioMin, #lwRatioMax')) {
        const filters = this.state.diamondFilters;
        filters.caratMin = parseFloat(document.getElementById('caratMin')?.value) || 0.25;
        filters.caratMax = parseFloat(document.getElementById('caratMax')?.value) || 10;
        filters.priceMin = parseFloat(document.getElementById('priceMin')?.value) || 0;
        filters.priceMax = parseFloat(document.getElementById('priceMax')?.value) || 500000;
        filters.lwRatioMin = parseFloat(document.getElementById('lwRatioMin')?.value) || 1.0;
        filters.lwRatioMax = parseFloat(document.getElementById('lwRatioMax')?.value) || 2.5;
        this.state.currentPage = 1;
        this.applyFilters();
      }

      if (e.target.matches('#gemCaratMin, #gemCaratMax, #gemPriceMin, #gemPriceMax')) {
        const filters = this.state.gemstoneFilters;
        filters.caratMin = parseFloat(document.getElementById('gemCaratMin')?.value) || 0.1;
        filters.caratMax = parseFloat(document.getElementById('gemCaratMax')?.value) || 50;
        filters.priceMin = parseFloat(document.getElementById('gemPriceMin')?.value) || 0;
        filters.priceMax = parseFloat(document.getElementById('gemPriceMax')?.value) || 100000;
        this.state.currentPage = 1;
        this.applyFilters();
      }
    });

    // Report number search
    this.container.addEventListener('click', (e) => {
      if (e.target.matches('.gf-search-btn')) {
        const input = document.getElementById('reportNumber');
        if (input) {
          this.state.gemstoneFilters.reportNumber = input.value;
          this.state.currentPage = 1;
          this.applyFilters();
        }
      }
    });

    // Enter key for report search
    this.container.addEventListener('keypress', (e) => {
      if (e.target.matches('#reportNumber') && e.key === 'Enter') {
        this.state.gemstoneFilters.reportNumber = e.target.value;
        this.state.currentPage = 1;
        this.applyFilters();
      }
    });

    // Clear filter tag
    this.container.addEventListener('click', (e) => {
      const removeBtn = e.target.closest('.gf-tag-remove');
      if (removeBtn) {
        const key = removeBtn.dataset.key;
        const filters = this.state.activeTab === 'diamonds'
          ? this.state.diamondFilters
          : this.state.gemstoneFilters;

        if (Array.isArray(filters[key])) {
          filters[key] = [];
        } else {
          filters[key] = '';
        }
        this.state.currentPage = 1;
        this.applyFilters();
      }
    });

    // Clear all filters
    this.container.addEventListener('click', (e) => {
      if (e.target.closest('.gf-clear-all')) {
        if (this.state.activeTab === 'diamonds') {
          this.state.diamondFilters = { ...DEFAULT_DIAMOND_FILTERS };
        } else {
          this.state.gemstoneFilters = { ...DEFAULT_GEMSTONE_FILTERS };
        }
        this.state.currentPage = 1;
        this.applyFilters();
      }
    });

    // Results tabs
    this.container.addEventListener('click', (e) => {
      const tab = e.target.closest('.gf-tab');
      if (tab) {
        this.state.activeResultsTab = tab.dataset.tab;
        this.state.currentPage = 1;
        this.applyFilters();
      }
    });

    // View toggle
    this.container.addEventListener('click', (e) => {
      const viewBtn = e.target.closest('.gf-view-btn');
      if (viewBtn) {
        this.state.viewMode = viewBtn.dataset.view;
        this.applyFilters();
      }
    });

    // Sort
    this.container.addEventListener('click', (e) => {
      const sortHeader = e.target.closest('.sortable');
      if (sortHeader) {
        const sortBy = sortHeader.dataset.sort;
        if (this.state.sortBy === sortBy) {
          this.state.sortOrder = this.state.sortOrder === 'asc' ? 'desc' : 'asc';
        } else {
          this.state.sortBy = sortBy;
          this.state.sortOrder = 'asc';
        }
        this.applyFilters();
      }
    });

    // Pagination
    this.container.addEventListener('click', (e) => {
      const pageBtn = e.target.closest('.gf-page-btn');
      if (pageBtn && !pageBtn.disabled) {
        const page = pageBtn.dataset.page;
        const totalPages = Math.ceil(this.getFilteredResults().length / this.options.itemsPerPage);

        if (page === 'prev') {
          this.state.currentPage = Math.max(1, this.state.currentPage - 1);
        } else if (page === 'next') {
          this.state.currentPage = Math.min(totalPages, this.state.currentPage + 1);
        } else {
          this.state.currentPage = parseInt(page);
        }
        this.applyFilters();
      }
    });

    // Compare checkbox
    this.container.addEventListener('change', (e) => {
      if (e.target.matches('.gf-compare-checkbox')) {
        const id = e.target.dataset.id;
        const items = this.state.activeTab === 'diamonds' ? this.diamonds : this.gemstones;
        const item = items.find(i => i.id === id);

        if (e.target.checked && item) {
          if (this.state.compareItems.length < 4) {
            this.state.compareItems.push(item);
          } else {
            e.target.checked = false;
            alert('You can compare up to 4 items');
          }
        } else {
          this.state.compareItems = this.state.compareItems.filter(i => i.id !== id);
        }
        this.updateComparePanel();
      }
    });

    // Remove from compare
    this.container.addEventListener('click', (e) => {
      const removeBtn = e.target.closest('.gf-compare-remove');
      if (removeBtn) {
        const id = removeBtn.dataset.id;
        this.state.compareItems = this.state.compareItems.filter(i => i.id !== id);
        this.applyFilters();
      }
    });

    // View item
    this.container.addEventListener('click', (e) => {
      const viewBtn = e.target.closest('.gf-view-item-btn');
      if (viewBtn) {
        const id = viewBtn.dataset.id;
        this.viewItem(id);
      }
    });

    // Add to cart
    this.container.addEventListener('click', (e) => {
      const addBtn = e.target.closest('.gf-add-to-cart-btn');
      if (addBtn) {
        const id = addBtn.dataset.id;
        this.addToCart(id);
      }
    });
  }

  applyFilters() {
    this.render();
    this.bindEvents();
  }

  updateComparePanel() {
    const panel = this.container.querySelector('.gf-compare-panel');
    if (panel) {
      panel.outerHTML = this.renderComparePanel();
    }
  }

  viewItem(id) {
    const items = this.state.activeTab === 'diamonds' ? this.diamonds : this.gemstones;
    const item = items.find(i => i.id === id);

    if (item) {
      // Add to recently viewed
      if (!this.state.recentlyViewed.find(r => r.id === id)) {
        this.state.recentlyViewed.unshift(item);
        if (this.state.recentlyViewed.length > 10) {
          this.state.recentlyViewed.pop();
        }
      }

      // Callback or default behavior
      if (this.options.onItemClick) {
        this.options.onItemClick(item);
      } else {
        console.log('View item:', item);
        // In Shopify, this would navigate to the product page
        // window.location.href = `/products/${item.handle}`;
      }
    }
  }

  addToCart(id) {
    const items = this.state.activeTab === 'diamonds' ? this.diamonds : this.gemstones;
    const item = items.find(i => i.id === id);

    if (item) {
      if (this.options.onAddToCart) {
        this.options.onAddToCart(item);
      } else {
        console.log('Add to cart:', item);
        // In Shopify, this would add to cart
        // fetch('/cart/add.js', { method: 'POST', body: ... });
      }
    }
  }

  // Public API methods
  setDiamonds(diamonds) {
    this.diamonds = diamonds;
    this.applyFilters();
  }

  setGemstones(gemstones) {
    this.gemstones = gemstones;
    this.applyFilters();
  }

  getSelectedFilters() {
    return {
      diamonds: this.state.diamondFilters,
      gemstones: this.state.gemstoneFilters
    };
  }

  getCompareItems() {
    return this.state.compareItems;
  }

  resetFilters() {
    this.state.diamondFilters = { ...DEFAULT_DIAMOND_FILTERS };
    this.state.gemstoneFilters = { ...DEFAULT_GEMSTONE_FILTERS };
    this.state.currentPage = 1;
    this.applyFilters();
  }
}

// Auto-initialize if container exists
document.addEventListener('DOMContentLoaded', () => {
  const container = document.getElementById('gems-filter-app');
  if (container) {
    window.gemsFilter = new GemsFilter(container);
  }
});

// Export for module usage and global access
export { GemsFilter };
window.GemsFilter = GemsFilter;
