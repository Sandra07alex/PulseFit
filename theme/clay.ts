// Clay 3D Design Tokens - PulseFit "soft toy" aesthetic
//
// Every 3D surface is built from three layers:
//   lip   – the darker underside that gives the surface visible thickness
//   face  – a top-lit gradient (light → base)
//   gloss – a translucent white highlight along the top edge
// plus a tinted drop shadow (glow) so surfaces appear to float.

export type ClayTint =
  | 'pulse'
  | 'droppy'
  | 'eggsy'
  | 'brocco'
  | 'blaze'
  | 'luna'
  | 'bubblegum'
  | 'cloud';

export interface ClayTintTokens {
  /** Top-lit face gradient, light → base */
  face: readonly [string, string];
  /** Darker underside for thickness */
  lip: string;
  /** Tinted drop-shadow colour */
  glow: string;
  /** Pastel fill for tracks, chips and soft backgrounds */
  soft: string;
  /** Text / icon colour that reads well on the face */
  ink: string;
  /** Strong accent (progress fills, numbers on light surfaces) */
  accent: string;
}

export const clayTints: Record<ClayTint, ClayTintTokens> = {
  pulse: {
    face: ['#B9AAFF', '#8B76FF'],
    lip: '#6650E6',
    glow: '#7B66FF',
    soft: '#EEE9FF',
    ink: '#FFFFFF',
    accent: '#7B66FF',
  },
  droppy: {
    face: ['#A8EBFF', '#4FC4F2'],
    lip: '#2A9CCB',
    glow: '#3BB6E8',
    soft: '#E2F6FF',
    ink: '#FFFFFF',
    accent: '#22A9E0',
  },
  eggsy: {
    face: ['#FFEAA8', '#FFC94D'],
    lip: '#E39E1C',
    glow: '#F5B731',
    soft: '#FFF5D6',
    ink: '#6B4300',
    accent: '#F0A81E',
  },
  brocco: {
    face: ['#BFF3D6', '#5FD39C'],
    lip: '#36AC74',
    glow: '#47C487',
    soft: '#E2F9EC',
    ink: '#FFFFFF',
    accent: '#2FB872',
  },
  blaze: {
    face: ['#FFC9B8', '#FF8B7B'],
    lip: '#E1625A',
    glow: '#FF7A6B',
    soft: '#FFECE6',
    ink: '#FFFFFF',
    accent: '#FF6F61',
  },
  luna: {
    face: ['#F3CCFF', '#C68CF0'],
    lip: '#9F63CF',
    glow: '#B57AE6',
    soft: '#F6EAFF',
    ink: '#FFFFFF',
    accent: '#A55FDB',
  },
  bubblegum: {
    face: ['#FFCDE2', '#FF8FBC'],
    lip: '#E2679A',
    glow: '#FF7EB0',
    soft: '#FFEAF3',
    ink: '#FFFFFF',
    accent: '#F2679F',
  },
  cloud: {
    face: ['#FFFFFF', '#FFFBF6'],
    lip: '#EEE2D4',
    glow: '#BFA184',
    soft: '#FFFFFF',
    ink: '#2E2350',
    accent: '#7B66FF',
  },
};

export const clay = {
  /** Solid cream app background */
  background: '#FFF8F0',

  ink: {
    primary: '#2E2350',
    secondary: '#6E6491',
    tertiary: '#A39BC0',
    onColor: '#FFFFFF',
  },

  /** Thickness of the lip under a surface, by depth */
  depth: {
    flat: 0,
    sm: 4,
    md: 6,
    lg: 9,
  },

  gloss: 'rgba(255, 255, 255, 0.55)',
  glossSoft: 'rgba(255, 255, 255, 0.28)',
  innerEdge: 'rgba(255, 255, 255, 0.85)',
  inset: 'rgba(46, 35, 80, 0.07)',
} as const;

/** Tinted floating drop shadow for a clay surface */
export function clayShadow(tint: ClayTint, strength: 'soft' | 'medium' | 'strong' = 'medium') {
  const t = clayTints[tint];
  const cfg = {
    soft: { y: 6, r: 12, o: 0.18, e: 4 },
    medium: { y: 10, r: 18, o: 0.26, e: 8 },
    strong: { y: 16, r: 26, o: 0.34, e: 14 },
  }[strength];
  return {
    shadowColor: t.glow,
    shadowOffset: { width: 0, height: cfg.y },
    shadowOpacity: cfg.o,
    shadowRadius: cfg.r,
    elevation: cfg.e,
  };
}
