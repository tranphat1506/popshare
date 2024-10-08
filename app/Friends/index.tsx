import DefaultLayout from '@/components/layout/DefaultLayout';
import useCustomScreenOptions from '@/hooks/useCustomScreenOptions';
import { Dimensions, ScrollView } from 'react-native';
import useLanguage from '@/languages/hooks/useLanguage';
import { useAppSelector } from '@/redux/hooks/hooks';
import { NavigationProp, RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { RootStackParamList } from '@/configs/routes.config';
import FriendsList from '@/components/Peer/FriendsList';
import { useEffect, useLayoutEffect, useState } from 'react';
import { FriendsEmpty } from './FriendsEmpty';
import FilterNavBar, { FilterNavProps } from './FilterNav';
import ButtonIconWithBadge from '@/components/ButtonIconWithBadge';
import { Feather } from '@expo/vector-icons';
const { width } = Dimensions.get('window');
const PADDING_DISPLAY_SCREEN = 15;
const DISPLAY_SCREEN = width - PADDING_DISPLAY_SCREEN * 2;
const NavArray: FilterNavProps[] = [
    {
        id: 'recent',
        title: 'Recent',
    },
    {
        id: 'all',
        title: 'All friends',
    },
    {
        id: 'pinned',
        title: 'Only pinned',
    },
    {
        id: 'pending',
        title: 'Pending',
    },
];
const FriendsScreen = () => {
    useEffect(() => {
        console.log('rerender FS');
    }, []);
    const lang = useLanguage();
    const friendTitleText = lang.FRIENDS_TITLE;
    useCustomScreenOptions({
        title: friendTitleText,
        headerTitleStyle: {
            fontSize: 24,
            fontFamily: 'System-Bold',
        },
        headerRight() {
            return (
                <ButtonIconWithBadge
                    btnProps={{
                        _icon: {
                            as: Feather,
                            name: 'search',
                        },
                        shadow: '1',
                    }}
                />
            );
        },
        headerShown: true,
    });
    const navigation = useNavigation<NavigationProp<RootStackParamList, 'friends-list'>>();
    const { params: routeParams } = useRoute<RouteProp<RootStackParamList, 'friends-list'>>();
    useLayoutEffect(() => {
        if (!routeParams || !routeParams.filterNav) navigation.navigate('friends-list', { filterNav: 'all' });
    }, [routeParams]);
    const friendsCount = useAppSelector((state) => state.peers.count);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    useLayoutEffect(() => {
        setIsLoading(!(friendsCount === 0));
    }, [friendsCount]);
    const [peerPerScreen] = useState<number>(4);
    if (!isLoading) return <FriendsEmpty />;
    return (
        <>
            <DefaultLayout preventStatusBar={false}>
                <FilterNavBar data={NavArray} />
                <ScrollView>
                    <RenderFilterItems
                        filterId={routeParams?.filterNav}
                        peerPerScreen={peerPerScreen}
                        displayScreen={DISPLAY_SCREEN}
                    />
                </ScrollView>
            </DefaultLayout>
        </>
    );
};

interface RenderFilterItemsProps {
    filterId?: string;
    peerPerScreen: number;
    displayScreen: number;
}
const RenderFilterItems: React.FC<RenderFilterItemsProps> = ({ filterId, peerPerScreen, displayScreen }) => {
    if (filterId === undefined) return <></>;
    if (filterId === 'pending') return <></>;
    return (
        <FriendsList
            showSectionTitle={false}
            showOnlyPinned={filterId === 'pinned'}
            showOnlyRecent={filterId === 'recent'}
            peerPeerScreen={peerPerScreen}
            displayScreen={displayScreen}
        />
    );
};

export default FriendsScreen;
