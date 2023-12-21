"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isSafari = exports.isMobileSafari = exports.getBrowser = void 0;
/**
 * Fetch browser name from UA string
 */
const getBrowser = () => {
    var _a, _b;
    const { userAgent } = window.navigator;
    const match = (_a = userAgent.match(/(opera|chrome|safari|firefox|msie|trident(?=\/))/i)) !== null && _a !== void 0 ? _a : [];
    let temp;
    let browserName = '';
    if (/trident/i.test(match[1])) {
        return 'IE';
    }
    if (match[1] && match[1].toLowerCase() === 'chrome') {
        temp = userAgent.match(/\b(OPR)/);
        if (temp !== null) {
            return 'Opera';
        }
        temp = userAgent.match(/\b(Edg)/);
        if (temp !== null) {
            return 'Edge';
        }
    }
    browserName = (_b = match[1]) !== null && _b !== void 0 ? _b : navigator.appName;
    return browserName ? browserName.toLowerCase() : 'other';
};
exports.getBrowser = getBrowser;
/**
 * Checks if requesting user agent is Safari browser on a mobile device
 */
const isMobileSafari = () => {
    const { userAgent } = window.navigator;
    return /iP(ad|od|hone)/i.test(userAgent) && /WebKit/i.test(userAgent) && !/(CriOS|FxiOS|OPiOS|mercury)/i.test(userAgent);
};
exports.isMobileSafari = isMobileSafari;
const isSafari = () => getBrowser() === 'safari' || isMobileSafari();
exports.isSafari = isSafari;
