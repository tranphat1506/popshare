import DefaultLayout from '@/components/layout/DefaultLayout';
import { ThemedText } from '@/components/ThemedText';
import TopToolBar from '@/components/TopToolBar';
import { View } from 'react-native';

export default function Home({ ...props }) {
    console.log('render home');
    return (
        <>
            <DefaultLayout {...props}>
                <TopToolBar />
                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                    <ThemedText type="title">Home</ThemedText>
                </View>
            </DefaultLayout>
        </>
    );
}
