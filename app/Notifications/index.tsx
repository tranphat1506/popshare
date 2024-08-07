import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from '@/components/ThemedText';
import DefaultLayout from '@/components/layout/DefaultLayout';
import useCustomScreenOptions from '@/hooks/useCustomScreenOptions';
import { Image } from 'react-native';
import useLanguage from '@/languages/hooks/useLanguage';
function NotificationsScreen() {
    const notiList = [];
    const lang = useLanguage();
    const notificationsText = lang.NOTIFICATION_TITLE;
    const noNotiTitle = lang.NOTIFICATION_NO_NOTI_TITLE;
    const noNotiDesc = lang.NOTIFICATION_NO_NOTI_DESC;

    useCustomScreenOptions({
        title: `${notificationsText} (${notiList.length})`,
    });
    return (
        <>
            <DefaultLayout>
                <ThemedView style={{ display: 'flex', alignItems: 'center', flexDirection: 'column', gap: 25 }}>
                    <Image
                        source={require('@/assets/images/bell.png')}
                        style={{
                            width: 150,
                            height: 150,
                            objectFit: 'contain',
                            marginTop: 40,
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
                        {noNotiTitle}
                    </ThemedText>

                    <ThemedText
                        lightColor="#6b7280"
                        darkColor="#ffffff90"
                        style={{ fontFamily: 'System-Regular', fontSize: 17, lineHeight: 20, textAlign: 'center' }}
                    >
                        {noNotiDesc}
                    </ThemedText>
                </ThemedView>
            </DefaultLayout>
        </>
    );
}
export default NotificationsScreen;
