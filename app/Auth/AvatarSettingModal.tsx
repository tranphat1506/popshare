import React, { useRef, useEffect, useState, useLayoutEffect } from 'react';
import { View, TouchableOpacity, Modal, Animated, StyleSheet, Dimensions, Pressable } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { AnimatedThemedView } from '@/components/AnimatedThemedView';
import EmojiPicker, { EmojiKey } from '@/components/common/EmojiPicker';
import PopshareColorPicker from '@/components/common/ColorPicker';
import PopshareAvatar from '@/components/common/PopshareAvatar';
import tw from 'twrnc';
import { BLUE_MAIN_COLOR } from '@/constants/Colors';
const screenHeight = Dimensions.get('window').height;

interface AvatarSettingModalProps {
    handleSetAvatar: (avatar: IAvatarState) => void;
    handleOpenSetting: (state: boolean) => void;
    isSettingOpen: boolean;
    previewAvatar: IAvatarState;
}
export interface IAvatarState {
    profilePicture?: string;
    avatarEmoji?: EmojiKey;
    avatarColor?: string;
}
const AvatarSettingModal: React.FC<AvatarSettingModalProps> = ({
    handleOpenSetting,
    isSettingOpen,
    previewAvatar,
    handleSetAvatar,
}) => {
    const slideAnim = useRef(new Animated.Value(screenHeight)).current;
    const [changeSetting, setChangeSetting] = useState<keyof IAvatarState>('avatarEmoji');
    const handleChangeSetting = (setting: keyof IAvatarState) => () => {
        setChangeSetting(setting);
    };
    const [changeAvatar, setChangeAvatar] = useState<IAvatarState>({
        ...previewAvatar,
    });
    const handleChangeAvatar = (dataField: keyof IAvatarState) => (data: string | EmojiKey) => {
        setChangeAvatar({ ...changeAvatar, [dataField]: data });
    };
    useEffect(() => {
        if (isSettingOpen) {
            handleOpen();
        }
    }, [isSettingOpen]);
    // Reset the avatar
    useLayoutEffect(() => {
        setChangeAvatar(previewAvatar);
    }, [previewAvatar]);
    const handleOpen = () => {
        handleOpenSetting(true);
        Animated.timing(slideAnim, {
            toValue: 0,
            duration: 300,
            useNativeDriver: true,
        }).start();
    };

    const handleCancelUpdate = () => {
        Animated.timing(slideAnim, {
            toValue: screenHeight,
            duration: 300,
            useNativeDriver: true,
        }).start(() => handleOpenSetting(false));
    };

    const handleDoneUpdate = () => {
        handleSetAvatar(changeAvatar);
        Animated.timing(slideAnim, {
            toValue: screenHeight,
            duration: 300,
            useNativeDriver: true,
        }).start(() => handleOpenSetting(false));
    };

    return (
        <>
            <Modal
                visible={isSettingOpen}
                transparent={true}
                animationType="none"
                style={{
                    marginHorizontal: 20,
                }}
            >
                <AnimatedThemedView style={[styles.pickerContainer, { transform: [{ translateY: slideAnim }] }]}>
                    {/* Header */}
                    <View className="flex flex-row items-center justify-between px-4 h-14">
                        <TouchableOpacity onPress={handleCancelUpdate}>
                            <ThemedText style={{ fontSize: 16, lineHeight: 16 }}>Cancel</ThemedText>
                        </TouchableOpacity>
                        <ThemedText
                            style={{
                                fontFamily: 'System-Medium',
                                fontSize: 20,
                                lineHeight: 24,
                            }}
                        >
                            Avatar Setting
                        </ThemedText>
                        <TouchableOpacity onPress={handleDoneUpdate}>
                            <ThemedText style={{ fontSize: 16, lineHeight: 16 }}>Done</ThemedText>
                        </TouchableOpacity>
                    </View>
                    <View>
                        <View
                            style={{
                                display: 'flex',
                                justifyContent: 'center',
                                alignItems: 'center',
                                paddingVertical: 10,
                            }}
                        >
                            <PopshareAvatar {...changeAvatar} />
                        </View>
                        <View
                            style={{
                                flexDirection: 'row',
                                display: 'flex',
                                justifyContent: 'center',
                                alignItems: 'center',
                                paddingVertical: 10,
                                columnGap: 10,
                                rowGap: 10,
                                flexWrap: 'wrap',
                            }}
                        >
                            <Pressable
                                onPress={handleChangeSetting('avatarEmoji')}
                                style={[
                                    {
                                        paddingHorizontal: 10,
                                        paddingVertical: 5,
                                        borderWidth: 1,
                                        borderRadius: 15,
                                    },
                                    tw.style({
                                        [`bg-[${BLUE_MAIN_COLOR}]`]: changeSetting === 'avatarEmoji',
                                    }),
                                ]}
                                className="border-black dark:border-white"
                            >
                                <ThemedText
                                    style={[
                                        { fontSize: 16, lineHeight: 20 },
                                        tw.style({
                                            ['text-white']: changeSetting === 'avatarEmoji',
                                        }),
                                    ]}
                                >
                                    Select emoji
                                </ThemedText>
                            </Pressable>
                            <Pressable
                                onPress={handleChangeSetting('avatarColor')}
                                style={[
                                    {
                                        paddingHorizontal: 10,
                                        paddingVertical: 5,
                                        borderWidth: 1,
                                        borderRadius: 15,
                                    },
                                    tw.style({
                                        [`bg-[${BLUE_MAIN_COLOR}]`]: changeSetting === 'avatarColor',
                                    }),
                                ]}
                                className="border-black dark:border-white"
                            >
                                <ThemedText
                                    style={[
                                        { fontSize: 16, lineHeight: 20 },
                                        tw.style({
                                            ['text-white']: changeSetting === 'avatarColor',
                                        }),
                                    ]}
                                >
                                    Select background color
                                </ThemedText>
                            </Pressable>
                            <Pressable
                                onPress={handleChangeSetting('profilePicture')}
                                style={[
                                    {
                                        paddingHorizontal: 10,
                                        paddingVertical: 5,
                                        borderWidth: 1,
                                        borderRadius: 15,
                                    },
                                    tw.style({
                                        [`bg-[${BLUE_MAIN_COLOR}]`]: changeSetting === 'profilePicture',
                                    }),
                                ]}
                                className="border-black dark:border-white"
                            >
                                <ThemedText
                                    style={[
                                        { fontSize: 16, lineHeight: 20 },
                                        tw.style({
                                            ['text-white']: changeSetting === 'profilePicture',
                                        }),
                                    ]}
                                >
                                    Select profile picture
                                </ThemedText>
                            </Pressable>
                        </View>
                    </View>
                    <EmojiPicker
                        visible={changeSetting === 'avatarEmoji'}
                        handleSetEmoji={handleChangeAvatar('avatarEmoji')}
                    />
                    <PopshareColorPicker
                        visible={changeSetting === 'avatarColor'}
                        color={changeAvatar.avatarColor}
                        handleChangeColor={handleChangeAvatar('avatarColor')}
                    />
                    {changeSetting === 'profilePicture' && <></>}
                </AnimatedThemedView>
            </Modal>
        </>
    );
};

const styles = StyleSheet.create({
    pickerContainer: {
        height: '100%',
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
    },
});

export default AvatarSettingModal;
