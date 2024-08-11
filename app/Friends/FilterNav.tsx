import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { RootStackParamList } from '@/configs/routes.config';
import { BLUE_MAIN_COLOR } from '@/constants/Colors';
import { useThemeColor } from '@/hooks/useThemeColor';
import { NavigationProp, RouteProp, useRoute } from '@react-navigation/native';
import { useNavigation } from 'expo-router';
import { Flex } from 'native-base';
import React, { useEffect, useState } from 'react';
import { Pressable } from 'react-native';

interface FilterNavBarProps {
    data?: FilterNavProps[];
}
export interface FilterNavProps {
    title: string;
    id: string;
}
const FilterNavBar: React.FC<FilterNavBarProps> = ({ ...props }) => {
    return (
        <ThemedView style={{ marginTop: 10, marginBottom: 20, marginHorizontal: 10 }}>
            <Flex
                direction="row"
                style={{
                    columnGap: 10,
                }}
            >
                {props.data?.map((nav) => (
                    <FilterNav key={nav.id} {...nav} />
                ))}
            </Flex>
        </ThemedView>
    );
};

const FilterNav: React.FC<FilterNavProps> = ({ ...props }) => {
    const [isSelected, setIsSelected] = useState<boolean>(false);
    const navigation = useNavigation<NavigationProp<RootStackParamList, 'friends'>>();
    const { params: routeParams } = useRoute<RouteProp<RootStackParamList, 'friends'>>();
    const handleChangeFilterNav = (filterNavId: string) => () => {
        if (routeParams.filterNav === filterNavId) return;
        navigation.navigate('friends', { ...routeParams, filterNav: filterNavId });
    };
    useEffect(() => {
        if (routeParams?.filterNav && routeParams.filterNav === props.id) setIsSelected(true);
        else setIsSelected(false);
    }, [routeParams]);
    const defaultBgColor = useThemeColor({}, 'background');
    const hoverBgColor = useThemeColor({ light: '#00000040', dark: '#ffffff30' });
    const selectedBgColor = useThemeColor({ light: BLUE_MAIN_COLOR, dark: BLUE_MAIN_COLOR });
    const borderColor = useThemeColor({ light: BLUE_MAIN_COLOR, dark: '#fff' });
    const textColor = useThemeColor({ light: BLUE_MAIN_COLOR, dark: '#fff' });

    return (
        <Pressable
            onPress={handleChangeFilterNav(props.id)}
            style={({ pressed }) => [
                {
                    paddingVertical: 6,
                    paddingHorizontal: 10,
                    borderRadius: 1000,
                    borderWidth: 1,
                    borderColor: isSelected ? selectedBgColor : borderColor,
                    backgroundColor: isSelected ? selectedBgColor : pressed ? hoverBgColor : defaultBgColor,
                },
            ]}
        >
            <ThemedText
                style={{
                    fontSize: 14,
                    lineHeight: 16,
                    textTransform: 'capitalize',
                    color: isSelected ? '#fff' : textColor,
                }}
            >
                {props.title}
            </ThemedText>
        </Pressable>
    );
};

export default FilterNavBar;
