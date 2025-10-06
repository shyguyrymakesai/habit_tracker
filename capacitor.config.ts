import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.echoleague.habits',
  appName: 'Echo Habits',
  webDir: 'dist',
  server: {
    androidScheme: 'https'
  }
};

export default config;
