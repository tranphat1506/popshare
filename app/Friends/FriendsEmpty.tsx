import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import useLanguage from '@/languages/hooks/useLanguage';
import { Image } from 'react-native';

export const FriendsEmpty = () => {
    const lang = useLanguage();
    const noFriendTitle = lang.FRIENDS_NO_DEVICE_TITLE;
    const noFriendDesc = lang.FRIENDS_NO_DEVICE_DESC;
    return (
        <ThemedView
            style={{
                display: 'flex',
                alignItems: 'center',
                flexDirection: 'column',
                gap: 10,
                paddingHorizontal: 20,
                height: '100%',
            }}
        >
            <Image
                source={require('@/assets/images/add-friend.png')}
                style={{
                    width: 200,
                    height: 200,
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
                {noFriendTitle}
            </ThemedText>

            <ThemedText
                lightColor="#6b7280"
                darkColor="#ffffff90"
                style={{ fontFamily: 'System-Regular', fontSize: 17, lineHeight: 20, textAlign: 'center' }}
            >
                {noFriendDesc}
            </ThemedText>
        </ThemedView>
    );
};
