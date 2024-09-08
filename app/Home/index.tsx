import DefaultLayout from '@/components/layout/DefaultLayout';
import PeersGroup from '@/components/Peer/PeersGroup';
import TopToolBar from '@/components/TopToolBar';

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
