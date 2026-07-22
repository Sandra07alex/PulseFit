# PulseFit Visual Language & Permanent Design System Specification

## 1. Executive Summary & Brand Identity

PulseFit's visual language establishes an iconic, instantly recognizable digital identity. The design language bridges:
- **Apple Fitness**: Premium metrics, vibrant neon accent rings, precise typography.
- **Headspace**: Warm pastel card backdrops, vast whitespace, calming micro-shapes.
- **Finch**: Lovable companion mascot family integrated into everyday tracking.
- **Duolingo**: Energetic celebration feedback, bouncy spring physics, playful gamification.
- **Modern Glassmorphism**: Soft frosted surfaces, translucent borders, subtle glowing shadows.

### Core Visual Principles
1. **Large Rounded Surfaces**: Cards use generous 24px–32px corner radii (`radius.card`, `radius.heroCard`).
2. **Vast Whitespace**: Generous line spacing and container padding prevent visual clutter.
3. **Floating Island Navigation**: A signature pill navigation floating off the bottom with an overlapping center mascot button.
4. **Companion Family System**: 6 unique mascots tied directly to health features with reactive moods.
5. **Soft Spring Physics**: All touch interactions feature scale compression and spring rebound physics.

---

## 2. Design Tokens

### 2.1 Color Token Architecture ([theme/colors.ts](file:///c:/Users/sandr/Desktop/rando/PulseFit/theme/colors.ts))

#### Companion Brand Colors
| Companion | Name | Primary | Soft Tint | Gradient Pair | Domain |
| :--- | :--- | :--- | :--- | :--- | :--- |
| 💧 | **Droppy** | `#00B4D8` | `#E0F7FA` | `['#00B4D8', '#48CAE4']` | Water & Hydration |
| 🥚 | **Eggsy** | `#FFB703` | `#FFF9E6` | `['#FFB703', '#FB8500']` | Protein & Muscle |
| 🥦 | **Brocco** | `#2A9D8F` | `#E8F5E9` | `['#2A9D8F', '#74C69D']` | Nutrition & Greens |
| 🔥 | **Blaze** | `#FF4D4D` | `#FFEBEE` | `['#FF4D4D', '#FF8E53']` | Workouts & Cardio |
| 🌙 | **Luna** | `#7209B7` | `#F3E5F5` | `['#7209B7', '#480CA8']` | Sleep & Recovery |
| ❤️ | **Pulse** | `#6B5DFF` | `#F0EEFF` | `['#6B5DFF', '#00D4FF']` | Main Head Coach |

#### Glassmorphism Tokens
- **`glass.light`**: `rgba(255, 255, 255, 0.75)`
- **`glass.dark`**: `rgba(26, 26, 36, 0.75)`
- **`glass.borderLight`**: `rgba(255, 255, 255, 0.35)`
- **`glass.borderDark`**: `rgba(255, 255, 255, 0.12)`
- **`glass.glow`**: `rgba(107, 93, 255, 0.15)`

---

### 2.2 Spacing & Whitespace System ([theme/spacing.ts](file:///c:/Users/sandr/Desktop/rando/PulseFit/theme/spacing.ts))

```ts
export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  '2xl': 24,
  '3xl': 32,
  '4xl': 40,
  huge: 48,
  screenPadding: 20,
};
```

---

### 2.3 Border Radius Scale ([theme/radius.ts](file:///c:/Users/sandr/Desktop/rando/PulseFit/theme/radius.ts))

```ts
export const radius = {
  heroCard: 32,
  card: 24,
  cardSmall: 18,
  modal: 28,
  sheet: 32,
  input: 16,
  button: 16,
  buttonPill: 999,
  pill: 999,
  navPill: 999,
};
```

---

### 2.4 Shadows & Floating Elevations ([theme/shadows.ts](file:///c:/Users/sandr/Desktop/rando/PulseFit/theme/shadows.ts))

- **`shadows.card`**: Subtle 16px blur radius, `#6B5DFF` 7% opacity.
- **`shadows.cardLift`**: Active touch elevation, 24px blur radius, 14% opacity.
- **`shadows.floatingNav`**: Island navigation elevation, `#0F172A` 15% opacity, 24px blur.
- **`shadows.mascotGlow`**: Soft radial aura around companion mascots.

---

## 3. Mascot Companion Family System ([components/mascot/](file:///c:/Users/sandr/Desktop/rando/PulseFit/components/mascot/))

Each companion functions as a domain-specific guide. Mascots change facial expressions based on user progress and screen states.

### Expression States
1. **`idle`**: Continuous breathing scale (2.8s cycle) and subtle eye blinking.
2. **`celebrate`**: Bouncy spring pop with star sparkles and open smile.
3. **`sad`**: Puppy eyes with tear indicator when goals are missed.
4. **`sleep`**: Closed arc eyes with floating Zzzs (used in recovery & empty states).
5. **`wave`**: Waving hand motion for welcoming quotes and coach tips.
6. **`thinking`**: Tilted head with thought bubble for search and logging.

---

## 4. Signature Experience: Floating Island Bottom Navigation ([components/navigation/](file:///c:/Users/sandr/Desktop/rando/PulseFit/components/navigation/))

The Floating Island Navigation (`FloatingIslandNav.tsx`) is PulseFit's defining visual landmark.

### Technical Architecture
- **Floating Island Pill**: Elevated pill container positioned 24px above screen bottom with translucent frosted glass backdrop (`colors.lightMode.navBackground`).
- **Spring Active Tab Indicator**: Animated pill background sliding behind active tabs with spring damping physics (`tension: 180, friction: 14`).
- **Center Mascot Button**: Overlapping ❤️ Pulse coach button positioned above the nav bar center.
- **Continuous Idle Breathing**: 2.8s gentle scale animation loop (`1.05x` to `0.97x`).
- **Morphing Radial Menu**: Tapping center mascot opens `QuickActionRadialMenu.tsx` displaying 4 quick actions:
  - 🥦 **+ Food** (Brocco)
  - 💧 **+ Water** (Droppy)
  - 🔥 **+ Workout** (Blaze)
  - ⚖️ **+ Weight** (Eggsy)

---

## 5. Component Library Index ([components/ui/](file:///c:/Users/sandr/Desktop/rando/PulseFit/components/ui/))

| Component | Key Variants / Features | File |
| :--- | :--- | :--- |
| **`Button`** | `primary`, `secondary`, `glass`, `floating`, `outline`, `ghost`, `quickAction` | [Button.tsx](file:///c:/Users/sandr/Desktop/rando/PulseFit/components/ui/Button.tsx) |
| **`Card`** | `default`, `elevated`, `soft`, `outlined`, `hero` with touch lift physics | [Card.tsx](file:///c:/Users/sandr/Desktop/rando/PulseFit/components/ui/Card.tsx) |
| **`GlassCard`** | Translucent frosted backdrop with light/dark borders | [GlassCard.tsx](file:///c:/Users/sandr/Desktop/rando/PulseFit/components/ui/GlassCard.tsx) |
| **`StatCard`** | Large numeric highlight with trend pills & companion badge | [StatCard.tsx](file:///c:/Users/sandr/Desktop/rando/PulseFit/components/ui/StatCard.tsx) |
| **`MetricTile`** | Compact tile with pastel icon background | [MetricTile.tsx](file:///c:/Users/sandr/Desktop/rando/PulseFit/components/ui/MetricTile.tsx) |
| **`WorkoutCard`** | 🔥 Blaze mascot tag, category, duration, calories, intensity badge | [WorkoutCard.tsx](file:///c:/Users/sandr/Desktop/rando/PulseFit/components/ui/WorkoutCard.tsx) |
| **`FoodCard`** | 🥦 Brocco mascot tag, macro chips (protein, carbs, fat), calories | [FoodCard.tsx](file:///c:/Users/sandr/Desktop/rando/PulseFit/components/ui/FoodCard.tsx) |
| **`WaterCard`** | 💧 Droppy mascot tag, liquid progress fill bar, quick add buttons | [WaterCard.tsx](file:///c:/Users/sandr/Desktop/rando/PulseFit/components/ui/WaterCard.tsx) |
| **`SectionTitle`** | Title, optional subtitle, badge tag, action link | [SectionTitle.tsx](file:///c:/Users/sandr/Desktop/rando/PulseFit/components/ui/SectionTitle.tsx) |
| **`ProgressRing`** | SVG arc stroke fill with gradient colors & center label | [ProgressRing.tsx](file:///c:/Users/sandr/Desktop/rando/PulseFit/components/ui/ProgressRing.tsx) |
| **`LinearProgress`** | Thick pill progress bar with smooth spring animation | [LinearProgress.tsx](file:///c:/Users/sandr/Desktop/rando/PulseFit/components/ui/LinearProgress.tsx) |
| **`GoalCard`** | Goal target card with celebration triggers | [GoalCard.tsx](file:///c:/Users/sandr/Desktop/rando/PulseFit/components/ui/GoalCard.tsx) |
| **`QuoteCard`** | Daily motivational tip card with coach speech bubble | [QuoteCard.tsx](file:///c:/Users/sandr/Desktop/rando/PulseFit/components/ui/QuoteCard.tsx) |
| **`AchievementCard`**| Celebratory hero card for unlocked badges | [AchievementCard.tsx](file:///c:/Users/sandr/Desktop/rando/PulseFit/components/ui/AchievementCard.tsx) |
| **`CompanionCard`** | Mascot avatar + advice bubble + action button | [CompanionCard.tsx](file:///c:/Users/sandr/Desktop/rando/PulseFit/components/ui/CompanionCard.tsx) |
| **`BottomSheet`** | Soft spring entrance, rounded top corners (`radius.sheet: 32`) | [BottomSheet.tsx](file:///c:/Users/sandr/Desktop/rando/PulseFit/components/ui/BottomSheet.tsx) |
| **`FloatingModal`** | Soft dialog with spring entrance & backdrop blur | [FloatingModal.tsx](file:///c:/Users/sandr/Desktop/rando/PulseFit/components/ui/FloatingModal.tsx) |
| **`Input`** | Soft rounded input with focus glow & icon support | [Input.tsx](file:///c:/Users/sandr/Desktop/rando/PulseFit/components/ui/Input.tsx) |
| **`Search`** | Pill search bar with clear button | [Search.tsx](file:///c:/Users/sandr/Desktop/rando/PulseFit/components/ui/Search.tsx) |
| **`Chip` & `Tag`** | Selection pills and metadata tags with soft tint backgrounds | [Chip.tsx](file:///c:/Users/sandr/Desktop/rando/PulseFit/components/ui/Chip.tsx) |
| **`Toast` & `Snackbar`** | Floating top/bottom alerts with mascot icons | [Toast.tsx](file:///c:/Users/sandr/Desktop/rando/PulseFit/components/ui/Toast.tsx) |
| **`EmptyState`** | Playful empty state with 🌙 Luna sleeping or 💧 Droppy thinking | [EmptyState.tsx](file:///c:/Users/sandr/Desktop/rando/PulseFit/components/ui/EmptyState.tsx) |
| **`Loading` & `Skeleton`** | Bouncing mascot loader & animated shimmer placeholders | [Loading.tsx](file:///c:/Users/sandr/Desktop/rando/PulseFit/components/ui/Loading.tsx) |

---

## 6. Motion Physics & Micro-Interactions ([hooks/useMotion.ts](file:///c:/Users/sandr/Desktop/rando/PulseFit/hooks/useMotion.ts))

- **Button Press Scale**: `usePressAnimation()` scales elements to `0.94x` on touch down, restoring with spring physics on release.
- **Card Touch Elevation**: `useCardLiftAnimation()` lifts cards `-6px` along Y-axis and reduces shadow spread.
- **Continuous Breathing**: `useBreathingAnimation()` pulses mascots continuously on a 2800ms ease-in-out loop.
- **Animated Numerical Counters**: `useCounterAnimation()` smoothly counts up values over 800ms.

---

## 7. Accessibility Standards

1. **Touch Target Size**: Minimum touch target of `48x48dp` for all buttons and interactive tabs.
2. **Contrast Ratios**: All text tokens satisfy WCAG AA contrast against card backgrounds.
3. **Screen Readers**: All components provide explicit `accessibilityRole`, `accessibilityLabel`, and `accessibilityState`.
4. **Dark Mode Support**: Color semantics map cleanly between light (`#F6F7FA`) and dark (`#0D0E15`) surface tokens.
