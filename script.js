// ========== Toast 通知系统 ==========

/**
 * Toast 通知类型
 * @enum {string}
 */
const ToastType = {
    SUCCESS: "success",
    ERROR: "error",
    WARNING: "warning",
    INFO: "info",
};

/**
 * Toast 通知管理类
 */
class ToastManager {
    /**
     * @param {string} containerId - Toast 容器的 DOM ID
     */
    constructor(containerId) {
        this.container = document.getElementById(containerId);
        this.toasts = [];
        this.maxToasts = 5;

        if (!this.container) {
            console.error(`Toast container with id "${containerId}" not found`);
        }
    }

    /**
     * 显示 Toast 通知
     * @param {string} message - 通知消息
     * @param {string} type - 通知类型 (success/error/warning/info)
     * @param {number} duration - 显示时长（毫秒），0 表示不自动关闭
     * @returns {HTMLElement|null} Toast 元素
     */
    show(message, type = ToastType.INFO, duration = 3000) {
        if (!this.container) {
            console.warn("Toast container not available, logging to console:", message);
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
        const toast = document.createElement("div");
        toast.className = `toast toast-${type}`;

        const iconMap = {
            success: "✅",
            error: "❌",
            warning: "⚠️",
            info: "ℹ️",
        };

        toast.innerHTML = `
            <span class="toast-icon">${iconMap[type] || iconMap.info}</span>
            <span class="toast-message">${this.escapeHtml(message)}</span>
            <button class="toast-close" aria-label="关闭">✕</button>
        `;

        // 关闭按钮事件
        const closeBtn = toast.querySelector(".toast-close");
        closeBtn.addEventListener("click", () => {
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

        toast.classList.add("toast-hiding");
        toast.addEventListener("animationend", () => {
            toast.remove();
            this.toasts = this.toasts.filter((t) => t !== toast);
        });
    }

    /**
     * 转义 HTML 特殊字符
     * @private
     * @param {string} text - 待转义的文本
     * @returns {string} 转义后的文本
     */
    escapeHtml(text) {
        const div = document.createElement("div");
        div.textContent = text;
        return div.innerHTML;
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

// 创建全局 Toast 实例
const toast = new ToastManager("toastContainer");

// ========== 配置 ==========
const CONFIG = {
    springFestival: new Date("2026-02-17T00:00:00"), // 2026年春节（马年正月初一）
    danmakuSpeed: 15000, // 弹幕移动时长（毫秒）
    danmakuInterval: 2000, // 自动发送弹幕间隔（毫秒）
    maxDanmakuOnScreen: 15, // 屏幕上最多同时显示的弹幕数
    defaultDanmaku: [
        "新年快乐！ovo",
        "恭喜发财！(✿◡‿◡)",
        "万事如意！OwO",
        "身体健康！(^_−)☆",
        "心想事成！(｡♥‿♥｡)",
        "阖家幸福！⊂((・▽・))⊃",
        "龙马精神！ovo",
        "岁岁平安！(´▽`ʃ♡ƪ)",
        "春节快乐！OwO",
        "吉祥如意！(✿◡‿◡)",
    ],
    soundEnabled: true, // 是否启用音效
    soundVolume: 0.3, // 音量（0-1）
};

// ========== 全局变量 ==========
let countdownInterval;
let autoDanmakuInterval;
let audioContext;
let isAudioInitialized = false;

// 倒计时彩蛋状态
let oneDayEggTriggered = false;
let oneMinuteEggTriggered = false;
let isLastMinute = false;

// ========== 优化后的倒计时功能 ==========
function updateCountdown() {
    try {
        const now = new Date();
        const diff = CONFIG.springFestival - now;

        if (diff <= 0) {
            // 春节到了 - 使用安全的 DOM 操作
            const countdownEl = document.getElementById("countdownText");
            if (countdownEl) {
                countdownEl.textContent = "🎊 2026 马年春节到啦！🎊";
            }
            clearInterval(countdownInterval);
            showNewYearMessage();
            return;
        }

        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((diff % (1000 * 60)) / 1000);

        // ========== 彩蛋检测：1天倒计时 ==========
        if (days === 1 && hours === 0 && !oneDayEggTriggered) {
            console.log("🎉 触发1天倒计时彩蛋！");
            triggerOneDayEgg();
        }

        // ========== 彩蛋检测：最后一分钟 ==========
        const lastMinute = days === 0 && hours === 0 && minutes === 0 && seconds <= 59;

        if (lastMinute && !isLastMinute) {
            isLastMinute = true;
            console.log("⏰ 进入最后一分钟！");
            triggerLastMinuteAnimation();
        } else if (!lastMinute && isLastMinute) {
            isLastMinute = false;
            removeLastMinuteAnimation();
        }

        // 只在秒数变化时更新显示（减少DOM操作）
        if (window.lastSeconds !== seconds) {
            window.lastSeconds = seconds;

            const countdownElement = document.getElementById("countdownText");

            // 检查元素是否存在
            if (!countdownElement) {
                console.error("找不到倒计时元素 #countdownText");
                return;
            }

            const timeValues = [days, hours, minutes, seconds];
            const timeLabels = ["天", "小时", "分钟", "秒"];

            // 清空现有内容
            countdownElement.textContent = "";

            // 安全地创建倒计时元素
            timeValues.forEach((value, index) => {
                const span = document.createElement("span");
                span.className = "countdown-number";
                span.setAttribute("data-value", value);
                span.textContent = value;

                // 检查数字是否变化
                const existingNumbers = countdownElement.querySelectorAll(".countdown-number");
                if (existingNumbers[index]) {
                    const oldValue = parseInt(existingNumbers[index].getAttribute("data-value"));
                    if (oldValue !== value) {
                        // 数字变化时添加动画
                        span.classList.add("number-changed");
                        span.style.transform = "scale(1.2) rotateY(360deg)";
                        span.style.color = "#FF6B6B";

                        setTimeout(() => {
                            span.classList.remove("number-changed");
                            span.style.transform = "scale(1) rotateY(0deg)";
                            span.style.color = "";
                        }, 500);
                    }
                }

                countdownElement.appendChild(span);

                // 添加标签（除了最后一个）
                if (index < timeLabels.length - 1) {
                    const label = document.createTextNode(timeLabels[index] + " ");
                    countdownElement.appendChild(label);
                } else {
                    const label = document.createTextNode(timeLabels[index]);
                    countdownElement.appendChild(label);
                }
            });
        }
    } catch (error) {
        console.error("倒计时更新错误:", error);
    }
}

function startCountdown() {
    console.log("启动倒计时，春节日期:", CONFIG.springFestival);

    try {
        updateCountdown(); // 立即执行一次
        countdownInterval = setInterval(updateCountdown, 1000);
        console.log("倒计时已启动，interval ID:", countdownInterval);
    } catch (error) {
        console.error("启动倒计时失败:", error);
    }
}

// ========== 性能优化工具函数 ==========
function throttle(func, limit) {
    let inThrottle;
    return function () {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(() => (inThrottle = false), limit);
        }
    };
}

function debounce(func, wait) {
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

// 使用 Intersection Observer 优化弹幕创建
let danmakuObserver;
function initDanmakuObserver() {
    if ("IntersectionObserver" in window) {
        danmakuObserver = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    entry.target.style.visibility = "visible";
                } else {
                    entry.target.style.visibility = "hidden";
                }
            });
        });
    }
}

// ========== 优化后的弹幕功能 ==========
function createDanmaku(text, isAuto = false, specialType = null) {
    const container = document.getElementById("danmakuContainer");

    // 检查屏幕上的弹幕数量
    if (container.children.length >= CONFIG.maxDanmakuOnScreen) {
        // 移除最老的弹幕
        const oldestDanmaku = container.firstChild;
        if (oldestDanmaku) {
            oldestDanmaku.remove();
        }
    }

    const danmaku = document.createElement("div");
    danmaku.className = "danmaku";
    danmaku.textContent = text;

    // 扩展的弹幕样式
    const styles = ["style-1", "style-2", "style-3", "style-4", "style-5", "style-6"];
    let randomStyle = styles[Math.floor(Math.random() * styles.length)];

    // 特殊类型弹幕
    if (specialType === "firework") {
        randomStyle = "firework-style";
    } else if (specialType === "rainbow") {
        randomStyle = "rainbow-style";
    } else if (specialType === "sparkle") {
        randomStyle = "sparkle-style";
    }

    danmaku.classList.add(randomStyle);

    // 使用 will-change 优化动画性能
    danmaku.style.willChange = "transform";

    // 随机垂直位置（避免顶部和底部）
    const topPosition = Math.random() * 60 + 15; // 15% - 75%
    danmaku.style.top = `${topPosition}%`;

    // 随机速度（基础速度 ± 40%）
    const speed = CONFIG.danmakuSpeed * (0.6 + Math.random() * 0.8);
    danmaku.style.animationDuration = `${speed}ms`;

    // 随机大小
    const fontSize = 16 + Math.random() * 8; // 16-24px
    danmaku.style.fontSize = `${fontSize}px`;

    // 设置初始位置在屏幕右侧外（使用transform而不是left）
    danmaku.style.transform = "translateX(100vw)";

    // 添加旋转效果（随机）
    if (Math.random() > 0.7) {
        const rotation = Math.random() * 20 - 10;
        danmaku.classList.add("rotated");
        danmaku.style.setProperty("--rotation", `${rotation}deg`);
        // 更新动画为带旋转的版本
        danmaku.style.animationName = "danmaku-move-rotated";
    }

    container.appendChild(danmaku);

    // 动画结束后移除弹幕并清理
    const cleanup = () => {
        danmaku.remove();
        if (danmakuObserver) {
            danmakuObserver.unobserve(danmaku);
        }
    };

    danmaku.addEventListener("animationend", cleanup);

    // 使用 Intersection Observer 优化性能
    if (danmakuObserver) {
        danmakuObserver.observe(danmaku);
    }

    // 弹幕不播放音效（避免过于频繁）
}

function sendDanmaku(text) {
    if (!text || text.trim() === "") {
        return;
    }

    // 添加发送动画效果
    createDanmaku(text.trim());

    // 清空输入框
    document.getElementById("danmakuInput").value = "";

    // 添加按钮点击效果
    const btn = document.getElementById("sendBtn");
    btn.style.transform = "scale(0.95)";
    setTimeout(() => {
        btn.style.transform = "";
    }, 100);
}

function startAutoDanmaku() {
    // 初始发送几条弹幕
    for (let i = 0; i < 5; i++) {
        setTimeout(() => {
            const randomMsg =
                CONFIG.defaultDanmaku[Math.floor(Math.random() * CONFIG.defaultDanmaku.length)];
            createDanmaku(randomMsg, true);
        }, i * 500);
    }

    // 定时发送随机弹幕
    autoDanmakuInterval = setInterval(() => {
        const randomMsg =
            CONFIG.defaultDanmaku[Math.floor(Math.random() * CONFIG.defaultDanmaku.length)];
        createDanmaku(randomMsg, true);
    }, CONFIG.danmakuInterval);
}

// ========== 涟漪效果函数 ==========
function createRippleEffect(event) {
    const button = event.currentTarget;
    const circle = document.createElement("span");
    const diameter = Math.max(button.clientWidth, button.clientHeight);
    const radius = diameter / 2;

    const rect = button.getBoundingClientRect();

    circle.style.width = circle.style.height = `${diameter}px`;
    circle.style.left = `${event.clientX - rect.left - radius}px`;
    circle.style.top = `${event.clientY - rect.top - radius}px`;
    circle.classList.add("ripple");

    // 移除旧的涟漪
    const ripple = button.getElementsByClassName("ripple")[0];
    if (ripple) {
        ripple.remove();
    }

    button.appendChild(circle);
}

// ========== 事件监听 ==========
function setupEventListeners() {
    // 发送按钮点击事件
    document.getElementById("sendBtn").addEventListener("click", (e) => {
        const input = document.getElementById("danmakuInput");

        // 创建涟漪效果
        createRippleEffect(e);

        // 播放特殊音效
        playSound("send");

        // 发送弹幕
        sendDanmaku(input.value);
    });

    // 输入框回车事件
    document.getElementById("danmakuInput").addEventListener("keypress", (e) => {
        if (e.key === "Enter") {
            const input = document.getElementById("danmakuInput");
            sendDanmaku(input.value);
        }
    });

    // 快捷消息按钮事件
    document.querySelectorAll(".quick-btn").forEach((btn) => {
        btn.addEventListener("click", (e) => {
            const msg = btn.getAttribute("data-msg");

            // 创建涟漪效果
            createRippleEffect(e);

            // 播放音效
            playSound("button");

            // 发送弹幕
            sendDanmaku(msg);
        });

        // 移动端触摸反馈
        btn.addEventListener("touchstart", () => {
            btn.style.transform = "scale(0.95)";
        });

        btn.addEventListener("touchend", () => {
            setTimeout(() => {
                btn.style.transform = "";
            }, 100);
        });
    });

    // 移动端触摸优化
    if ("ontouchstart" in window) {
        // 防止双击缩放
        let lastTouchEnd = 0;
        document.addEventListener(
            "touchend",
            (event) => {
                const now = new Date().getTime();
                if (now - lastTouchEnd <= 300) {
                    event.preventDefault();
                }
                lastTouchEnd = now;
            },
            false
        );

        // 输入框获得焦点时防止页面滚动
        const input = document.getElementById("danmakuInput");
        input.addEventListener("focus", () => {
            setTimeout(() => {
                window.scrollTo(0, 0);
            }, 300);
        });
    }
}

// ========== 新年祝福 ==========
function showNewYearMessage() {
    const messages = [
        "ovo 新年到！新年到！ovo",
        "OwO 2026 马年快乐！OwO",
        "(✿◡‿◡) 恭喜发财，万事如意！(✿◡‿◡)",
        "(｡♥‿♥｡) 祝你马年大吉！(｡♥‿♥｡)",
    ];

    messages.forEach((msg, index) => {
        setTimeout(() => {
            createDanmaku(msg);
        }, index * 500);
    });

    // 修改副标题 - 使用安全的 DOM 操作
    const subtitle = document.querySelector(".subtitle");
    subtitle.textContent = "";
    subtitle.appendChild(createSpan("ovo", "sparkle"));
    subtitle.appendChild(createSpan("新年快乐！万事如意！"));
    subtitle.appendChild(createSpan("ovo", "sparkle"));
}

/**
 * 创建 span 元素的辅助函数
 * @param {string} text - 文本内容
 * @param {string} className - CSS 类名（可选）
 * @returns {HTMLSpanElement} span 元素
 */
function createSpan(text, className = "") {
    const span = document.createElement("span");
    span.textContent = text;
    if (className) {
        span.className = className;
    }
    return span;
}

// ========== 页面加载完成 ==========
document.addEventListener("DOMContentLoaded", () => {
    console.log("========================================");
    console.log("ovo 春节倒计时 - 二次元版 ovo");
    console.log("(✿◡‿◡) Made with OwO for iFlow 新春创造营 (✿◡‿◡)");
    console.log("========================================");

    // 检查关键元素是否存在
    const countdownText = document.getElementById("countdownText");
    const danmakuContainer = document.getElementById("danmakuContainer");
    const danmakuInput = document.getElementById("danmakuInput");
    const sendBtn = document.getElementById("sendBtn");

    console.log("DOM 元素检查:");
    console.log("- countdownText:", countdownText ? "✓" : "✗");
    console.log("- danmakuContainer:", danmakuContainer ? "✓" : "✗");
    console.log("- danmakuInput:", danmakuInput ? "✓" : "✗");
    console.log("- sendBtn:", sendBtn ? "✓" : "✗");

    if (!countdownText) {
        console.error("严重错误：找不到倒计时元素！");
        return;
    }

    // 初始化性能优化
    initDanmakuObserver();
    window.lastSeconds = -1; // 用于倒计时优化

    // 初始化音频（延迟到用户首次交互）
    document.addEventListener(
        "click",
        () => {
            if (!isAudioInitialized) {
                console.log("用户点击，初始化音频...");
                initAudio();
            }
        },
        { once: true }
    );

    // 启动倒计时
    console.log("准备启动倒计时...");
    startCountdown();

    // 启动自动弹幕
    startAutoDanmaku();

    // 设置事件监听
    setupEventListeners();

    // 添加页面加载动画
    document.body.style.opacity = "0";
    setTimeout(() => {
        document.body.style.transition = "opacity 0.5s ease";
        document.body.style.opacity = "1";
    }, 100);

    console.log("========================================");
    console.log("初始化完成！");
    console.log("========================================");
});

// ========== 页面可见性变化（节省性能）==========
document.addEventListener("visibilitychange", () => {
    if (document.hidden) {
        // 页面隐藏时暂停自动弹幕和倒计时
        clearInterval(autoDanmakuInterval);
        clearInterval(countdownInterval);

        // 暂停音频上下文
        if (audioContext && audioContext.state === "running") {
            audioContext.suspend();
        }
    } else {
        // 页面显示时恢复自动弹幕和倒计时
        startAutoDanmaku();
        startCountdown();

        // 恢复音频上下文
        if (audioContext && audioContext.state === "suspended") {
            audioContext.resume();
        }
    }
});

// ========== 页面卸载清理 ==========
window.addEventListener("beforeunload", () => {
    // 清理定时器
    clearInterval(countdownInterval);
    clearInterval(autoDanmakuInterval);

    // 清理音频上下文
    if (audioContext) {
        audioContext.close();
    }

    // 清理观察器
    if (danmakuObserver) {
        danmakuObserver.disconnect();
    }

    // 清理所有弹幕
    const container = document.getElementById("danmakuContainer");
    if (container) {
        container.textContent = "";
    }
});

// ========== 键盘快捷键 ==========
document.addEventListener("keydown", (e) => {
    // ESC 键清空输入框
    if (e.key === "Escape") {
        document.getElementById("danmakuInput").value = "";
    }

    // Ctrl + Enter 发送特殊弹幕
    if (e.ctrlKey && e.key === "Enter") {
        const specialMessages = [
            "(◕‿◕✿) 彩虹弹幕来袭！(◕‿◕✿)",
            "ovo 星光闪闪！ovo",
            "OwO 烟花绽放！OwO",
            "(✿◡‿◡) 魔法弹幕！(✿◡‿◡)",
        ];
        const randomMsg = specialMessages[Math.floor(Math.random() * specialMessages.length)];
        const specialTypes = ["rainbow", "sparkle", "firework"];
        const randomType = specialTypes[Math.floor(Math.random() * specialTypes.length)];

        createDanmaku(randomMsg, false, randomType);
        playSound("firework");
    }

    // Alt + F 触发烟花弹幕雨
    if (e.altKey && e.key.toLowerCase() === "f") {
        e.preventDefault();
        triggerFireworkShow();
    }

    // Alt + S 切换音效
    if (e.altKey && e.key.toLowerCase() === "s") {
        e.preventDefault();
        CONFIG.soundEnabled = !CONFIG.soundEnabled;
        createDanmaku(CONFIG.soundEnabled ? "ovo 音效已开启" : "ovo 音效已关闭", false, "sparkle");
    }
});

// ========== 特殊彩蛋功能 ==========
function triggerFireworkShow() {
    const fireworkMessages = [
        "ovo 烟花秀开始！ovo",
        "(✿◡‿◡) 绚丽多彩！(✿◡‿◡)",
        "(｡♥‿♥｡) 璀璨夺目！(｡♥‿♥｡)",
        "OwO 庆祝时刻！OwO",
    ];

    for (let i = 0; i < 20; i++) {
        setTimeout(() => {
            const msg = fireworkMessages[Math.floor(Math.random() * fireworkMessages.length)];
            createDanmaku(msg, false, "firework");

            if (i % 3 === 0) {
                playSound("firework");
            }
        }, i * 150);
    }
}

// 鼠标跟随特效
let mouseFollowEnabled = false;
document.addEventListener("mousemove", (e) => {
    if (!mouseFollowEnabled) return;

    if (Math.random() > 0.95) {
        // 5% 概率触发
        const sparkle = document.createElement("div");
        sparkle.textContent = "ovo"; // 使用 textContent 而不是 innerHTML
        sparkle.style.position = "fixed";
        sparkle.style.left = e.clientX + "px";
        sparkle.style.top = e.clientY + "px";
        sparkle.style.pointerEvents = "none";
        sparkle.style.zIndex = "1000";
        sparkle.style.fontSize = "20px";
        sparkle.style.animation = "mouse-sparkle 1s ease-out forwards";

        document.body.appendChild(sparkle);

        setTimeout(() => {
            sparkle.remove();
        }, 1000);
    }
});

// 双击背景切换鼠标跟随
let lastClickTime = 0;
document.addEventListener("click", (e) => {
    const currentTime = Date.now();

    if (currentTime - lastClickTime < 300) {
        // 双击事件
        if (e.target === document.body || e.target.classList.contains("stars-container")) {
            mouseFollowEnabled = !mouseFollowEnabled;
            createDanmaku(
                mouseFollowEnabled ? "ovo 鼠标跟随已开启" : "ovo 鼠标跟随已关闭",
                false,
                "sparkle"
            );
        }
    }

    lastClickTime = currentTime;
});

// 添加鼠标跟随动画样式
const sparkleStyle = document.createElement("style");
sparkleStyle.textContent = `
    @keyframes mouse-sparkle {
        0% {
            transform: scale(0) rotate(0deg);
            opacity: 1;
        }
        50% {
            transform: scale(1.2) rotate(180deg);
            opacity: 0.8;
        }
        100% {
            transform: scale(0) rotate(360deg);
            opacity: 0;
        }
    }
`;
document.head.appendChild(sparkleStyle);

// ========== 音效系统 ==========
/**
 * 初始化音频上下文
 * @returns {boolean} 初始化是否成功
 */
function initAudio() {
    if (isAudioInitialized) {
        console.log("音频已初始化，跳过");
        return true;
    }

    console.log("开始初始化音频系统...");

    try {
        // 检查浏览器支持
        if (!(window.AudioContext || window.webkitAudioContext)) {
            throw new Error("您的浏览器不支持 Web Audio API");
        }

        audioContext = new (window.AudioContext || window.webkitAudioContext)();
        isAudioInitialized = true;

        console.log("✓ 音频系统初始化成功");
        toast.show("音效系统已启用", ToastType.SUCCESS, 2000);
        return true;
    } catch (e) {
        console.error("✗ 音频上下文初始化失败:", e);

        // 禁用音效并通知用户
        CONFIG.soundEnabled = false;

        // 只在首次初始化时显示错误提示
        if (!window.audioErrorShown) {
            toast.show(`音效初始化失败: ${e.message}。已自动禁用音效。`, ToastType.WARNING, 5000);
            window.audioErrorShown = true;
        }

        return false;
    }
}

/**
 * 播放音效
 * @param {string} type - 音效类型
 * @returns {boolean} 播放是否成功
 */
function playSound(type) {
    // 调试日志
    if (window.debugSound) {
        console.log("playSound 被调用:", type, {
            soundEnabled: CONFIG.soundEnabled,
            audioContext: !!audioContext,
            audioContextState: audioContext?.state,
        });
    }

    if (!CONFIG.soundEnabled) {
        if (window.debugSound) console.log("音效被禁用");
        return false;
    }

    if (!audioContext) {
        if (window.debugSound) console.log("音频上下文未初始化");
        return false;
    }

    // 确保音频上下文处于运行状态
    if (audioContext.state === "suspended") {
        if (window.debugSound) console.log("音频上下文被暂停，尝试恢复...");
        audioContext.resume().catch((err) => {
            console.warn("无法恢复音频上下文:", err);
        });
    }

    try {
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();

        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);

        // 设置音量并立即开始衰减
        gainNode.gain.setValueAtTime(CONFIG.soundVolume, audioContext.currentTime);
        gainNode.gain.linearRampToValueAtTime(0.001, audioContext.currentTime + 0.1);

        // 根据类型设置频率
        switch (type) {
            case "danmaku":
                oscillator.frequency.setValueAtTime(800, audioContext.currentTime);
                oscillator.frequency.linearRampToValueAtTime(1200, audioContext.currentTime + 0.05);
                break;
            case "button":
                oscillator.frequency.setValueAtTime(600, audioContext.currentTime);
                oscillator.frequency.linearRampToValueAtTime(900, audioContext.currentTime + 0.05);
                break;
            case "send":
                // 发送按钮特殊音效 - 水滴效果
                oscillator.frequency.setValueAtTime(1200, audioContext.currentTime);
                oscillator.frequency.linearRampToValueAtTime(1800, audioContext.currentTime + 0.1);
                oscillator.frequency.linearRampToValueAtTime(600, audioContext.currentTime + 0.2);
                break;
            case "firework":
                oscillator.frequency.setValueAtTime(400, audioContext.currentTime);
                oscillator.frequency.linearRampToValueAtTime(1600, audioContext.currentTime + 0.1);
                break;
            case "celebration":
                oscillator.frequency.setValueAtTime(523, audioContext.currentTime);
                oscillator.frequency.setValueAtTime(659, audioContext.currentTime + 0.05);
                oscillator.frequency.setValueAtTime(784, audioContext.currentTime + 0.1);
                break;
            default:
                console.warn(`未知的音效类型: ${type}`);
                return false;
        }

        // 开始播放
        oscillator.start(audioContext.currentTime);

        // 立即停止播放
        oscillator.stop(audioContext.currentTime + 0.1);

        // 断开连接
        setTimeout(() => {
            try {
                oscillator.disconnect();
                gainNode.disconnect();
            } catch (e) {
                // 忽略断开连接时的错误
            }
        }, 150);

        return true;
    } catch (e) {
        console.error("音效播放失败:", e);
        // 静默失败，避免频繁弹窗
        return false;
    }
}

// ========== 工具函数 ==========
// 添加彩蛋：连续点击标题
let titleClickCount = 0;
document.querySelector(".main-title")?.addEventListener("click", () => {
    titleClickCount++;
    if (titleClickCount >= 5) {
        // 触发彩蛋
        const surpriseMessages = [
            "ovo 你发现了隐藏的彩蛋！ovo",
            "(✿◡‿◡) 祝你马年行大运！(✿◡‿◡)",
            "OwO 一码当先，码到成功！OwO",
            "(｡♥‿♥｡) 马年到，福气到！(｡♥‿♥｡)",
        ];
        for (let i = 0; i < 10; i++) {
            setTimeout(() => {
                const msg = surpriseMessages[Math.floor(Math.random() * surpriseMessages.length)];
                createDanmaku(msg, false, "firework");
            }, i * 200);
        }

        // 播放庆祝音效
        playSound("celebration");
        titleClickCount = 0;
    }
});

// ========== 倒计时彩蛋函数 ==========

/**
 * 触发1天倒计时彩蛋
 */
function triggerOneDayEgg() {
    oneDayEggTriggered = true;
    console.log("🎉 触发1天倒计时彩蛋！");

    // 显示提示
    const toastContainer = document.getElementById("toastContainer");
    if (toastContainer) {
        const toastDiv = document.createElement("div");
        toastDiv.className = "toast toast-info toast-countdown-egg";
        toastDiv.innerHTML = `
            <span class="toast-icon">🎊</span>
            <span class="toast-message">距离春节还有1天！马年即将到来！🐴</span>
        `;
        toastContainer.appendChild(toastDiv);

        setTimeout(() => {
            toastDiv.remove();
        }, 5000);
    }

    // 触发烟花弹幕
    const oneDayMessages = [
        "🎊 明天就是春节啦！ovo",
        "🐴 马年最后一天！OwO",
        "(✿◡‿◡) 跨年倒计时！24小时！(✿◡‿◡)",
        "🎆 准备迎接马年！一码当先！🎆",
        "(｡♥‿♥｡) 新年快乐！倒计时1天！(｡♥‿♥｡)",
    ];

    // 连续发送15条特殊弹幕
    for (let i = 0; i < 15; i++) {
        setTimeout(() => {
            const msg = oneDayMessages[Math.floor(Math.random() * oneDayMessages.length)];
            createDanmaku(msg, false, "firework");
        }, i * 800);
    }

    // 触发烟花秀
    setTimeout(() => {
        triggerFireworkShow();
    }, 3000);

    // 添加页面特殊效果
    document.body.classList.add("countdown-one-day-egg");

    // 播放特殊音效
    playSound("celebration");
}

/**
 * 触发最后一分钟的动画效果
 */
function triggerLastMinuteAnimation() {
    oneMinuteEggTriggered = true;
    console.log("⏰ 进入最后一分钟！");

    // 显示提示
    const toastContainer = document.getElementById("toastContainer");
    if (toastContainer) {
        const toastDiv = document.createElement("div");
        toastDiv.className = "toast toast-success toast-last-minute";
        toastDiv.innerHTML = `
            <span class="toast-icon">⏰</span>
            <span class="toast-message">最后1分钟！准备迎接春节！🎊</span>
        `;
        toastContainer.appendChild(toastDiv);

        setTimeout(() => {
            toastDiv.remove();
        }, 4000);
    }

    // 添加最后一分钟的动画类
    const countdownWrapper = document.querySelector(".countdown-wrapper");
    if (countdownWrapper) {
        countdownWrapper.classList.add("last-minute-countdown");
    }

    // 触发倒计时数字的特殊动画
    const countdownText = document.getElementById("countdownText");
    if (countdownText) {
        countdownText.classList.add("final-countdown-pulse");
    }

    // 添加心跳效果到倒计时容器
    const animeBorder = document.querySelector(".anime-border");
    if (animeBorder) {
        animeBorder.classList.add("urgent-border");
    }

    // 播放提示音效
    playSound("button");

    // 发送提示弹幕
    createDanmaku("⏰ 最后1分钟！倒计时进入冲刺阶段！ovo", false, "sparkle");
}

/**
 * 移除最后一分钟的动画效果
 */
function removeLastMinuteAnimation() {
    const countdownWrapper = document.querySelector(".countdown-wrapper");
    if (countdownWrapper) {
        countdownWrapper.classList.remove("last-minute-countdown");
    }

    const countdownText = document.getElementById("countdownText");
    if (countdownText) {
        countdownText.classList.remove("final-countdown-pulse");
    }

    const animeBorder = document.querySelector(".anime-border");
    if (animeBorder) {
        animeBorder.classList.remove("urgent-border");
    }
}

// ========== 测试彩蛋功能（供开发调试使用）==========
/**
 * 手动触发1天彩蛋（用于测试）
 */
window.testOneDayEgg = function () {
    console.log("手动触发1天彩蛋测试...");
    triggerOneDayEgg();
};

/**
 * 手动触发最后一分钟彩蛋（用于测试）
 */
window.testLastMinuteEgg = function () {
    console.log("手动触发最后一分钟彩蛋测试...");
    isLastMinute = false; // 重置状态
    triggerLastMinuteAnimation();
};

/**
 * 模拟倒计时到指定时间（用于测试）
 * @param {number} days - 天数
 * @param {number} hours - 小时数
 * @param {number} minutes - 分钟数
 * @param {number} seconds - 秒数
 */
window.simulateCountdown = function (days, hours, minutes, seconds) {
    const now = new Date();
    const simulatedSpringFestival = new Date(
        now.getTime() +
            days * 24 * 60 * 60 * 1000 +
            hours * 60 * 60 * 1000 +
            minutes * 60 * 1000 +
            seconds * 1000
    );

    console.log("模拟春节时间:", simulatedSpringFestival);
    CONFIG.springFestival = simulatedSpringFestival;

    // 重置彩蛋状态
    oneDayEggTriggered = false;
    isLastMinute = false;

    console.log("倒计时已设置为:", days, "天", hours, "小时", minutes, "分钟", seconds, "秒");
    console.log("提示：");
    console.log("- 测试1天彩蛋: simulateCountdown(1, 0, 0, 0)");
    console.log("- 测试1分钟彩蛋: simulateCountdown(0, 0, 0, 59)");
    console.log("- 手动触发: testOneDayEgg() 或 testLastMinuteEgg()");
};

// 导出配置（方便调试）
window.DanmakuConfig = CONFIG;
