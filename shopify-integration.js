/**
 * GemsFilter - Shopify Integration Helper
 *
 * This file provides utilities for integrating GemsFilter with Shopify stores.
 * Include this after the main gemsfilter.iife.js file.
 */

(function() {
  'use strict';

  /**
   * Fetch products from a Shopify collection and transform them for GemsFilter
   */
  async function fetchShopifyDiamonds(collectionHandle, options = {}) {
    const limit = options.limit || 250;
    let allProducts = [];
    let page = 1;
    let hasMore = true;

    while (hasMore) {
      try {
        const response = await fetch(
          `/collections/${collectionHandle}/products.json?limit=${limit}&page=${page}`
        );
        const data = await response.json();

        if (data.products && data.products.length > 0) {
          allProducts = allProducts.concat(data.products);
          page++;
          hasMore = data.products.length === limit;
        } else {
          hasMore = false;
        }
      } catch (error) {
        console.error('Error fetching products:', error);
        hasMore = false;
      }
    }

    return allProducts.map(transformShopifyDiamond);
  }

  /**
   * Transform a Shopify product to GemsFilter diamond format
   */
  function transformShopifyDiamond(product) {
    const metafields = product.metafields || {};
    const variant = product.variants[0];

    return {
      id: String(product.id),
      handle: product.handle,
      variantId: variant.id,
      shape: getMetafieldValue(metafields, 'shape', 'round'),
      carat: parseFloat(getMetafieldValue(metafields, 'carat', '1.0')),
      color: getMetafieldValue(metafields, 'color', 'G'),
      clarity: getMetafieldValue(metafields, 'clarity', 'VS1'),
      cut: getMetafieldValue(metafields, 'cut', 'Excellent'),
      polish: getMetafieldValue(metafields, 'polish', 'Excellent'),
      symmetry: getMetafieldValue(metafields, 'symmetry', 'Excellent'),
      fluorescence: getMetafieldValue(metafields, 'fluorescence', 'None'),
      certification: getMetafieldValue(metafields, 'certification', 'GIA'),
      price: parseFloat(variant.price),
      currency: window.Shopify?.currency?.active || '€',
      lwRatio: parseFloat(getMetafieldValue(metafields, 'lw_ratio', '1.0')),
      image: product.images[0]?.src || null,
      reportNumber: getMetafieldValue(metafields, 'report_number', '')
    };
  }

  /**
   * Fetch products from a Shopify collection and transform them for GemsFilter (gemstones)
   */
  async function fetchShopifyGemstones(collectionHandle, options = {}) {
    const limit = options.limit || 250;
    let allProducts = [];
    let page = 1;
    let hasMore = true;

    while (hasMore) {
      try {
        const response = await fetch(
          `/collections/${collectionHandle}/products.json?limit=${limit}&page=${page}`
        );
        const data = await response.json();

        if (data.products && data.products.length > 0) {
          allProducts = allProducts.concat(data.products);
          page++;
          hasMore = data.products.length === limit;
        } else {
          hasMore = false;
        }
      } catch (error) {
        console.error('Error fetching products:', error);
        hasMore = false;
      }
    }

    return allProducts.map(transformShopifyGemstone);
  }

  /**
   * Transform a Shopify product to GemsFilter gemstone format
   */
  function transformShopifyGemstone(product) {
    const metafields = product.metafields || {};
    const variant = product.variants[0];

    return {
      id: String(product.id),
      handle: product.handle,
      variantId: variant.id,
      type: getMetafieldValue(metafields, 'type', 'natural'),
      gemstoneType: getMetafieldValue(metafields, 'gemstone_type', 'sapphire'),
      shape: getMetafieldValue(metafields, 'shape', 'oval'),
      carat: parseFloat(getMetafieldValue(metafields, 'carat', '1.0')),
      color: getMetafieldValue(metafields, 'color', ''),
      intensity: getMetafieldValue(metafields, 'intensity', 'vivid'),
      clarity: getMetafieldValue(metafields, 'clarity', 'ec1'),
      certification: getMetafieldValue(metafields, 'certification', 'ICL'),
      price: parseFloat(variant.price),
      currency: window.Shopify?.currency?.active || '€',
      image: product.images[0]?.src || null,
      reportNumber: getMetafieldValue(metafields, 'report_number', '')
    };
  }

  /**
   * Helper to get metafield value with fallback
   */
  function getMetafieldValue(metafields, key, defaultValue) {
    // Try different metafield namespaces
    const namespaces = ['custom', 'diamond', 'gemstone', 'product'];

    for (const namespace of namespaces) {
      if (metafields[namespace] && metafields[namespace][key]) {
        return metafields[namespace][key];
      }
    }

    // Also check flat structure
    if (metafields[key]) {
      return metafields[key];
    }

    return defaultValue;
  }

  /**
   * Add item to Shopify cart
   */
  async function addToShopifyCart(variantId, quantity = 1) {
    try {
      const response = await fetch('/cart/add.js', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          id: variantId,
          quantity: quantity
        })
      });

      if (!response.ok) {
        throw new Error('Failed to add to cart');
      }

      const data = await response.json();

      // Trigger cart update event
      document.dispatchEvent(new CustomEvent('cart:updated', { detail: data }));

      return data;
    } catch (error) {
      console.error('Error adding to cart:', error);
      throw error;
    }
  }

  /**
   * Navigate to product page
   */
  function goToProduct(handle) {
    window.location.href = `/products/${handle}`;
  }

  /**
   * Initialize GemsFilter with Shopify data
   */
  async function initializeWithShopify(containerSelector, options = {}) {
    const {
      diamondCollection = 'diamonds',
      gemstoneCollection = 'gemstones',
      ...filterOptions
    } = options;

    // Create the filter instance
    const filter = new GemsFilter(containerSelector, {
      ...filterOptions,
      onItemClick: function(item) {
        goToProduct(item.handle);
      },
      onAddToCart: async function(item) {
        try {
          await addToShopifyCart(item.variantId);
          // Show success notification (customize as needed)
          if (typeof window.showNotification === 'function') {
            window.showNotification('Added to cart!', 'success');
          } else {
            alert('Added to cart!');
          }
        } catch (error) {
          if (typeof window.showNotification === 'function') {
            window.showNotification('Failed to add to cart', 'error');
          } else {
            alert('Failed to add to cart. Please try again.');
          }
        }
      }
    });

    // Fetch and set data
    try {
      const [diamonds, gemstones] = await Promise.all([
        fetchShopifyDiamonds(diamondCollection),
        fetchShopifyGemstones(gemstoneCollection)
      ]);

      filter.setDiamonds(diamonds);
      filter.setGemstones(gemstones);
    } catch (error) {
      console.error('Error loading products:', error);
    }

    return filter;
  }

  // Expose utilities globally
  window.GemsFilterShopify = {
    fetchDiamonds: fetchShopifyDiamonds,
    fetchGemstones: fetchShopifyGemstones,
    transformDiamond: transformShopifyDiamond,
    transformGemstone: transformShopifyGemstone,
    addToCart: addToShopifyCart,
    goToProduct: goToProduct,
    initialize: initializeWithShopify
  };

})();
