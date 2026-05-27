/**
 * Formats a number or string into Indian Rupee (INR) format
 * Uses Intl.NumberFormat with 'en-IN' locale for proper Indian number formatting
 * 
 * Examples:
 *   formatCurrency(1000)        => "₹1,000"
 *   formatCurrency(25000)       => "₹25,000"
 *   formatCurrency(150000)      => "₹1,50,000"
 *   formatCurrency('5000')       => "₹5,000"
 *   formatCurrency(0)           => "₹0"
 *   formatCurrency(null)        => ""
 *   formatCurrency('')          => ""
 */
export const formatCurrency = (amount) => {
  if (amount === null || amount === undefined || amount === '') return '';
  
  // If it's already a string that contains ₹ or Rs., return as-is
  if (typeof amount === 'string' && (amount.includes('₹') || amount.includes('Rs.') || amount.includes('Rs '))) {
    return amount;
  }
  
  // Remove any existing $, ₹, Rs., or comma characters and parse as number
  const cleanValue = String(amount).replace(/[$₹,]/g, '').replace(/Rs\.?\s*/gi, '').trim();
  const numericValue = parseFloat(cleanValue);
  
  if (isNaN(numericValue)) return amount;
  
  try {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: numericValue % 1 === 0 ? 0 : 2,
    }).format(numericValue);
  } catch (e) {
    // Fallback formatting if Intl fails
    const formatted = numericValue.toLocaleString('en-IN', {
      maximumFractionDigits: numericValue % 1 === 0 ? 0 : 2,
    });
    return `₹${formatted}`;
  }
};

/**
 * Strips currency symbol and returns raw numeric string
 * Useful for form input fields where we want plain numbers
 */
export const stripCurrency = (amount) => {
  if (!amount) return '';
  return String(amount).replace(/[$₹,]/g, '').replace(/Rs\.?\s*/gi, '').trim();
};

export default formatCurrency;