import { SIZES } from '@/constants/Sizes';
import { MotiView } from 'moti';
import { View } from 'native-base';
import React from 'react';
import { useColorScheme, ViewStyle } from 'react-native';
import { Easing } from 'react-native-reanimated';

const BUTTON_SIZE = SIZES.SCAN_BUTTON_SIZE;
// const BUTTON_PADDING = SIZES.SCAN_BUTTON_PADDING;
const ScanAnimation = ({ active = false, animationStyle }: { active: boolean; animationStyle?: ViewStyle }) => {
    const theme = useColorScheme();
    return (
        <>
            {active &&
                [...Array(10).keys()].map((index) => {
                    return (
                        <MotiView
                            style={{
                                backgroundColor: theme === 'light' ? '#1c9ff62b' : '#1c9ff64b',
                                position: 'absolute',
                                alignItems: 'center',
                                justifyContent: 'center',
                                width: BUTTON_SIZE,
                                height: BUTTON_SIZE,
                                borderRadius: BUTTON_SIZE * 10,
                                ...animationStyle,
                            }}
                            key={`${Math.random()}-${Date.now()}`}
                            from={{ opacity: 0.5, scale: 0 }}
                            animate={{ opacity: 0, scale: 15 }}
                            transition={{
                                type: 'timing',
                                duration: 7000,
                                easing: Easing.out(Easing.ease),
                                delay: 700 * index,
                                repeatReverse: false,
                                loop: true,
                            }}
                        />
                    );
                })}
        </>
    );
};

export default ScanAnimation;
