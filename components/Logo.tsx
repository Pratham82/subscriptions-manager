import React from 'react';
import Svg, { Circle, Path } from 'react-native-svg';

interface LogoProps {
  size?: number;
  color?: string;
  opacity?: number;
}

export function Logo({ size = 120, color = '#6b46c1', opacity = 1 }: LogoProps) {
  const center = size / 2;
  const outerRadius = size * 0.425;
  const middleRadius = size * 0.3;
  const innerRadius = size * 0.175;

  return (
    <Svg width={size} height={size} viewBox="0 0 200 200">
      {/* Outer ring */}
      <Circle
        cx="100"
        cy="100"
        r="85"
        stroke={color}
        strokeWidth="3"
        opacity={0.3 * opacity}
      />

      {/* Middle ring */}
      <Circle
        cx="100"
        cy="100"
        r="60"
        stroke={color}
        strokeWidth="3"
        opacity={0.5 * opacity}
      />

      {/* Inner ring */}
      <Circle cx="100" cy="100" r="35" stroke={color} strokeWidth="4" opacity={opacity} />

      {/* Checkmark */}
      <Path
        d="M85 100 L95 110 L115 85"
        stroke={color}
        strokeWidth="5"
        strokeLinecap="round"
        strokeLinejoin="round"
        opacity={opacity}
      />

      {/* Orbiting dots */}
      <Circle cx="100" cy="15" r="4" fill={color} opacity={0.8 * opacity} />
      <Circle cx="185" cy="100" r="4" fill={color} opacity={0.8 * opacity} />
      <Circle cx="100" cy="185" r="4" fill={color} opacity={0.8 * opacity} />
      <Circle cx="15" cy="100" r="4" fill={color} opacity={0.8 * opacity} />
    </Svg>
  );
}
