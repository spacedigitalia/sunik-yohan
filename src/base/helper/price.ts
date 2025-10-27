/**
 * Formats a price string to Indonesian Rupiah (IDR) format
 * @param price - The price string to format
 * @returns Formatted price string with thousand separators
 * @example
 * formatPrice("20000") // returns "20.000"
 * formatPrice("1000000") // returns "1.000.000"
 */
export const formatPrice = (price: string): string => {
    // Remove any non-digit characters
    const numericPrice = price.replace(/\D/g, '');
    // Convert to number and format with dots as thousand separators
    return new Intl.NumberFormat('id-ID').format(Number(numericPrice));
};

/**
 * Formats a price string to Indonesian Rupiah (IDR) format with currency symbol
 * @param price - The price string to format
 * @returns Formatted price string with currency symbol and thousand separators
 * @example
 * formatPriceWithSymbol("20000") // returns "Rp 20.000"
 * formatPriceWithSymbol("1000000") // returns "Rp 1.000.000"
 */
export const formatPriceWithSymbol = (price: string): string => {
    return `Rp ${formatPrice(price)}`;
}; 