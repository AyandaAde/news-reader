export type AccountDevice = {
  id: string;
  name: string;
  location: string;
  browser?: string;
  isCurrent?: boolean;
  lastActiveLabel?: string;
};

export const DEFAULT_ACCOUNT_DEVICES: AccountDevice[] = [
  {
    id: "iphone-14-pro",
    name: "iPhone 14 Pro",
    location: "San Francisco, CA",
    isCurrent: true,
  },
  {
    id: "macbook-pro-16",
    name: 'MacBook Pro 16"',
    location: "San Francisco, CA",
    browser: "Safari",
    lastActiveLabel: "Last active 2 hours ago",
  },
];
