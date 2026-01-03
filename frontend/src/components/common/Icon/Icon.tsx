import './Icon.css';

export type IconName =
  | 'star'
  | 'moon'
  | 'sun'
  | 'heart'
  | 'sparkle'
  | 'arrow-right'
  | 'arrow-left'
  | 'check'
  | 'close'
  | 'male'
  | 'female'
  | 'love'
  | 'career'
  | 'health'
  | 'money'
  | 'spirituality'
  | 'growth'
  | 'crystal-ball'
  | 'zodiac'
  | 'constellation'
  | 'planet'
  | 'rocket'
  | 'infinity'
  | 'crown'
  | 'lightning'
  | 'eye'
  | 'compass'
  | 'hourglass'
  | 'magic-wand';

export interface IconProps {
  name: IconName;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  color?: string;
  className?: string;
  animated?: boolean;
}

const icons: Record<IconName, string> = {
  star: '\u2605',
  moon: '\u263E',
  sun: '\u2600',
  heart: '\u2665',
  sparkle: '\u2728',
  'arrow-right': '\u2192',
  'arrow-left': '\u2190',
  check: '\u2713',
  close: '\u2715',
  male: '\u2642',
  female: '\u2640',
  love: '\u2661',
  career: '\u2696',
  health: '\u2695',
  money: '\u24C8',
  spirituality: '\u262F',
  growth: '\u2191',
  'crystal-ball': '\u26AA',
  zodiac: '\u2649',
  constellation: '\u2B50',
  planet: '\u2609',
  rocket: '\u{1F680}',
  infinity: '\u221E',
  crown: '\u2654',
  lightning: '\u26A1',
  eye: '\u{1F441}',
  compass: '\u29B8',
  hourglass: '\u29D6',
  'magic-wand': '\u2726',
};

export function Icon({
  name,
  size = 'md',
  color,
  className = '',
  animated = false,
}: IconProps) {
  const classNames = [
    'cosmic-icon',
    `cosmic-icon--${size}`,
    animated && 'cosmic-icon--animated',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <span
      className={classNames}
      style={color ? { color } : undefined}
      role="img"
      aria-label={name}
    >
      {icons[name]}
    </span>
  );
}

export default Icon;
