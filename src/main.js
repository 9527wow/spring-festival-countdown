/**
 * 主入口文件
 * @module main
 */

import { CONFIG, ToastType } from './utils/config.js';
import { throttle } from './utils/helpers.js';
import { toast } from './ui/toast.js';
import { initAudio, playSound, suspendAudio, resumeAudio, closeAudio } from './core/audio.js';
import { startCountdown, stopCountdown, resetCountdown, setNewYearCallback } from './core/countdown.js';
import {
    initDanmakuObserver,
    createDanmaku,
    sendDanmaku,
    startAutoDanmaku,
    stopAutoDanmaku,
    setupTitleEgg,
    triggerFireworkShow,
    cleanupDanmaku,
    showNewYearMessage,
} from './core/danmaku.js';

// 设置新年消息回调（避免循环依赖）
setNewYearCallback(showNewYearMessage);

// ========== 鼠标跟随特效 ==========
let mouseFollowEnabled = false;
document.addEventListener('mousemove', (e) => {
    if (!mouseFollowEnabled) return;

    if (Math.random() > 0.95) {
        // 5% 概率触发
        const sparkle = document.createElement('div');
        sparkle.textContent = 'ovo';
        sparkle.style.position = 'fixed';
        sparkle.style.left = e.clientX + 'px';
        sparkle.style.top = e.clientY + 'px';
        sparkle.style.pointerEvents = 'none';
        sparkle.style.zIndex = '1000';
        sparkle.style.fontSize = '20px';
        sparkle.style.animation = 'mouse-sparkle 1s ease-out forwards';

        document.body.appendChild(sparkle);

        setTimeout(() => {
            sparkle.remove();
        }, 1000);
    }
});

// 双击背景切换鼠标跟随
let lastClickTime = 0;
document.addEventListener('click', (e) => {
    const currentTime = Date.now();

    if (currentTime - lastClickTime < 300) {
        // 双击事件
        if (e.target === document.body || e.target.classList.contains('stars-container')) {
            mouseFollowEnabled = !mouseFollowEnabled;
            createDanmaku(mouseFollowEnabled ? 'ovo 鼠标跟随已开启' : 'ovo 鼠标跟随已关闭', false, 'sparkle');
        }
    }

    lastClickTime = currentTime;
});

// ========== 涟漪效果函数 ==========
/**
 * 创建按钮涟漪效果
 * @param {MouseEvent} event - 鼠标事件
 */
function createRippleEffect(event) {
    const button = event.currentTarget;
    const circle = document.createElement('span');
    const diameter = Math.max(button.clientWidth, button.clientHeight);
    const radius = diameter / 2;

    const rect = button.getBoundingClientRect();

    circle.style.width = circle.style.height = `${diameter}px`;
    circle.style.left = `${event.clientX - rect.left - radius}px`;
    circle.style.top = `${event.clientY - rect.top - radius}px`;
    circle.classList.add('ripple');

    // 移除旧的涟漪
    const ripple = button.getElementsByClassName('ripple')[0];
    if (ripple) {
        ripple.remove();
    }

    button.appendChild(circle);
}

// ========== 事件监听 ==========
/**
 * 设置所有事件监听器
 */
function setupEventListeners() {
    // 发送按钮点击事件
    const sendBtn = document.getElementById('sendBtn');
    if (sendBtn) {
        sendBtn.addEventListener('click', (e) => {
            const input = document.getElementById('danmakuInput');

            // 创建涟漪效果
            createRippleEffect(e);

            // 播放特殊音效
            playSound('send');

            // 发送弹幕
            if (input) {
                sendDanmaku(input.value);
            }
        });
    }

    // 输入框回车事件
    const danmakuInput = document.getElementById('danmakuInput');
    if (danmakuInput) {
        danmakuInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                sendDanmaku(danmakuInput.value);
            }
        });
    }

    // 快捷消息按钮事件
    document.querySelectorAll('.quick-btn').forEach((btn) => {
        btn.addEventListener('click', (e) => {
            const msg = btn.getAttribute('data-msg');

            // 创建涟漪效果
            createRippleEffect(e);

            // 播放音效
            playSound('button');

            // 发送弹幕
            sendDanmaku(msg || '');
        });

        // 移动端触摸反馈
        btn.addEventListener('touchstart', () => {
            btn.style.transform = 'scale(0.95)';
        });

        btn.addEventListener('touchend', () => {
            setTimeout(() => {
                btn.style.transform = '';
            }, 100);
        });
    });

    // 移动端触摸优化
    if ('ontouchstart' in window) {
        // 防止双击缩放
        let lastTouchEnd = 0;
        document.addEventListener('touchend', (event) => {
            const now = Date.now();
            if (now - lastTouchEnd <= 300) {
                event.preventDefault();
            }
            lastTouchEnd = now;
        }, false);

        // 输入框获得焦点时防止页面滚动
        if (danmakuInput) {
            danmakuInput.addEventListener('focus', () => {
                setTimeout(() => {
                    window.scrollTo(0, 0);
                }, 300);
            });
        }
    }
}

// ========== 键盘快捷键 ==========
document.addEventListener('keydown', (e) => {
    // ESC 键清空输入框
    if (e.key === 'Escape') {
        const input = document.getElementById('danmakuInput');
        if (input) {
            input.value = '';
        }
    }

    // Ctrl + Enter 发送特殊弹幕
    if (e.ctrlKey && e.key === 'Enter') {
        const specialMessages = [
            '(◕‿◕✿) 彩虹弹幕来袭！(◕‿◕✿)',
            'ovo 星光闪闪！ovo',
            'OwO 烟花绽放！OwO',
            '(✿◡‿◡) 魔法弹幕！(✿◡‿◡)',
        ];
        const randomMsg = specialMessages[Math.floor(Math.random() * specialMessages.length)];
        const specialTypes = ['rainbow', 'sparkle', 'firework'];
        const randomType = specialTypes[Math.floor(Math.random() * specialTypes.length)];

        createDanmaku(randomMsg, false, randomType);
        playSound('firework');
    }

    // Alt + F 触发烟花弹幕雨
    if (e.altKey && e.key.toLowerCase() === 'f') {
        e.preventDefault();
        triggerFireworkShow();
    }

    // Alt + S 切换音效
    if (e.altKey && e.key.toLowerCase() === 's') {
        e.preventDefault();
        CONFIG.soundEnabled = !CONFIG.soundEnabled;
        createDanmaku(
            CONFIG.soundEnabled ? 'ovo 音效已开启' : 'ovo 音效已关闭',
            false,
            'sparkle'
        );
    }
});

// ========== 页面可见性变化（节省性能）==========
document.addEventListener('visibilitychange', async () => {
    if (document.hidden) {
        // 页面隐藏时暂停自动弹幕和倒计时
        stopAutoDanmaku();
        stopCountdown();

        // 暂停音频上下文
        await suspendAudio();
    } else {
        // 页面显示时恢复自动弹幕和倒计时
        startAutoDanmaku();
        startCountdown();

        // 恢复音频上下文
        await resumeAudio();
    }
});

// ========== 页面卸载清理 ==========
window.addEventListener('beforeunload', async () => {
    // 清理倒计时
    stopCountdown();

    // 清理弹幕
    cleanupDanmaku();

    // 清理音频上下文
    await closeAudio();
});

// ========== 页面加载完成 ==========
document.addEventListener('DOMContentLoaded', () => {
    console.log('ovo 春节倒计时 - 二次元版 ovo');
    console.log('(✿◡‿◡) Made with OwO for iFlow 新春创造营 (✿◡‿◡)');

    // 初始化性能优化
    initDanmakuObserver();

    // 初始化音频（延迟到用户首次交互）
    document.addEventListener(
        'click',
        () => {
            initAudio();
        },
        { once: true }
    );

    // 启动倒计时
    startCountdown();

    // 启动自动弹幕
    startAutoDanmaku();

    // 设置事件监听
    setupEventListeners();

    // 设置彩蛋
    setupTitleEgg();

    // 添加页面加载动画
    document.body.style.opacity = '0';
    setTimeout(() => {
        document.body.style.transition = 'opacity 0.5s ease';
        document.body.style.opacity = '1';
    }, 100);
});

// ========== 导出配置（方便调试）==========
if (typeof window !== 'undefined') {
    window.DanmakuConfig = CONFIG;
}
