"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WEBSITE_ORDER_MARKER = void 0;
exports.isWebsiteOrder = isWebsiteOrder;
exports.hasAwaitingStockNotes = hasAwaitingStockNotes;
exports.parseAwaitingStockNotes = parseAwaitingStockNotes;
exports.WEBSITE_ORDER_MARKER = 'Kedar Foundation website';
function isWebsiteOrder(notes) {
    return Boolean(notes?.includes(exports.WEBSITE_ORDER_MARKER));
}
function hasAwaitingStockNotes(notes) {
    return Boolean(notes?.includes('AWAITING_STOCK'));
}
function parseAwaitingStockNotes(notes) {
    if (!hasAwaitingStockNotes(notes))
        return [];
    const section = notes.split('AWAITING_STOCK:')[1] || '';
    const lines = section.trim().split('\n').filter(Boolean);
    const pattern = /^(.+): ordered ([\d.]+) (\S+), in stock ([\d.]+) \S+, need production for ([\d.]+) \S+/;
    const result = [];
    for (const line of lines) {
        const match = line.trim().match(pattern);
        if (!match)
            continue;
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
//# sourceMappingURL=store.util.js.map