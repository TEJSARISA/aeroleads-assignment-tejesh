
export interface ScraperConfig {
  proxyRotation: boolean;
  randomUserAgent: boolean;
  dynamicWaiting: boolean;
  retryMechanism: boolean;
  profileUrls: string;
}

export enum OutputTab {
  PYTHON_SCRIPT = 'Python Script',
  SETUP_GUIDE = 'Setup Guide',
}
