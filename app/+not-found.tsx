import { Image, StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import useCustomScreenOptions from '@/hooks/useCustomScreenOptions';
import useLanguage from '@/languages/hooks/useLanguage';
import { Link } from '@react-navigation/native';

export default function NotFoundScreen() {
    // change header title
    useCustomScreenOptions({ title: 'Oops!' });
    const lang = useLanguage();
    const notFoundText = lang.CANNOT_FIND_PAGE;
    const returnHomeText = `${lang.RETURN} ${lang.HOME_PAGE}!`;

    return (
        <>
            <ThemedView style={styles.container}>
                <View className="flex justify-center items-center gap-y-3">
                    <Image source={require('@/assets/images/radar.png')} className="w-32 h-32" />
                    <ThemedText type="title">{notFoundText}</ThemedText>
                </View>
                <Link to={'/'} style={styles.link}>
                    <ThemedText type="link">{returnHomeText}</ThemedText>
                </Link>
            </ThemedView>
        </>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    link: {
        marginTop: 15,
        paddingVertical: 15,
    },
});
