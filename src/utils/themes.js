/**
 * 主题系统模块
 * @module themes
 */

import { SettingsManager } from './storage.js';
import { toast } from '../ui/toast.js';

/**
 * 主题配置
 * @type {Object.<string, ThemeConfig>}
 */
export const THEMES = {
    default: {
        name: '默认粉蓝',
        description: '柔和的粉蓝配色，经典二次元风格',
        colors: {
            primaryPink: '#FFB6C1',
            secondaryPink: '#FFC0CB',
            lightPink: '#FFE4E1',
            softBlue: '#87CEEB',
            skyBlue: '#B0E0E6',
            lavender: '#E6E6FA',
            lilac: '#C8A2C8',
            white: '#FFFFFF',
            textDark: '#4A4A4A',
            textLight: '#7A7A7A',
        },
        gradient: 'linear-gradient(135deg, #FFB6C1 0%, #87CEEB 100%)',
        background: 'url(【哲风壁纸】傍晚路灯-山脉-水面.png)',
    },
    cyberpunk: {
        name: '赛博朋克',
        description: '霓虹灯效果，未来科技感',
        colors: {
            primaryPink: '#FF00FF',
            secondaryPink: '#FF1493',
            lightPink: '#FF69B4',
            softBlue: '#00FFFF',
            skyBlue: '#00CED1',
            lavender: '#9400D3',
            lilac: '#8A2BE2',
            white: '#FFFFFF',
            textDark: '#E0E0E0',
            textLight: '#B0B0B0',
        },
        gradient: 'linear-gradient(135deg, #FF00FF 0%, #00FFFF 100%)',
        background: 'linear-gradient(135deg, #0a0a0a 0%, #1a1a2e 100%)',
    },
    ancient: {
        name: '古风雅韵',
        description: '传统中国风，典雅水墨',
        colors: {
            primaryPink: '#E8B4B8',
            secondaryPink: '#F5DEB3',
            lightPink: '#FFF8DC',
            softBlue: '#ADD8E6',
            skyBlue: '#87CEEB',
            lavender: '#DDA0DD',
            lilac: '#DA70D6',
            white: '#FFFAFA',
            textDark: '#2F2F2F',
            textLight: '#696969',
        },
        gradient: 'linear-gradient(135deg, #E8B4B8 0%, #ADD8E6 100%)',
        background: 'linear-gradient(135deg, #FFF8DC 0%, #F5DEB3 100%)',
    },
    sakura: {
        name: '樱花纷飞',
        description: '樱花主题，浪漫唯美',
        colors: {
            primaryPink: '#FFB7C5',
            secondaryPink: '#FFC0CB',
            lightPink: '#FFE4E1',
            softBlue: '#E6E6FA',
            skyBlue: '#D8BFD8',
            lavender: '#DDA0DD',
            lilac: '#EE82EE',
            white: '#FFFFFF',
            textDark: '#4A3F44',
            textLight: '#7A6A72',
        },
        gradient: 'linear-gradient(135deg, #FFB7C5 0%, #E6E6FA 100%)',
        background: 'linear-gradient(135deg, #FFE4E1 0%, #FFC0CB 100%)',
    },
    ocean: {
        name: '深海幽蓝',
        description: '深蓝配色，宁静深邃',
        colors: {
            primaryPink: '#87CEEB',
            secondaryPink: '#B0E0E6',
            lightPink: '#E0FFFF',
            softBlue: '#4682B4',
            skyBlue: '#5F9EA0',
            lavender: '#B0C4DE',
            lilac: '#778899',
            white: '#FFFFFF',
            textDark: '#2F4F4F',
            textLight: '#696969',
        },
        gradient: 'linear-gradient(135deg, #87CEEB 0%, #4682B4 100%)',
        background: 'linear-gradient(135deg, #E0FFFF 0%, #B0E0E6 100%)',
    },
};

/**
 * 主题管理器类
 */
export class ThemeManager {
    /**
     * 获取当前主题
     * @returns {string} 主题 ID
     */
    static getCurrentTheme() {
        const settings = SettingsManager.getSettings();
        return settings.theme || 'default';
    }

    /**
     * 设置主题
     * @param {string} themeId - 主题 ID
     * @returns {boolean} 是否设置成功
     */
    static setTheme(themeId) {
        if (!THEMES[themeId]) {
            console.error(`Theme "${themeId}" not found`);
            return false;
        }

        const theme = THEMES[themeId];

        // 更新 CSS 变量
        this.applyTheme(theme);

        // 保存设置
        SettingsManager.updateSetting('theme', themeId);

        // 显示提示
        toast.show(`已切换到${theme.name}主题`, 'success', 2000);

        return true;
    }

    /**
     * 应用主题样式
     * @private
     * @param {ThemeConfig} theme - 主题配置
     */
    static applyTheme(theme) {
        const root = document.documentElement;

        // 设置颜色变量
        root.style.setProperty('--primary-pink', theme.colors.primaryPink);
        root.style.setProperty('--secondary-pink', theme.colors.secondaryPink);
        root.style.setProperty('--light-pink', theme.colors.lightPink);
        root.style.setProperty('--soft-blue', theme.colors.softBlue);
        root.style.setProperty('--sky-blue', theme.colors.skyBlue);
        root.style.setProperty('--lavender', theme.colors.lavender);
        root.style.setProperty('--lilac', theme.colors.lilac);
        root.style.setProperty('--white', theme.colors.white);
        root.style.setProperty('--text-dark', theme.colors.textDark);
        root.style.setProperty('--text-light', theme.colors.textLight);

        // 设置渐变
        root.style.setProperty('--gradient-primary', theme.gradient);
        root.style.setProperty('--gradient-glow', theme.gradient);

        // 设置背景
        if (theme.background.startsWith('url')) {
            document.body.style.backgroundImage = theme.background;
        } else {
            document.body.style.background = theme.background;
            document.body.style.backgroundImage = 'none';
        }
    }

    /**
     * 初始化主题（从设置加载）
     */
    static init() {
        const themeId = this.getCurrentTheme();
        if (THEMES[themeId]) {
            this.applyTheme(THEMES[themeId]);
        }
    }

    /**
     * 获取所有可用主题
     * @returns {Object.<string, ThemeConfig>} 主题列表
     */
    static getAvailableThemes() {
        return THEMES;
    }

    /**
     * 获取主题信息
     * @param {string} themeId - 主题 ID
     * @returns {ThemeConfig|null} 主题配置
     */
    static getThemeInfo(themeId) {
        return THEMES[themeId] || null;
    }
}

/**
 * 主题切换快捷键
 */
export function setupThemeShortcuts() {
    document.addEventListener('keydown', (e) => {
        // Alt + 1-5 快速切换主题
        if (e.altKey && e.key >= '1' && e.key <= '5') {
            e.preventDefault();
            const themeKeys = Object.keys(THEMES);
            const index = parseInt(e.key) - 1;

            if (index < themeKeys.length) {
                const themeId = themeKeys[index];
                ThemeManager.setTheme(themeId);
            }
        }

        // Alt + T 循环切换主题
        if (e.altKey && e.key.toLowerCase() === 't') {
            e.preventDefault();
            const themeKeys = Object.keys(THEMES);
            const currentTheme = ThemeManager.getCurrentTheme();
            const currentIndex = themeKeys.indexOf(currentTheme);
            const nextIndex = (currentIndex + 1) % themeKeys.length;

            ThemeManager.setTheme(themeKeys[nextIndex]);
        }
    });
}
