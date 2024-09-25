import DefaultLayout from '@/components/layout/DefaultLayout';
import { ThemedText } from '@/components/ThemedText';
import useLanguage from '@/languages/hooks/useLanguage';
import { Ionicons } from '@expo/vector-icons';
import { Icon, Input } from 'native-base';
import React, { useMemo } from 'react';
import { SectionList, StyleSheet, TouchableOpacity, View } from 'react-native';

const SearchScreen = () => {
    const lang = useLanguage();
    const textData = useMemo(() => {
        return {
            SEARCH_PLACEHOLDER: lang.SEARCH_PLACEHOLDER,
        };
    }, [lang]);
    return (
        <>
            <DefaultLayout preventStatusBar={true}>
                {/* Header */}
                <View className="flex flex-row items-center px-4 h-14 justify-between">
                    <View
                        className="flex flex-row items-center justify-between mr-4"
                        style={{ columnGap: 20, borderRadius: 100 }}
                    >
                        <TouchableOpacity onPress={undefined} activeOpacity={0.6} style={{ borderRadius: 100 }}>
                            <Icon as={Ionicons} name="arrow-back" size={'lg'} className="text-black dark:text-white" />
                        </TouchableOpacity>
                    </View>
                    <View
                        style={{
                            flex: 1,
                            flexDirection: 'row',
                            alignItems: 'center',
                            justifyContent: 'center',
                            columnGap: 10,
                            borderWidth: 1,
                            borderRadius: 100,
                            paddingHorizontal: 5,
                            borderColor: '#888',
                            height: 40,
                        }}
                    >
                        <Input
                            placeholder={textData.SEARCH_PLACEHOLDER}
                            type="text"
                            keyboardType="web-search"
                            borderRadius={100}
                            variant={'unstyled'}
                            flex={1}
                            fontFamily={'System-Regular'}
                            fontSize={16}
                            className="text-black dark:text-white"
                        />
                    </View>
                </View>
            </DefaultLayout>
        </>
    );
};

const styles = StyleSheet.create({});

export default SearchScreen;
