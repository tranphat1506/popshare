import React from 'react';
import { Image, View } from 'react-native';
import * as splash from 'expo-splash-screen';
import { ThemedView } from '../ThemedView';
import { ThemedText } from '../ThemedText';

// Hide splash screen
splash.hideAsync().catch(() => {});

const SplashScreen = ({ onlyIcon = false }) => {
    if (onlyIcon)
        return (
            <ThemedView className="h-full w-full">
                <View className="flex justify-center items-center h-screen w-screen">
                    <Image source={require('@/assets/images/radar.png')} className="w-32 h-32" />
                </View>
            </ThemedView>
        );
    return (
        <ThemedView className="h-full w-full">
            <View className="flex justify-center items-center h-screen w-screen gap-y-5">
                <Image source={require('@/assets/images/radar.png')} className="w-32 h-32" />
                <ThemedText style={{ fontFamily: 'System-Black' }} className="uppercase text-5xl">
                    PopShare
                </ThemedText>
            </View>
            <View className="flex flex-col h-full w-full items-center absolute justify-end pb-5">
                <ThemedText style={{ fontFamily: 'System-Light' }} className="text-md">
                    by
                </ThemedText>
                <ThemedText style={{ fontFamily: 'System-Bold' }} className="uppercase text-[#1C9EF6] text-xl">
                    PopPam
                </ThemedText>
            </View>
        </ThemedView>
    );
};

export default SplashScreen;
