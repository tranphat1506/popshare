import DefaultLayout from '@/components/layout/DefaultLayout';
import PeersGroup from '@/components/Peer/PeersGroup';
import TopToolBar from '@/components/TopToolBar';
import { genRandomPeers } from '@/helpers/FakeDevices';
import { useAppDispatch } from '@/redux/hooks/hooks';
import { addPeers } from '@/redux/peers/reducer';
import { useLayoutEffect, useState } from 'react';

export default function Home({ ...props }) {
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const dispatch = useAppDispatch();
    useLayoutEffect(() => {
        const dumpFriendPeers = genRandomPeers(10);
        dumpFriendPeers.forEach((peer, index) => {
            if (index <= 4) peer.pinSlot = index;
        });
        // console.log(dumpFriendPeers.map((p) => p.username));
        dispatch(addPeers(dumpFriendPeers));
        setIsLoading(false);
    }, []);
    console.log('render home');
    return (
        <>
            <DefaultLayout {...props}>
                <TopToolBar />
                <PeersGroup peerPerScreen={4} maxDisplay={40} />
            </DefaultLayout>
        </>
    );
}
