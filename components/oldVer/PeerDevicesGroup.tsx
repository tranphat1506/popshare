import React, { memo, useCallback, useEffect, useState } from 'react';
import { Dimensions, LayoutChangeEvent, LayoutRectangle, StyleProp, StyleSheet, ViewStyle } from 'react-native';
import PeerDevice, { Peer, PeerDeviceProps } from '../Peer/PeerDevice';
import { SIZES } from '@/constants/Sizes';
import { GestureDetector, Gesture, GestureHandlerRootView } from 'react-native-gesture-handler';
import Animated, { cancelAnimation, useAnimatedStyle, useSharedValue } from 'react-native-reanimated';
interface Point {
    x: number;
    y: number;
}
type PeerWithPoint = Point & Peer;
interface PeerDeviceGroupProps {
    peerList: PeerDeviceProps[];
    Component?: React.FC<any>;
    componentProps?: any;
    show?: boolean;
    maxDisplay?: number;
}

const { width: wScreen, height: hScreen } = Dimensions.get('screen');

function clamp(val: number, min: number, max: number) {
    return Math.min(Math.max(val, min), max);
}
const randomPoint = (peer: Peer, existPoints: PeerWithPoint[][]): Point => {
    // let pos = [0].concat(
    //     existPoints
    //         .map((_, i) => {
    //             return [-1 * (i + 1), i + 1];
    //         })
    //         .flat()
    //         .sort((a, b) => a + b),
    // );
    // console.log(pos);
    let pos = [1, 0, -1];

    // console.log(existPoints);
    // check
    for (let i in pos) {
        for (let j in pos) {
            const x = pos[i],
                y = pos[j];
            if (!x && !y) continue;
            for (let fI in existPoints)
                if (
                    !existPoints[fI].find((p) => {
                        return p.x === x && p.y === y;
                    })
                ) {
                    if (Number(fI) % 2 === 0 && (!x || !y)) continue;
                    // push
                    existPoints[fI].push({ x, y, ...peer });
                    // setExistPoints(existPoints);
                    // console.log({ x: (Number(fI) + 1) * x, y: (Number(fI) + 1) * y });
                    return { x: (Number(fI) + 1) * x, y: (Number(fI) + 1) * y };
                }
        }
    }
    existPoints.push([]);
    existPoints[existPoints.length - 1].push({ x: 1, y: 1, ...peer });
    /// console.log({ x: Number(existPoints.length) * 1, y: Number(existPoints.length) * 1 });
    return { x: Number(existPoints.length) * 1, y: Number(existPoints.length) * 1 };
};
const PeerDeviceGroup: React.FC<PeerDeviceGroupProps> = (props) => {
    const displayPeerDevices = props.show ?? true;
    const MAX_PEER_DISPLAY = props.maxDisplay || 18;
    // const [existPoints, setExistPoints] = useState<PeerWithPoint[][]>([[]]);
    const existPoints: PeerWithPoint[][] = [];
    const [containerPoint, setContainerPoint] = useState<LayoutRectangle>({ x: 0, y: 0, width: 0, height: 0 });
    const [childPoint, setChildPoint] = useState<LayoutRectangle>({ x: 0, y: 0, width: 0, height: 0 });

    // test
    // useEffect(() => {
    //     console.log({ containerPoint }, Platform.OS);
    // }, [containerPoint, childPoint]);

    //handle set postion container point
    const handleSetContainerPoint = (e: LayoutChangeEvent) => {
        setContainerPoint(e.nativeEvent.layout);
    };
    // handle set postion children point
    const handleSetChildrenPoint = (e: LayoutChangeEvent) => {
        setChildPoint(e.nativeEvent.layout);
    };

    //Handle pinch and pan gesture
    const scale = useSharedValue(1);
    const startScale = useSharedValue(0);
    const translationX = useSharedValue(0);
    const translationY = useSharedValue(0);
    const prevTranslationX = useSharedValue(0);
    const prevTranslationY = useSharedValue(0);
    const panAnimatedStyles = useAnimatedStyle(() => ({
        transform: [{ translateX: translationX.value }, { translateY: translationY.value }],
    }));
    const pinchAnimatedStyles = useAnimatedStyle(() => ({
        transform: [{ scale: scale.value }],
    }));

    // set pinch gesture
    const pinch = Gesture.Pinch()
        .enabled(displayPeerDevices)
        .onStart(() => {
            startScale.value = scale.value;
        })
        .onUpdate((event) => {
            scale.value = clamp(startScale.value * event.scale, 0.5, Math.min(wScreen / 100, hScreen / 100));
        })
        .runOnJS(true);

    // set pan gesture
    const pan = Gesture.Pan()
        .enabled(displayPeerDevices)
        .minDistance(30 * scale.value)
        .minPointers(1)
        .onStart(() => {
            prevTranslationX.value = translationX.value;
            prevTranslationY.value = translationY.value;
        })
        .onUpdate((event) => {
            const maxTranslateX = SIZES.PEER_DEVICE_WIDTH * (existPoints.length + scale.value);
            //
            const maxTranslateY = SIZES.PEER_DEVICE_HEIGHT * (existPoints.length + scale.value) + SIZES.BOTTOM_NAV_BAR;
            // console.log(maxTranslateX, maxTranslateY, existPoints.length);
            // console.log(
            //     clamp(prevTranslationX.value + event.translationX, -maxTranslateX, maxTranslateX),
            //     clamp(prevTranslationY.value + event.translationY, -maxTranslateY, maxTranslateY),
            // );
            const speedWithScale = 1.25 / scale.value;
            translationX.value = clamp(
                prevTranslationX.value + event.translationX * speedWithScale,
                -maxTranslateX,
                maxTranslateX,
            );
            translationY.value = clamp(
                prevTranslationY.value + event.translationY * speedWithScale,
                -maxTranslateY,
                maxTranslateY,
            );
        })
        .runOnJS(true);

    // cancle animation
    const handleResetDefaultScreen = useCallback(() => {
        cancelAnimation(scale);
        cancelAnimation(startScale);
        cancelAnimation(translationX);
        cancelAnimation(translationY);
        cancelAnimation(prevTranslationX);
        cancelAnimation(prevTranslationY);
    }, [scale, startScale, translationX, translationY, prevTranslationX, prevTranslationY]);
    // auto reset
    useEffect(() => {
        if (!displayPeerDevices) handleResetDefaultScreen();
        return handleResetDefaultScreen();
    }, [displayPeerDevices, handleResetDefaultScreen]);

    return (
        <>
            <GestureHandlerRootView
                style={{ borderWidth: 2, borderColor: '#333', height: hScreen - SIZES.BOTTOM_NAV_BAR * 2 }}
            >
                <GestureDetector gesture={pinch}>
                    <GestureDetector gesture={pan}>
                        <Animated.View>
                            <Animated.View style={[pinchAnimatedStyles]}>
                                <Animated.View style={[panAnimatedStyles]} onLayout={handleSetContainerPoint}>
                                    {props.show &&
                                        props.peerList.slice(0, MAX_PEER_DISPLAY).map((peer, index) => {
                                            const pos: Point = randomPoint(peer, existPoints);
                                            const peerStyle = Object.assign(peer.style || {}, styles.peer, {
                                                transform: [
                                                    {
                                                        translateX:
                                                            (containerPoint.width - SIZES.PEER_DEVICE_WIDTH) / 2 +
                                                            ((childPoint.width + SIZES.PEER_DEVICE_WIDTH) / 2) * pos.x,
                                                    },
                                                    {
                                                        translateY:
                                                            (containerPoint.height - SIZES.PEER_DEVICE_HEIGHT) / 2 -
                                                            ((childPoint.height + SIZES.PEER_DEVICE_HEIGHT) / 2) *
                                                                pos.y,
                                                    },
                                                ],
                                            } as StyleProp<ViewStyle>);
                                            return <PeerDevice key={index} {...peer} style={peerStyle} />;
                                        })}
                                    {/* set props to children */}
                                    {props.Component && (
                                        <props.Component onLayout={handleSetChildrenPoint} {...props.componentProps} />
                                    )}
                                </Animated.View>
                            </Animated.View>
                        </Animated.View>
                    </GestureDetector>
                </GestureDetector>
            </GestureHandlerRootView>
        </>
    );
};

const styles = StyleSheet.create({
    peer: {
        position: 'absolute',
        top: 0,
        left: 0,
        zIndex: 2,
    },
});

export default memo(PeerDeviceGroup);
