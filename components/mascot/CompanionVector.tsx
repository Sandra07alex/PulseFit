import React from 'react';
import Svg, { Circle, Path, Rect, G, Defs, LinearGradient, Stop, Text as SvgText } from 'react-native-svg';
import { CompanionId, CompanionMood } from './types';
import { colors } from '../../theme/colors';

interface CompanionVectorProps {
  id: CompanionId;
  mood: CompanionMood;
  size: number;
}

export const CompanionVector: React.FC<CompanionVectorProps> = ({ id, mood, size }) => {
  const viewBox = "0 0 100 100";

  // Facial features based on mood
  const renderEyes = () => {
    switch (mood) {
      case 'sleep':
        return (
          <G id="eyes-sleep">
            {/* Closed curved eyes */}
            <Path d="M 32 46 Q 38 52 44 46" stroke="#1E1B4B" strokeWidth="3.5" strokeLinecap="round" fill="none" />
            <Path d="M 56 46 Q 62 52 68 46" stroke="#1E1B4B" strokeWidth="3.5" strokeLinecap="round" fill="none" />
            {/* Zzz floating indicator */}
            <SvgText x="74" y="32" fontSize="14" fontWeight="bold" fill="#7209B7">Z</SvgText>
            <SvgText x="82" y="22" fontSize="10" fontWeight="bold" fill="#B5179E">z</SvgText>
          </G>
        );
      case 'celebrate':
        return (
          <G id="eyes-celebrate">
            {/* Happy arch eyes */}
            <Path d="M 30 46 Q 38 36 46 46" stroke="#1E1B4B" strokeWidth="4" strokeLinecap="round" fill="none" />
            <Path d="M 54 46 Q 62 36 70 46" stroke="#1E1B4B" strokeWidth="4" strokeLinecap="round" fill="none" />
            {/* Sparkle stars */}
            <Path d="M 18 24 L 20 28 L 24 30 L 20 32 L 18 36 L 16 32 L 12 30 L 16 28 Z" fill="#FFB703" />
            <Path d="M 78 20 L 80 23 L 83 25 L 80 27 L 78 30 L 76 27 L 73 25 L 76 23 Z" fill="#FFB703" />
          </G>
        );
      case 'sad':
        return (
          <G id="eyes-sad">
            {/* Big puppy eyes with tear */}
            <Circle cx="38" cy="46" r="6" fill="#1E1B4B" />
            <Circle cx="62" cy="46" r="6" fill="#1E1B4B" />
            <Circle cx="36" cy="44" r="2" fill="#FFFFFF" />
            <Circle cx="60" cy="44" r="2" fill="#FFFFFF" />
            {/* Tear drop */}
            <Path d="M 68 52 C 68 56 65 59 63 59 C 61 59 60 57 60 55 C 60 53 63 50 63 50 C 63 50 68 50 68 52 Z" fill="#00B4D8" />
          </G>
        );
      case 'thinking':
        return (
          <G id="eyes-thinking">
            {/* Looking up right */}
            <Circle cx="38" cy="44" r="5" fill="#1E1B4B" />
            <Circle cx="62" cy="44" r="5" fill="#1E1B4B" />
            <Circle cx="40" cy="42" r="2" fill="#FFFFFF" />
            <Circle cx="64" cy="42" r="2" fill="#FFFFFF" />
            {/* Thought bubble dot */}
            <Circle cx="76" cy="30" r="3" fill="#D1D5DB" />
            <Circle cx="84" cy="20" r="5" fill="#E5E7EB" />
          </G>
        );
      case 'wave':
      case 'idle':
      default:
        return (
          <G id="eyes-default">
            <Circle cx="38" cy="45" r="5.5" fill="#1E1B4B" />
            <Circle cx="62" cy="45" r="5.5" fill="#1E1B4B" />
            <Circle cx="36" cy="43" r="2" fill="#FFFFFF" />
            <Circle cx="60" cy="43" r="2" fill="#FFFFFF" />
            {/* Rosy cheeks */}
            <Circle cx="28" cy="52" r="4.5" fill="#FF8B9E" opacity="0.6" />
            <Circle cx="72" cy="52" r="4.5" fill="#FF8B9E" opacity="0.6" />
          </G>
        );
    }
  };

  const renderMouth = () => {
    switch (mood) {
      case 'celebrate':
        return <Path d="M 40 54 Q 50 68 60 54 Z" fill="#FF4B65" stroke="#1E1B4B" strokeWidth="2" />;
      case 'sad':
        return <Path d="M 42 60 Q 50 52 58 60" stroke="#1E1B4B" strokeWidth="3" strokeLinecap="round" fill="none" />;
      case 'sleep':
        return <Circle cx="50" cy="56" r="3" fill="#1E1B4B" />;
      case 'thinking':
        return <Path d="M 44 56 Q 50 58 56 54" stroke="#1E1B4B" strokeWidth="3" strokeLinecap="round" fill="none" />;
      case 'wave':
      case 'idle':
      default:
        return <Path d="M 42 54 Q 50 62 58 54" stroke="#1E1B4B" strokeWidth="3" strokeLinecap="round" fill="none" />;
    }
  };

  const renderWavingHand = () => {
    if (mood !== 'wave') return null;
    return (
      <G id="waving-hand">
        <Path d="M 80 50 Q 92 40 88 32 C 84 28 78 36 78 44" fill="#FFB703" stroke="#1E1B4B" strokeWidth="2" />
      </G>
    );
  };

  // Render individual companions
  switch (id) {
    case 'droppy': // 💧 Water Drop Mascot
      return (
        <Svg width={size} height={size} viewBox={viewBox}>
          <Defs>
            <LinearGradient id="droppyGrad" x1="0" y1="0" x2="0" y2="1">
              <Stop offset="0%" stopColor="#48CAE4" />
              <Stop offset="100%" stopColor="#0077B6" />
            </LinearGradient>
          </Defs>
          {/* Water Drop Body */}
          <Path
            d="M 50 12 C 50 12 18 50 18 68 C 18 85 32 94 50 94 C 68 94 82 85 82 68 C 82 50 50 12 50 12 Z"
            fill="url(#droppyGrad)"
            stroke="#0096C7"
            strokeWidth="3"
          />
          {/* Glossy highlight */}
          <Path d="M 32 45 C 28 55 28 65 32 75 C 29 70 29 55 35 48 Z" fill="#FFFFFF" opacity="0.45" />
          {renderEyes()}
          {renderMouth()}
          {renderWavingHand()}
        </Svg>
      );

    case 'eggsy': // 🥚 Protein Egg Mascot
      return (
        <Svg width={size} height={size} viewBox={viewBox}>
          <Defs>
            <LinearGradient id="eggsyGrad" x1="0" y1="0" x2="0" y2="1">
              <Stop offset="0%" stopColor="#FFF275" />
              <Stop offset="100%" stopColor="#FFB703" />
            </LinearGradient>
          </Defs>
          {/* Oval Egg Body */}
          <Path
            d="M 50 14 C 30 14 18 36 18 62 C 18 82 32 94 50 94 C 68 94 82 82 82 62 C 82 36 70 14 50 14 Z"
            fill="url(#eggsyGrad)"
            stroke="#FB8500"
            strokeWidth="3"
          />
          {/* Highlight */}
          <Path d="M 32 30 C 26 40 26 55 30 68 C 27 58 27 42 34 32 Z" fill="#FFFFFF" opacity="0.5" />
          {renderEyes()}
          {renderMouth()}
          {renderWavingHand()}
        </Svg>
      );

    case 'brocco': // 🥦 Broccoli Mascot
      return (
        <Svg width={size} height={size} viewBox={viewBox}>
          <Defs>
            <LinearGradient id="broccoStem" x1="0" y1="0" x2="0" y2="1">
              <Stop offset="0%" stopColor="#95D5B2" />
              <Stop offset="100%" stopColor="#52B788" />
            </LinearGradient>
            <LinearGradient id="broccoHead" x1="0" y1="0" x2="0" y2="1">
              <Stop offset="0%" stopColor="#40916C" />
              <Stop offset="100%" stopColor="#1B4332" />
            </LinearGradient>
          </Defs>
          {/* Stem */}
          <Rect x="38" y="55" width="24" height="38" rx="10" fill="url(#broccoStem)" stroke="#2D6A4F" strokeWidth="3" />
          {/* Fluffy Broccoli Head */}
          <Circle cx="35" cy="38" r="22" fill="url(#broccoHead)" />
          <Circle cx="65" cy="38" r="22" fill="url(#broccoHead)" />
          <Circle cx="50" cy="26" r="24" fill="url(#broccoHead)" />
          <Circle cx="50" cy="40" r="24" fill="url(#broccoHead)" />
          {renderEyes()}
          {renderMouth()}
          {renderWavingHand()}
        </Svg>
      );

    case 'blaze': // 🔥 Workout Flame Mascot
      return (
        <Svg width={size} height={size} viewBox={viewBox}>
          <Defs>
            <LinearGradient id="blazeOuter" x1="0" y1="0" x2="0" y2="1">
              <Stop offset="0%" stopColor="#FF4D4D" />
              <Stop offset="100%" stopColor="#FF8E53" />
            </LinearGradient>
            <LinearGradient id="blazeInner" x1="0" y1="0" x2="0" y2="1">
              <Stop offset="0%" stopColor="#FFB703" />
              <Stop offset="100%" stopColor="#FFE066" />
            </LinearGradient>
          </Defs>
          {/* Flame outer body */}
          <Path
            d="M 50 10 C 60 28 85 45 85 68 C 85 85 70 94 50 94 C 30 94 15 85 15 68 C 15 45 40 28 50 10 Z"
            fill="url(#blazeOuter)"
            stroke="#E63946"
            strokeWidth="3"
          />
          {/* Flame inner core */}
          <Path
            d="M 50 42 C 56 54 68 64 68 76 C 68 85 60 90 50 90 C 40 90 32 85 32 76 C 32 64 44 54 50 42 Z"
            fill="url(#blazeInner)"
            opacity="0.9"
          />
          {renderEyes()}
          {renderMouth()}
          {renderWavingHand()}
        </Svg>
      );

    case 'luna': // 🌙 Recovery Moon Mascot
      return (
        <Svg width={size} height={size} viewBox={viewBox}>
          <Defs>
            <LinearGradient id="lunaGrad" x1="0" y1="0" x2="1" y2="1">
              <Stop offset="0%" stopColor="#9D4EDD" />
              <Stop offset="100%" stopColor="#5A189A" />
            </LinearGradient>
          </Defs>
          {/* Crescent Moon body */}
          <Path
            d="M 65 12 C 40 12 18 32 18 58 C 18 80 38 94 62 94 C 74 94 84 88 88 82 C 60 82 46 64 46 44 C 46 28 56 16 65 12 Z"
            fill="url(#lunaGrad)"
            stroke="#3C096C"
            strokeWidth="3"
          />
          {/* Sleepy stars */}
          <Circle cx="80" cy="22" r="3" fill="#E0AAFF" />
          <Circle cx="88" cy="38" r="2" fill="#E0AAFF" />
          {renderEyes()}
          {renderMouth()}
          {renderWavingHand()}
        </Svg>
      );

    case 'pulse': // ❤️ Main Coach Mascot
    default:
      return (
        <Svg width={size} height={size} viewBox={viewBox}>
          <Defs>
            <LinearGradient id="pulseGrad" x1="0" y1="0" x2="1" y2="1">
              <Stop offset="0%" stopColor="#6B5DFF" />
              <Stop offset="100%" stopColor="#00D4FF" />
            </LinearGradient>
          </Defs>
          {/* Dynamic Heart/Pulse shape */}
          <Path
            d="M 50 88 C 22 70 12 50 12 36 C 12 22 23 12 37 12 C 46 12 50 18 50 18 C 50 18 54 12 63 12 C 77 12 88 22 88 36 C 88 50 78 70 50 88 Z"
            fill="url(#pulseGrad)"
            stroke="#4B3DFF"
            strokeWidth="3"
          />
          {/* Crown/Star accessory */}
          <Path d="M 50 6 L 53 12 L 60 12 L 54 16 L 56 22 L 50 18 L 44 22 L 46 16 L 40 12 L 47 12 Z" fill="#FFB703" />
          {renderEyes()}
          {renderMouth()}
          {renderWavingHand()}
        </Svg>
      );
  }
};
