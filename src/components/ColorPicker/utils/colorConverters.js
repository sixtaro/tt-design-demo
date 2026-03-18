/**
 * 颜色空间转换工具函数
 */

// HSV 到 RGB 转换函数
export function hsvToRgb(h, s, v) {
    let r, g, b;
    const i = Math.floor(h * 6);
    const f = h * 6 - i;
    const p = v * (1 - s);
    const q = v * (1 - f * s);
    const t = v * (1 - (1 - f) * s);

    switch (i % 6) {
        case 0: r = v; g = t; b = p; break;
        case 1: r = q; g = v; b = p; break;
        case 2: r = p; g = v; b = t; break;
        case 3: r = p; g = q; b = v; break;
        case 4: r = t; g = p; b = v; break;
        case 5: r = v; g = p; b = q; break;
        default: r = v; g = t; b = p;
    }

    return {
        r: Math.round(r * 255),
        g: Math.round(g * 255),
        b: Math.round(b * 255),
    };
}

// RGB 到 HEX 转换
export function rgbToHex(r, g, b) {
    return `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1).toUpperCase()}`;
}

// RGB 到 HSV 转换
export function rgbToHsv(r, g, b) {
    r /= 255; g /= 255; b /= 255;
    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    const v = max;
    const d = max - min;
    const s = max === 0 ? 0 : d / max;
    let h;
    if (max === min) {
        h = 0;
    } else {
        switch (max) {
            case r: h = (g - b) / d + (g < b ? 6 : 0); break;
            case g: h = (b - r) / d + 2; break;
            case b: h = (r - g) / d + 4; break;
            default: h = 0;
        }
        h /= 6;
    }
    return { h, s, v };
}

// HEX 到 RGBA 转换
export function hexToRgba(hex) {
    let r, g, b, a = 1;
    if (hex.length === 9) { // #RRGGBBAA
        r = parseInt(hex.slice(1, 3), 16);
        g = parseInt(hex.slice(3, 5), 16);
        b = parseInt(hex.slice(5, 7), 16);
        a = parseInt(hex.slice(7, 9), 16) / 255;
    } else { // #RRGGBB
        r = parseInt(hex.slice(1, 3), 16);
        g = parseInt(hex.slice(3, 5), 16);
        b = parseInt(hex.slice(5, 7), 16);
    }
    return { r, g, b, a };
}

// HSV 到 HSL 转换
export function hsvToHsl(h, s, v) {
    const l = v * (1 - s / 2);
    let newS;
    if (l === 0 || l === 1) {
        newS = 0;
    } else {
        newS = (v - l) / Math.min(l, 1 - l);
    }
    return { h, s: newS, l };
}

// HSL 到 HSV 转换
export function hslToHsv(h, s, l) {
    const v = l + s * Math.min(l, 1 - l);
    let newS;
    if (v === 0) {
        newS = 0;
    } else {
        newS = 2 * (1 - l / v);
    }
    return { h, s: newS, v };
}

// HSL 到 RGB 转换
export function hslToRgb(h, s, l) {
    let r, g, b;

    if (s === 0) {
        r = g = b = l; // 无饱和度，灰度
    } else {
        const hue2rgb = (p, q, t) => {
            if (t < 0) {
                t += 1
            }
            if (t > 1) {
                t -= 1
            }
            if (t < 1 / 6) {
                return p + (q - p) * 6 * t
            }
            if (t < 1 / 2) {
                return q
            }
            if (t < 2 / 3) {
                return p + (q - p) * (2 / 3 - t) * 6
            }
            return p;
        };

        const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
        const p = 2 * l - q;

        r = hue2rgb(p, q, h + 1 / 3);
        g = hue2rgb(p, q, h);
        b = hue2rgb(p, q, h - 1 / 3);
    }

    return {
        r: Math.round(r * 255),
        g: Math.round(g * 255),
        b: Math.round(b * 255)
    };
}

/**
 * 检查输入值是否是合法的纯色颜色值或渐变色颜色值
 * @param {string} color - 要检查的颜色值
 * @returns {string|boolean} - 如果是合法颜色值返回原始值，否则返回false
 */
export function isValidColor(color) {
    if (typeof color !== 'string') {
        return false;
    }

    // 去除前后空白字符
    const trimmedColor = color.trim();

    // 首先检查是否是渐变色
    if (isValidGradient(trimmedColor)) {
        return trimmedColor;
    }

    // 然后检查是否是纯色
    if (isValidSolidColor(trimmedColor)) {
        return trimmedColor;
    }

    // 都不是，返回false
    return false;
}

/**
 * 检查是否是合法的纯色颜色值
 * @param {string} color - 要检查的颜色值
 * @returns {boolean} - 是否是合法的纯色颜色值
 */
function isValidSolidColor(color) {
    // 检查HEX格式: #RRGGBB 或 #RRGGBBAA
    const hexRegex = /^#[0-9A-Fa-f]{6}$|^#[0-9A-Fa-f]{8}$/;
    if (hexRegex.test(color)) {
        return true;
    }

    // 检查RGB格式: rgb(r, g, b)
    const rgbRegex = /^rgb\((\d{1,3}),\s*(\d{1,3}),\s*(\d{1,3})\)$/;
    const rgbMatch = color.match(rgbRegex);
    if (rgbMatch) {
        // 检查RGB值是否在0-255范围内
        const r = parseInt(rgbMatch[1], 10);
        const g = parseInt(rgbMatch[2], 10);
        const b = parseInt(rgbMatch[3], 10);
        return r >= 0 && r <= 255 && g >= 0 && g <= 255 && b >= 0 && b <= 255;
    }

    // 检查RGBA格式: rgba(r, g, b, a)
    const rgbaRegex = /^rgba\((\d{1,3}),\s*(\d{1,3}),\s*(\d{1,3}),\s*([01](?:\.\d+)?)\)$/;
    const rgbaMatch = color.match(rgbaRegex);
    if (rgbaMatch) {
        // 检查RGB值是否在0-255范围内，alpha值是否在0-1范围内
        const r = parseInt(rgbaMatch[1], 10);
        const g = parseInt(rgbaMatch[2], 10);
        const b = parseInt(rgbaMatch[3], 10);
        const a = parseFloat(rgbaMatch[4]);
        return r >= 0 && r <= 255 && g >= 0 && g <= 255 && b >= 0 && b <= 255 && a >= 0 && a <= 1;
    }

    // 检查HSL格式: hsl(h, s%, l%)
    const hslRegex = /^hsl\((\d{1,3}),\s*(\d{1,3})%,\s*(\d{1,3})%\)$/;
    const hslMatch = color.match(hslRegex);
    if (hslMatch) {
        // 检查HSL值是否在有效范围内
        const h = parseInt(hslMatch[1], 10);
        const s = parseInt(hslMatch[2], 10);
        const l = parseInt(hslMatch[3], 10);
        return h >= 0 && h <= 360 && s >= 0 && s <= 100 && l >= 0 && l <= 100;
    }

    // 检查HSLA格式: hsla(h, s%, l%, a)
    const hslaRegex = /^hsla\((\d{1,3}),\s*(\d{1,3})%,\s*(\d{1,3})%,\s*([01]?(?:\.\d+)?)\)$/;
    const hslaMatch = color.match(hslaRegex);
    if (hslaMatch) {
        // 检查HSLA值是否在有效范围内
        const h = parseInt(hslaMatch[1], 10);
        const s = parseInt(hslaMatch[2], 10);
        const l = parseInt(hslaMatch[3], 10);
        const a = parseFloat(hslaMatch[4]);
        return h >= 0 && h <= 360 && s >= 0 && s <= 100 && l >= 0 && l <= 100 && a >= 0 && a <= 1;
    }

    // 检查HSBA格式: hsba(h, s%, b%, a)
    const hsbaRegex = /^hsba\((\d{1,3}),\s*(\d{1,3})%,\s*(\d{1,3})%,\s*([01]?(?:\.\d+)?)\)$/;
    const hsbaMatch = color.match(hsbaRegex);
    if (hsbaMatch) {
        // 检查HSBA值是否在有效范围内
        const h = parseInt(hsbaMatch[1], 10);
        const s = parseInt(hsbaMatch[2], 10);
        const b = parseInt(hsbaMatch[3], 10);
        const a = parseFloat(hsbaMatch[4]);
        return h >= 0 && h <= 360 && s >= 0 && s <= 100 && b >= 0 && b <= 100 && a >= 0 && a <= 1;
    }

    // 都不匹配
    return false;
}

/**
 * 检查是否是合法的渐变色颜色值
 * @param {string} color - 要检查的颜色值
 * @returns {boolean} - 是否是合法的渐变色颜色值
 */
function isValidGradient(color) {
    // 检查线性渐变格式 - 支持前后带引号和空白字符的情况，使用(.+)匹配括号内的所有内容（包括嵌套括号）
    const linearGradientRegex = /^\s*(?:["'“”‘’])?\s*linear-gradient\s*\((.+)\)\s*(?:["'“”‘’])?\s*$/i;
    const linearMatch = color.match(linearGradientRegex);
    if (linearMatch) {
        return isValidGradientStops(linearMatch[1]);
    }

    // 检查径向渐变格式 - 支持前后带引号和空白字符的情况，使用(.+)匹配括号内的所有内容（包括嵌套括号）
    const radialGradientRegex = /^\s*(?:["'“”‘’])?\s*radial-gradient\s*\((.+)\)\s*(?:["'“”‘’])?\s*$/i;
    const radialMatch = color.match(radialGradientRegex);
    if (radialMatch) {
        return isValidGradientStops(radialMatch[1]);
    }

    // 都不匹配
    return false;
}

/**
 * 检查渐变颜色停止点是否合法
 * @param {string} stopsStr - 渐变颜色停止点字符串
 * @returns {boolean} - 是否是合法的渐变颜色停止点
 */
function isValidGradientStops(stopsStr) {
    // 解析渐变颜色停止点字符串，支持嵌套括号
    // 步骤：
    // 1. 检查是否包含角度值
    // 2. 找到所有颜色停止点（考虑嵌套括号）
    // 3. 验证每个颜色停止点是否合法

    // 去掉前后空白
    let cleanStr = stopsStr.trim();

    // 检查第一个部分是否是角度值（例如0deg、90deg等）
    let startIndex = 0;
    // const angleRegex = /^(\d+deg|to\s+\w+)$/i;

    // 尝试匹配角度值
    let angleMatch;
    if ((angleMatch = cleanStr.match(/^((?:\d+deg|to\s+\w+))\s*,\s*/i))) {
        // 跳过角度值和逗号
        startIndex = angleMatch[0].length;
    }

    // 从角度值之后的位置开始处理颜色停止点
    const stopsPart = cleanStr.substring(startIndex);

    // 解析颜色停止点（考虑嵌套括号）
    const stops = [];
    let currentStop = '';
    let bracketCount = 0;

    for (let i = 0; i < stopsPart.length; i++) {
        const char = stopsPart[i];

        if (char === '(') {
            bracketCount++;
            currentStop += char;
        } else if (char === ')') {
            bracketCount--;
            currentStop += char;
        } else if (char === ',' && bracketCount === 0) {
            // 只有当括号匹配时，才将当前内容作为一个停止点
            if (currentStop.trim() !== '') {
                stops.push(currentStop.trim());
                currentStop = '';
            }
        } else {
            currentStop += char;
        }
    }

    // 添加最后一个停止点
    if (currentStop.trim() !== '') {
        stops.push(currentStop.trim());
    }

    // 确保至少有两个颜色停止点
    if (stops.length < 2) {
        return false;
    }

    // 检查每个颜色停止点是否包含合法的颜色值
    for (const stop of stops) {
        if (!containsValidColor(stop)) {
            return false;
        }
    }

    return true;
}

/**
 * 检查字符串是否包含合法的颜色值
 * @param {string} str - 要检查的字符串
 * @returns {boolean} - 是否包含合法的颜色值
 */
function containsValidColor(str) {
    // 这个函数会尝试从字符串中提取可能的颜色值并检查
    // 检查HEX颜色
    if (/#[0-9A-Fa-f]{6}|#[0-9A-Fa-f]{8}/.test(str)) {
        return true;
    }

    // 检查RGB颜色
    if (/rgb\(\s*(\d{1,3})\s*,\s*(\d{1,3})\s*,\s*(\d{1,3})\s*\)/.test(str)) {
        return true;
    }

    // 检查RGBA颜色
    if (/rgba\(\s*(\d{1,3})\s*,\s*(\d{1,3})\s*,\s*(\d{1,3})\s*,\s*([01]?(?:\.\d+)?)\s*\)/.test(str)) {
        return true;
    }

    // 检查HSL颜色
    if (/hsl\(\s*(\d{1,3})\s*,\s*(\d{1,3})%\s*,\s*(\d{1,3})%\s*\)/.test(str)) {
        return true;
    }

    // 检查HSLA颜色
    if (/hsla\(\s*(\d{1,3})\s*,\s*(\d{1,3})%\s*,\s*(\d{1,3})%\s*,\s*([01]?(?:\.\d+)?)\s*\)/.test(str)) {
        return true;
    }

    // 检查HSBA颜色
    if (/hsba\(\s*(\d{1,3})\s*,\s*(\d{1,3})%\s*,\s*(\d{1,3})%\s*,\s*([01]?(?:\.\d+)?)\s*\)/.test(str)) {
        return true;
    }

    return false;
}
