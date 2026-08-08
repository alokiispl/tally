import { invoke } from '@tauri-apps/api/core';
import { listen } from '@tauri-apps/api/event';
import { getMockBootstrapState, mockSettingsView, mockUsageView } from './mockData';
import type {
  ApiKeyStatus,
  AppSettings,
  BootstrapState,
  ProviderApiKeyState,
  ResetClaimOutcome,
  SettingsViewState,
  UpdateProgress,
  UpdateStatus,
  UsageViewState,
} from './types';

type StopListening = () => void;
type PayloadHandler<T> = (payload: T) => void;
export type PanelResizeEdge = 'top' | 'bottom';
export type PanelHeightMode = 'automatic' | 'manual';

function isTauriEnv(): boolean {
  return typeof window !== 'undefined' && '__TAURI_INTERNALS__' in window;
}

function onEvent<T>(name: string, handler: PayloadHandler<T>): Promise<StopListening> {
  if (!isTauriEnv()) return Promise.resolve(() => {});
  return listen<T>(name, (event) => handler(event.payload));
}

export function getBootstrapState() {
  if (!isTauriEnv()) return Promise.resolve(getMockBootstrapState());
  return invoke<BootstrapState>('get_bootstrap_state');
}

export function refreshUsage() {
  if (!isTauriEnv()) return Promise.resolve(mockUsageView);
  return invoke<UsageViewState>('refresh_usage');
}

export function refreshProviderUsage(providerId: string) {
  if (!isTauriEnv()) return Promise.resolve(mockUsageView);
  return invoke<UsageViewState>('refresh_provider_usage', { providerId });
}

export function claimCodexResetCredit(expiresAt: string, redeemRequestId: string) {
  if (!isTauriEnv()) return Promise.resolve('success' as ResetClaimOutcome);
  return invoke<ResetClaimOutcome>('claim_codex_reset_credit', { expiresAt, redeemRequestId });
}

export function openProviderLink(providerId: string, linkIndex: number) {
  if (!isTauriEnv()) return Promise.resolve();
  return invoke<void>('open_provider_link', { providerId, linkIndex });
}

export function getProviderApiKeyState(providerId: string) {
  if (!isTauriEnv()) return Promise.resolve({ providerId, status: 'saved' as ApiKeyStatus });
  return invoke<ProviderApiKeyState | null>('get_provider_api_key_state', { providerId });
}

export function saveProviderApiKey(providerId: string, apiKey: string) {
  if (!isTauriEnv()) return Promise.resolve({ providerId, status: 'saved' as ApiKeyStatus });
  return invoke<ProviderApiKeyState>('save_provider_api_key', { providerId, apiKey });
}

export function deleteProviderApiKey(providerId: string) {
  if (!isTauriEnv()) return Promise.resolve({ providerId, status: 'notSet' as ApiKeyStatus });
  return invoke<ProviderApiKeyState>('delete_provider_api_key', { providerId });
}

export function getAppSettings() {
  if (!isTauriEnv()) return Promise.resolve(mockSettingsView);
  return invoke<SettingsViewState>('get_app_settings');
}

export function saveAppSettings(settings: AppSettings) {
  if (!isTauriEnv()) return Promise.resolve({ ...mockSettingsView, settings });
  return invoke<SettingsViewState>('save_app_settings', { settings });
}

export function resetCustomization() {
  if (!isTauriEnv()) return Promise.resolve(mockSettingsView);
  return invoke<SettingsViewState>('reset_customization');
}

export function resetProviderCustomization(providerId: string) {
  if (!isTauriEnv()) return Promise.resolve(mockSettingsView);
  return invoke<SettingsViewState>('reset_provider_customization', { providerId });
}

export function requestNotificationPermission() {
  if (!isTauriEnv()) return Promise.resolve(mockSettingsView);
  return invoke<SettingsViewState>('request_notification_permission');
}

export function openNotificationSettings() {
  if (!isTauriEnv()) return Promise.resolve();
  return invoke<void>('open_notification_settings');
}

export function getLogPath() {
  if (!isTauriEnv()) return Promise.resolve('browser-preview.log');
  return invoke<string>('get_log_path');
}

export function openLogFolder() {
  if (!isTauriEnv()) return Promise.resolve();
  return invoke<void>('open_log_folder');
}

export function dismissMainWindow() {
  if (!isTauriEnv()) return Promise.resolve();
  return invoke<void>('dismiss_main_window');
}

export function getPanelResizeEdge() {
  if (!isTauriEnv()) return Promise.resolve('bottom' as PanelResizeEdge);
  return invoke<PanelResizeEdge>('get_panel_resize_edge');
}

export function getPanelHeightMode() {
  if (!isTauriEnv()) return Promise.resolve('automatic' as PanelHeightMode);
  return invoke<PanelHeightMode>('get_panel_height_mode');
}

export function fitPanelToContent(height: number) {
  if (!isTauriEnv()) return Promise.resolve(true);
  return invoke<boolean>('fit_panel_to_content', { height });
}

export function setPanelHeightAutomatic() {
  if (!isTauriEnv()) return Promise.resolve();
  return invoke<void>('set_panel_height_automatic');
}

export function setPanelHeightManual() {
  if (!isTauriEnv()) return Promise.resolve();
  return invoke<void>('set_panel_height_manual');
}

export function beginPanelResize() {
  if (!isTauriEnv()) return Promise.resolve('bottom' as PanelResizeEdge);
  return invoke<PanelResizeEdge>('begin_panel_resize');
}

export function lockPanelResizeAxis() {
  if (!isTauriEnv()) return Promise.resolve();
  return invoke<void>('lock_panel_resize_axis');
}

export function quitApplication() {
  if (!isTauriEnv()) return Promise.resolve();
  return invoke<void>('quit_app');
}

export function checkForApplicationUpdates() {
  if (!isTauriEnv())
    return Promise.resolve({
      available: false,
      currentVersion: '0.3.3',
      version: null,
      body: null,
      installable: false,
      releaseUrl: '',
    });
  return invoke<UpdateStatus>('check_for_updates');
}

export function installApplicationUpdate() {
  if (!isTauriEnv()) return Promise.resolve();
  return invoke<void>('install_update');
}

export function openUpdatePage() {
  if (!isTauriEnv()) return Promise.resolve();
  return invoke<void>('open_update_page');
}

export function onUsageState(handler: PayloadHandler<UsageViewState>) {
  return onEvent('usage-state', handler);
}

export function onSettingsState(handler: PayloadHandler<SettingsViewState>) {
  return onEvent('settings-state', handler);
}

export function onOpenScreen(handler: PayloadHandler<string>) {
  return onEvent('open-screen', handler);
}

export function onPopupHidden(handler: PayloadHandler<void>) {
  return onEvent('popup-hidden', handler);
}

export function onUpdateProgress(handler: PayloadHandler<UpdateProgress>) {
  return onEvent('update-progress', handler);
}

