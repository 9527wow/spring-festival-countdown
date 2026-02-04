/**
 * Vitest 测试设置文件
 * @vitest-environment jsdom
 */

import { beforeEach, afterEach, vi } from 'vitest';

// 模拟 localStorage
const localStorageMock = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn(),
};

global.localStorage = localStorageMock;

// 模拟 requestAnimationFrame
global.requestAnimationFrame = (callback) => {
  return setTimeout(callback, 16);
};

global.cancelAnimationFrame = (id) => {
  clearTimeout(id);
};

// 模拟 AudioContext
class AudioContextMock {
  constructor() {
    this.state = 'running';
  }

  createOscillator() {
    return {
      connect: vi.fn(),
      start: vi.fn(),
      stop: vi.fn(),
      disconnect: vi.fn(),
      frequency: {
        setValueAtTime: vi.fn(),
        linearRampToValueAtTime: vi.fn(),
      },
    };
  }

  createGain() {
    return {
      connect: vi.fn(),
      gain: {
        setValueAtTime: vi.fn(),
        linearRampToValueAtTime: vi.fn(),
      },
      disconnect: vi.fn(),
    };
  }

  suspend() {
    return Promise.resolve();
  }

  resume() {
    return Promise.resolve();
  }

  close() {
    return Promise.resolve();
  }
}

global.AudioContext = AudioContextMock;
global.webkitAudioContext = AudioContextMock;

beforeEach(() => {
  // 清除所有模拟
  vi.clearAllMocks();

  // 重置 localStorage
  localStorageMock.getItem.mockReturnValue(null);
});

afterEach(() => {
  // 清理
});
