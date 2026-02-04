/**
 * 倒计时核心模块
 * @module countdown
 */

import { CONFIG } from "../utils/config.js";
import { createSpan } from "../utils/helpers.js";
import { createDanmaku, triggerFireworkShow } from "./danmaku.js";

/** @type {number|null} */
let countdownInterval = null;

/** @type {number} */
let lastSeconds = -1;

/** @type {boolean} */
let oneDayEggTriggered = false;

/** @type {boolean} */
let oneMinuteEggTriggered = false;

/** @type {boolean} */
let isLastMinute = false;

/**
 * 新年消息回调（延迟设置以避免循环依赖）
 * @type {Function|null}
 */
let newYearCallback = null;

/**
 * 设置新年消息回调
 * @param {Function} callback - 回调函数
 */
export function setNewYearCallback(callback) {
    newYearCallback = callback;
}

/**
 * 更新倒计时显示
 */
function updateCountdown() {
    const now = new Date();
    const diff = CONFIG.springFestival - now;

    // 调试信息
    if (window.debugCountdown) {
        console.log("倒计时更新:", {
            now,
            springFestival: CONFIG.springFestival,
            diff,
            days: Math.floor(diff / (1000 * 60 * 60 * 24)),
        });
    }

    if (diff <= 0) {
        // 春节到了 - 使用安全的 DOM 操作
        const countdownEl = document.getElementById("countdownText");
        if (countdownEl) {
            countdownEl.textContent = "🎊 2026 马年春节到啦！🎊";
        }
        stopCountdown();
        if (newYearCallback) {
            newYearCallback();
        }
        return;
    }

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diff % (1000 * 60)) / 1000);

    // 检测是否触发1天彩蛋（24小时内）
    if (days === 1 && hours === 0 && !oneDayEggTriggered) {
        triggerOneDayEgg();
    }

    // 检测是否进入最后一分钟
    const lastMinute = days === 0 && hours === 0 && minutes === 0 && seconds <= 59;

    if (lastMinute && !isLastMinute) {
        isLastMinute = true;
        triggerLastMinuteAnimation();
    } else if (!lastMinute) {
        isLastMinute = false;
        removeLastMinuteAnimation();
    }

    // 只在秒数变化时更新显示（减少DOM操作）
    if (lastSeconds !== seconds) {
        lastSeconds = seconds;

        const countdownElement = document.getElementById("countdownText");

        // 检查元素是否存在
        if (!countdownElement) {
            console.warn("countdownText element not found");
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
            span.setAttribute("data-value", String(value));
            span.textContent = String(value);

            // 检查数字是否变化
            const existingNumbers = countdownElement.querySelectorAll(".countdown-number");
            if (existingNumbers[index]) {
                const oldValue = parseInt(existingNumbers[index].getAttribute("data-value") || "0");
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
}

/**
 * 启动倒计时
 */
export function startCountdown() {
    console.log("启动倒计时...");
    console.log("春节日期:", CONFIG.springFestival);

    // 立即执行一次
    updateCountdown();

    // 每秒更新
    countdownInterval = setInterval(updateCountdown, 1000);
    console.log("倒计时已启动，interval ID:", countdownInterval);
}

/**
 * 停止倒计时
 */
export function stopCountdown() {
    if (countdownInterval) {
        clearInterval(countdownInterval);
        countdownInterval = null;
    }
}

/**
 * 重置倒计时状态
 */
export function resetCountdown() {
    lastSeconds = -1;
}

/**
 * 获取当前倒计时值
 * @returns {{days: number, hours: number, minutes: number, seconds: number, total: number}}
 */
export function getCountdown() {
    const now = new Date();
    const diff = CONFIG.springFestival - now;

    if (diff <= 0) {
        return { days: 0, hours: 0, minutes: 0, seconds: 0, total: 0 };
    }

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diff % (1000 * 60)) / 1000);

    return { days, hours, minutes, seconds, total: diff };
}

/**
 * 触发1天倒计时彩蛋
 */
function triggerOneDayEgg() {
    oneDayEggTriggered = true;
    console.log("🎉 触发1天倒计时彩蛋！");

    // 显示提示
    const toast = document.getElementById("toastContainer");
    if (toast) {
        const toastDiv = document.createElement("div");
        toastDiv.className = "toast toast-info toast-countdown-egg";
        toastDiv.innerHTML = `
            <span class="toast-icon">🎊</span>
            <span class="toast-message">距离春节还有1天！马年即将到来！🐴</span>
        `;
        toast.appendChild(toastDiv);

        setTimeout(() => toastDiv.remove(), 5000);
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
}

/**
 * 触发最后一分钟的动画效果
 */
function triggerLastMinuteAnimation() {
    oneMinuteEggTriggered = true;
    console.log("⏰ 进入最后一分钟！");

    // 显示提示
    const toast = document.getElementById("toastContainer");
    if (toast) {
        const toastDiv = document.createElement("div");
        toastDiv.className = "toast toast-success toast-last-minute";
        toastDiv.innerHTML = `
            <span class="toast-icon">⏰</span>
            <span class="toast-message">最后1分钟！准备迎接春节！🎊</span>
        `;
        toast.appendChild(toastDiv);

        setTimeout(() => toastDiv.remove(), 4000);
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
