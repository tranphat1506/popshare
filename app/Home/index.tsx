import DefaultLayout from '@/components/layout/DefaultLayout';
import PeersGroup from '@/components/Peer/PeersGroup';
import TopToolBar from '@/components/TopToolBar';
import { useAppDispatch } from '@/redux/hooks/hooks';
import { addPeers } from '@/redux/peers/reducer';
import { useLayoutEffect, useState } from 'react';

export default function Home({ ...props }) {
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
