import { BLUE_MAIN_COLOR } from '@/constants/Colors';
import { MaterialCommunityIcons, MaterialIcons } from '@expo/vector-icons';
import { useNavigationState, Link } from '@react-navigation/native';
import { Flex, Icon, IconButton } from 'native-base';
import React, { memo } from 'react';
import { ThemedView, ThemedViewProps } from './ThemedView';
import { SIZES } from '@/constants/Sizes';
import { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { Platform } from 'react-native';

const NavigateDetails = {
    '/': {
        iconName: 'radar',
        as: MaterialCommunityIcons,
        color: BLUE_MAIN_COLOR,
    },
    archive: {
        iconName: 'archive',
        as: MaterialIcons,
        color: BLUE_MAIN_COLOR,
    },
};

// props for route active
const ActiveRouteProps = {
    borderTopColor: BLUE_MAIN_COLOR,
    borderTopWidth: '2px',
    borderTopRadius: '0',
};

const BottomNavBar: React.FC<BottomTabBarProps & ThemedViewProps> = ({ state, descriptors, navigation, ...props }) => {
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
                    const navDetail = NavigateDetails[route.name as keyof typeof NavigateDetails];
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
                        <IconButton
                            key={index}
                            accessibilityRole="button"
                            accessibilityState={isFocused ? { selected: true } : {}}
                            accessibilityLabel={options.tabBarAccessibilityLabel}
                            testID={options.tabBarTestID}
                            onPress={onPress}
                            onLongPress={onLongPress}
                            {...(isFocused ? ActiveRouteProps : {})}
                            icon={
                                <Icon size={'lg'} color={navDetail.color} name={navDetail.iconName} as={navDetail.as} />
                            }
                            flex={1}
                            flexBasis={'50%'}
                        />
                    );
                })}
            </Flex>
        </ThemedView>
    );
};

export default memo(BottomNavBar);
