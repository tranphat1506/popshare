import { BLUE_MAIN_COLOR } from '@/constants/Colors';
import { Feather, Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { Flex } from 'native-base';
import React, { memo, useEffect, useMemo, useRef } from 'react';
import { ThemedView, ThemedViewProps } from './ThemedView';
import { SIZES } from '@/constants/Sizes';
import { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { Animated, Dimensions, Platform } from 'react-native';
import ButtonIconWithBadge, { ButtonIconWithBadgeProps } from './ButtonIconWithBadge';
import { useThemeColor } from '@/hooks/useThemeColor';
import { AnimatedThemedView } from './AnimatedThemedView';
const { width: SCREEN_WIDTH } = Dimensions.get('window');
// props for route active

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
                zIndex: 10,
            }}
            {...props}
        >
            <FocusedBorderTop currentIndex={state.index} maxIndex={state.routeNames.length - 1} />
            <Flex direction="row" alignItems={'center'}>
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
                        console.log('PRESS');

                        if (!isFocused && !event.defaultPrevented) {
                            navigation.navigate(route.name, route.params);
                        }
                    };
                    return (
                        <ButtonIconWithBadge
                            {...NavigateProps}
                            key={index}
                            accessibilityRole="button"
                            accessibilityState={isFocused ? { selected: true } : {}}
                            accessibilityLabel={options.tabBarAccessibilityLabel}
                            flex={1}
                            flexBasis={`${100 / Object.keys(NavigateDetails).length}%`}
                            btnProps={{
                                ...NavigateProps.btnProps,
                                onPress: onPress,
                                borderRadius: 'none',
                                borderWidth: 0,
                                shadow: 'none',
                                _icon: {
                                    ...NavigateProps.btnProps?._icon,
                                    color: isFocused ? BLUE_MAIN_COLOR : defaultIconColor,
                                    size: 'lg',
                                },
                                height: SIZES.BOTTOM_NAV_BAR - 10,
                            }}
                        />
                    );
                })}
            </Flex>
        </ThemedView>
    );
};
interface FocusedBorderTopProps {
    currentIndex: number;
    maxIndex: number;
}
const FocusedBorderTop: React.FC<FocusedBorderTopProps> = ({ currentIndex, maxIndex }) => {
    const STEP_WIDTH_PERCENT = 100 / (maxIndex + 1);
    const animatedIndex = useRef(new Animated.Value(currentIndex)).current;
    useEffect(() => {
        // Animate when index changes
        Animated.timing(animatedIndex, {
            toValue: currentIndex,
            duration: 500,
            useNativeDriver: false,
        }).start();
    }, [currentIndex]);

    const animatedTranslateX = animatedIndex.interpolate({
        inputRange: new Array(maxIndex).fill('').map((_, index) => {
            return index;
        }),
        outputRange: new Array(maxIndex).fill('').map((_, index) => {
            return SCREEN_WIDTH * ((index * STEP_WIDTH_PERCENT) / 100);
        }), // Moves by 25% increments
    });
    return (
        <ThemedView style={{ height: 2, width: '100%' }}>
            <AnimatedThemedView
                lightColor={BLUE_MAIN_COLOR}
                darkColor={BLUE_MAIN_COLOR}
                style={{
                    height: '100%',
                    width: `${STEP_WIDTH_PERCENT}%`,
                    transform: [{ translateX: animatedTranslateX }],
                }}
            />
        </ThemedView>
    );
};
export default memo(BottomNavBar);
