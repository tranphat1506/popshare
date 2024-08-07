import { Dimensions, StyleSheet } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, { useSharedValue, useAnimatedStyle } from 'react-native-reanimated';

const { width, height } = Dimensions.get('window');
export default function Test() {
    const scale = useSharedValue(1);
    const savedScale = useSharedValue(1);

    const pinchGesture = Gesture.Pinch()
        .onUpdate((e) => {
            scale.value = savedScale.value * e.scale;
        })
        .onEnd(() => {
            savedScale.value = scale.value;
        });

    const animatedStyle = useAnimatedStyle(() => ({
        transform: [{ scale: scale.value }],
    }));

    return (
        <GestureDetector gesture={pinchGesture}>
            <Animated.View>
                <Animated.View style={[styles.box, animatedStyle]} />
            </Animated.View>
        </GestureDetector>
    );
}

const styles = StyleSheet.create({
    box: {
        height: height,
        width: width,
        backgroundColor: '#b58df1',
        borderRadius: 20,
        marginBottom: 30,
    },
});
