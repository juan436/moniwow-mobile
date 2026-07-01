export const colors = {
  // Brand
  primary: '#00694c',
  primaryContainer: '#008560',
  onPrimary: '#ffffff',
  onPrimaryContainer: '#f5fff7',
  inversePrimary: '#6cdbae',

  secondary: '#775a19',
  secondaryContainer: '#fed488',
  onSecondary: '#ffffff',
  onSecondaryContainer: '#785a1a',

  tertiary: '#b51c00',
  tertiaryContainer: '#dc3214',
  onTertiary: '#ffffff',

  error: '#ba1a1a',
  errorContainer: '#ffdad6',
  onError: '#ffffff',
  onErrorContainer: '#93000a',

  // Surfaces
  background: '#f8f9fa',
  onBackground: '#191c1d',
  surface: '#f8f9fa',
  surfaceDim: '#d9dadb',
  surfaceBright: '#f8f9fa',
  surfaceContainerLowest: '#ffffff',
  surfaceContainerLow: '#f3f4f5',
  surfaceContainer: '#edeeef',
  surfaceContainerHigh: '#e7e8e9',
  surfaceContainerHighest: '#e1e3e4',
  onSurface: '#191c1d',
  onSurfaceVariant: '#3d4943',
  inverseSurface: '#2e3132',
  inverseOnSurface: '#f0f1f2',
  outline: '#6d7a73',
  outlineVariant: '#bdcac1',

  // Brand custom
  navyDark: '#0A192F',
  slateGray: '#5E6D82',
  pureWhite: '#FFFFFF',
  iceWhite: '#F8F9FA',
  emeraldSuccess: '#008F68',
  goldDreams: '#C5A059',
  alertOrange: '#FF4B2B',
  black: '#000000',

  // Utilitarios
  transparent:   'transparent' as const,

  // Transparent tints (para fondos y bordes sin hexadecimales inline)
  emeraldTint:   '#008F680D',  // emeraldSuccess  5% — fondos de hero/card
  emeraldBorder: '#008F6833',  // emeraldSuccess 20% — bordes sutiles
  goldTint:      '#C5A05926',  // goldDreams     15% — badge bg
  navyTint:      '#0A192F0A',  // navyDark        4% — pill bg sutil
  dividerSoft:   '#BDCAC155',  // outlineVariant 33% — divisores
} as const;

export const typography = {
  headlineHuge: {
    fontFamily: 'Outfit_700Bold',
    fontSize: 48,
    lineHeight: 56,
  },
  headlineHugeMobile: {
    fontFamily: 'Outfit_700Bold',
    fontSize: 40,
    lineHeight: 48,
  },
  headlineLg: {
    fontFamily: 'Outfit_600SemiBold',
    fontSize: 26,
    lineHeight: 32,
  },
  headlineMd: {
    fontFamily: 'Outfit_600SemiBold',
    fontSize: 20,
    lineHeight: 28,
  },
  heroDisplay: {
    fontFamily: 'Outfit_700Bold',
    fontSize: 64,
    lineHeight: 72,
  },
  bodyLg: {
    fontFamily: 'Inter_500Medium',
    fontSize: 15,
    lineHeight: 22,
  },
  bodyMd: {
    fontFamily: 'Inter_400Regular',
    fontSize: 16,
    lineHeight: 24,
  },
  bodyMdBold: {
    fontFamily: 'Outfit_600SemiBold',
    fontSize: 16,
    lineHeight: 24,
  },
  labelMd: {
    fontFamily: 'Inter_500Medium',
    fontSize: 14,
    lineHeight: 20,
  },
  labelMdBold: {
    fontFamily: 'Outfit_600SemiBold',
    fontSize: 14,
    lineHeight: 20,
  },
  labelSm: {
    fontFamily: 'Inter_400Regular',
    fontSize: 12,
    lineHeight: 16,
    letterSpacing: 0.5,
  },
  labelXs: {
    fontFamily: 'Inter_400Regular',
    fontSize: 10,
    lineHeight: 14,
  },
} as const;

export const spacing = {
  marginPage: 24,
  gutter: 16,
  stackXxs: 2,
  stackXs: 4,
  stackSm: 8,
  stackMd: 16,
  stackLg: 24,
  cardPadding: 16,
  buttonHeight: 48,
  inputHeight: 44,
} as const;

export const radius = {
  sm: 4,
  md: 12,
  lg: 16,
  xl: 24,
  card: 32,
  button: 24,
  chip: 16,
  full: 9999,
} as const;

export const sizes = {
  trackXs: 6,
  trackSm: 12,
  trackMd: 16,
  dotSm: 8,
  checkboxSm: 24,
  emojiFontMd: 22,
  avatarSm: 32,
  iconSm: 36,
  iconMd: 44,
  iconLg: 60,
  iconFab: 52,
  barMaxHeight: 80,
  barLabelSpace: 40,
  numpadKeyHeight: 64,
} as const;

export const shadows = {
  card: {
    shadowColor: '#0A192F',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
  },
  modal: {
    shadowColor: '#0A192F',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.12,
    shadowRadius: 20,
    elevation: 8,
  },
  footer: {
    shadowColor: '#0A192F',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.06,
    shadowRadius: 12,
    elevation: 8,
  },
} as const;
