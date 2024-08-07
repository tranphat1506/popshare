import DefaultLayout from '@/components/layout/DefaultLayout';
import PeersGroup from '@/components/Peer/PeersGroup';
import TopToolBar from '@/components/TopToolBar';
import { useState } from 'react';
import { View } from 'react-native';

export default function Home({ ...props }) {
    const [scanPressed, setScanPressed] = useState<boolean>(false);

    const handlePressed = async (state: boolean) => {
        // logic when started scan device
        setScanPressed(state);
    };
    console.log('render home');
    return (
        <>
            <DefaultLayout {...props}>
                <TopToolBar />
                <PeersGroup />
            </DefaultLayout>
        </>
    );
}
