/**
 * 配置管理模块
 * @module config
 */

import { SettingsManager, DEFAULT_SETTINGS } from './storage.js';

/**
 * 默认应用配置
 * @type {Object}
 */
export const DEFAULT_CONFIG = {
    springFestival: new Date('2026-02-17T00:00:00'), // 2026年春节（马年正月初一）
    danmakuSpeed: 15000, // 弹幕移动时长（毫秒）
    danmakuInterval: 2000, // 自动发送弹幕间隔（毫秒）
    maxDanmakuOnScreen: 15, // 屏幕上最多同时显示的弹幕数
    defaultDanmaku: [
        '新年快乐！ovo',
        '恭喜发财！(✿◡‿◡)',
        '万事如意！OwO',
        '身体健康！(^_−)☆',
        '心想事成！(｡♥‿♥｡)',
        '阖家幸福！⊂((・▽・))⊃',
        '龙马精神！ovo',
        '岁岁平安！(´▽`ʃ♡ƪ)',
        '春节快乐！OwO',
        '吉祥如意！(✿◡‿◡)',
    ],
    soundEnabled: true, // 是否启用音效
    soundVolume: 0.3, // 音量（0-1）
};

/**
 * 应用配置（从 localStorage 加载或使用默认值）
 * @type {Object}
 */
export const CONFIG = {
    ...DEFAULT_CONFIG,
    ...SettingsManager.getSettings(),
};

/**
 * Toast 通知类型枚举
 * @enum {string}
 */
export const ToastType = {
    SUCCESS: 'success',
    ERROR: 'error',
    WARNING: 'warning',
    INFO: 'info',
};
