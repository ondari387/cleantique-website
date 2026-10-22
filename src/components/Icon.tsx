type IconName =
  | "bug" | "sparkle" | "box" | "truck" | "phone" | "whatsapp" | "mail" | "pin" | "clock"
  | "check" | "arrow" | "chevron" | "menu" | "close" | "search" | "home" | "building"
  | "key" | "utensils" | "hardhat" | "store" | "shield" | "calendar" | "chat" | "clipboard"
  | "info" | "star";

const paths: Record<IconName, React.ReactNode> = {
  bug: (<><path d="M8 9a4 4 0 1 1 8 0v6a4 4 0 1 1-8 0V9Z" /><path d="M12 9v10M4 13h4M16 13h4M5 7l3 2M19 7l-3 2M5 19l3-2M19 19l-3-2M10 5 9 3M14 5l1-2" /></>),
  sparkle: (<><path d="M12 3v4M12 17v4M3 12h4M17 12h4" /><path d="m12 8 1.2 2.8L16 12l-2.8 1.2L12 16l-1.2-2.8L8 12l2.8-1.2L12 8Z" /><path d="M18.5 4.5l-1.4 1.4M6.9 17.1l-1.4 1.4" /></>),
  box: (<><path d="M3 7.5 12 3l9 4.5v9L12 21l-9-4.5v-9Z" /><path d="m3 7.5 9 4.5 9-4.5M12 12v9M7.5 5.2l9 4.6" /></>),
  truck: (<><path d="M2 6h11v10H2zM13 9h4.5L21 12.5V16h-8" /><circle cx="6" cy="17.5" r="1.8" /><circle cx="17" cy="17.5" r="1.8" /></>),
  phone: (<path d="M5 3h3.5l1.5 4.5-2.2 1.4a11 11 0 0 0 7.3 7.3l1.4-2.2L21 15.5V19a2 2 0 0 1-2.2 2A17 17 0 0 1 3 5.2 2 2 0 0 1 5 3Z" />),
  whatsapp: (<><path d="M4 20l1.2-3.9A8 8 0 1 1 8 19.1L4 20Z" /><path d="M9 8.5c0 3.3 3.2 6.5 6.5 6.5l1.2-1.5-2-1-1 .9a5 5 0 0 1-2.6-2.6l.9-1-1-2L9.5 8" /></>),
  mail: (<><rect x="3" y="5" width="18" height="14" rx="2" /><path d="m3.5 6.5 8.5 6 8.5-6" /></>),
  pin: (<><path d="M12 21s-6.5-6-6.5-11a6.5 6.5 0 1 1 13 0c0 5-6.5 11-6.5 11Z" /><circle cx="12" cy="10" r="2.3" /></>),
  clock: (<><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" /></>),
  check: (<path d="m5 12.5 4.5 4.5L19 7.5" />),
  arrow: (<path d="M5 12h14m-5-5 5 5-5 5" />),
  chevron: (<path d="m6 9 6 6 6-6" />),
  menu: (<path d="M4 7h16M4 12h16M4 17h16" />),
  close: (<path d="M6 6l12 12M18 6 6 18" />),
  search: (<><circle cx="11" cy="11" r="6.5" /><path d="m20 20-4.2-4.2" /></>),
  home: (<><path d="M4 11 12 4l8 7" /><path d="M6 9.5V20h12V9.5M10 20v-5h4v5" /></>),
  building: (<><path d="M5 21V4h10v17M15 9h4v12M3 21h18" /><path d="M8 8h1M11 8h1M8 12h1M11 12h1M8 16h1M11 16h1" /></>),
  key: (<><circle cx="8" cy="15" r="4" /><path d="m11 12 9-9M17 6l2 2M15 8l2 2" /></>),
  utensils: (<><path d="M7 3v7a2 2 0 0 0 2 2v9M11 3v7a2 2 0 0 1-2 2M17 21V3c-2 0-3 2.5-3 6s1 4 3 4" /></>),
  hardhat: (<><path d="M3 17h18M5 17v-3a7 7 0 0 1 14 0v3" /><path d="M10 7.2V5h4v2.2M3 17v2h18v-2" /></>),
  store: (<><path d="M4 9h16l-1.5-5h-13L4 9Z" /><path d="M5 9v11h14V9M9.5 20v-6h5v6M4 9a2.7 2.7 0 0 0 5.3 0 2.7 2.7 0 0 0 5.4 0 2.7 2.7 0 0 0 5.3 0" /></>),
  shield: (<><path d="M12 3 5 6v6c0 4.5 3 7.8 7 9 4-1.2 7-4.5 7-9V6l-7-3Z" /><path d="m9 12 2.2 2.2L15.5 10" /></>),
  calendar: (<><rect x="3.5" y="5" width="17" height="15" rx="2" /><path d="M3.5 10h17M8 3v4M16 3v4" /></>),
  chat: (<path d="M4 5h16v11H9l-5 4V5Z" />),
  clipboard: (<><rect x="5" y="4" width="14" height="17" rx="2" /><path d="M9 4V3h6v1M9 10h6M9 14h6M9 18h3" /></>),
  info: (<><circle cx="12" cy="12" r="9" /><path d="M12 11v6M12 7.5v.5" /></>),
  star: (<path d="m12 3.5 2.6 5.3 5.9.9-4.3 4.1 1 5.8-5.2-2.7-5.2 2.7 1-5.8-4.3-4.1 5.9-.9L12 3.5Z" />),
};

export function Icon({ name, className = "h-5 w-5", strokeWidth = 1.7 }: { name: IconName; className?: string; strokeWidth?: number }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
      focusable="false"
    >
      {paths[name]}
    </svg>
  );
}

export type { IconName };
