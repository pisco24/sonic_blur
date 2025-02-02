import { global } from "../config/global";

export function formatNumber(num, decimals = 3) {
    if (num >= 1e12) {
        return (num / 1e12).toFixed(decimals) + 'T';
    } else if (num >= 1e9) {
        return (num / 1e9).toFixed(decimals) + 'B';
    } else if (num >= 1e6) {
        return (num / 1e6).toFixed(decimals) + 'M';
    } else if (num >= 1e3) {
        return (num / 1e3).toFixed(decimals) + 'K';
    } else if (num >= 1e-3) {
        return num.toFixed(decimals);
    } else if (num >= 1e-6) {
        return num.toFixed(6);
    } else if (num >= 1e-9) {
        return num.toFixed(9);
    } else if (num >= 1e-12) {
        return num.toFixed(12);
    } else if (num >= 1e-15) {
        return num.toFixed(15);
    } else if (num >= 1e-18) {
        return num.toFixed(18);
    } else {
        return '0'
    }
}

export function getDefaultGas() {
    return global.defaultGas
}

export function getMaxValue(tokenBalance, isNative) {
    if (isNative) {
        const defaultGas = getDefaultGas()
        return tokenBalance - defaultGas
    }

    return tokenBalance
}

export function delayMs(ms) {
    return new Promise(resolve => {
        setTimeout(resolve, ms)
    });
}