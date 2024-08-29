import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { RootStackParamList } from '@/configs/routes.config';
import { BLUE_MAIN_COLOR } from '@/constants/Colors';
import { Link, NavigationProp, useNavigation } from '@react-navigation/native';
import { Button, Flex, FormControl, Input, Spacer, Text, WarningOutlineIcon } from 'native-base';
import React from 'react';
import { Image, TextInput, View } from 'react-native';
import MoreOptions from './MoreOptions';

const SignIn = () => {
    const navigation = useNavigation<NavigationProp<RootStackParamList, 'signIn'>>();
    const handleNavToSignUp = () => {
        navigation.navigate('signUp', {});
    };
    return (
        <ThemedView style={{ width: '100%', height: '100%', display: 'flex', justifyContent: 'center' }}>
            <View className="flex flex-col justify-center items-center">
                <View className="flex flex-row py-4 justify-center items-center">
                    <Image source={require('@/assets/images/radar.png')} className="w-6 h-6 mr-2" />
                    <ThemedText style={{ fontSize: 20, lineHeight: 24, fontFamily: 'System-Medium' }}>
                        PopShare
                    </ThemedText>
                </View>
                <ThemedText style={{ fontSize: 40, lineHeight: 50, fontFamily: 'System-Black' }}>
                    Sign In Account
                </ThemedText>
                {/* <ThemedText style={{ fontSize: 16, lineHeight: 20, fontFamily: 'System-Regular' }}>
                    Welcome back!
                </ThemedText> */}
            </View>
            <View className="p-2 flex justify-center items-center my-4">
                <ThemedText style={{ fontSize: 24, lineHeight: 24, fontFamily: 'System-Regular' }}>
                    Welcome Back!
                </ThemedText>
            </View>
            <View className="flex items-center mt-4 gap-y-4">
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
                <FormControl w="80%" maxW="350px">
                    <Input
                        h={'50px'}
                        focusOutlineColor={BLUE_MAIN_COLOR}
                        autoComplete={'password'}
                        type={'password'}
                        fontFamily={'System-Regular'}
                        placeholder="Password"
                        fontSize={16}
                        borderRadius={'xl'}
                        className="bg-white text-black dark:text-white dark:bg-black"
                    />
                    <FormControl.ErrorMessage leftIcon={<WarningOutlineIcon size="xs" />}>
                        Try different from previous passwords.
                    </FormControl.ErrorMessage>
                </FormControl>
                <Button w="80%" maxW="350px" backgroundColor={BLUE_MAIN_COLOR} borderRadius={'md'}>
                    <Text color={'#fff'} fontFamily={'System-Regular'} fontSize={16} lineHeight={20}>
                        Sign In
                    </Text>
                </Button>
                <Button onPress={handleNavToSignUp} variant={'outline'} w="80%" maxW="350px" borderRadius={'md'}>
                    <ThemedText darkColor="#fff" lightColor="#000" style={{ fontSize: 16, lineHeight: 20 }}>
                        Sign Up Account
                    </ThemedText>
                </Button>
            </View>

            <MoreOptions />
        </ThemedView>
    );
};

export default SignIn;
