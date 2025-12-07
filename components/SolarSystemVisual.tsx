import { useEffect, useState } from 'react';
import { StyleSheet, Text, View, Image } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  type SharedValue,
} from 'react-native-reanimated';

import { Subscription } from '@/types/subscription';
import { getBrandLogoUrl } from '@/utils/brandUtils';

interface AnimatedPlanetProps {
  subscription: Subscription;
  radius: number;
  angle: number;
  rotation: SharedValue<number>;
  index: number;
}

function AnimatedPlanet({
  subscription,
  radius,
  angle,
  rotation,
  index,
}: AnimatedPlanetProps) {
  const logoUrl = getBrandLogoUrl(subscription.logo || subscription.name);
  const [logoError, setLogoError] = useState(false);

  const animatedStyle = useAnimatedStyle(() => {
    const currentAngle = angle + rotation.value;
    const x = Math.cos(currentAngle) * radius;
    const y = Math.sin(currentAngle) * radius;

    // 3D effect: scale and opacity based on position (planets further back appear smaller and dimmer)
    const z = Math.sin(currentAngle) * 0.5;
    const scale = 1 + z * 0.2;
    const opacity = 0.8 + Math.abs(z) * 0.2;

    return {
      transform: [
        { translateX: x },
        { translateY: y },
        { scale },
        { rotateY: `${z}rad` }, // 3D rotation
      ],
      opacity,
    };
  });

  const showLogo = logoUrl && !logoError;

  return (
    <Animated.View style={[styles.planetContainer, animatedStyle]}>
      <View
        style={[
          styles.planet,
          !showLogo && { backgroundColor: getPlanetColor(index) },
          showLogo && { backgroundColor: '#fff' },
        ]}
      >
        {showLogo ? (
          <Image
            source={{ uri: logoUrl }}
            style={styles.planetLogo}
            resizeMode="contain"
            onError={() => setLogoError(true)}
          />
        ) : (
          <Text style={styles.planetText}>
            {subscription.name.charAt(0).toUpperCase()}
          </Text>
        )}
      </View>
    </Animated.View>
  );
}

interface AnimatedRingProps {
  radius: number;
  color: string;
  subscriptions: Subscription[];
  rotation: SharedValue<number>;
  startIndex: number;
}

function AnimatedRing({
  radius,
  color,
  subscriptions,
  rotation,
  startIndex,
}: AnimatedRingProps) {
  const angleStep = subscriptions.length > 0 ? (2 * Math.PI) / subscriptions.length : 0;

  return (
    <View style={styles.ringContainer}>
      <View
        style={[
          styles.ring,
          { width: radius * 2, height: radius * 2, borderColor: color },
        ]}
      />
      {subscriptions.map((subscription, index) => (
        <AnimatedPlanet
          key={subscription.id}
          subscription={subscription}
          radius={radius}
          angle={angleStep * index}
          rotation={rotation}
          index={startIndex + index}
        />
      ))}
    </View>
  );
}

function getPlanetColor(index: number): string {
  const colors = ['#6b46c1', '#8b5cf6', '#a78bfa', '#c4b5fd', '#ddd6fe', '#f3e8ff'];
  return colors[index % colors.length];
}

interface OrbitData {
  subscriptions: Subscription[];
  count: number;
}

interface SolarSystemVisualProps {
  orbits: OrbitData[];
}

export function SolarSystemVisual({ orbits }: SolarSystemVisualProps) {
  const rotation1 = useSharedValue(0);
  const rotation2 = useSharedValue(0);
  const rotation3 = useSharedValue(0);

  const ring1Subs = orbits[0]?.subscriptions || [];
  const ring2Subs = orbits[1]?.subscriptions || [];
  const ring3Subs = orbits[2]?.subscriptions || [];

  useEffect(() => {
    // Slow rotation speeds (different for each ring for visual interest)
    // Negative values for counter-clockwise rotation
    rotation1.value = withRepeat(
      withTiming(2 * Math.PI, { duration: 20000 }), // 20 seconds per rotation
      -1,
      false,
    );
    rotation2.value = withRepeat(
      withTiming(-2 * Math.PI, { duration: 25000 }), // 25 seconds per rotation (counter-clockwise)
      -1,
      false,
    );
    rotation3.value = withRepeat(
      withTiming(2 * Math.PI, { duration: 30000 }), // 30 seconds per rotation
      -1,
      false,
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ring1Subs.length, ring2Subs.length, ring3Subs.length]);

  const centerOrbStyle = useAnimatedStyle(() => {
    const pulse = Math.sin(rotation1.value * 2) * 0.1 + 1;
    return {
      transform: [{ scale: pulse }],
    };
  });

  return (
    <View style={styles.visualContainer}>
      <View style={styles.orbContainer}>
        {/* Center Orb with pulse animation */}
        <Animated.View style={[styles.centerOrb, centerOrbStyle]}>
          <View style={styles.centerOrbInner} />
        </Animated.View>

        {/* Ring 1 - Inner orbit */}
        {ring1Subs.length > 0 && (
          <AnimatedRing
            radius={40}
            color="#6b46c1"
            subscriptions={ring1Subs}
            rotation={rotation1}
            startIndex={0}
          />
        )}

        {/* Ring 2 - Middle orbit */}
        {ring2Subs.length > 0 && (
          <AnimatedRing
            radius={70}
            color="#8b5cf6"
            subscriptions={ring2Subs}
            rotation={rotation2}
            startIndex={ring1Subs.length}
          />
        )}

        {/* Ring 3 - Outer orbit */}
        {ring3Subs.length > 0 && (
          <AnimatedRing
            radius={100}
            color="#a78bfa"
            subscriptions={ring3Subs}
            rotation={rotation3}
            startIndex={ring1Subs.length + ring2Subs.length}
          />
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  visualContainer: {
    height: 220,
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 20,
  },
  orbContainer: {
    width: 220,
    height: 220,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  centerOrb: {
    width: 60,
    height: 60,
    borderRadius: 30,
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
  },
  centerOrbInner: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#ff6b6b',
    // Gradient-like effect
    shadowColor: '#ff6b6b',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 10,
    elevation: 10,
  },
  ringContainer: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  ring: {
    position: 'absolute',
    borderWidth: 1,
    borderRadius: 1000,
    opacity: 0.3,
  },
  planetContainer: {
    position: 'absolute',
    width: 24,
    height: 24,
    left: '50%',
    top: '50%',
    marginLeft: -12,
    marginTop: -12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  planet: {
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    // 3D shadow effect
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  planetText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: 'bold',
  },
  planetLogo: {
    width: 24,
    height: 24,
    borderRadius: 12,
  },
});
