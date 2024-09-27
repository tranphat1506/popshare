import React, { memo, useMemo } from 'react';
import { Pressable, View, ViewProps } from 'react-native';
import { Flex } from 'native-base';
import { Entypo, Feather } from '@expo/vector-icons';
import ButtonIconWithBadge from './ButtonIconWithBadge';
import { NavigationProp, ParamListBase, useNavigation } from '@react-navigation/native';
import { useAppSelector } from '@/redux/hooks/hooks';
import { SIZES } from '@/constants/Sizes';
import PopshareAvatar from './common/PopshareAvatar';
import { EmojiKey } from './common/EmojiPicker';
import { LoginSessionManager } from '@/storage/loginSession.storage';
import { useDispatch } from 'react-redux';
import { logout } from '@/redux/auth/reducer';
import { clear } from '@/redux/peers/reducer';
import { clearChatState } from '@/redux/chatRoom/reducer';
// import tw from 'twrnc';
type TopToolBarProps = ViewProps;
const TopToolBar: React.FC<TopToolBarProps> = (props) => {
    const dispatch = useDispatch();
    const navigation: NavigationProp<ParamListBase> = useNavigation();
    const navigationToOtherRoute = (routeName: string, routeParams?: any) => () => {
        navigation.navigate(routeName, routeParams);
    };
    const userData = useAppSelector((state) => state.auth.user);
    const chatRoomState = useAppSelector((state) => state.chatRoom);
    const messageNotRead = useMemo(() => {
        return Object.keys(chatRoomState.rooms).filter((r) => !!chatRoomState.rooms[r]?.notRead === true).length;
    }, [chatRoomState]);
    const handleLogout = async () => {
        await LoginSessionManager.logoutSession(false);
        dispatch(clear());
        dispatch(logout());
        dispatch(clearChatState());
    };
    return (
        <View
            style={{
                marginHorizontal: 15,
                display: 'flex',
                justifyContent: 'center',
                height: SIZES.TOP_TOOL_BAR,
            }}
        >
            <Flex
                width={'full'}
                flexDirection={'row'}
                justifyContent={'space-between'}
                alignItems={'flex-end'}
                justifyItems={'flex-end'}
            >
                <Pressable onPress={handleLogout}>
                    <PopshareAvatar
                        size={50}
                        avatarColor={userData?.avatarColor || ''}
                        avatarEmoji={(userData?.avatarEmoji as EmojiKey) || ''}
                        profilePicture={userData?.profilePicture}
                        skeleton={userData === undefined}
                    />
                </Pressable>
                <Flex flexDirection={'row'} justifyContent={'flex-end'} alignItems={'flex-end'}>
                    <ButtonIconWithBadge
                        marginLeft={4}
                        btnProps={{
                            _icon: {
                                as: Feather,
                                name: 'search',
                            },
                            onPress: navigationToOtherRoute('search'),
                        }}
                    />
                    <ButtonIconWithBadge
                        marginLeft={4}
                        badgeProps={{
                            value: messageNotRead,
                            min: 1,
                            max: 99,
                        }}
                        btnProps={{
                            _icon: {
                                as: Entypo,
                                name: 'message',
                            },
                            onPress: navigationToOtherRoute('messages'),
                        }}
                    />
                </Flex>
            </Flex>
        </View>
    );
};

export default memo(TopToolBar);
