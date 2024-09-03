import React from 'react';
import { StyleSheet, View } from 'react-native';
import ColorPicker from 'react-native-wheel-color-picker';

export interface PopshareColorPickerProps {
    handleChangeColor: (color: string) => void;
    color?: string;
    visible?: boolean;
}

const PopshareColorPicker: React.FC<PopshareColorPickerProps> = ({ handleChangeColor, color, visible }) => {
    const onColorChange = (color: string) => {
        handleChangeColor(color);
    };

    return (
        <View style={[styles.modalContainer, { display: visible ? 'flex' : 'none' }]}>
            <View style={styles.modalContent}>
                <ColorPicker
                    color={color}
                    onColorChange={onColorChange}
                    thumbSize={30}
                    sliderSize={30}
                    noSnap={true}
                    row={false}
                />
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    modalContainer: {
        flex: 1,
    },
    modalContent: {
        padding: 20,
    },
    colorPicker: {
        width: 250, // Đặt kích thước cho Color Picker
        height: 250,
    },
});

export default PopshareColorPicker;
