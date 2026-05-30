/**
 * Utility functions for the backend
 */

/**
 * Normalize text by trimming and converting to proper case
 * @param {string} text - The text to normalize
 * @returns {string} - Normalized text
 */
function normalizeText(text) {
  if (!text) return "";
  return String(text).trim();
}

/**
 * Normalize coupon code by trimming and converting to uppercase
 * @param {string} code - The code to normalize
 * @returns {string} - Normalized code
 */
function normalizeCode(code) {
  if (!code) return "";
  return String(code).trim().toUpperCase();
}

/**
 * Compute discount amount based on coupon type
 * @param {Object} options - Options object
 * @param {Object} options.coupon - Coupon document
 * @param {number} options.subTotal - Subtotal amount
 * @returns {number} - Discount amount
 */
function computeDiscount({ coupon, subTotal }) {
  if (!coupon || !coupon.value) return 0;

  let discountAmount = 0;

  if (coupon.type === "fixed") {
    discountAmount = Math.min(coupon.value, subTotal);
  } else if (coupon.type === "percentage") {
    discountAmount = (subTotal * coupon.value) / 100;

    // Apply max discount limit if set
    if (coupon.maxDiscount && discountAmount > coupon.maxDiscount) {
      discountAmount = coupon.maxDiscount;
    }
  }

  return Math.max(0, discountAmount);
}

/**
 * Validate email format
 * @param {string} email - Email to validate
 * @returns {boolean} - True if valid
 */
function validateEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Validate phone number format (flexible)
 * @param {string} phone - Phone to validate
 * @returns {boolean} - True if valid
 */
function validatePhone(phone) {
  const phoneRegex = /^[\d\s\-\+\(\)]{7,}$/;
  return phoneRegex.test(phone);
}

module.exports = {
  normalizeText,
  normalizeCode,
  computeDiscount,
  validateEmail,
  validatePhone,
};
