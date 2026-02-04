/**
 * 主题选择器 UI 组件
 * @module themeSelector
 */

import { ThemeManager, THEMES } from '../utils/themes.js';
import { createSpan } from '../utils/helpers.js';

/**
 * 创建主题选择器
 * @returns {HTMLElement} 主题选择器元素
 */
export function createThemeSelector() {
    const container = document.createElement('div');
    container.className = 'theme-selector';
    container.innerHTML = `
        <button class="theme-selector-btn" id="themeToggleBtn" aria-label="切换主题">
            <span class="theme-icon">🎨</span>
        </button>
        <div class="theme-panel" id="themePanel">
            <div class="theme-panel-header">
                <span class="theme-panel-title">选择主题</span>
                <button class="theme-close-btn" aria-label="关闭">×</button>
            </div>
            <div class="theme-list" id="themeList">
                <!-- 主题列表将由 JS 生成 -->
            </div>
        </div>
    `;

    // 生成主题列表
    const themeList = container.querySelector('#themeList');
    Object.entries(THEMES).forEach(([themeId, theme]) => {
        const themeItem = createThemeItem(themeId, theme);
        themeList.appendChild(themeItem);
    });

    // 添加事件监听
    setupThemeSelectorEvents(container);

    return container;
}

/**
 * 创建主题选项
 * @private
 * @param {string} themeId - 主题 ID
 * @param {Object} theme - 主题配置
 * @returns {HTMLElement} 主题选项元素
 */
function createThemeItem(themeId, theme) {
    const item = document.createElement('div');
    item.className = 'theme-item';
    item.dataset.themeId = themeId;
    item.setAttribute('role', 'button');
    item.setAttribute('tabindex', '0');

    const currentTheme = ThemeManager.getCurrentTheme();
    const isActive = themeId === currentTheme;

    item.innerHTML = `
        <div class="theme-preview" style="background: ${theme.gradient};"></div>
        <div class="theme-info">
            <span class="theme-name">${theme.name}</span>
            <span class="theme-desc">${theme.description}</span>
        </div>
        ${isActive ? '<span class="theme-active-badge">✓</span>' : ''}
    `;

    // 点击事件
    item.addEventListener('click', () => {
        ThemeManager.setTheme(themeId);
        updateThemeActiveStates();
    });

    // 键盘事件
    item.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            ThemeManager.setTheme(themeId);
            updateThemeActiveStates();
        }
    });

    return item;
}

/**
 * 设置主题选择器事件
 * @private
 * @param {HTMLElement} container - 容器元素
 */
function setupThemeSelectorEvents(container) {
    const toggleBtn = container.querySelector('#themeToggleBtn');
    const panel = container.querySelector('#themePanel');
    const closeBtn = container.querySelector('.theme-close-btn');

    // 切换面板显示
    toggleBtn.addEventListener('click', () => {
        panel.classList.toggle('open');
    });

    // 关闭按钮
    closeBtn.addEventListener('click', () => {
        panel.classList.remove('open');
    });

    // 点击外部关闭
    document.addEventListener('click', (e) => {
        if (!container.contains(e.target)) {
            panel.classList.remove('open');
        }
    });

    // 更新激活状态
    function updateThemeActiveStates() {
        const currentTheme = ThemeManager.getCurrentTheme();
        container.querySelectorAll('.theme-item').forEach((item) => {
            const isActive = item.dataset.themeId === currentTheme;
            item.classList.toggle('active', isActive);

            let badge = item.querySelector('.theme-active-badge');
            if (isActive && !badge) {
                badge = document.createElement('span');
                badge.className = 'theme-active-badge';
                badge.textContent = '✓';
                item.appendChild(badge);
            } else if (!isActive && badge) {
                badge.remove();
            }
        });
    }
}

/**
 * 将主题选择器添加到页面
 */
export function initThemeSelector() {
    // 检查是否已存在
    if (document.querySelector('.theme-selector')) {
        return;
    }

    const selector = createThemeSelector();
    document.body.appendChild(selector);

    // 初始化主题
    ThemeManager.init();
}
