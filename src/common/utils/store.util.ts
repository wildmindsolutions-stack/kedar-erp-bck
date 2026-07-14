export const WEBSITE_ORDER_MARKER = 'Kedar Foundation website';

export function isWebsiteOrder(notes?: string | null): boolean {
  return Boolean(notes?.includes(WEBSITE_ORDER_MARKER));
}

export function hasAwaitingStockNotes(notes?: string | null): boolean {
  return Boolean(notes?.includes('AWAITING_STOCK'));
}

export interface AwaitingStockLine {
  productName: string;
  ordered: number;
  unit: string;
  available: number;
  shortfall: number;
}

export function parseAwaitingStockNotes(notes?: string | null): AwaitingStockLine[] {
  if (!hasAwaitingStockNotes(notes)) return [];

  const section = notes!.split('AWAITING_STOCK:')[1] || '';
  const lines = section.trim().split('\n').filter(Boolean);
  const pattern = /^(.+): ordered ([\d.]+) (\S+), in stock ([\d.]+) \S+, need production for ([\d.]+) \S+/;
  const result: AwaitingStockLine[] = [];

  for (const line of lines) {
    const match = line.trim().match(pattern);
    if (!match) continue;
    result.push({
      productName: match[1],
      ordered: Number(match[2]),
      unit: match[3],
      available: Number(match[4]),
      shortfall: Number(match[5]),
    });
  }

  return result;
}
