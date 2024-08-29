import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { RootStackParamList } from '@/configs/routes.config';
import { BLUE_MAIN_COLOR } from '@/constants/Colors';
import { Link, NavigationProp, useNavigation } from '@react-navigation/native';
import { Button, Flex, FormControl, Input, Spacer, Text, WarningOutlineIcon } from 'native-base';
import React from 'react';
import { Image, View } from 'react-native';
import MoreOptions from './MoreOptions';
import DefaultLayout from '@/components/layout/DefaultLayout';
import ThemedHeader from '@/components/ThemedHeader';

const ForgotPassword = () => {
    const navigation = useNavigation<NavigationProp<RootStackParamList, 'signIn'>>();
    const handleNavToSignIn = () => {
        navigation.navigate('signIn', {});
    };
    return (
        <DefaultLayout>
            <ThemedHeader options={{ title: 'Reset Password' }} />
            <View className="flex flex-col justify-center items-center">
                <View className="flex flex-row py-4 justify-center items-center">
                    <Image source={require('@/assets/images/radar.png')} className="w-6 h-6 mr-2" />
                    <ThemedText style={{ fontSize: 20, lineHeight: 24, fontFamily: 'System-Medium' }}>
                        PopShare
                    </ThemedText>
                </View>
                <ThemedText style={{ fontSize: 40, lineHeight: 50, fontFamily: 'System-Black' }}>
                    Forgot Password
                </ThemedText>
            </View>
            <View className="p-2 flex justify-center items-center my-4">
                <ThemedText style={{ fontSize: 24, lineHeight: 24, fontFamily: 'System-Regular' }}>
                    Reset your password
                </ThemedText>
            </View>
            <View className="flex items-center pt-10 gap-y-4">
                <FormControl w="80%" maxW="350px">
                    <Input
                        h={'50px'}
                        focusOutlineColor={BLUE_MAIN_COLOR}
                        autoComplete={'email'}
                        type={'text'}
                        fontFamily={'System-Regular'}
                        placeholder="Username or email"
                        fontSize={16}
                        borderRadius={'xl'}
                        backgroundColor={'#fff'}
                        className="bg-white text-black dark:text-white dark:bg-black"
                    />
                    <FormControl.ErrorMessage leftIcon={<WarningOutlineIcon size="xs" />}>
                        Error message
                    </FormControl.ErrorMessage>
                </FormControl>
                <Button w="80%" maxW="350px" backgroundColor={BLUE_MAIN_COLOR} borderRadius={'md'}>
                    <Text color={'#fff'} fontFamily={'System-Regular'} fontSize={16} lineHeight={20}>
                        Submit
                    </Text>
                </Button>
            </View>
        </DefaultLayout>
    );
};

export default ForgotPassword;
