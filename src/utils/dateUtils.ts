export function formatDate(ddmmyyyy: string): string {
  const [day, month, year] = ddmmyyyy.split('-').map(Number);
  const date = new Date(year, month - 1, day);
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}
