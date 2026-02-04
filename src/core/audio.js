/**
 * 音效管理模块
 * @module audio
 */

import { CONFIG } from '../utils/config.js';
import { toast } from '../ui/toast.js';

/** @type {AudioContext|null} */
let audioContext = null;

/** @type {boolean} */
let isAudioInitialized = false;

/** @type {boolean} */
let audioErrorShown = false;

/**
 * 初始化音频上下文
 * @param {boolean} [showNotification=true] - 是否显示通知
 * @returns {boolean} 初始化是否成功
 */
export function initAudio(showNotification = true) {
    if (isAudioInitialized) {
        return true;
    }

    try {
        // 检查浏览器支持
        if (!(window.AudioContext || window.webkitAudioContext)) {
            throw new Error('您的浏览器不支持 Web Audio API');
        }

        audioContext = new (window.AudioContext || window.webkitAudioContext)();
        isAudioInitialized = true;

        if (showNotification) {
            toast.show('音效系统已启用', 'success', 2000);
        }
        return true;
    } catch (e) {
        console.error('音频上下文初始化失败:', e);

        // 禁用音效并通知用户
        CONFIG.soundEnabled = false;

        // 只在首次初始化时显示错误提示
        if (!audioErrorShown && showNotification) {
            toast.show(`音效初始化失败: ${e.message}。已自动禁用音效。`, 'warning', 5000);
            audioErrorShown = true;
        }

        return false;
    }
}

/**
 * 播放音效
 * @param {string} type - 音效类型 (danmaku/button/send/firework/celebration)
 * @returns {Promise<boolean>} 播放是否成功
 */
export async function playSound(type) {
    // 如果音效被禁用，直接返回
    if (!CONFIG.soundEnabled) {
        return false;
    }

    // 如果音频未初始化，尝试初始化（不显示通知）
    if (!audioContext) {
        const initialized = await initAudio(false);
        if (!initialized) {
            return false;
        }
    }

    // 确保音频上下文处于运行状态
    if (audioContext.state === 'suspended') {
        try {
            await audioContext.resume();
        } catch (err) {
            console.warn('无法恢复音频上下文:', err);
            return false;
        }
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
            case 'danmaku':
                oscillator.frequency.setValueAtTime(800, audioContext.currentTime);
                oscillator.frequency.linearRampToValueAtTime(1200, audioContext.currentTime + 0.05);
                break;
            case 'button':
                oscillator.frequency.setValueAtTime(600, audioContext.currentTime);
                oscillator.frequency.linearRampToValueAtTime(900, audioContext.currentTime + 0.05);
                break;
            case 'send':
                // 发送按钮特殊音效 - 水滴效果
                oscillator.frequency.setValueAtTime(1200, audioContext.currentTime);
                oscillator.frequency.linearRampToValueAtTime(1800, audioContext.currentTime + 0.1);
                oscillator.frequency.linearRampToValueAtTime(600, audioContext.currentTime + 0.2);
                break;
            case 'firework':
                oscillator.frequency.setValueAtTime(400, audioContext.currentTime);
                oscillator.frequency.linearRampToValueAtTime(1600, audioContext.currentTime + 0.1);
                break;
            case 'celebration':
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
        console.error('音效播放失败:', e);
        return false;
    }
}

/**
 * 暂停音频上下文
 * @returns {Promise<void>}
 */
export async function suspendAudio() {
    if (audioContext && audioContext.state === 'running') {
        await audioContext.suspend();
    }
}

/**
 * 恢复音频上下文
 * @returns {Promise<void>}
 */
export async function resumeAudio() {
    if (audioContext && audioContext.state === 'suspended') {
        await audioContext.resume();
    }
}

/**
 * 关闭音频上下文
 * @returns {Promise<void>}
 */
export async function closeAudio() {
    if (audioContext) {
        await audioContext.close();
        audioContext = null;
        isAudioInitialized = false;
    }
}

/**
 * 检查音频是否已初始化
 * @returns {boolean}
 */
export function isAudioReady() {
    return isAudioInitialized && audioContext !== null;
}
