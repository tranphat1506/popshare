import { ThemedText } from '@/components/ThemedText';
import { RootStackParamList } from '@/configs/routes.config';
import { BLUE_MAIN_COLOR } from '@/constants/Colors';
import { NavigationProp, useNavigation } from '@react-navigation/native';
import { Button, FormControl, Input, Text, WarningOutlineIcon } from 'native-base';
import React, { useMemo, useState } from 'react';
import { Image, View } from 'react-native';
import DefaultLayout from '@/components/layout/DefaultLayout';
import ThemedHeader from '@/components/ThemedHeader';
import useLanguage from '@/languages/hooks/useLanguage';

const ForgotPassword = () => {
    const lang = useLanguage();
    const textLanguage = useMemo(() => {
        return {
            TITLE_FORGOT_PASSWORD: lang.FORGOT_PASSWORD,
            SUBMESSAGE_FORGOT_PASSWORD: lang.SUBMESSAGE_FORGOT_PASSWORD,
            RESET_PASSWORD_BUTTON_TITLE: lang.SUBMIT,
            INPUT_PLACEHOLDER: lang.USERNAME_OR_EMAIL,
        };
    }, [lang]);
    const [inputValue, setInputValue] = useState<string>('');
    const [inputErrorMessage, setInputErrorMessage] = useState<string | undefined>(undefined);
    const handleInputText = (data: string) => {
        setInputValue(data);
    };
    const handleSubmitForgotPwd = () => {
        setInputErrorMessage(`SERVICES_NOT_AVAILABLE FORGOT_PASSWORD ${inputValue}`);
    };
    return (
        <DefaultLayout>
            <ThemedHeader options={{ title: textLanguage.TITLE_FORGOT_PASSWORD }} />
            <View className="flex flex-col justify-center items-center">
                <View className="flex flex-row py-4 justify-center items-center">
                    <Image source={require('@/assets/images/icon-64x64.png')} className="w-6 h-6 mr-2" />
                    <ThemedText style={{ fontSize: 20, lineHeight: 24, fontFamily: 'System-Medium' }}>
                        PopShare
                    </ThemedText>
                </View>
                <ThemedText
                    style={{ fontSize: 40, lineHeight: 50, fontFamily: 'System-Black', textTransform: 'capitalize' }}
                >
                    {textLanguage.TITLE_FORGOT_PASSWORD}
                </ThemedText>
            </View>
            <View className="p-2 flex justify-center items-center my-2">
                <ThemedText style={{ fontSize: 18, lineHeight: 22, fontFamily: 'System-Regular' }}>
                    {textLanguage.SUBMESSAGE_FORGOT_PASSWORD}
                </ThemedText>
            </View>
            <View className="flex items-center pt-10 gap-y-4">
                <FormControl isInvalid={!!inputErrorMessage} w="80%" maxW="350px">
                    <Input
                        value={inputValue}
                        onChangeText={handleInputText}
                        h={'50px'}
                        focusOutlineColor={BLUE_MAIN_COLOR}
                        autoComplete={'email'}
                        type={'text'}
                        fontFamily={'System-Regular'}
                        placeholder={textLanguage.INPUT_PLACEHOLDER}
                        fontSize={16}
                        borderRadius={'xl'}
                        backgroundColor={'#fff'}
                        className="bg-white text-black dark:text-white dark:bg-black"
                    />
                    <FormControl.ErrorMessage leftIcon={<WarningOutlineIcon size="xs" />}>
                        {inputErrorMessage}
                    </FormControl.ErrorMessage>
                </FormControl>
                <Button
                    onPress={handleSubmitForgotPwd}
                    w="80%"
                    maxW="350px"
                    backgroundColor={BLUE_MAIN_COLOR}
                    borderRadius={'md'}
                >
                    <Text color={'#fff'} fontFamily={'System-Regular'} fontSize={16} lineHeight={20}>
                        {textLanguage.RESET_PASSWORD_BUTTON_TITLE}
                    </Text>
                </Button>
            </View>
        </DefaultLayout>
    );
};

export default ForgotPassword;
