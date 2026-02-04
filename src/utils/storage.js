/**
 * 本地存储管理模块
 * @module storage
 */

/** 存储键前缀 */
const STORAGE_PREFIX = 'spring_festival_';

/** 存储键枚举 */
export const StorageKey = {
    SETTINGS: `${STORAGE_PREFIX}settings`,
    DANMAKU_HISTORY: `${STORAGE_PREFIX}danmaku_history`,
    USER_DANMAKU: `${STORAGE_PREFIX}user_danmaku`,
};

/**
 * 默认用户设置
 * @type {Object}
 */
export const DEFAULT_SETTINGS = {
    soundEnabled: true,
    soundVolume: 0.3,
    danmakuSpeed: 15000,
    danmakuInterval: 2000,
    maxDanmakuOnScreen: 15,
    mouseFollowEnabled: false,
    theme: 'default',
};

/**
 * 从 localStorage 获取数据
 * @template T
 * @param {string} key - 存储键
 * @param {T} [defaultValue] - 默认值
 * @returns {T|null} 存储的数据或默认值
 */
export function getStorage(key, defaultValue = null) {
    try {
        const item = localStorage.getItem(key);
        if (item === null) {
            return defaultValue;
        }
        return JSON.parse(item);
    } catch (e) {
        console.error(`Error reading from localStorage (key: ${key}):`, e);
        return defaultValue;
    }
}

/**
 * 向 localStorage 保存数据
 * @template T
 * @param {string} key - 存储键
 * @param {T} value - 要保存的值
 * @returns {boolean} 是否保存成功
 */
export function setStorage(key, value) {
    try {
        localStorage.setItem(key, JSON.stringify(value));
        return true;
    } catch (e) {
        console.error(`Error writing to localStorage (key: ${key}):`, e);
        return false;
    }
}

/**
 * 从 localStorage 删除数据
 * @param {string} key - 存储键
 * @returns {boolean} 是否删除成功
 */
export function removeStorage(key) {
    try {
        localStorage.removeItem(key);
        return true;
    } catch (e) {
        console.error(`Error removing from localStorage (key: ${key}):`, e);
        return false;
    }
}

/**
 * 清空所有应用相关的存储数据
 * @returns {boolean} 是否清空成功
 */
export function clearAllStorage() {
    try {
        const keys = Object.values(StorageKey);
        keys.forEach((key) => {
            localStorage.removeItem(key);
        });
        return true;
    } catch (e) {
        console.error('Error clearing localStorage:', e);
        return false;
    }
}

/**
 * 用户设置管理类
 */
export class SettingsManager {
    /**
     * 获取用户设置
     * @returns {Object} 用户设置
     */
    static getSettings() {
        const settings = getStorage(StorageKey.SETTINGS, DEFAULT_SETTINGS);
        return { ...DEFAULT_SETTINGS, ...settings };
    }

    /**
     * 保存用户设置
     * @param {Object} settings - 设置对象
     * @returns {boolean} 是否保存成功
     */
    static saveSettings(settings) {
        const currentSettings = this.getSettings();
        const mergedSettings = { ...currentSettings, ...settings };
        return setStorage(StorageKey.SETTINGS, mergedSettings);
    }

    /**
     * 更新单个设置项
     * @param {string} key - 设置键
     * @param {*} value - 设置值
     * @returns {boolean} 是否保存成功
     */
    static updateSetting(key, value) {
        const settings = this.getSettings();
        settings[key] = value;
        return this.saveSettings(settings);
    }

    /**
     * 重置设置为默认值
     * @returns {boolean} 是否重置成功
     */
    static resetSettings() {
        return setStorage(StorageKey.SETTINGS, DEFAULT_SETTINGS);
    }
}

/**
 * 弹幕历史管理类
 */
export class DanmakuHistoryManager {
    /**
     * 最大历史记录数量
     * @type {number}
     */
    static MAX_HISTORY = 100;

    /**
     * 获取弹幕历史
     * @returns {Array<{text: string, timestamp: number, type: string}>} 弹幕历史
     */
    static getHistory() {
        return getStorage(StorageKey.DANMAKU_HISTORY, []);
    }

    /**
     * 添加弹幕到历史记录
     * @param {string} text - 弹幕文本
     * @param {string} [type='user'] - 弹幕类型 (user/auto)
     * @returns {boolean} 是否添加成功
     */
    static addHistory(text, type = 'user') {
        const history = this.getHistory();

        // 添加新记录
        history.unshift({
            text,
            type,
            timestamp: Date.now(),
        });

        // 限制历史记录数量
        if (history.length > this.MAX_HISTORY) {
            history.pop();
        }

        return setStorage(StorageKey.DANMAKU_HISTORY, history);
    }

    /**
     * 清空历史记录
     * @returns {boolean} 是否清空成功
     */
    static clearHistory() {
        return setStorage(StorageKey.DANMAKU_HISTORY, []);
    }

    /**
     * 获取用户自定义弹幕列表
     * @returns {string[]} 用户弹幕列表
     */
    static getUserDanmaku() {
        return getStorage(StorageKey.USER_DANMAKU, []);
    }

    /**
     * 添加用户自定义弹幕
     * @param {string} text - 弹幕文本
     * @returns {boolean} 是否添加成功
     */
    static addUserDanmaku(text) {
        const userDanmaku = this.getUserDanmaku();

        // 避免重复
        if (userDanmaku.includes(text)) {
            return false;
        }

        // 限制数量
        if (userDanmaku.length >= 20) {
            userDanmaku.pop();
        }

        userDanmaku.unshift(text);
        return setStorage(StorageKey.USER_DANMAKU, userDanmaku);
    }

    /**
     * 删除用户自定义弹幕
     * @param {string} text - 弹幕文本
     * @returns {boolean} 是否删除成功
     */
    static removeUserDanmaku(text) {
        const userDanmaku = this.getUserDanmaku();
        const filtered = userDanmaku.filter((item) => item !== text);

        if (filtered.length === userDanmaku.length) {
            return false; // 没有找到匹配项
        }

        return setStorage(StorageKey.USER_DANMAKU, filtered);
    }

    /**
     * 清空用户自定义弹幕
     * @returns {boolean} 是否清空成功
     */
    static clearUserDanmaku() {
        return setStorage(StorageKey.USER_DANMAKU, []);
    }
}

/**
 * 导出存储数据（用于备份）
 * @returns {string|null} JSON 字符串
 */
export function exportStorage() {
    const data = {};
    Object.values(StorageKey).forEach((key) => {
        const value = getStorage(key);
        if (value !== null) {
            data[key] = value;
        }
    });

    try {
        return JSON.stringify(data);
    } catch (e) {
        console.error('Error exporting storage:', e);
        return null;
    }
}

/**
 * 导入存储数据（用于恢复）
 * @param {string} jsonData - JSON 字符串
 * @returns {boolean} 是否导入成功
 */
export function importStorage(jsonData) {
    try {
        const data = JSON.parse(jsonData);
        Object.entries(data).forEach(([key, value]) => {
            setStorage(key, value);
        });
        return true;
    } catch (e) {
        console.error('Error importing storage:', e);
        return false;
    }
}
