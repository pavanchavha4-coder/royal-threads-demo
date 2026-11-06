import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.nexora.royalthreads',
  appName: 'Royal Threads',
  webDir: 'dist',
  backgroundColor: '#064E3B',
  server: {
    androidScheme: 'https',
    cleartext: false
  },
  android: {
    allowMixedContent: false,
    captureInput: true,
    webContentsDebuggingEnabled: false,
    backgroundColor: '#064E3B',
    buildOptions: {
      keystorePath: 'release-key.jks',
      keystoreAlias: 'shilpadresses',
    }
  },
  plugins: {
    SplashScreen: {
      launchShowDuration: 2200,
      launchAutoHide: true,
      backgroundColor: '#064E3B',
      androidSplashResourceName: 'splash',
      androidScaleType: 'CENTER_CROP',
      showSpinner: false,
      splashFullScreen: true,
      splashImmersive: true,
    },
    StatusBar: {
      style: 'DARK',
      backgroundColor: '#064E3B',
      overlaysWebView: false
    }
  }
};

export default config;
