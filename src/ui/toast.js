/**
 * Toast 通知系统
 * @module toast
 */

import { ToastType } from '../utils/config.js';
import { escapeHtml } from '../utils/helpers.js';

/**
 * Toast 通知管理类
 */
class ToastManager {
    /**
     * @param {string} containerId - Toast 容器的 DOM ID
     */
    constructor(containerId) {
        /** @type {HTMLElement|null} */
        this.container = document.getElementById(containerId);
        /** @type {HTMLElement[]} */
        this.toasts = [];
        /** @type {number} */
        this.maxToasts = 5;

        if (!this.container) {
            console.error(`Toast container with id "${containerId}" not found`);
        }
    }

    /**
     * 显示 Toast 通知
     * @param {string} message - 通知消息
     * @param {string} [type=ToastType.INFO] - 通知类型 (success/error/warning/info)
     * @param {number} [duration=3000] - 显示时长（毫秒），0 表示不自动关闭
     * @returns {HTMLElement|null} Toast 元素
     */
    show(message, type = ToastType.INFO, duration = 3000) {
        if (!this.container) {
            console.warn('Toast container not available, logging to console:', message);
            return null;
        }

        // 限制同时显示的 Toast 数量
        if (this.toasts.length >= this.maxToasts) {
            this.hide(this.toasts[0]);
        }

        const toast = this.createToast(message, type);
        this.container.appendChild(toast);
        this.toasts.push(toast);

        // 自动关闭
        if (duration > 0) {
            setTimeout(() => {
                this.hide(toast);
            }, duration);
        }

        return toast;
    }

    /**
     * 创建 Toast 元素
     * @private
     * @param {string} message - 通知消息
     * @param {string} type - 通知类型
     * @returns {HTMLElement} Toast 元素
     */
    createToast(message, type) {
        const toast = document.createElement('div');
        toast.className = `toast toast-${type}`;

        const iconMap = {
            success: '✅',
            error: '❌',
            warning: '⚠️',
            info: 'ℹ️',
        };

        toast.innerHTML = `
            <span class="toast-icon">${iconMap[type] || iconMap.info}</span>
            <span class="toast-message">${escapeHtml(message)}</span>
            <button class="toast-close" aria-label="关闭">✕</button>
        `;

        // 关闭按钮事件
        const closeBtn = toast.querySelector('.toast-close');
        closeBtn.addEventListener('click', () => {
            this.hide(toast);
        });

        return toast;
    }

    /**
     * 隐藏 Toast
     * @param {HTMLElement} toast - Toast 元素
     */
    hide(toast) {
        if (!toast || !toast.parentElement) {
            return;
        }

        toast.classList.add('toast-hiding');
        toast.addEventListener('animationend', () => {
            toast.remove();
            this.toasts = this.toasts.filter((t) => t !== toast);
        });
    }

    /**
     * 清除所有 Toast
     */
    clearAll() {
        this.toasts.forEach((toast) => {
            toast.remove();
        });
        this.toasts = [];
    }
}

// 创建并导出全局 Toast 实例
/** @type {ToastManager} */
export const toast = new ToastManager('toastContainer');
