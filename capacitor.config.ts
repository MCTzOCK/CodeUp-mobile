import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.bensiebert.codeup',
  appName: 'codeup_mobile',
  webDir: 'dist',
  server: {
    androidScheme: 'https'
  },
  "plugins": {
    "CapacitorHttp": {
      "enabled": true
    },
    "SplashScreen": {
      "launchAutoHide": false
    }
  }
};

export default config;
