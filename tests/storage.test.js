/**
 * 本地存储测试
 * @vitest-environment jsdom
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';
import {
  getStorage,
  setStorage,
  removeStorage,
  clearAllStorage,
  SettingsManager,
  DanmakuHistoryManager,
  StorageKey,
} from '../src/utils/storage.js';

describe('Storage Utils', () => {
  beforeEach(() => {
    // 清空 localStorage
    localStorage.clear();
    vi.clearAllMocks();
  });

  describe('getStorage', () => {
    it('should return default value when key does not exist', () => {
      const result = getStorage('non_existent_key', 'default');
      expect(result).toBe('default');
    });

    it('should parse and return stored value', () => {
      localStorage.setItem('test_key', JSON.stringify({ value: 'test' }));
      const result = getStorage('test_key', null);
      expect(result).toEqual({ value: 'test' });
    });

    it('should handle JSON parse errors', () => {
      localStorage.setItem('invalid_key', 'invalid json');
      const result = getStorage('invalid_key', 'fallback');
      expect(result).toBe('fallback');
    });
  });

  describe('setStorage', () => {
    it('should store value as JSON string', () => {
      const success = setStorage('test_key', { value: 'test' });
      expect(success).toBe(true);
      expect(localStorage.getItem('test_key')).toBe(JSON.stringify({ value: 'test' }));
    });
  });

  describe('removeStorage', () => {
    it('should remove stored value', () => {
      localStorage.setItem('test_key', 'test');
      const success = removeStorage('test_key');
      expect(success).toBe(true);
      expect(localStorage.getItem('test_key')).toBeNull();
    });
  });

  describe('SettingsManager', () => {
    it('should get default settings', () => {
      const settings = SettingsManager.getSettings();
      expect(settings).toHaveProperty('soundEnabled');
      expect(settings).toHaveProperty('soundVolume');
    });

    it('should save settings', () => {
      const success = SettingsManager.saveSettings({ soundEnabled: false });
      expect(success).toBe(true);

      const settings = SettingsManager.getSettings();
      expect(settings.soundEnabled).toBe(false);
    });

    it('should update single setting', () => {
      const success = SettingsManager.updateSetting('soundVolume', 0.5);
      expect(success).toBe(true);

      const settings = SettingsManager.getSettings();
      expect(settings.soundVolume).toBe(0.5);
    });
  });

  describe('DanmakuHistoryManager', () => {
    it('should add danmaku to history', () => {
      const success = DanmakuHistoryManager.addHistory('test danmaku');
      expect(success).toBe(true);

      const history = DanmakuHistoryManager.getHistory();
      expect(history).toHaveLength(1);
      expect(history[0].text).toBe('test danmaku');
    });

    it('should limit history size', () => {
      // 添加超过最大数量的记录
      for (let i = 0; i < DanmakuHistoryManager.MAX_HISTORY + 10; i++) {
        DanmakuHistoryManager.addHistory(`danmaku ${i}`);
      }

      const history = DanmakuHistoryManager.getHistory();
      expect(history).toHaveLength(DanmakuHistoryManager.MAX_HISTORY);
    });

    it('should add user danmaku', () => {
      const success = DanmakuHistoryManager.addUserDanmaku('custom danmaku');
      expect(success).toBe(true);

      const userDanmaku = DanmakuHistoryManager.getUserDanmaku();
      expect(userDanmaku).toContain('custom danmaku');
    });

    it('should not add duplicate user danmaku', () => {
      DanmakuHistoryManager.addUserDanmaku('duplicate');
      const success = DanmakuHistoryManager.addUserDanmaku('duplicate');
      expect(success).toBe(false);
    });
  });
});
