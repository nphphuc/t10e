import type { SVGProps } from 'react';

// Bộ icon nét (stroke) tự vẽ trên lưới 24×24 — thay cho emoji trong toàn bộ trang chọn môn/đề.
const PATHS = {
  back: <path d="M15 5l-7 7 7 7" />,
  chevron: <path d="M9 5l7 7-7 7" />,
  exam: (
    <>
      <path d="M7 3h7l4 4v14H7z" />
      <path d="M14 3v4h4" />
      <path d="M10 12h5M10 15.5h5M10 8.5h2" />
    </>
  ),
  shuffle: (
    <>
      <path d="M4 7h3.5c4 0 5 10 9 10H20" />
      <path d="M4 17h3.5c1.6 0 2.7-1.6 3.6-3.6M13 10.6C13.9 8.6 15 7 16.5 7H20" />
      <path d="M17.5 4.5L20 7l-2.5 2.5M17.5 14.5L20 17l-2.5 2.5" />
    </>
  ),
  stack: (
    <>
      <path d="M12 4l8 4-8 4-8-4z" />
      <path d="M4 12l8 4 8-4" />
      <path d="M4 16l8 4 8-4" />
    </>
  ),
  book: (
    <>
      <path d="M12 6.5C10.5 5.3 8.5 4.8 4 5v13c4.5-.2 6.5.3 8 1.5 1.5-1.2 3.5-1.7 8-1.5V5c-4.5-.2-6.5.3-8 1.5z" />
      <path d="M12 6.5v13" />
    </>
  ),
  grid: (
    <>
      <rect x="4" y="4" width="6.5" height="6.5" rx="1" />
      <rect x="13.5" y="4" width="6.5" height="6.5" rx="1" />
      <rect x="4" y="13.5" width="6.5" height="6.5" rx="1" />
      <rect x="13.5" y="13.5" width="6.5" height="6.5" rx="1" />
    </>
  ),
  plusSquare: (
    <>
      <rect x="4" y="4" width="16" height="16" rx="2" />
      <path d="M12 8.5v7M8.5 12h7" />
    </>
  ),
  target: (
    <>
      <circle cx="12" cy="12" r="8" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="12" cy="12" r="0.8" fill="currentColor" />
    </>
  ),
  // môn học
  gamepad: (
    <>
      <path d="M7.5 8h9a4 4 0 014 4.3l-.4 3.6a2.4 2.4 0 01-4.2 1.3L14.5 15.5h-5l-1.4 1.7a2.4 2.4 0 01-4.2-1.3l-.4-3.6A4 4 0 017.5 8z" />
      <path d="M8 11v3M6.5 12.5h3" />
      <circle cx="15.5" cy="11.5" r="0.8" fill="currentColor" />
      <circle cx="17" cy="13.5" r="0.8" fill="currentColor" />
    </>
  ),
  braces: (
    <>
      <path d="M9 4c-2 0-2.5 1-2.5 2.5v3C6.5 11 5.5 12 4 12c1.5 0 2.5 1 2.5 2.5v3C6.5 19 7 20 9 20" />
      <path d="M15 4c2 0 2.5 1 2.5 2.5v3c0 1.5 1 2.5 2.5 2.5-1.5 0-2.5 1-2.5 2.5v3c0 1.5-.5 2.5-2.5 2.5" />
    </>
  ),
  kanban: (
    <>
      <rect x="3.5" y="4" width="17" height="16" rx="2" />
      <path d="M9.2 4v16M14.8 4v16" />
      <path d="M5.5 8h2M11 8h2M11 11h2M16.8 8h2" />
    </>
  ),
  compass: (
    <>
      <circle cx="12" cy="12" r="8.5" />
      <path d="M15.5 8.5l-2 5-5 2 2-5z" />
    </>
  ),
  coins: (
    <>
      <ellipse cx="10" cy="7" rx="5.5" ry="2.5" />
      <path d="M4.5 7v4c0 1.4 2.5 2.5 5.5 2.5s5.5-1.1 5.5-2.5V7" />
      <path d="M4.5 11v4c0 1.4 2.5 2.5 5.5 2.5 1 0 1.9-.1 2.7-.3" />
      <circle cx="16.5" cy="16" r="3.5" />
    </>
  ),
  // chủ đề PRU213
  window: (
    <>
      <rect x="3.5" y="5" width="17" height="14" rx="2" />
      <path d="M3.5 9h17M9 9v10" />
    </>
  ),
  cube: (
    <>
      <path d="M12 3.5l7.5 4.2v8.6L12 20.5l-7.5-4.2V7.7z" />
      <path d="M4.5 7.7L12 12l7.5-4.3M12 12v8.5" />
    </>
  ),
  orbit: (
    <>
      <circle cx="12" cy="12" r="3" />
      <ellipse cx="12" cy="12" rx="9" ry="4" transform="rotate(-25 12 12)" />
    </>
  ),
  film: (
    <>
      <rect x="4" y="4" width="16" height="16" rx="2" />
      <path d="M8 4v16M16 4v16M4 9h4M4 15h4M16 9h4M16 15h4" />
    </>
  ),
  layout: (
    <>
      <rect x="4" y="4" width="16" height="16" rx="2" />
      <path d="M4 9.5h16M11 9.5V20" />
    </>
  ),
  pointer: (
    <>
      <path d="M6 4l12 6.5-5 1.5-2 5.5z" />
      <path d="M13 12l5 5" />
    </>
  ),
  database: (
    <>
      <ellipse cx="12" cy="6" rx="7" ry="2.8" />
      <path d="M5 6v12c0 1.5 3.1 2.8 7 2.8s7-1.3 7-2.8V6" />
      <path d="M5 12c0 1.5 3.1 2.8 7 2.8s7-1.3 7-2.8" />
    </>
  ),
  // chủ đề PRN222
  plug: (
    <>
      <path d="M9 3.5v4M15 3.5v4" />
      <path d="M6.5 7.5h11v3a5.5 5.5 0 01-11 0z" />
      <path d="M12 16v4.5" />
    </>
  ),
  bolt: <path d="M13 3L5.5 13.5H12L11 21l7.5-10.5H12z" />,
  signal: (
    <>
      <circle cx="12" cy="13" r="1.6" />
      <path d="M8.5 9.5a5 5 0 000 7M15.5 9.5a5 5 0 010 7" />
      <path d="M5.6 6.6a9 9 0 000 12.8M18.4 6.6a9 9 0 010 12.8" />
    </>
  ),
  globe: (
    <>
      <circle cx="12" cy="12" r="8.5" />
      <path d="M3.5 12h17M12 3.5c2.4 2.4 3.5 5.2 3.5 8.5s-1.1 6.1-3.5 8.5c-2.4-2.4-3.5-5.2-3.5-8.5s1.1-6.1 3.5-8.5z" />
    </>
  ),
  folders: (
    <>
      <path d="M3.5 8.5V18a1.5 1.5 0 001.5 1.5h11" />
      <path d="M7 5h4l1.5 2H19a1.5 1.5 0 011.5 1.5v6A1.5 1.5 0 0119 16H8.5A1.5 1.5 0 017 14.5z" />
    </>
  ),
  gear: (
    <>
      <circle cx="12" cy="12" r="3" />
      <path d="M12 3.5v2.3M12 18.2v2.3M3.5 12h2.3M18.2 12h2.3M6 6l1.6 1.6M16.4 16.4L18 18M6 18l1.6-1.6M16.4 7.6L18 6" />
      <circle cx="12" cy="12" r="6.2" />
    </>
  ),
  refresh: (
    <>
      <path d="M19 12a7 7 0 01-12.2 4.7M5 12a7 7 0 0112.2-4.7" />
      <path d="M17.5 3.5v4h-4M6.5 20.5v-4h4" />
    </>
  ),
  // chủ đề PMG201c
  calendar: (
    <>
      <rect x="4" y="5.5" width="16" height="14.5" rx="2" />
      <path d="M4 10h16M8.5 3.5v4M15.5 3.5v4" />
    </>
  ),
  chart: (
    <>
      <path d="M4 20h16" />
      <path d="M7 16.5V11M12 16.5V6.5M17 16.5v-4" />
    </>
  ),
  check: (
    <>
      <circle cx="12" cy="12" r="8.5" />
      <path d="M8.3 12.3l2.5 2.5 5-5.3" />
    </>
  ),
  users: (
    <>
      <circle cx="9" cy="8.5" r="3.2" />
      <path d="M3.5 19.5c.6-3.2 2.7-5 5.5-5s4.9 1.8 5.5 5" />
      <path d="M15.5 5.6a3.2 3.2 0 010 5.8M17.3 14.8c1.7.6 2.8 2.2 3.2 4.7" />
    </>
  ),
  message: <path d="M5 5h14a1.5 1.5 0 011.5 1.5v9A1.5 1.5 0 0119 17h-8l-4.5 3.5V17H5a1.5 1.5 0 01-1.5-1.5v-9A1.5 1.5 0 015 5z" />,
  alert: (
    <>
      <path d="M12 4l9 16H3z" />
      <path d="M12 10v4.5" />
      <circle cx="12" cy="17.3" r="0.8" fill="currentColor" />
    </>
  ),
  network: (
    <>
      <circle cx="12" cy="5.5" r="2.2" />
      <circle cx="5.5" cy="18" r="2.2" />
      <circle cx="18.5" cy="18" r="2.2" />
      <path d="M11 7.5l-4.4 8.4M13 7.5l4.4 8.4M7.7 18h8.6" />
    </>
  ),
  cross: (
    <>
      <circle cx="12" cy="12" r="8.5" />
      <path d="M9 9l6 6M15 9l-6 6" />
    </>
  ),
  trophy: (
    <>
      <path d="M8 4h8v5a4 4 0 01-8 0z" />
      <path d="M8 6H5v1.5A3 3 0 008 10.5M16 6h3v1.5a3 3 0 01-3 3" />
      <path d="M12 13v3.5M8.5 20h7M9.5 20l.5-3.5h4l.5 3.5" />
    </>
  ),
  bulb: (
    <>
      <path d="M9 17.5h6M10 20.5h4" />
      <path d="M12 3.5a5.5 5.5 0 00-3.3 9.9c.6.5 1 1.2 1 2V15.5h4.6v-.1c0-.8.4-1.5 1-2A5.5 5.5 0 0012 3.5z" />
    </>
  ),
} as const;

export type IconName = keyof typeof PATHS;

export default function Icon({ name, size = 20, strokeWidth = 1.6, ...rest }: { name: IconName; size?: number; strokeWidth?: number } & SVGProps<SVGSVGElement>) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
      {...rest}
    >
      {PATHS[name]}
    </svg>
  );
}
