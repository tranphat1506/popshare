import { Flex } from 'native-base';
import React, { memo } from 'react';
import { Image, LayoutChangeEvent, Platform, Pressable, StyleSheet, useColorScheme } from 'react-native';
import tw from 'twrnc';
import { ThemedView } from './ThemedView';
import { SIZES } from '@/constants/Sizes';
import { ActivePeerDeviceGroup } from './oldVer/PeerDeviceGroup__not_support_now';
import ScanAnimation from './ScanAnimation';

const BUTTON_SIZE = SIZES.SCAN_BUTTON_SIZE;
const BUTTON_PADDING = SIZES.SCAN_BUTTON_PADDING;

type ButtonScanProps = {
    onLayout?: (event: LayoutChangeEvent) => void;
} & ActivePeerDeviceGroup;
const ButtonScan: React.FC<ButtonScanProps> = ({ onLayout, active = false, handleActive = () => {} }) => {
    const theme = useColorScheme();
    return (
        <Flex className="w-full flex items-center justify-center">
            <ScanAnimation active={active} />
            <ThemedView style={[styles.rounded]} onLayout={onLayout}>
                <Pressable
                    onLongPress={() => {
                        handleActive(!active);
                    }}
                    style={({ pressed }) => {
                        return tw.style(styles.button, styles.rounded, {
                            'border-[#ffffff99] bg-[#1c9ff62a]': Platform.OS === 'ios',
                            'border-[#1c9ff610] bg-[#1c9ff62a]': Platform.OS === 'android',
                            'bg-[#222] border-[#111]': theme === 'dark',
                            'bg-[#333] border-[#222]': theme === 'dark' && pressed,
                            'bg-[#1c9ff63a] border-[#1c9ff620]': pressed,
                        });
                    }}
                >
                    <Image style={styles.scanImage} source={require('@/assets/images/radar.png')} />
                </Pressable>
            </ThemedView>
        </Flex>
    );
};

const styles = StyleSheet.create({
    rounded: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        width: BUTTON_SIZE,
        height: BUTTON_SIZE,
        borderRadius: BUTTON_SIZE * 10,
    },
    button: {
        borderWidth: 10,
        padding: BUTTON_PADDING || 10,
    },
    scanImage: {
        width: BUTTON_SIZE / 1.5,
        height: BUTTON_SIZE / 1.5,
    },
});

export default memo(ButtonScan);
