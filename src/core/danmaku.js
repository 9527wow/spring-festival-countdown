/**
 * 弹幕系统模块
 * @module danmaku
 */

import { CONFIG } from '../utils/config.js';
import { randomItem, randomInt, createSpan } from '../utils/helpers.js';
import { toast } from '../ui/toast.js';
import { playSound } from './audio.js';
import { DanmakuHistoryManager } from '../utils/storage.js';

/** @type {number|null} */
let autoDanmakuInterval = null;

/** @type {IntersectionObserver|null} */
let danmakuObserver = null;

/** @type {number} */
let titleClickCount = 0;

/**
 * 发送弹幕
 * @param {string} text - 弹幕文本
 */
export function sendDanmaku(text) {
    if (!text || text.trim() === '') {
        return;
    }

    const trimmedText = text.trim();

    // 添加发送动画效果
    createDanmaku(trimmedText);

    // 保存到历史记录
    DanmakuHistoryManager.addHistory(trimmedText, 'user');

    // 如果是用户输入的弹幕，也保存到用户弹幕列表
    if (!CONFIG.defaultDanmaku.includes(trimmedText)) {
        DanmakuHistoryManager.addUserDanmaku(trimmedText);
    }

    // 清空输入框
    const input = document.getElementById('danmakuInput');
    if (input) {
        input.value = '';
    }

    // 添加按钮点击效果
    const btn = document.getElementById('sendBtn');
    if (btn) {
        btn.style.transform = 'scale(0.95)';
        setTimeout(() => {
            btn.style.transform = '';
        }, 100);
    }
}

/**
 * 初始化弹幕观察器（性能优化）
 */
export function initDanmakuObserver() {
    if ('IntersectionObserver' in window && !danmakuObserver) {
        danmakuObserver = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    entry.target.style.visibility = 'visible';
                } else {
                    entry.target.style.visibility = 'hidden';
                }
            });
        });
    }
}

/**
 * 创建弹幕
 * @param {string} text - 弹幕文本
 * @param {boolean} [isAuto=false] - 是否为自动弹幕
 * @param {string|null} [specialType=null] - 特殊类型 (firework/rainbow/sparkle)
 */
export function createDanmaku(text, isAuto = false, specialType = null) {
    const container = document.getElementById('danmakuContainer');
    if (!container) return;

    // 检查屏幕上的弹幕数量
    if (container.children.length >= CONFIG.maxDanmakuOnScreen) {
        // 移除最老的弹幕
        const oldestDanmaku = container.firstChild;
        if (oldestDanmaku) {
            oldestDanmaku.remove();
        }
    }

    const danmaku = document.createElement('div');
    danmaku.className = 'danmaku';
    danmaku.textContent = text;

    // 扩展的弹幕样式
    const styles = ['style-1', 'style-2', 'style-3', 'style-4', 'style-5', 'style-6'];
    let randomStyle = randomItem(styles);

    // 特殊类型弹幕
    if (specialType === 'firework') {
        randomStyle = 'firework-style';
    } else if (specialType === 'rainbow') {
        randomStyle = 'rainbow-style';
    } else if (specialType === 'sparkle') {
        randomStyle = 'sparkle-style';
    }

    danmaku.classList.add(randomStyle);

    // 使用 will-change 优化动画性能
    danmaku.style.willChange = 'transform';

    // 随机垂直位置（避免顶部和底部）
    const topPosition = randomInt(15, 75);
    danmaku.style.top = `${topPosition}%`;

    // 随机速度（基础速度 ± 40%）
    const speed = CONFIG.danmakuSpeed * (0.6 + Math.random() * 0.8);
    danmaku.style.animationDuration = `${speed}ms`;

    // 随机大小
    const fontSize = randomInt(16, 24);
    danmaku.style.fontSize = `${fontSize}px`;

    // 设置初始位置在屏幕右侧外（使用transform而不是left）
    danmaku.style.transform = 'translateX(100vw)';

    // 添加旋转效果（随机）
    if (Math.random() > 0.7) {
        const rotation = randomInt(-10, 10);
        danmaku.classList.add('rotated');
        danmaku.style.setProperty('--rotation', `${rotation}deg`);
        // 更新动画为带旋转的版本
        danmaku.style.animationName = 'danmaku-move-rotated';
    }

    container.appendChild(danmaku);

    // 动画结束后移除弹幕并清理
    const cleanup = () => {
        danmaku.remove();
        if (danmakuObserver) {
            danmakuObserver.unobserve(danmaku);
        }
    };

    danmaku.addEventListener('animationend', cleanup);

    // 使用 Intersection Observer 优化性能
    if (danmakuObserver) {
        danmakuObserver.observe(danmaku);
    }
}

/**
 * 发送弹幕
 * @param {string} text - 弹幕文本
 */
export function sendDanmaku(text) {
    if (!text || text.trim() === '') {
        return;
    }

    // 添加发送动画效果
    createDanmaku(text.trim());

    // 清空输入框
    const input = document.getElementById('danmakuInput');
    if (input) {
        input.value = '';
    }

    // 添加按钮点击效果
    const btn = document.getElementById('sendBtn');
    if (btn) {
        btn.style.transform = 'scale(0.95)';
        setTimeout(() => {
            btn.style.transform = '';
        }, 100);
    }
}

/**
 * 启动自动弹幕
 */
export function startAutoDanmaku() {
    // 初始发送几条弹幕
    for (let i = 0; i < 5; i++) {
        setTimeout(() => {
            const randomMsg = randomItem(CONFIG.defaultDanmaku);
            createDanmaku(randomMsg, true);
        }, i * 500);
    }

    // 定时发送随机弹幕
    if (autoDanmakuInterval) {
        clearInterval(autoDanmakuInterval);
    }

    autoDanmakuInterval = setInterval(() => {
        const randomMsg = randomItem(CONFIG.defaultDanmaku);
        createDanmaku(randomMsg, true);
    }, CONFIG.danmakuInterval);
}

/**
 * 停止自动弹幕
 */
export function stopAutoDanmaku() {
    if (autoDanmakuInterval) {
        clearInterval(autoDanmakuInterval);
        autoDanmakuInterval = null;
    }
}

/**
 * 显示新年祝福消息
 */
export function showNewYearMessage() {
    const messages = [
        'ovo 新年到！新年到！ovo',
        'OwO 2026 马年快乐！OwO',
        '(✿◡‿◡) 恭喜发财，万事如意！(✿◡‿◡)',
        '(｡♥‿♥｡) 祝你马年大吉！(｡♥‿♥｡)',
    ];

    messages.forEach((msg, index) => {
        setTimeout(() => {
            createDanmaku(msg);
        }, index * 500);
    });

    // 修改副标题 - 使用安全的 DOM 操作
    const subtitle = document.querySelector('.subtitle');
    if (subtitle) {
        subtitle.textContent = '';
        subtitle.appendChild(createSpan('ovo', 'sparkle'));
        subtitle.appendChild(createSpan('新年快乐！万事如意！'));
        subtitle.appendChild(createSpan('ovo', 'sparkle'));
    }
}

/**
 * 触发烟花弹幕秀（彩蛋功能）
 */
export function triggerFireworkShow() {
    const fireworkMessages = [
        'ovo 烟花秀开始！ovo',
        '(✿◡‿◡) 绚丽多彩！(✿◡‿◡)',
        '(｡♥‿♥｡) 璀璨夺目！(｡♥‿♥｡)',
        'OwO 庆祝时刻！OwO',
    ];

    for (let i = 0; i < 20; i++) {
        setTimeout(() => {
            const msg = randomItem(fireworkMessages);
            createDanmaku(msg, false, 'firework');

            if (i % 3 === 0) {
                playSound('firework');
            }
        }, i * 150);
    }
}

/**
 * 触发标题点击彩蛋
 */
export function setupTitleEgg() {
    const title = document.querySelector('.main-title');
    if (!title) return;

    title.addEventListener('click', () => {
        titleClickCount++;
        if (titleClickCount >= 5) {
            // 触发彩蛋
            const surpriseMessages = [
                'ovo 你发现了隐藏的彩蛋！ovo',
                '(✿◡‿◡) 祝你马年行大运！(✿◡‿◡)',
                'OwO 一码当先，码到成功！OwO',
                '(｡♥‿♥｡) 马年到，福气到！(｡♥‿♥｡)',
            ];

            for (let i = 0; i < 10; i++) {
                setTimeout(() => {
                    const msg = randomItem(surpriseMessages);
                    createDanmaku(msg, false, 'firework');
                }, i * 200);
            }

            // 播放庆祝音效
            playSound('celebration');
            titleClickCount = 0;
        }
    });
}

/**
 * 清理弹幕系统
 */
export function cleanupDanmaku() {
    stopAutoDanmaku();

    // 清理观察器
    if (danmakuObserver) {
        danmakuObserver.disconnect();
        danmakuObserver = null;
    }

    // 清理所有弹幕
    const container = document.getElementById('danmakuContainer');
    if (container) {
        container.textContent = '';
    }
}
