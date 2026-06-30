const mongoose = require('mongoose');

/**
 * customOption sub-schema
 *
 * Defines a single configurable spec a buyer can choose when ordering
 * (e.g. "Wood type" with choices ["Sheesham", "Teak", "Mango"]).
 * This is what powers the custom order configurator on the frontend.
 */
const customOptionSchema = new mongoose.Schema(
  {
    label: {
      type: String,
      required: true,
      trim: true,
    }, // e.g. "Wood type", "Canvas size", "Spice level"

    type: {
      type: String,
      enum: ['select', 'text', 'number'],
      default: 'select',
    },

    // Used when type === 'select'. e.g. ["Sheesham", "Teak", "Mango"]
    choices: {
      type: [String],
      default: undefined,
    },

    // Optional price adjustment per choice, e.g. { "Teak": 500 }
    // Kept simple as a flat additive amount in the smallest currency unit (paise)
    priceModifier: {
      type: Map,
      of: Number,
      default: undefined,
    },

    required: {
      type: Boolean,
      default: true,
    },
  },
  { _id: false },
);

const productSchema = new mongoose.Schema(
  {
    vendorId: {
      type:     mongoose.Schema.Types.ObjectId,
      ref:      'User',
      required: true,
      index:    true,
    },

    title: {
      type:      String,
      required:  [true, 'Product title is required'],
      trim:      true,
      maxlength: [120, 'Title cannot exceed 120 characters'],
    },

    description: {
      type:      String,
      required:  [true, 'Product description is required'],
      maxlength: [2000, 'Description cannot exceed 2000 characters'],
    },

    category: {
      type:     String,
      required: true,
      enum: [
        'paintings',
        'textiles',
        'food',
        'craft',      // pottery, general craft
        'wood',
        'cookies',
        'other',
      ],
      index: true,
    },

    // Stored in the smallest currency unit (paise) to avoid floating-point
    // rounding errors in financial calculations. ₹320.00 → 32000
    price: {
      type:     Number,
      required: true,
      min:      [0, 'Price cannot be negative'],
    },

    stockQuantity: {
      type:     Number,
      required: true,
      min:      [0, 'Stock cannot be negative'],
      default:  0,
    },

    imageUrls: {
      type: [String],
      validate: {
        validator: (arr) => arr.length > 0 && arr.length <= 6,
        message: 'A product must have between 1 and 6 images',
      },
    },

    // Drives the custom order configurator on the product detail page.
    // Empty array = no custom options, straightforward "Add to cart" product.
    customOptions: {
      type:    [customOptionSchema],
      default: [],
    },

    isCustomizable: {
      type:    Boolean,
      default: false,
    },

    // Soft-delete flag. Never hard-delete a product — orders may reference it.
    isActive: {
      type:    Boolean,
      default: true,
      index:   true,
    },

    // Set to false by admin if a listing violates guidelines.
    // Different from isActive: vendor can reactivate isActive themselves,
    // but only an admin can lift a moderation flag.
    isApproved: {
      type:    Boolean,
      default: true,
    },

    // Denormalised rating fields, updated by the review system (Phase 6).
    // Storing here avoids an aggregation query on every product list fetch.
    ratingAverage: {
      type:    Number,
      default: 0,
      min: 0,
      max: 5,
    },
    ratingCount: {
      type:    Number,
      default: 0,
    },

    totalSold: {
      type:    Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  },
);

// ── Indexes ───────────────────────────────────────────────────────────────────

// Compound index: most product list queries filter by category + isActive
// together, so a compound index serves them far better than two separate ones.
productSchema.index({ category: 1, isActive: 1 });

// Text index for search (title + description).
// Powers the navbar search bar via $text queries.
productSchema.index({ title: 'text', description: 'text' });

// ── Virtuals ──────────────────────────────────────────────────────────────────

// Convenience virtual: price in rupees (for display only, never for storage/calc)
productSchema.virtual('priceInRupees').get(function () {
  return this.price / 100;
});

productSchema.set('toJSON', { virtuals: true });

const Product = mongoose.model('Product', productSchema);
module.exports = Product;