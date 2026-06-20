import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.meihostel.app',
  appName: 'MEI Hostel',
  // ✅ CHANGE THIS LINE right here:
  webDir: '.vercel/output/static',
  server: {
    androidScheme: 'https'
  }
};

export default config;