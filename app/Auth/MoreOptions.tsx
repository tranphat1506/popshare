import { ThemedText } from '@/components/ThemedText';
import { Link } from '@react-navigation/native';
import { Button, Flex } from 'native-base';
import React from 'react';
import { Image, View } from 'react-native';

const MoreOptions = () => {
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
                    <ThemedText style={{ marginHorizontal: 10, lineHeight: 16, fontSize: 16, color: '#8e8e8e' }}>
                        Or
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
                            <Image source={require('@/assets/images/radar.png')} className="w-6 h-6 mr-2" />
                            <ThemedText>PopPam</ThemedText>
                        </View>
                    </Button>
                </Flex>
            </View>

            <View className="pb-6 justify-center items-center mt-4">
                <ThemedText style={{ fontSize: 16, lineHeight: 20, fontFamily: 'System-Regular' }}>
                    Forgot password?{' '}
                    <Link to={'/forgotPassword'}>
                        <ThemedText type="link">Reset password!</ThemedText>
                    </Link>
                </ThemedText>
            </View>
        </>
    );
};
export default MoreOptions;
