"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.normalizePhone = normalizePhone;
function normalizePhone(phone) {
    const digits = String(phone ?? '').replace(/\D/g, '');
    if (digits.length === 12 && digits.startsWith('91'))
        return digits.slice(2);
    if (digits.length === 11 && digits.startsWith('0'))
        return digits.slice(1);
    return digits.slice(-10);
}
//# sourceMappingURL=phone.util.js.map