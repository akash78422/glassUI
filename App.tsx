import React, { useEffect } from 'react';

import { Dimensions, SafeAreaView, StyleSheet, View, Text } from 'react-native';
import MaskedView from '@react-native-masked-view/masked-view';
import LinearGradient from 'react-native-linear-gradient';
import Svg, { Defs, RadialGradient, Stop, Circle } from 'react-native-svg';
import Animated, {
  Easing,
  useSharedValue,
  withRepeat,
  withTiming,
  useAnimatedProps,
  useAnimatedStyle,
} from 'react-native-reanimated';

const { width: W, height: H } = Dimensions.get('window');
const AnimatedCircle = Animated.createAnimatedComponent(Circle);

const BLOBS = [
  { id: 'g0', color: '#D4AF37', ampX: W * 0.42, ampY: H * 0.28, baseR: W * 0.55, varR: W * 0.10, speed: 0.60, phase: 0.0,  opacity: 0.30 }, 
  { id: 'g1', color: '#C0C0C0', ampX: W * 0.38, ampY: H * 0.26, baseR: W * 0.48, varR: W * 0.09, speed: 0.72, phase: 1.1,  opacity: 0.26 }, 
  { id: 'g2', color: '#FFD700', ampX: W * 0.36, ampY: H * 0.25, baseR: W * 0.52, varR: W * 0.08, speed: 0.54, phase: 2.2,  opacity: 0.28 }, 
  { id: 'g3', color: '#D3D3D3', ampX: W * 0.40, ampY: H * 0.33, baseR: W * 0.50, varR: W * 0.10, speed: 0.66, phase: 3.3,  opacity: 0.24 }, 
  { id: 'g4', color: '#B8860B', ampX: W * 0.45, ampY: H * 0.30, baseR: W * 0.46, varR: W * 0.08, speed: 0.58, phase: 4.4,  opacity: 0.22 },
  { id: 'g5', color: '#A9A9A9', ampX: W * 0.34, ampY: H * 0.27, baseR: W * 0.44, varR: W * 0.07, speed: 0.76, phase: 5.5,  opacity: 0.20 },
];

export default function App() {
  const t = useSharedValue(0);
  const rot = useSharedValue(0);

  useEffect(() => {
    t.value = withRepeat(
      withTiming(Math.PI * 2, { duration: 16000, easing: Easing.linear }),
      -1,
      false
    );
    rot.value = withRepeat(
      withTiming(360, { duration: 12000, easing: Easing.linear }),
      -1,
      false
    );
  }, [t, rot]);

  const rotateStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${rot.value}deg` }],
  }));

  return (
    <SafeAreaView style={styles.root}>
      <View style={StyleSheet.absoluteFill}>
        <AnimatedBlobField t={t} />
      </View>

      <View style={styles.centerWrap}>
        <MaskedView
          style={styles.mask}
          maskElement={
            <View style={styles.maskInner}>
              <Text style={styles.title}>Smooth is Fast</Text>
            </View>
          }
        >
          <Animated.View style={[styles.gradientBox, rotateStyle]}>
            <LinearGradient
              colors={[
                '#C0C0C0',
                '#E8E8E8',
                '#FFD700',
                '#E8E8E8', 
                '#C0C0C0', 
              ]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={StyleSheet.absoluteFill}
              locations={[0, 0.22, 0.5, 0.78, 1]}
            />
          </Animated.View>
        </MaskedView>

        <Text style={styles.glow}>Smooth is Fast</Text>
      </View>
    </SafeAreaView>
  );
}

function AnimatedBlobField({ t }: { t: Animated.SharedValue<number> }) {
  const propsArray = BLOBS.map((cfg) =>
    useAnimatedProps(() => {
      const angle = t.value * cfg.speed + cfg.phase;
      const cx = W / 2 + cfg.ampX * Math.cos(angle);
      const cy = H / 2 + cfg.ampY * Math.sin(angle * 0.9);
      const r =
        cfg.baseR +
        cfg.varR * (0.5 + 0.5 * Math.sin(t.value * (cfg.speed * 1.6) + cfg.phase * 1.3));
      const op =
        cfg.opacity * (0.75 + 0.25 * Math.sin(t.value * (cfg.speed * 1.2) + cfg.phase * 0.7));

      return { cx, cy, r, opacity: op } as any;
    })
  );

  return (
    <Svg width={W} height={H}>
      <Defs>
        {BLOBS.map((b) => (
          <RadialGradient key={b.id} id={b.id} cx="50%" cy="50%" r="50%">
            <Stop offset="0%" stopColor={b.color} stopOpacity={0.9} />
            <Stop offset="100%" stopColor={b.color} stopOpacity={0.0} />
          </RadialGradient>
        ))}
      </Defs>

      {BLOBS.map((b, i) => (
        <AnimatedCircle key={b.id} animatedProps={propsArray[i]} fill={`url(#${b.id})`} />
      ))}
    </Svg>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#0a0a0a' }, 
  centerWrap: {
    ...StyleSheet.absoluteFillObject,
    alignItems: 'center',
    justifyContent: 'center',
  },
  mask: { width: Math.min(W * 0.9, 700), height: 140 },
  maskInner: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  title: {
    fontSize: Math.min(W * 0.12, 64),
    fontWeight: '900',
    letterSpacing: 0.5,
  },
  gradientBox: { flex: 1 },
  glow: {
    position: 'absolute',
    fontSize: Math.min(W * 0.12, 64),
    fontWeight: '900',
    color: '#FFD700',         
    opacity: 0.08,
    textShadowColor: '#FFD700',
    textShadowRadius: 16,
    letterSpacing: 0.5,
  },
});
