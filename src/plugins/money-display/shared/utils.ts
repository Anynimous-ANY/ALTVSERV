/**
 * Format a number as currency (EUR)
 * @param amount - The amount to format
 * @returns Formatted currency string
 */
export function formatMoney(amount: number): string {
    return new Intl.NumberFormat('fr-FR', {
        style: 'currency',
        currency: 'EUR',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
    }).format(amount);
}
