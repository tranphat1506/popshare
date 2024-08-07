import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from '@/components/ThemedText';
import DefaultLayout from '@/components/layout/DefaultLayout';
import useCustomScreenOptions from '@/hooks/useCustomScreenOptions';
import { Image } from 'react-native';
import useLanguage from '@/languages/hooks/useLanguage';
function DevicesScreen() {
    const deviceList = [];
    const lang = useLanguage();
    const deviceText = lang.DEVICES_TITLE;
    const noDeviceTitle = lang.DEVICES_NO_DEVICE_TITLE;
    const noDeviceDesc = lang.DEVICES_NO_DEVICE_DESC;
    useCustomScreenOptions({
        title: `${deviceText} (${deviceList.length})`,
    });
    return (
        <>
            <DefaultLayout>
                <ThemedView style={{ display: 'flex', alignItems: 'center', flexDirection: 'column', gap: 25 }}>
                    <Image
                        source={require('@/assets/images/hand_hold_device.png')}
                        style={{
                            width: 150,
                            height: 150,
                        }}
                    />
                    <ThemedText
                        style={{
                            fontFamily: 'System-Medium',
                            fontSize: 25,
                            lineHeight: 25,
                            textTransform: 'capitalize',
                        }}
                    >
                        {noDeviceTitle}
                    </ThemedText>

                    <ThemedText
                        lightColor="#6b7280"
                        darkColor="#ffffff90"
                        style={{ fontFamily: 'System-Regular', fontSize: 17, lineHeight: 20, textAlign: 'center' }}
                    >
                        {noDeviceDesc}
                    </ThemedText>
                </ThemedView>
            </DefaultLayout>
        </>
    );
}
export default DevicesScreen;
