// storageUtils.js - 本地存储相关工具函数

/**
 * 检查localStorage是否可用
 * @returns {boolean} - localStorage是否可用
 */
export function isLocalStorageAvailable() {
    try {
        // 尝试使用localStorage
        const testKey = '__color_picker_test__';
        localStorage.setItem(testKey, testKey);
        localStorage.removeItem(testKey);
        return true;
    } catch (e) {
        // localStorage不可用（隐私模式、禁用等）
        return false;
    }
}

/**
 * 从localStorage获取颜色选择器数据
 * @param {string} key - 存储键名
 * @param {any} defaultValue - 默认值
 * @returns {any} - 存储的数据或默认值
 */
export function getFromStorage(key, defaultValue) {
    if (!isLocalStorageAvailable()) {
        return defaultValue;
    }

    try {
        const value = localStorage.getItem(key);
        return value ? JSON.parse(value) : defaultValue;
    } catch (e) {
        console.warn(`Error getting ${key} from localStorage:`, e);
        return defaultValue;
    }
}

/**
 * 将数据保存到localStorage
 * @param {string} key - 存储键名
 * @param {any} value - 要存储的数据
 * @returns {boolean} - 是否保存成功
 */
export function saveToStorage(key, value) {
    if (!isLocalStorageAvailable()) {
        return false;
    }

    try {
        localStorage.setItem(key, JSON.stringify(value));
        return true;
    } catch (e) {
        console.warn(`Error saving ${key} to localStorage:`, e);
        return false;
    }
}
