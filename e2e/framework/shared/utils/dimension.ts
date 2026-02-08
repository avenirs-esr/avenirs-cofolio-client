export const AV_BREAKPOINTS = {
  sm: 576,
  md: 768,
  lg: 1024,
  xl: 1440,
} as const

export const MOBILE_VIEWPORT = { width: AV_BREAKPOINTS.sm, height: 851 }

export const TABLET_VIEWPORT = { width: AV_BREAKPOINTS.md, height: 1024 }

export const DESKTOP_VIEWPORT = { width: 1920, height: 1080 }
