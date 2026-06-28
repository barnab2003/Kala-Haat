const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const vendorProfileSchema = new mongoose.Schema(
  {
    storeName:   { type: String, trim: true },
    bio:         { type: String, maxlength: 500 },
    bannerUrl:   { type: String },       // Cloudinary URL — added in Phase 3
    location:    { type: String },       // e.g. "Jaipur, Rajasthan"
    // Added in Phase 4 when vendor completes Stripe Connect onboarding
    stripeAccountId:       { type: String },
    stripeOnboardingDone:  { type: Boolean, default: false },
  },
  { _id: false }, // embedded sub-doc, no separate _id needed
);

const userSchema = new mongoose.Schema(
  {
    name: {
      type:     String,
      required: [true, 'Name is required'],
      trim:     true,
      maxlength: [60, 'Name cannot exceed 60 characters'],
    },

    email: {
      type:      String,
      required:  [true, 'Email is required'],
      unique:    true,
      lowercase: true,
      trim:      true,
      match: [
        /^\S+@\S+\.\S+$/,
        'Please provide a valid email address',
      ],
    },

    passwordHash: {
      type:     String,
      required: true,
      // Never send the password hash to the client
      select:   false,
    },

    role: {
      type:    String,
      enum:    ['buyer', 'vendor', 'admin'],
      default: 'buyer',
    },

    // Only populated when role === 'vendor'
    vendorProfile: {
      type:    vendorProfileSchema,
      default: null,
    },

    isActive: {
      type:    Boolean,
      default: true,  // Admin can suspend accounts by setting this to false
    },
  },
  {
    timestamps: true, // createdAt, updatedAt added automatically
  },
);

// ── Indexes ───────────────────────────────────────────────────────────────────
// email is already indexed via `unique: true`.
// Index role so admin queries like "find all vendors" are fast.
userSchema.index({ role: 1 });

// ── Pre-save hook: hash password ──────────────────────────────────────────────
// Only runs when passwordHash is new or modified, so updating other fields
// (e.g. storeName) doesn't re-hash unnecessarily.
userSchema.pre('save', async function (next) {
  if (!this.isModified('passwordHash')) return next();
  // Cost factor 12 is the current industry standard balance of
  // security vs. performance (~300ms on a modern server)
  this.passwordHash = await bcrypt.hash(this.passwordHash, 12);
  next();
});

// ── Instance method: compare password ────────────────────────────────────────
// Used in auth.service.js during login.
// We define it on the model so the comparison logic lives in one place.
userSchema.methods.comparePassword = async function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.passwordHash);
};

// ── Instance method: safe public profile ─────────────────────────────────────
// Returns a plain object with sensitive fields stripped out.
// Use this whenever you send user data in a response.
userSchema.methods.toPublicProfile = function () {
  return {
    _id:           this._id,
    name:          this.name,
    email:         this.email,
    role:          this.role,
    vendorProfile: this.vendorProfile,
    createdAt:     this.createdAt,
  };
};

const User = mongoose.model('User', userSchema);
module.exports = User;