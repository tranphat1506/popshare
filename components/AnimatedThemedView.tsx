import { Animated, ViewProps } from 'react-native';

import { useThemeColor } from '@/hooks/useThemeColor';

export type AnimatedThemedViewProps = ViewProps & {
    lightColor?: string;
    darkColor?: string;
};

export function AnimatedThemedView({ style, lightColor, darkColor, ...otherProps }: AnimatedThemedViewProps) {
    const backgroundColor = useThemeColor({ light: lightColor, dark: darkColor }, 'background');

    return <Animated.View style={[style, { backgroundColor }]} {...otherProps} />;
}
