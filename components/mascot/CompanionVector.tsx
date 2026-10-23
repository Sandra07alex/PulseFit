import React, { useId } from 'react';
import Svg, {
  Circle,
  Defs,
  Ellipse,
  G,
  Path,
  RadialGradient,
  Rect,
  Stop,
  Text as SvgText,
} from 'react-native-svg';
import { CompanionId, CompanionMood } from './types';
import { shade } from '../../utils/color';

interface CompanionVectorProps {
  id: CompanionId;
  mood: CompanionMood;
  size: number;
}

/** Base body colour per companion; light/dark shading is derived from it */
const BODY: Record<CompanionId, string> = {
  droppy: '#4FC4F2',
  eggsy: '#FFD15C',
  brocco: '#5FD39C',
  blaze: '#FF8B7B',
  luna: '#C68CF0',
  pulse: '#9B88FF',
};

const INK = '#2E2350';
const BLUSH = '#FF8FB1';

/**
 * 3D-shaded vector companion.
 *
 * Bodies use an off-centre radial gradient (light from top-left) with a
 * specular highlight, eyes are glossy with double sparkles, and a soft ground
 * shadow sits underneath so the character reads as a floating toy.
 */
export const CompanionVector: React.FC<CompanionVectorProps> = ({ id, mood, size }) => {
  const uid = useId().replace(/[^a-zA-Z0-9]/g, '');
  const base = BODY[id] ?? BODY.pulse;
  const bodyId = `b${uid}`;
  const accentId = `a${uid}`;

  const bodyGradient = (gid: string, color: string) => (
    <RadialGradient id={gid} cx="36%" cy="30%" r="78%" fx="34%" fy="26%">
      <Stop offset="0%" stopColor={shade(color, 0.62)} />
      <Stop offset="45%" stopColor={color} />
      <Stop offset="100%" stopColor={shade(color, -0.28)} />
    </RadialGradient>
  );

  // ---------------------------------------------------------------------------
  // Face
  // ---------------------------------------------------------------------------

  const glossyEye = (cx: number, cy: number, r = 6) => (
    <G>
      <Ellipse cx={cx} cy={cy} rx={r} ry={r * 1.15} fill={INK} />
      <Circle cx={cx - r * 0.35} cy={cy - r * 0.45} r={r * 0.42} fill="#FFFFFF" />
      <Circle cx={cx + r * 0.35} cy={cy + r * 0.4} r={r * 0.18} fill="#FFFFFF" opacity={0.85} />
    </G>
  );

  const cheeks = (
    <G opacity={0.55}>
      <Ellipse cx="27" cy="55" rx="6" ry="3.6" fill={BLUSH} />
      <Ellipse cx="73" cy="55" rx="6" ry="3.6" fill={BLUSH} />
    </G>
  );

  const renderEyes = () => {
    switch (mood) {
      case 'sleep':
        return (
          <G>
            <Path d="M 31 47 Q 38 53 45 47" stroke={INK} strokeWidth="3.5" strokeLinecap="round" fill="none" />
            <Path d="M 55 47 Q 62 53 69 47" stroke={INK} strokeWidth="3.5" strokeLinecap="round" fill="none" />
            {cheeks}
            <SvgText x="76" y="26" fontSize="15" fontWeight="bold" fill="#9F63CF">Z</SvgText>
            <SvgText x="86" y="14" fontSize="10" fontWeight="bold" fill="#C68CF0">z</SvgText>
          </G>
        );
      case 'celebrate':
        return (
          <G>
            <Path d="M 30 48 Q 38 37 46 48" stroke={INK} strokeWidth="4" strokeLinecap="round" fill="none" />
            <Path d="M 54 48 Q 62 37 70 48" stroke={INK} strokeWidth="4" strokeLinecap="round" fill="none" />
            {cheeks}
            <Path d="M 12 22 L 14.5 27 L 20 29 L 14.5 31 L 12 36 L 9.5 31 L 4 29 L 9.5 27 Z" fill="#FFD15C" />
            <Path d="M 86 16 L 88 20 L 92 21.5 L 88 23 L 86 27 L 84 23 L 80 21.5 L 84 20 Z" fill="#FFD15C" />
            <Circle cx="90" cy="38" r="2" fill="#FF8FB1" />
          </G>
        );
      case 'sad':
        return (
          <G>
            {glossyEye(38, 47, 6.5)}
            {glossyEye(62, 47, 6.5)}
            <Path d="M 30 38 L 44 41" stroke={INK} strokeWidth="2.5" strokeLinecap="round" />
            <Path d="M 70 38 L 56 41" stroke={INK} strokeWidth="2.5" strokeLinecap="round" />
            <Path d="M 70 54 C 70 58 67.5 61 65.5 61 C 63.5 61 62 59 62 57 C 62 55 66 51 66 51 C 66 51 70 52 70 54 Z" fill="#7FD8FF" />
          </G>
        );
      case 'thinking':
        return (
          <G>
            {glossyEye(40, 45, 5.5)}
            {glossyEye(64, 45, 5.5)}
            {cheeks}
            <Circle cx="80" cy="28" r="3.2" fill="#FFFFFF" stroke="#E3DCFA" strokeWidth="1" />
            <Circle cx="88" cy="16" r="5.5" fill="#FFFFFF" stroke="#E3DCFA" strokeWidth="1" />
          </G>
        );
      case 'wave':
      case 'idle':
      default:
        return (
          <G>
            {glossyEye(38, 46)}
            {glossyEye(62, 46)}
            {cheeks}
          </G>
        );
    }
  };

  const renderMouth = () => {
    switch (mood) {
      case 'celebrate':
        return (
          <G>
            <Path d="M 40 55 Q 50 70 60 55 Z" fill="#E8556F" stroke={INK} strokeWidth="2" strokeLinejoin="round" />
            <Ellipse cx="50" cy="63" rx="4.5" ry="2.5" fill="#FF9DB0" />
          </G>
        );
      case 'sad':
        return <Path d="M 43 62 Q 50 55 57 62" stroke={INK} strokeWidth="3" strokeLinecap="round" fill="none" />;
      case 'sleep':
        return <Ellipse cx="50" cy="58" rx="3" ry="3.6" fill={INK} />;
      case 'thinking':
        return <Path d="M 44 58 Q 50 60 57 56" stroke={INK} strokeWidth="3" strokeLinecap="round" fill="none" />;
      case 'wave':
      case 'idle':
      default:
        return <Path d="M 43 56 Q 50 63 57 56" stroke={INK} strokeWidth="3" strokeLinecap="round" fill="none" />;
    }
  };

  const renderWavingHand = () => {
    if (mood !== 'wave') return null;
    return (
      <G>
        <Ellipse cx="86" cy="44" rx="7" ry="9" fill={`url(#${bodyId})`} transform="rotate(-25 86 44)" />
        <Ellipse cx="83.5" cy="40" rx="2.5" ry="1.6" fill="#FFFFFF" opacity={0.7} />
      </G>
    );
  };

  /** White specular highlight + tiny sparkle, shared by all bodies */
  const specular = (cx: number, cy: number, rx = 10, ry = 6, rot = -30) => (
    <G>
      <Ellipse cx={cx} cy={cy} rx={rx} ry={ry} fill="#FFFFFF" opacity={0.7} transform={`rotate(${rot} ${cx} ${cy})`} />
      <Circle cx={cx + rx * 0.9} cy={cy + ry * 1.1} r={1.8} fill="#FFFFFF" opacity={0.75} />
    </G>
  );

  // ---------------------------------------------------------------------------
  // Bodies (drawn in a 100×100 box, then scaled to leave room for the shadow)
  // ---------------------------------------------------------------------------

  const renderBody = () => {
    switch (id) {
      case 'droppy':
        return (
          <G>
            <Path
              d="M 50 8 C 50 8 17 47 17 67 C 17 85 32 95 50 95 C 68 95 83 85 83 67 C 83 47 50 8 50 8 Z"
              fill={`url(#${bodyId})`}
              stroke={shade(base, -0.18)}
              strokeWidth="1.5"
            />
            {specular(34, 52, 6, 12, 20)}
          </G>
        );

      case 'eggsy':
        return (
          <G>
            <Path
              d="M 50 8 C 29 8 16 34 16 62 C 16 83 31 95 50 95 C 69 95 84 83 84 62 C 84 34 71 8 50 8 Z"
              fill={`url(#${bodyId})`}
              stroke={shade(base, -0.2)}
              strokeWidth="1.5"
            />
            {specular(33, 28, 9, 6, -40)}
          </G>
        );

      case 'brocco':
        return (
          <G>
            <Rect x="37" y="58" width="26" height="37" rx="12" fill={`url(#${accentId})`} stroke={shade('#BFF3D6', -0.25)} strokeWidth="1.5" />
            <Circle cx="28" cy="42" r="19" fill={`url(#${bodyId})`} />
            <Circle cx="72" cy="42" r="19" fill={`url(#${bodyId})`} />
            <Circle cx="38" cy="24" r="18" fill={`url(#${bodyId})`} />
            <Circle cx="62" cy="24" r="18" fill={`url(#${bodyId})`} />
            <Circle cx="50" cy="44" r="26" fill={`url(#${bodyId})`} />
            {specular(30, 16, 7, 4.5, -30)}
          </G>
        );

      case 'blaze':
        return (
          <G>
            <Path
              d="M 50 4 C 58 20 70 22 74 10 C 86 28 88 50 86 66 C 84 84 70 95 50 95 C 30 95 16 84 14 66 C 12 48 22 34 30 26 C 32 36 38 38 42 32 C 46 24 44 14 50 4 Z"
              fill={`url(#${bodyId})`}
              stroke={shade(base, -0.2)}
              strokeWidth="1.5"
            />
            <Path
              d="M 50 62 C 56 70 66 74 66 82 C 66 90 59 94 50 94 C 41 94 34 90 34 82 C 34 74 44 70 50 62 Z"
              fill={`url(#${accentId})`}
              opacity={0.95}
            />
            {specular(28, 50, 5, 10, 15)}
          </G>
        );

      case 'luna':
        return (
          <G>
            <Circle cx="50" cy="52" r="42" fill={`url(#${bodyId})`} stroke={shade(base, -0.2)} strokeWidth="1.5" />
            {/* craters */}
            <Circle cx="72" cy="30" r="5" fill={shade(base, -0.12)} opacity={0.6} />
            <Circle cx="78" cy="68" r="3.5" fill={shade(base, -0.12)} opacity={0.6} />
            <Circle cx="24" cy="72" r="4" fill={shade(base, -0.12)} opacity={0.6} />
            {/* sleepy nightcap */}
            <Path d="M 22 28 Q 40 0 74 14 Q 60 16 52 26 Z" fill="#7FA4FF" stroke={shade('#7FA4FF', -0.2)} strokeWidth="1.2" />
            <Circle cx="76" cy="14" r="5" fill="#FFFFFF" />
            {specular(30, 34, 8, 5, -35)}
          </G>
        );

      case 'pulse':
      default:
        return (
          <G>
            <Path
              d="M 50 92 C 20 72 8 52 8 35 C 8 20 20 9 35 9 C 44 9 50 16 50 16 C 50 16 56 9 65 9 C 80 9 92 20 92 35 C 92 52 80 72 50 92 Z"
              fill={`url(#${bodyId})`}
              stroke={shade(base, -0.2)}
              strokeWidth="1.5"
            />
            {/* tiny crown */}
            <Path
              d="M 40 10 L 42 1 L 47 7 L 50 0 L 53 7 L 58 1 L 60 10 Z"
              fill={`url(#${accentId})`}
              stroke={shade('#FFD15C', -0.25)}
              strokeWidth="1"
              strokeLinejoin="round"
            />
            {specular(24, 24, 9, 5.5, -35)}
          </G>
        );
    }
  };

  const accentColor = id === 'brocco' ? '#BFF3D6' : '#FFD15C';

  return (
    <Svg width={size} height={size} viewBox="0 0 100 100">
      <Defs>
        {bodyGradient(bodyId, base)}
        {bodyGradient(accentId, accentColor)}
      </Defs>
      {/* ground shadow */}
      <Ellipse cx="50" cy="96" rx="26" ry="3.5" fill="#2E2350" opacity={0.12} />
      <G transform="translate(5 0) scale(0.9)">
        {renderBody()}
        {renderEyes()}
        {renderMouth()}
        {renderWavingHand()}
      </G>
    </Svg>
  );
};
