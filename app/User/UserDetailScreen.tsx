import React, { useEffect, useMemo, useState } from 'react';
import { View, ScrollView, RefreshControl } from 'react-native';
import { NavigationProp, RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { useAppDispatch, useAppSelector } from '@/redux/hooks/hooks';
import { addPeer, IUserPublicDetail, Peer, updatePeerById } from '@/redux/peers/reducer';
import {
    FetchAddFriendByUserId,
    FetchingFriendshipByUserId,
    FetchUnFriendByUserId,
    FetchUserAvatarByUrl,
    FetchUserProfileById,
} from '@/helpers/fetching';
import { getAllFirstLetterOfString } from '@/helpers/string';
import { LoginSessionManager } from '@/storage/loginSession.storage';
import { ThemedView } from '@/components/ThemedView';
import PopshareAvatar from '@/components/common/PopshareAvatar';
import DefaultLayout from '@/components/layout/DefaultLayout';
import useCustomScreenOptions from '@/hooks/useCustomScreenOptions';
import { RootStackParamList } from '@/configs/routes.config';
import { EmojiKey } from '@/components/common/EmojiPicker';
import { ThemedText } from '@/components/ThemedText';
import { Skeleton } from 'native-base';
import { Feather, FontAwesome6 } from '@expo/vector-icons';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { useThemeColor } from '@/hooks/useThemeColor';
import { BlurView } from 'expo-blur';
import useLanguage from '@/languages/hooks/useLanguage';
import _ from 'lodash';

const DEFAULT_AVATAR_SIZE = 100;

const UserDetailScreen = () => {
    const { params: routeParams } = useRoute<RouteProp<RootStackParamList, 'user-detail'>>();
    const dispatch = useAppDispatch();
    const currentUser = useAppSelector((state) => state.auth.user);
    const existUserDetail = useAppSelector((state) => state.peers.peers[routeParams.userId]);
    const [userPublicDetail, setUserPublicDetail] = useState<IUserPublicDetail>();
    const [refreshing, setRefreshing] = useState(false); // State for refresh control
    const lang = useLanguage();
    const textData = useMemo(() => {
        return {
            ADD_FRIEND: lang.ADD_FRIEND,
            IS_FRIEND: lang.FRIEND,
            UN_FRIEND: lang.UN_FRIEND,
            IS_ME: lang.YOU_TEXT,
            DEACTIVE_ADD_FRIEND: lang.DEACTIVE_ADD_FRIEND,
            ACTIVE_ADD_FRIEND: lang.ACTIVE_ADD_FRIEND,
        };
    }, [lang]);
    const handleFetchingUserData = async (strict?: boolean) => {
        try {
            const session = await LoginSessionManager.getCurrentSession();
            if (!existUserDetail || strict) {
                const data = await FetchUserProfileById(routeParams.userId, {
                    token: session?.token,
                    rtoken: session?.rtoken,
                });
                if (!data) throw Error('Cannot Fetching');
                const uriData = data.user.profilePicture
                    ? await FetchUserAvatarByUrl(data.user.profilePicture)
                    : undefined;
                // console.log(data.friendship);
                const peer: Peer = {
                    ...data.user,
                    uriAvatar: uriData,
                    suffixName: getAllFirstLetterOfString(data.user.displayName),
                    friendship: data.friendship,
                    isMyFriend: data.friendship?.status === 'accepted',
                };
                dispatch(addPeer(peer));
                setUserPublicDetail(peer);
            } else if (existUserDetail.profilePicture && !existUserDetail.uriAvatar) {
                const uriData = existUserDetail.profilePicture
                    ? await FetchUserAvatarByUrl(existUserDetail.profilePicture)
                    : undefined;
                const peer: Peer = { ...existUserDetail, uriAvatar: uriData };
                dispatch(addPeer(peer));
                setUserPublicDetail(peer);
            } else {
                const friendship = await FetchingFriendshipByUserId(
                    {
                        token: session?.token,
                        rtoken: session?.rtoken,
                    },
                    existUserDetail.userId,
                );
                setUserPublicDetail({ ...existUserDetail, friendship: friendship?.friendship });
                dispatch(
                    updatePeerById({
                        userId: existUserDetail.userId,
                        field: 'friendship',
                        data: friendship?.friendship,
                    }),
                    updatePeerById({
                        userId: existUserDetail.userId,
                        field: 'isMyFriend',
                        data: friendship?.friendship?.status === 'accepted',
                    }),
                );
            }
        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        if (currentUser && currentUser.userId !== routeParams.userId && !userPublicDetail) {
            handleFetchingUserData();
        }
    }, [existUserDetail, currentUser?.userId, routeParams.userId]);

    useCustomScreenOptions({
        headerShown: false,
    });

    const onRefresh = async () => {
        setRefreshing(true);
        setUserPublicDetail(undefined);
        await handleFetchingUserData(true); // Fetch user data on refresh
        setRefreshing(false); // End the refresh state
    };
    const defaultBorderColor = useThemeColor({ light: '#000', dark: '#fff' }, 'background');
    const navigation = useNavigation<NavigationProp<RootStackParamList, 'user-detail'>>();
    const handleClickButtonBack = () => {
        navigation.goBack();
    };

    // Handle add and un friend
    const handleAddFriend = () => {
        const addFriend = async () => {
            try {
                const session = await LoginSessionManager.getCurrentSession();
                if (!userPublicDetail) return;
                const data = await FetchAddFriendByUserId(
                    {
                        token: session?.token,
                        rtoken: session?.rtoken,
                    },
                    userPublicDetail.userId,
                );
                setUserPublicDetail({
                    ...userPublicDetail,
                    friendship: data.friendRequest,
                });
                dispatch(
                    updatePeerById({
                        userId: userPublicDetail.userId,
                        field: 'friendship',
                        data: data.friendRequest,
                    }),
                    updatePeerById({
                        userId: userPublicDetail.userId,
                        field: 'isMyFriend',
                        data: data.friendRequest.status === 'accepted',
                    }),
                );
            } catch (error) {
                console.error('ERROR WHILE ADD FRIEND', error);
            }
        };
        addFriend();
    };
    const handleUnFriend = () => {
        const unFriend = async () => {
            try {
                const session = await LoginSessionManager.getCurrentSession();
                if (!userPublicDetail) return;
                const data = await FetchUnFriendByUserId(
                    {
                        token: session?.token,
                        rtoken: session?.rtoken,
                    },
                    userPublicDetail.userId,
                );
                setUserPublicDetail({
                    ...userPublicDetail,
                    friendship: undefined,
                });
                dispatch(
                    updatePeerById({
                        userId: userPublicDetail.userId,
                        field: 'friendship',
                        data: undefined,
                    }),
                    updatePeerById({
                        userId: userPublicDetail.userId,
                        field: 'isMyFriend',
                        data: false,
                    }),
                );
            } catch (error) {
                console.error('ERROR WHILE UNFRIEND', error);
            }
        };
        unFriend();
    };
    // debounce
    const handleOnPressAddFriend = _.debounce(handleAddFriend, 2000, {
        leading: true,
        trailing: false,
    });
    const handleOnPressUnFriend = _.debounce(handleUnFriend, 2000, {
        leading: true,
        trailing: false,
    });
    if (!userPublicDetail) return <EmptyProfile refreshing={refreshing} onRefresh={onRefresh} />;
    if (userPublicDetail && currentUser?.userId !== routeParams.userId)
        return (
            <>
                <DefaultLayout preventStatusBar={true}>
                    <ScrollView
                        contentContainerStyle={{ flexGrow: 1 }}
                        refreshControl={
                            <RefreshControl
                                refreshing={refreshing} // Bind refresh state
                                onRefresh={onRefresh} // Trigger when pull-to-refresh is activated
                            />
                        }
                    >
                        <View
                            style={{
                                position: 'relative',
                                width: '100%',
                                height: '30%',
                                maxHeight: 200,
                            }}
                        >
                            {/* Back Container */}
                            <View
                                style={{
                                    position: 'absolute',
                                    zIndex: 1,
                                    top: 15,
                                    left: 15,
                                }}
                            >
                                {/* Back Button */}
                                <TouchableOpacity activeOpacity={0.8} onPress={handleClickButtonBack}>
                                    <BlurView
                                        style={{
                                            borderColor: defaultBorderColor,
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            display: 'flex',
                                            padding: 5,
                                            overflow: 'hidden',
                                            borderRadius: 1000,
                                        }}
                                        intensity={50}
                                        tint="dark"
                                    >
                                        <Feather size={20} name={'chevron-left'} color={'#fff'} style={{ left: -1 }} />
                                    </BlurView>
                                </TouchableOpacity>
                            </View>
                            {/* Background avatar */}
                            <ThemedView
                                lightColor={userPublicDetail.avatarColor}
                                darkColor={userPublicDetail.avatarColor}
                                style={{ flex: 1 }}
                            />
                            <View
                                style={{
                                    position: 'absolute',
                                    bottom: -(DEFAULT_AVATAR_SIZE / 1.5),
                                    // borderWidth: 1,
                                    // borderColor: '#fff',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    paddingHorizontal: 10,
                                }}
                            >
                                <ThemedView
                                    style={{
                                        padding: 5,
                                        borderRadius: 1000,
                                        display: 'flex',
                                    }}
                                >
                                    <PopshareAvatar
                                        size={DEFAULT_AVATAR_SIZE}
                                        avatarColor={userPublicDetail.avatarColor}
                                        avatarEmoji={userPublicDetail.avatarEmoji as EmojiKey}
                                        profilePicture={userPublicDetail.profilePicture}
                                        displayOnlineState={!!userPublicDetail.onlineState}
                                        onlineState={userPublicDetail.onlineState}
                                    />
                                </ThemedView>
                            </View>
                        </View>
                        <View
                            style={{
                                paddingHorizontal: 15,
                                marginTop: 10,
                                flexDirection: 'row',
                                justifyContent: 'flex-end',
                            }}
                        >
                            {!userPublicDetail.friendship && (
                                <TouchableOpacity
                                    activeOpacity={0.8}
                                    onPress={handleOnPressAddFriend}
                                    style={{
                                        paddingHorizontal: 14,
                                        paddingVertical: 7,
                                        borderColor: defaultBorderColor,
                                        borderWidth: 1,
                                        borderRadius: 100,
                                        flex: 1,
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                    }}
                                >
                                    <ThemedText style={{ fontFamily: 'System-SemiBold' }}>
                                        {textData.ADD_FRIEND}
                                    </ThemedText>
                                </TouchableOpacity>
                            )}
                            {userPublicDetail.friendship?.status === 'pending' && (
                                <>
                                    {userPublicDetail.friendship.senderId === currentUser?.userId ? (
                                        <TouchableOpacity
                                            activeOpacity={0.8}
                                            onPress={handleOnPressUnFriend}
                                            style={{
                                                paddingHorizontal: 14,
                                                paddingVertical: 7,
                                                borderColor: defaultBorderColor,
                                                borderWidth: 1,
                                                borderRadius: 100,
                                                flex: 1,
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                            }}
                                        >
                                            <ThemedText style={{ fontFamily: 'System-SemiBold' }}>
                                                {textData.DEACTIVE_ADD_FRIEND}
                                            </ThemedText>
                                        </TouchableOpacity>
                                    ) : (
                                        <TouchableOpacity
                                            activeOpacity={0.8}
                                            onPress={handleOnPressAddFriend}
                                            style={{
                                                paddingHorizontal: 14,
                                                paddingVertical: 7,
                                                borderColor: defaultBorderColor,
                                                borderWidth: 1,
                                                borderRadius: 100,
                                                flex: 1,
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                            }}
                                        >
                                            <ThemedText style={{ fontFamily: 'System-SemiBold' }}>
                                                {textData.ACTIVE_ADD_FRIEND}
                                            </ThemedText>
                                        </TouchableOpacity>
                                    )}
                                </>
                            )}
                            {userPublicDetail.friendship?.status === 'accepted' && (
                                <TouchableOpacity
                                    onPress={handleUnFriend}
                                    activeOpacity={0.8}
                                    style={{
                                        paddingHorizontal: 14,
                                        paddingVertical: 7,
                                        borderColor: defaultBorderColor,
                                        borderWidth: 1,
                                        borderRadius: 100,
                                        flex: 1,
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        flexDirection: 'row',
                                        columnGap: 5,
                                    }}
                                >
                                    <FontAwesome6 name={'user-check'} size={16} color={defaultBorderColor} />
                                    <ThemedText style={{ fontFamily: 'System-SemiBold' }}>
                                        {textData.IS_FRIEND}
                                    </ThemedText>
                                </TouchableOpacity>
                            )}
                        </View>
                        <View style={{ paddingHorizontal: 15, marginTop: DEFAULT_AVATAR_SIZE / 1.5 - 40 }}>
                            <ThemedText
                                numberOfLines={2}
                                style={{ fontFamily: 'System-Bold', fontSize: 20, lineHeight: 24 }}
                            >
                                {userPublicDetail.displayName}
                            </ThemedText>
                            <ThemedText lightColor="#888" darkColor="#999">
                                @{userPublicDetail.username}
                            </ThemedText>
                        </View>
                    </ScrollView>
                </DefaultLayout>
            </>
        );

    return null;
};

const EmptyProfile = ({ refreshing, onRefresh }: { refreshing: boolean; onRefresh: () => void }) => {
    return (
        <>
            <DefaultLayout preventStatusBar={false}>
                <ScrollView
                    contentContainerStyle={{ flexGrow: 1 }}
                    refreshControl={
                        <RefreshControl
                            refreshing={refreshing} // Bind refresh state
                            onRefresh={onRefresh} // Trigger when pull-to-refresh is activated
                        />
                    }
                >
                    <View
                        style={{
                            position: 'relative',
                            width: '100%',
                            height: '30%',
                            maxHeight: 200,
                        }}
                    >
                        {/* Background avatar */}
                        <Skeleton style={{ flex: 1 }} />
                        <View
                            style={{
                                position: 'absolute',
                                bottom: -(DEFAULT_AVATAR_SIZE / 1.2),
                                // borderWidth: 1,
                                // borderColor: '#fff',
                                display: 'flex',
                                flexDirection: 'column',
                                paddingHorizontal: 10,
                            }}
                        >
                            <ThemedView
                                style={{
                                    padding: 5,
                                    borderRadius: 1000,
                                    display: 'flex',
                                }}
                            >
                                <PopshareAvatar size={DEFAULT_AVATAR_SIZE} skeleton={true} />
                            </ThemedView>
                        </View>
                    </View>
                    <View
                        style={{
                            paddingHorizontal: 15,
                            marginTop: 10,
                            flexDirection: 'row',
                            justifyContent: 'flex-end',
                        }}
                    >
                        <Skeleton
                            style={{
                                width: 100,
                                height: 35,
                            }}
                            borderRadius="full"
                        />
                    </View>
                    <View style={{ paddingHorizontal: 15, marginTop: DEFAULT_AVATAR_SIZE / 1.2 - 30 }}>
                        <Skeleton h={'20px'} borderRadius={'md'} w={'100px'} />
                        <Skeleton h={'16px'} borderRadius={'md'} w={'50px'} marginTop={'4px'} />
                    </View>
                </ScrollView>
            </DefaultLayout>
        </>
    );
};
export default UserDetailScreen;
