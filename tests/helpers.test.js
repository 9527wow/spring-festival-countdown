/**
 * 工具函数测试
 * @vitest-environment jsdom
 */

import { describe, it, expect } from 'vitest';
import { throttle, debounce, escapeHtml, randomItem, randomInt } from '../src/utils/helpers.js';

describe('throttle', () => {
  it('should throttle function calls', () => {
    let count = 0;
    const throttledFn = throttle(() => {
      count++;
    }, 100);

    throttledFn();
    throttledFn();
    throttledFn();

    // 第一次调用应该立即执行
    expect(count).toBe(1);
  });

  it('should allow function call after limit', async () => {
    let count = 0;
    const throttledFn = throttle(() => {
      count++;
    }, 50);

    throttledFn();
    expect(count).toBe(1);

    await new Promise((resolve) => setTimeout(resolve, 60));
    throttledFn();
    expect(count).toBe(2);
  });
});

describe('debounce', () => {
  it('should debounce function calls', async () => {
    let count = 0;
    const debouncedFn = debounce(() => {
      count++;
    }, 50);

    debouncedFn();
    debouncedFn();
    debouncedFn();

    // 立即调用不应该执行
    expect(count).toBe(0);

    // 等待延迟后应该执行一次
    await new Promise((resolve) => setTimeout(resolve, 60));
    expect(count).toBe(1);
  });
});

describe('escapeHtml', () => {
  it('should escape HTML special characters', () => {
    expect(escapeHtml('<script>alert("xss")</script>')).toBe(
      '&lt;script&gt;alert("xss")&lt;/script&gt;'
    );
    expect(escapeHtml('<div>hello</div>')).toBe('&lt;div&gt;hello&lt;/div&gt;');
    expect(escapeHtml('plain text')).toBe('plain text');
  });
});

describe('randomItem', () => {
  it('should return a random item from array', () => {
    const arr = ['a', 'b', 'c'];
    const result = randomItem(arr);
    expect(arr).toContain(result);
  });

  it('should return item from single item array', () => {
    const result = randomItem(['only']);
    expect(result).toBe('only');
  });
});

describe('randomInt', () => {
  it('should return integer within range', () => {
    const result = randomInt(1, 10);
    expect(result).toBeGreaterThanOrEqual(1);
    expect(result).toBeLessThanOrEqual(10);
    expect(Number.isInteger(result)).toBe(true);
  });

  it('should return min value when min equals max', () => {
    const result = randomInt(5, 5);
    expect(result).toBe(5);
  });

  it('should handle negative ranges', () => {
    const result = randomInt(-10, -1);
    expect(result).toBeGreaterThanOrEqual(-10);
    expect(result).toBeLessThanOrEqual(-1);
  });
});
