import { ThemedText } from '@/components/ThemedText';
import useLanguage from '@/languages/hooks/useLanguage';
import { Link } from '@react-navigation/native';
import { Button, Flex } from 'native-base';
import React, { useMemo } from 'react';
import { Image, View } from 'react-native';

const MoreOptions = () => {
    const lang = useLanguage();
    const textLanguage = useMemo(() => {
        return {
            SIGN_IN_WITH_OAUTH: lang.SIGN_IN_WITH_OAUTH,
            QUESTION_FORGOT_PASSWORD: lang.FORGOT_PASSWORD + '?',
            RESET_PASSWORD_LINK: lang.RESET_PASSWORD,
        };
    }, [lang]);
    return (
        <>
            <View style={{ paddingVertical: 10 }}>
                <Flex direction="row" justifyContent={'center'} alignItems={'center'} mt={10}>
                    <View
                        style={{
                            height: 2,
                            width: '20%',
                            maxWidth: 300,
                            backgroundColor: '#8e8e8e',
                        }}
                    />
                    <ThemedText
                        style={{
                            marginHorizontal: 10,
                            lineHeight: 16,
                            fontSize: 16,
                            color: '#8e8e8e',
                            textTransform: 'capitalize',
                        }}
                    >
                        {textLanguage.SIGN_IN_WITH_OAUTH}
                    </ThemedText>
                    <View
                        style={{
                            height: 2,
                            width: '20%',
                            maxWidth: 300,
                            backgroundColor: '#8e8e8e',
                        }}
                    />
                </Flex>
                <Flex
                    direction="row"
                    mt={4}
                    justifyContent={'center'}
                    style={{ columnGap: 10, rowGap: 20, flexWrap: 'wrap' }}
                >
                    <Button variant={'outline'} flexBasis={'40%'} paddingX={10}>
                        <View
                            style={{
                                display: 'flex',
                                flexDirection: 'row',
                                justifyContent: 'center',
                                alignItems: 'center',
                            }}
                        >
                            <Image source={require('@/assets/images/google-icon.png')} className="w-6 h-6 mr-2" />
                            <ThemedText>Google</ThemedText>
                        </View>
                    </Button>
                    <Button variant={'outline'} flexBasis={'40%'} paddingX={10}>
                        <View
                            style={{
                                display: 'flex',
                                flexDirection: 'row',
                                justifyContent: 'center',
                                alignItems: 'center',
                            }}
                        >
                            <Image source={require('@/assets/images/facebook-icon.png')} className="w-6 h-6 mr-2" />
                            <ThemedText>Facebook</ThemedText>
                        </View>
                    </Button>
                    <Button variant={'outline'} flexBasis={'40%'} paddingX={10}>
                        <View
                            style={{
                                display: 'flex',
                                flexDirection: 'row',
                                justifyContent: 'center',
                                alignItems: 'center',
                            }}
                        >
                            <Image source={require('@/assets/images/icon-64x64.png')} className="w-6 h-6 mr-2" />
                            <ThemedText>PopPam</ThemedText>
                        </View>
                    </Button>
                </Flex>
            </View>

            <View className="pb-6 justify-center items-center mt-4">
                <ThemedText style={{ fontSize: 16, lineHeight: 20, fontFamily: 'System-Regular' }}>
                    {textLanguage.QUESTION_FORGOT_PASSWORD}{' '}
                    <Link to={'/forgotPassword'}>
                        <ThemedText type="link">{textLanguage.RESET_PASSWORD_LINK}</ThemedText>
                    </Link>
                </ThemedText>
            </View>
        </>
    );
};
export default MoreOptions;
