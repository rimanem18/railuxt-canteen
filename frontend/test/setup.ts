import { vi } from "vitest";

// グローバルなモックの設定
global.console = {
  ...console,
  // コンソールログを無効化（必要に応じて）
  log: vi.fn(),
  error: vi.fn(),
  warn: vi.fn(),
  info: vi.fn(),
};
