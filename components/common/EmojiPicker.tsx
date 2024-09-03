import { Emoji } from '@/constants/EmojiConstants';
import React, { useState } from 'react';
import { View, FlatList, Image, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { ThemedView } from '../ThemedView';
import { ThemedText } from '../ThemedText';
import { StyleProps } from 'react-native-reanimated';
import { Icon, Input } from 'native-base';
import { BLUE_MAIN_COLOR } from '@/constants/Colors';
import { Feather } from '@expo/vector-icons';
export type EmojiKey = keyof typeof Emoji;

export interface EmojiPickerProps {
    handleSetEmoji: (item: EmojiKey) => void;
    visible?: boolean;
    style?: StyleProps;
    className?: string;
}
const EmojiPicker: React.FC<EmojiPickerProps> = ({ handleSetEmoji, style, className, visible }) => {
    const [searchText, setSearchText] = useState<string>('');
    const handleSelectEmoji = (item: EmojiKey) => () => {
        handleSetEmoji(item);
    };
    // Lọc emoji theo text tìm kiếm
    const filteredEmoji = Object.keys(Emoji).filter((emojiName) =>
        emojiName.toLowerCase().includes(searchText.toLowerCase()),
    );

    return (
        <ThemedView style={[styles.container, style, { display: visible ? 'flex' : 'none' }]} className={className}>
            <View style={{ marginBottom: 20 }}>
                <ThemedText style={{ fontSize: 16, lineHeight: 20 }}>Search emoji:</ThemedText>
                <Input
                    focusOutlineColor={BLUE_MAIN_COLOR}
                    _focus={{
                        backgroundColor: '#ffffff00',
                    }}
                    onChangeText={setSearchText}
                    value={searchText}
                    type={'text'}
                    fontFamily={'System-Regular'}
                    paddingX={20}
                    fontSize={16}
                    lineHeight={20}
                    borderRadius={'full'}
                    className="bg-white text-black dark:text-white dark:bg-black"
                    InputLeftElement={
                        <TouchableOpacity style={{ marginLeft: 10 }}>
                            <Icon
                                className="bg-white text-black dark:text-white dark:bg-black"
                                as={Feather}
                                name="search"
                            />
                        </TouchableOpacity>
                    }
                />
            </View>
            <FlatList
                data={filteredEmoji}
                numColumns={6} // Số cột trong ma trận
                keyExtractor={(item) => item}
                renderItem={({ item }) => (
                    <TouchableOpacity onPress={handleSelectEmoji(item as EmojiKey)}>
                        <Image source={Emoji[item as EmojiKey]} style={styles.emojiIcon} />
                    </TouchableOpacity>
                )}
                contentContainerStyle={styles.emojiList}
                columnWrapperStyle={{ gap: 10 }}
                key={searchText}
            />
        </ThemedView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        justifyContent: 'center',
    },
    emojiList: {
        justifyContent: 'center',
        alignItems: 'center',
        rowGap: 10,
    },
    emojiIcon: {
        width: 50,
        height: 50,
    },
    selectedEmojiContainer: {
        alignItems: 'center',
        marginTop: 20,
    },
    selectedEmoji: {
        width: 100,
        height: 100,
    },
    emojiName: {
        fontSize: 18,
        marginTop: 10,
    },
    label: {
        fontSize: 16,
        marginBottom: 5,
    },
});

export default EmojiPicker;
