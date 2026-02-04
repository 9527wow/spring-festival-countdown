/**
 * 工具函数模块
 * @module helpers
 */

/**
 * 节流函数 - 限制函数执行频率
 * @template {Function} T
 * @param {T} func - 需要节流的函数
 * @param {number} limit - 时间限制（毫秒）
 * @returns {T} 节流后的函数
 * @example
 * const throttledScroll = throttle(() => console.log('scroll'), 100);
 * window.addEventListener('scroll', throttledScroll);
 */
export function throttle(func, limit) {
    let inThrottle;
    return function (...args) {
        const context = this;
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(() => (inThrottle = false), limit);
        }
    };
}

/**
 * 防抖函数 - 延迟执行函数
 * @template {Function} T
 * @param {T} func - 需要防抖的函数
 * @param {number} wait - 等待时间（毫秒）
 * @returns {Function} 防抖后的函数
 * @example
 * const debouncedSearch = debounce((query) => search(query), 300);
 * searchInput.addEventListener('input', (e) => debouncedSearch(e.target.value));
 */
export function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

/**
 * 创建 span 元素的辅助函数
 * @param {string} text - 文本内容
 * @param {string} [className=''] - CSS 类名
 * @returns {HTMLSpanElement} span 元素
 */
export function createSpan(text, className = '') {
    const span = document.createElement('span');
    span.textContent = text;
    if (className) {
        span.className = className;
    }
    return span;
}

/**
 * 转义 HTML 特殊字符，防止 XSS 攻击
 * @param {string} text - 待转义的文本
 * @returns {string} 转义后的文本
 * @example
 * escapeHtml('<script>alert("xss")</script>') // returns '&lt;script&gt;alert("xss")&lt;/script&gt;'
 */
export function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

/**
 * 随机获取数组中的一个元素
 * @template T
 * @param {T[]} array - 数组
 * @returns {T} 随机元素
 * @example
 * randomItem(['a', 'b', 'c']) // returns 'a', 'b', or 'c'
 */
export function randomItem(array) {
    return array[Math.floor(Math.random() * array.length)];
}

/**
 * 随机生成指定范围内的整数
 * @param {number} min - 最小值（包含）
 * @param {number} max - 最大值（包含）
 * @returns {number} 随机整数
 * @example
 * randomInt(1, 10) // returns integer between 1 and 10
 */
export function randomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}
