import { EmojiKey } from '@/components/common/EmojiPicker';
import PopshareAvatar from '@/components/common/PopshareAvatar';
import DefaultLayout from '@/components/layout/DefaultLayout';
import { ThemedText } from '@/components/ThemedText';
import { RootStackParamList } from '@/configs/routes.config';
import { FetchingFriendshipByUserId, FetchingSearchByKeywordPayload, FetchSearchByKeyword } from '@/helpers/fetching';
import { useThemeColor } from '@/hooks/useThemeColor';
import useLanguage from '@/languages/hooks/useLanguage';
import { useAppSelector } from '@/redux/hooks/hooks';
import { LoginSessionManager } from '@/storage/loginSession.storage';
import { Entypo, Ionicons } from '@expo/vector-icons';
import { NavigationProp, useNavigation } from '@react-navigation/native';
import { Icon, Input } from 'native-base';
import React, { useMemo, useState } from 'react';
import { Pressable, TouchableOpacity, View } from 'react-native';

const SearchScreen = () => {
    const lang = useLanguage();
    const textData = useMemo(() => {
        return {
            SEARCH_PLACEHOLDER: lang.SEARCH_PLACEHOLDER,
            EMPTY_SEARCH_RESULT: lang.EMPTY_SEARCH_RESULT,
            IS_MY_FRIEND: lang.FRIEND,
            IS_ME: lang.YOU_TEXT,
        };
    }, [lang]);
    const [searchInput, setSearchInput] = useState<string>('');
    const [searchResult, setSearchResult] = useState<FetchingSearchByKeywordPayload | null>(null);
    const peers = useAppSelector((state) => state.peers.peers);
    const currentUserId = useAppSelector((state) => state.auth.user?.userId);
    const handleChangeSearchInput = (text: string) => {
        setSearchInput(text);
    };
    const handleSubmitSearch = () => {
        const handleSearchByKeyword = async () => {
            try {
                const session = await LoginSessionManager.getCurrentSession();
                if (!session) throw Error('ERROR_SESSION_EMPTY');
                const result = await FetchSearchByKeyword(
                    {
                        token: session.token,
                        rtoken: session.rtoken,
                    },
                    searchInput,
                );
                if (result)
                    // Add friendship to user
                    for (const user of result?.result.user) {
                        user.userId = user._id;
                        let existFriendship = peers[user.userId]?.friendship;
                        if (!existFriendship) {
                            existFriendship = (
                                await FetchingFriendshipByUserId(
                                    {
                                        token: session.token,
                                        rtoken: session.rtoken,
                                    },
                                    user.userId,
                                )
                            )?.friendship;
                        }
                        user.friendship = existFriendship;
                        user.isMyFriend = existFriendship?.status === 'accepted';
                    }
                setSearchResult(result);
            } catch (error) {
                console.error(`ERROR WHILE SEARCHING::${searchInput}::`, error);
            }
        };
        console.log('Search');
        handleSearchByKeyword();
    };
    const navigation = useNavigation<NavigationProp<RootStackParamList, 'search'>>();
    const handleExit = () => {
        navigation.goBack();
        return true;
    };
    const handleClearSearchInput = () => {
        setSearchInput('');
        setSearchResult(null);
    };
    const handleNavigateToUserDetail = (userId: string) => {
        navigation.navigate('user-detail', {
            userId: userId,
        });
    };
    const defaultPressedBgColor = useThemeColor({ light: '#f5f5f5', dark: '#222' }, 'background');
    return (
        <>
            <DefaultLayout preventStatusBar={true}>
                {/* Header */}
                <View className="flex flex-row items-center px-4 h-14 justify-between">
                    <View
                        className="flex flex-row items-center justify-between mr-4"
                        style={{ columnGap: 20, borderRadius: 100 }}
                    >
                        <TouchableOpacity onPress={handleExit} activeOpacity={0.6} style={{ borderRadius: 100 }}>
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
                            onChangeText={handleChangeSearchInput}
                            onSubmitEditing={handleSubmitSearch}
                            value={searchInput}
                            placeholder={textData.SEARCH_PLACEHOLDER}
                            borderRadius={100}
                            variant={'unstyled'}
                            flex={1}
                            fontFamily={'System-Regular'}
                            fontSize={16}
                            className="text-black dark:text-white"
                        />
                    </View>
                </View>
                <View className="py-4">
                    {!searchResult && (
                        <>
                            <View className="px-4">
                                <ThemedText lightColor="#888" darkColor="#999">
                                    {textData.EMPTY_SEARCH_RESULT}
                                </ThemedText>
                            </View>
                        </>
                    )}
                    {searchResult && (
                        <>
                            {searchResult.result.user.map((user) => {
                                return (
                                    <Pressable
                                        key={user.userId}
                                        style={({ pressed }) => {
                                            return {
                                                paddingHorizontal: 16,
                                                backgroundColor: pressed ? defaultPressedBgColor : undefined,
                                            };
                                        }}
                                        onPress={() => handleNavigateToUserDetail(user.userId)}
                                    >
                                        <View className="flex flex-row py-2" style={{ columnGap: 15 }}>
                                            <PopshareAvatar
                                                avatarColor={user.avatarColor}
                                                avatarEmoji={user.avatarEmoji as EmojiKey}
                                                profilePicture={user.profilePicture}
                                                size={40}
                                            />
                                            <View className="flex flex-col items-start">
                                                <ThemedText
                                                    numberOfLines={1}
                                                    style={{ fontFamily: 'System-Medium', maxWidth: '100%' }}
                                                >
                                                    {user.displayName}
                                                </ThemedText>
                                                <View className="flex flex-row" style={{ flex: 1, width: '100%' }}>
                                                    <ThemedText
                                                        lightColor="#888"
                                                        darkColor="#999"
                                                        numberOfLines={1}
                                                        style={{
                                                            fontSize: 12,
                                                            lineHeight: 15,
                                                            fontFamily: 'System-Medium',
                                                            maxWidth: 200,
                                                        }}
                                                    >
                                                        @{user.username}
                                                    </ThemedText>
                                                    {user.isMyFriend && (
                                                        <>
                                                            <Icon as={Entypo} name="dot-single" />
                                                            <ThemedText
                                                                lightColor="#888"
                                                                darkColor="#999"
                                                                style={{
                                                                    fontSize: 12,
                                                                    lineHeight: 15,
                                                                    fontFamily: 'System-Medium',
                                                                }}
                                                            >
                                                                {textData.IS_MY_FRIEND}
                                                            </ThemedText>
                                                        </>
                                                    )}
                                                    {user.userId === currentUserId && (
                                                        <>
                                                            <Icon as={Entypo} name="dot-single" />
                                                            <ThemedText
                                                                lightColor="#888"
                                                                darkColor="#999"
                                                                style={{
                                                                    fontSize: 12,
                                                                    lineHeight: 15,
                                                                    fontFamily: 'System-Medium',
                                                                }}
                                                            >
                                                                {textData.IS_ME}
                                                            </ThemedText>
                                                        </>
                                                    )}
                                                </View>
                                            </View>
                                        </View>
                                    </Pressable>
                                );
                            })}
                        </>
                    )}
                </View>
            </DefaultLayout>
        </>
    );
};

export default SearchScreen;
