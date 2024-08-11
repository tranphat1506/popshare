import React, { memo } from 'react';
import { View, ViewProps } from 'react-native';
import { Avatar, Flex } from 'native-base';
import { Entypo, Feather, Ionicons, MaterialIcons } from '@expo/vector-icons';
import ButtonIconWithBadge from './ButtonIconWithBadge';
import { NavigationProp, ParamListBase, useNavigation } from '@react-navigation/native';
import { useAppSelector } from '@/redux/hooks/hooks';
import { SIZES } from '@/constants/Sizes';
// import tw from 'twrnc';
type TopToolBarProps = ViewProps;
const TopToolBar: React.FC<TopToolBarProps> = (props) => {
    const navigation: NavigationProp<ParamListBase> = useNavigation();
    const navigationToOtherRoute = (routeName: string, routeParams?: any) => () => {
        navigation.navigate(routeName, routeParams);
    };
    const peerLength = useAppSelector((state) => state.peers.count);
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
                <ButtonIconWithBadge
                    btnProps={{
                        icon: <Avatar source={require('@/assets/images/avatar.png')} />,
                        borderRadius: 'full',
                        padding: '0',
                    }}
                />
                <Flex flexDirection={'row'} justifyContent={'flex-end'} alignItems={'flex-end'}>
                    <ButtonIconWithBadge
                        marginLeft={4}
                        btnProps={{
                            _icon: {
                                as: Feather,
                                name: 'search',
                            },
                        }}
                    />
                    <ButtonIconWithBadge
                        marginLeft={4}
                        badgeProps={{
                            value: 100,
                            min: 1,
                            max: 99,
                        }}
                        btnProps={{
                            _icon: {
                                as: Ionicons,
                                name: 'notifications',
                            },
                            onPress: navigationToOtherRoute('notifications'),
                        }}
                    />
                    <ButtonIconWithBadge
                        marginLeft={4}
                        badgeProps={{
                            value: peerLength,
                            min: 1,
                        }}
                        btnProps={{
                            _icon: {
                                as: Feather,
                                name: 'users',
                            },
                            onPress: navigationToOtherRoute('friends'),
                        }}
                    />
                    <ButtonIconWithBadge
                        marginLeft={4}
                        badgeProps={{
                            value: 100,
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
