/**
 * 弹幕对象池（性能优化）
 * @module danmakuPool
 */

import { randomInt } from './helpers.js';

/**
 * 弹幕对象池类
 * 用于复用弹幕 DOM 元素，减少 GC 压力
 */
export class DanmakuPool {
    /**
     * @param {number} [initialSize=10] - 初始池大小
     * @param {number} [maxSize=50] - 最大池大小
     */
    constructor(initialSize = 10, maxSize = 50) {
        /** @type {HTMLDivElement[]} */
        this.pool = [];
        /** @type {number} */
        this.maxSize = maxSize;
        /** @type {number} */
        this.size = 0;

        // 预创建对象
        for (let i = 0; i < initialSize; i++) {
            this.pool.push(this.createDanmakuElement());
        }
        this.size = initialSize;
    }

    /**
     * 创建弹幕 DOM 元素
     * @private
     * @returns {HTMLDivElement} 弹幕元素
     */
    createDanmakuElement() {
        const danmaku = document.createElement('div');
        danmaku.className = 'danmaku';
        danmaku.style.display = 'none';
        danmaku.style.willChange = 'transform';
        return danmaku;
    }

    /**
     * 从池中获取弹幕元素
     * @returns {HTMLDivElement} 弹幕元素
     */
    acquire() {
        let element;

        if (this.pool.length > 0) {
            // 从池中取出
            element = this.pool.pop();
        } else if (this.size < this.maxSize) {
            // 创建新元素
            element = this.createDanmakuElement();
            this.size++;
        } else {
            // 池已满，创建临时元素（不会回收）
            element = this.createDanmakuElement();
        }

        return element;
    }

    /**
     * 将弹幕元素归还到池中
     * @param {HTMLDivElement} element - 弹幕元素
     * @returns {boolean} 是否成功归还
     */
    release(element) {
        // 如果池未满，则回收
        if (this.pool.length < this.maxSize) {
            // 重置元素状态
            this.resetElement(element);
            this.pool.push(element);
            return true;
        }

        // 池已满，丢弃元素
        element.remove();
        return false;
    }

    /**
     * 重置弹幕元素状态
     * @private
     * @param {HTMLDivElement} element - 弹幕元素
     */
    resetElement(element) {
        // 移除所有样式类
        element.className = 'danmaku';
        element.style.display = 'none';
        element.textContent = '';
        element.style.top = '';
        element.style.animationDuration = '';
        element.style.fontSize = '';
        element.style.transform = '';
        element.style.removeProperty('--rotation');

        // 移除事件监听器
        const newElement = element.cloneNode(false);
        element.parentNode?.replaceChild(newElement, element);
    }

    /**
     * 清空对象池
     */
    clear() {
        this.pool.forEach((element) => {
            element.remove();
        });
        this.pool = [];
        this.size = 0;
    }

    /**
     * 获取池状态
     * @returns {{available: number, total: number}} 池状态
     */
    getStatus() {
        return {
            available: this.pool.length,
            total: this.size,
        };
    }
}

/**
 * 全局弹幕对象池实例
 * @type {DanmakuPool|null}
 */
let globalPool = null;

/**
 * 初始化全局弹幕对象池
 * @param {number} [initialSize] - 初始大小
 * @param {number} [maxSize] - 最大大小
 */
export function initDanmakuPool(initialSize = 10, maxSize = 50) {
    if (!globalPool) {
        globalPool = new DanmakuPool(initialSize, maxSize);
    }
    return globalPool;
}

/**
 * 获取全局弹幕对象池
 * @returns {DanmakuPool|null} 对象池实例
 */
export function getDanmakuPool() {
    return globalPool;
}

/**
 * 使用对象池创建弹幕（优化版）
 * @param {string} text - 弹幕文本
 * @param {string[]} styles - 可用样式列表
 * @param {number} danmakuSpeed - 弹幕速度
 * @param {number} maxTop - 最大顶部位置
 * @param {number} minTop - 最小顶部位置
 * @param {string|null} specialType - 特殊类型
 * @param {HTMLElement} container - 容器元素
 * @returns {HTMLDivElement} 弹幕元素
 */
export function createPooledDanmaku(text, styles, danmakuSpeed, maxTop, minTop, specialType, container) {
    const pool = getDanmakuPool();
    const danmaku = pool ? pool.acquire() : document.createElement('div');

    // 设置基本属性
    danmaku.className = 'danmaku';
    danmaku.textContent = text;
    danmaku.style.display = 'block';

    // 扩展的弹幕样式
    let randomStyle = styles[Math.floor(Math.random() * styles.length)];

    // 特殊类型弹幕
    if (specialType === 'firework') {
        randomStyle = 'firework-style';
    } else if (specialType === 'rainbow') {
        randomStyle = 'rainbow-style';
    } else if (specialType === 'sparkle') {
        randomStyle = 'sparkle-style';
    }

    danmaku.classList.add(randomStyle);

    // 随机垂直位置
    const topPosition = randomInt(minTop, maxTop);
    danmaku.style.top = `${topPosition}%`;

    // 随机速度
    const speed = danmakuSpeed * (0.6 + Math.random() * 0.8);
    danmaku.style.animationDuration = `${speed}ms`;

    // 随机大小
    const fontSize = randomInt(16, 24);
    danmaku.style.fontSize = `${fontSize}px`;

    // 设置初始位置
    danmaku.style.transform = 'translateX(100vw)';

    // 添加旋转效果（随机）
    if (Math.random() > 0.7) {
        const rotation = randomInt(-10, 10);
        danmaku.classList.add('rotated');
        danmaku.style.setProperty('--rotation', `${rotation}deg`);
        danmaku.style.animationName = 'danmaku-move-rotated';
    }

    container.appendChild(danmaku);

    // 动画结束后归还到池中
    const cleanup = () => {
        danmaku.remove();
        if (pool) {
            pool.release(danmaku);
        }
    };

    danmaku.addEventListener('animationend', cleanup);

    return danmaku;
}

/**
 * 清理全局弹幕对象池
 */
export function cleanupDanmakuPool() {
    if (globalPool) {
        globalPool.clear();
        globalPool = null;
    }
}
