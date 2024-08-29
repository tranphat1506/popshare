import { Emoji } from '@/constants/EmojiConstants';
import React, { useEffect, useState } from 'react';
import { View, TextInput, FlatList, Image, TouchableOpacity, StyleSheet, Text } from 'react-native';
import { ThemedView } from '../ThemedView';
export type EmojiKey = keyof typeof Emoji;

export interface EmojiPickerProps {
    handleSetEmoji: (item: EmojiKey) => void;
    handleOpenPicker: (open: boolean) => void;
    isPickerOpen: boolean;
}
const EmojiPicker: React.FC<EmojiPickerProps> = ({ handleSetEmoji, handleOpenPicker, isPickerOpen }) => {
    const [searchText, setSearchText] = useState<string>('');
    const handleSelectEmoji = (item: EmojiKey) => () => {
        handleSetEmoji(item);
        handleOpenPicker(false);
    };
    // Lọc emoji theo text tìm kiếm
    const filteredEmoji = Object.keys(Emoji).filter((emojiName) =>
        emojiName.toLowerCase().includes(searchText.toLowerCase()),
    );

    return (
        <ThemedView style={[styles.container, { display: isPickerOpen ? 'flex' : 'none' }]}>
            <View>
                <TextInput
                    style={styles.searchBar}
                    placeholder="Tìm kiếm emoji..."
                    value={searchText}
                    onChangeText={setSearchText}
                />

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
                />
            </View>
        </ThemedView>
    );
};

const styles = StyleSheet.create({
    container: {
        position: 'absolute',
        flex: 1,
        padding: 20,
        zIndex: 10,
        height: '100%',
        width: '100%',
        top: 0,
    },
    searchBar: {
        height: 40,
        borderColor: '#ddd',
        borderWidth: 1,
        borderRadius: 5,
        paddingLeft: 10,
        marginBottom: 20,
    },
    emojiList: {
        justifyContent: 'center',
    },
    emojiIcon: {
        width: 50,
        height: 50,
        margin: 5,
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
