import React, { memo, useCallback, useEffect, useLayoutEffect, useMemo, useState } from 'react';
import { Dimensions, LayoutChangeEvent, LayoutRectangle, StyleSheet, View, ViewProps } from 'react-native';
import PeerDevice, { PeerDeviceProps } from '../Peer/PeerDevice';
import { SIZES } from '@/constants/Sizes';
import { GestureDetector, Gesture, GestureHandlerRootView } from 'react-native-gesture-handler';
import Animated, { useAnimatedStyle, useSharedValue } from 'react-native-reanimated';
import { useAppDispatch, useAppSelector } from '@/redux/hooks/hooks';
import { genRandomPeer } from '@/helpers/FakeDevices';
import { addPeer, Peers, removePeer, removePeerByPeerId } from '@/redux/peers/reducer';

export interface ActivePeerDeviceGroup {
    active?: boolean;
    handleActive?: (state: boolean) => void;
}
type PeerDeviceGroupProps = {
    peerList?: PeerDeviceProps[];
    ActiveComponent?: React.FC<ActivePeerDeviceGroup & ViewProps>;
    componentProps?: ViewProps;
    maxDisplay?: number;
} & ActivePeerDeviceGroup;

const { width: wScreen, height: hScreen } = Dimensions.get('screen');
const { height: hWindow } = Dimensions.get('window');

function clamp(val: number, min: number, max: number) {
    return Math.min(Math.max(val, min), max);
}

const PeerDeviceGroup: React.FC<PeerDeviceGroupProps> = (props) => {
    const displayPeerDevices = props.active ?? true;
    const MAX_PEER_DISPLAY = props.maxDisplay ?? 18;

    console.log('re-render screen');
    const dispatch = useAppDispatch();
    // console.log(wScreen - wWindow, hScreen - hWindow);
    // const [existPoints, setExistPoints] = useState<PeerWithPoint[][]>([[]]);
    // const existPoints: PeerWithPoint[][] = [];
    const [containerPoint, setContainerPoint] = useState<LayoutRectangle>({ x: 0, y: 0, width: 0, height: 0 });
    const [childPoint, setChildPoint] = useState<LayoutRectangle>({ x: 0, y: 0, width: 0, height: 0 });
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
    if (!displayPeerDevices)
        return (
            <>
                <View
                    style={{
                        // borderWidth: 2,
                        // borderColor: '#333',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        // align in center screen within bottom bar
                        height: hWindow - SIZES.BOTTOM_NAV_BAR * 2,
                        width: '100%',
                    }}
                >
                    {/* set props to children */}
                    {props.ActiveComponent && (
                        <props.ActiveComponent
                            // onLayout={handleSetChildrenPoint}
                            active={displayPeerDevices}
                            handleActive={props.handleActive}
                            {...props.componentProps}
                        />
                    )}
                </View>
            </>
        );

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
            const maxTranslateX = SIZES.PEER_DEVICE_WIDTH * (4 + scale.value);
            //
            const maxTranslateY = SIZES.PEER_DEVICE_HEIGHT * (4 + scale.value) + SIZES.BOTTOM_NAV_BAR;
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

    return (
        <>
            <GestureHandlerRootView>
                <GestureDetector gesture={pinch}>
                    <GestureDetector gesture={pan}>
                        <Animated.View>
                            <Animated.View
                                style={[
                                    pinchAnimatedStyles,
                                    {
                                        // borderWidth: 2,
                                        // borderColor: '#333',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        // align in center screen within bottom bar
                                        height: hWindow - SIZES.BOTTOM_NAV_BAR * 2,
                                        width: '100%',
                                    },
                                ]}
                            >
                                <Animated.View style={[panAnimatedStyles]} onLayout={handleSetContainerPoint}>
                                    <View
                                        style={{
                                            zIndex: 1,
                                        }}
                                    >
                                        {displayPeerDevices && (
                                            <RenderPeers
                                                maxDisplay={MAX_PEER_DISPLAY}
                                                childPoint={childPoint}
                                                containerPoint={containerPoint}
                                            />
                                        )}
                                    </View>
                                    {/* set props to children */}
                                    {props.ActiveComponent && (
                                        <props.ActiveComponent
                                            onLayout={handleSetChildrenPoint}
                                            active={displayPeerDevices}
                                            handleActive={props.handleActive}
                                            {...props.componentProps}
                                        />
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
type RenderPeersProps = {
    maxDisplay?: number;
    containerPoint: LayoutRectangle;
    childPoint: LayoutRectangle;
};
const RenderPeers: React.FC<RenderPeersProps> = memo(({ maxDisplay, childPoint, containerPoint }) => {
    const _ = useAppSelector((state) => state.peers);
    const [peers, setPeers] = useState<Peers>([]);
    const MAX_PEER_DISPLAY = maxDisplay ?? 18;
    return _.peers.map((peer) => {
        const pos = { x: (peer.floor + 1) * peer.x, y: (peer.floor + 1) * peer.y };
        return (
            <PeerDevice
                key={peer.id}
                {...peer}
                style={[
                    styles.peer,
                    {
                        transform: [
                            {
                                translateX:
                                    (containerPoint.width - SIZES.PEER_DEVICE_WIDTH) / 2 +
                                    ((childPoint.width + SIZES.PEER_DEVICE_WIDTH) / 2) * pos.x,
                            },
                            {
                                translateY:
                                    (containerPoint.height - SIZES.PEER_DEVICE_HEIGHT) / 2 -
                                    ((childPoint.height + SIZES.PEER_DEVICE_HEIGHT) / 2) * pos.y,
                            },
                        ],
                    },
                ]}
                // delay={index}
            />
        );
    });
});

const styles = StyleSheet.create({
    peer: {
        position: 'absolute',
        top: 0,
        left: 0,
        zIndex: 1,
    },
});

export default memo(PeerDeviceGroup);
