import React from 'react';
import { View } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { ThemedView } from '../ThemedView';
import { BLUE_MAIN_COLOR } from '@/constants/Colors';
import { Icon } from 'native-base';
import { AntDesign } from '@expo/vector-icons';

interface ButtonScrollToEndProps {
    handleClick: () => void;
}
const ButtonScrollToEnd: React.FC<ButtonScrollToEndProps> = ({ handleClick }) => {
    return (
        <View
            style={{
                flexDirection: 'row',
                width: '100%',
                position: 'absolute',
                zIndex: 2,
                bottom: 100,
                justifyContent: 'flex-end',
            }}
        >
            <View
                style={{
                    justifyContent: 'center',
                    alignItems: 'center',
                    marginHorizontal: 20,
                }}
            >
                <TouchableOpacity activeOpacity={0.7} onPress={handleClick}>
                    <ThemedView
                        lightColor={`${BLUE_MAIN_COLOR}`}
                        darkColor={`${BLUE_MAIN_COLOR}`}
                        style={{
                            borderRadius: 999,
                            padding: 10,
                        }}
                    >
                        <Icon as={AntDesign} name="caretdown" size={'sm'} color={'white'} />
                    </ThemedView>
                </TouchableOpacity>
            </View>
        </View>
    );
};

export default ButtonScrollToEnd;
