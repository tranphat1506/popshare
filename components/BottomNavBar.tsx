import { BLUE_MAIN_COLOR } from '@/constants/Colors';
import { Feather, Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { Flex } from 'native-base';
import React, { memo, useMemo } from 'react';
import { ThemedView, ThemedViewProps } from './ThemedView';
import { SIZES } from '@/constants/Sizes';
import { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { Platform } from 'react-native';
import ButtonIconWithBadge, { ButtonIconWithBadgeProps } from './ButtonIconWithBadge';
import { useThemeColor } from '@/hooks/useThemeColor';

// props for route active
const ActiveRouteProps = {
    borderTopColor: BLUE_MAIN_COLOR,
    borderTopWidth: '2px',
    borderTopRadius: '0',
};

const BottomNavBar: React.FC<BottomTabBarProps & ThemedViewProps> = ({ state, descriptors, navigation, ...props }) => {
    const notificationNotRead = useMemo(() => {
        return 0;
    }, []);
    const friendsDisplay = useMemo(() => {
        return 0;
    }, []);
    const defaultIconColor = useThemeColor({ light: '#888', dark: '#999' }, 'text');
    const NavigateDetails: { [endpoint: string]: ButtonIconWithBadgeProps } = {
        home: {
            btnProps: {
                _icon: {
                    as: MaterialCommunityIcons,
                    name: 'home',
                    color: BLUE_MAIN_COLOR,
                },
            },
        },
        friends: {
            badgeProps: {
                value: friendsDisplay,
                min: 1,
            },
            btnProps: {
                _icon: {
                    as: Feather,
                    name: 'users',
                    color: BLUE_MAIN_COLOR,
                },
            },
        },
        notifications: {
            badgeProps: {
                value: notificationNotRead,
                min: 1,
                max: 99,
            },
            btnProps: {
                _icon: {
                    as: Ionicons,
                    name: 'notifications',
                    color: BLUE_MAIN_COLOR,
                },
            },
        },
    };
    return (
        <ThemedView
            style={{
                height: SIZES.BOTTOM_NAV_BAR + (Platform.OS === 'ios' ? 28 : 0),
                width: '100%',
            }}
            {...props}
        >
            <Flex direction="row">
                {state.routes.map((route, index) => {
                    const NavigateProps = NavigateDetails[route.name as keyof typeof NavigateDetails] || undefined;
                    if (!NavigateProps) return <></>;
                    const { options } = descriptors[route.key];
                    const isFocused = state.index === index;
                    const onPress = () => {
                        const event = navigation.emit({
                            type: 'tabPress',
                            target: route.key,
                            canPreventDefault: true,
                        });

                        if (!isFocused && !event.defaultPrevented) {
                            navigation.navigate(route.name, route.params);
                        }
                    };
                    const onLongPress = () => {
                        navigation.emit({
                            type: 'tabLongPress',
                            target: route.key,
                        });
                    };
                    return (
                        <ButtonIconWithBadge
                            {...NavigateProps}
                            key={index}
                            accessibilityRole="button"
                            accessibilityState={isFocused ? { selected: true } : {}}
                            accessibilityLabel={options.tabBarAccessibilityLabel}
                            testID={options.tabBarTestID}
                            {...(isFocused ? ActiveRouteProps : {})}
                            flex={1}
                            flexBasis={`${100 / Object.keys(NavigateDetails).length}%`}
                            btnProps={{
                                ...NavigateProps.btnProps,
                                onPress: onPress,
                                onLongPress: onLongPress,
                                borderRadius: 'none',
                                borderWidth: 0,
                                height: '100%',
                                shadow: 'none',
                                _icon: {
                                    ...NavigateProps.btnProps?._icon,
                                    color: isFocused ? BLUE_MAIN_COLOR : defaultIconColor,
                                },
                            }}
                        />
                    );
                })}
            </Flex>
        </ThemedView>
    );
};

export default memo(BottomNavBar);
