import React, { useRef, useEffect } from 'react';
import { View, TouchableOpacity, Modal, Animated, StyleSheet, Dimensions } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { AnimatedThemedView } from '@/components/AnimatedThemedView';
import EmojiPicker, { EmojiPickerProps } from '@/components/common/EmojiPicker';

const screenHeight = Dimensions.get('window').height;

interface AvatarSettingModalProps {
    handleChangePickerVisible: (state: boolean) => void;
    isPickerVisible: boolean;
    emojiPicker: EmojiPickerProps;
}

const AvatarSettingModal: React.FC<AvatarSettingModalProps> = ({
    handleChangePickerVisible,
    isPickerVisible,
    emojiPicker,
}) => {
    const slideAnim = useRef(new Animated.Value(screenHeight)).current;

    useEffect(() => {
        if (isPickerVisible) {
            openPicker();
        }
    }, [isPickerVisible]);

    const openPicker = () => {
        handleChangePickerVisible(true);
        Animated.timing(slideAnim, {
            toValue: 0,
            duration: 300,
            useNativeDriver: true,
        }).start();
    };

    const closePicker = () => {
        Animated.timing(slideAnim, {
            toValue: screenHeight,
            duration: 300,
            useNativeDriver: true,
        }).start(() => handleChangePickerVisible(false));
    };

    const handleOptionPress = (option: string) => {
        console.log(`Đã chọn: ${option}`);
        closePicker();
        // Xử lý sự kiện nhấn cho từng option ở đây
    };

    return (
        <>
            <EmojiPicker {...emojiPicker} />
            <Modal visible={isPickerVisible} transparent={true} animationType="none">
                <View style={styles.modalBackground}>
                    <TouchableOpacity style={styles.modalOverlay} onPress={closePicker} />
                    <AnimatedThemedView style={[styles.pickerContainer, { transform: [{ translateY: slideAnim }] }]}>
                        <ThemedText style={[styles.title]}>Avatar Settings</ThemedText>
                        <View style={styles.optionButton}>
                            <TouchableOpacity onPress={() => emojiPicker.handleOpenPicker(true)}>
                                <ThemedText style={[styles.optionText]}>Choose Emoji</ThemedText>
                            </TouchableOpacity>
                        </View>
                        <View style={styles.optionButton}>
                            <TouchableOpacity onPress={() => handleOptionPress('Chọn nền background')}>
                                <ThemedText style={[styles.optionText]}>Choose Background Color</ThemedText>
                            </TouchableOpacity>
                        </View>
                        <View style={styles.optionButton}>
                            <TouchableOpacity onPress={() => handleOptionPress('Chọn từ thư viện')}>
                                <ThemedText style={[styles.optionText]}>Choose From Library</ThemedText>
                            </TouchableOpacity>
                        </View>
                        <View style={styles.optionButton}>
                            <TouchableOpacity onPress={closePicker}>
                                <ThemedText style={[styles.optionText]}>Exit</ThemedText>
                            </TouchableOpacity>
                        </View>
                    </AnimatedThemedView>
                </View>
            </Modal>
        </>
    );
};

const styles = StyleSheet.create({
    container: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        position: 'absolute',
        zIndex: 1,
        height: '100%',
        width: '100%',
    },
    openButtonText: {
        color: '#fff',
        fontSize: 16,
    },
    modalBackground: {
        flex: 1,
        justifyContent: 'flex-end',
    },
    modalOverlay: {
        flex: 1,
    },
    pickerContainer: {
        paddingTop: 20,
        borderTopLeftRadius: 15,
        borderTopRightRadius: 15,
    },
    title: {
        fontSize: 20,
        marginBottom: 10,
        textAlign: 'center',
        fontFamily: 'System-Medium',
    },
    optionButton: {
        width: '100%',
        paddingVertical: 15,
        borderTopWidth: 1,
        borderTopColor: '#7e7e7e',
    },
    optionText: {
        fontSize: 16,
        textAlign: 'center',
        fontFamily: 'System-Regular',
    },
});

export default AvatarSettingModal;
