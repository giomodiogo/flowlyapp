import { Capacitor } from '@capacitor/core'

/**
 * Configures native-only behaviour (status bar, keyboard). On the web these
 * calls are skipped, so the same bundle runs everywhere.
 */
export async function initNative(): Promise<void> {
  if (!Capacitor.isNativePlatform()) return

  try {
    const { StatusBar, Style } = await import('@capacitor/status-bar')
    await StatusBar.setStyle({ style: Style.Light })
    if (Capacitor.getPlatform() === 'android') {
      await StatusBar.setBackgroundColor({ color: '#f4f6fb' })
    }
  } catch {
    /* StatusBar not available on this platform — ignore. */
  }

  try {
    const { Keyboard, KeyboardResize } = await import('@capacitor/keyboard')
    await Keyboard.setResizeMode({ mode: KeyboardResize.Native })
  } catch {
    /* Keyboard not available on this platform — ignore. */
  }
}
