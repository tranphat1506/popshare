import { ThemedText } from '@/components/ThemedText';
import { RootStackParamList } from '@/configs/routes.config';
import { BLUE_MAIN_COLOR } from '@/constants/Colors';
import { NavigationProp, useNavigation } from '@react-navigation/native';
import { Avatar, Button, FormControl, Icon, Input, Pressable, Spinner, Text, WarningOutlineIcon } from 'native-base';
import React, { useEffect, useMemo, useState } from 'react';
import { Image, ScrollView, TouchableOpacity, View } from 'react-native';
import MoreOptions from './MoreOptions';
import { Entypo, FontAwesome } from '@expo/vector-icons';
import DefaultLayout from '@/components/layout/DefaultLayout';
import { EmojiKey } from '@/components/common/EmojiPicker';
import AvatarSettingModal from './AvatarSettingModal';
import PopshareAvatar from '@/components/common/PopshareAvatar';
import { BE_API_URL, CommonRegex } from '@/constants/Constants';
import _ from 'lodash';
import { IErrorResponse } from '@/interfaces/ResponsePayload.interfaces';
import { translateErrorMessageWithStructure } from '@/helpers/string';
import { useAppSelector } from '@/redux/hooks/hooks';
import useLanguage from '@/languages/hooks/useLanguage';
import AuthOTPInput from './AuthOTPInput';
interface ISignUpData {
    displayName?: string;
    username?: string;
    email?: string;
    password?: string;
    rePassword?: string;
    avatarEmoji?: string;
    avatarColor?: string;
    profilePicture?: string;
    otp?: string;
}
const DEFAULT_SIGNUP_DATA = {
    avatarColor: '#F4F5F7',
    avatarEmoji: 'Slightly Smiling Face',
};
const SignUp = () => {
    const language = useAppSelector((state) => state.setting.language);
    const langData = useLanguage();
    const textData = useMemo(() => {
        return {
            displayName: langData.DISPLAYNAME,
            avatarColor: langData.AVATARCOLOR,
            avatarEmoji: langData.AVATAREMOJI,
            email: langData.EMAIL,
            password: langData.PASSWORD,
            profilePicture: langData.PROFILEPICTURE,
            username: langData.USERNAME,
            rePassword: langData.REPASSWORD,
            signIn: langData.SIGN_IN,
            signUp: langData.SIGN_UP,
            verifyAccount: langData.VERIFY_ACCOUNT,
            subMessageVerifyAccount: langData.OTP_JUST_SEND_TO_EMAIL,
        };
    }, [language]);
    const navigation = useNavigation<NavigationProp<RootStackParamList, 'signIn'>>();
    const handleNavToSignIn = () => {
        navigation.navigate('signIn');
    };
    const [successSignUp, setSuccessSignUp] = useState<boolean>(false);
    const [showAvatarSetting, setShowAvatarSetting] = useState<boolean>(false);
    const [showPassword, setShowPassword] = useState<boolean>(false);
    const handleShowPassword = () => {
        setShowPassword(!showPassword);
    };
    const [signUpData, setSignUpData] = useState<ISignUpData>(DEFAULT_SIGNUP_DATA);
    const [errorMessages, setErrorMessages] = useState<ISignUpData>({});
    const handleChangeData = (dataField: keyof ISignUpData) => (e: string | EmojiKey | null) => {
        setSignUpData({ ...signUpData, [dataField]: e });
    };

    // Display name checking
    useEffect(() => {
        const min = 4,
            max = 32;
        if (signUpData.displayName?.trim() !== signUpData.displayName) {
            setErrorMessages({
                ...errorMessages,
                displayName: translateErrorMessageWithStructure('"displayName" ERROR_INVALID_CHAR', language),
            });
        } else if (!signUpData.displayName) {
            setErrorMessages({
                ...errorMessages,
                displayName: translateErrorMessageWithStructure('"displayName" ERROR_EMPTY', language),
            });
        } else if (signUpData.displayName?.length < min) {
            setErrorMessages({
                ...errorMessages,
                displayName: translateErrorMessageWithStructure(`"displayName" ERROR_UNDER_MIN ${min}`, language),
            });
        } else if (signUpData.displayName?.length > max) {
            setErrorMessages({
                ...errorMessages,
                displayName: translateErrorMessageWithStructure(`"displayName" ERROR_OVER_MAX ${max}`, language),
            });
        } else {
            setErrorMessages({
                ...errorMessages,
                displayName: undefined,
            });
        }
    }, [signUpData.displayName]);
    // Username checking
    useEffect(() => {
        const min = 4,
            max = 24;
        if (signUpData.username?.trim() !== signUpData.username) {
            setErrorMessages({
                ...errorMessages,
                username: translateErrorMessageWithStructure('"username" ERROR_INVALID_CHAR', language),
            });
        } else if (!signUpData.username) {
            setErrorMessages({
                ...errorMessages,
                username: translateErrorMessageWithStructure('"username" ERROR_EMPTY', language),
            });
        } else if (signUpData.username.length < min) {
            setErrorMessages({
                ...errorMessages,
                username: translateErrorMessageWithStructure(`"username" ERROR_UNDER_MIN ${min}`, language),
            });
        } else if (signUpData.username.length > max) {
            setErrorMessages({
                ...errorMessages,
                username: translateErrorMessageWithStructure(`"username" ERROR_OVER_MAX ${max}`, language),
            });
        } else if (!RegExp(CommonRegex.username).test(signUpData.username)) {
            setErrorMessages({
                ...errorMessages,
                username: translateErrorMessageWithStructure('"username" ERROR_INVALID_PATTERN', language),
            });
        } else {
            setErrorMessages({
                ...errorMessages,
                username: undefined,
            });
        }
    }, [signUpData.username]);
    // Email checking
    useEffect(() => {
        if (signUpData.email?.trim() !== signUpData.email) {
            setErrorMessages({
                ...errorMessages,
                email: translateErrorMessageWithStructure('"email" ERROR_INVALID_CHAR', language),
            });
        } else if (!signUpData.email) {
            setErrorMessages({
                ...errorMessages,
                email: translateErrorMessageWithStructure('"email" ERROR_EMPTY', language),
            });
        } else if (!RegExp(CommonRegex.email).test(signUpData.email)) {
            setErrorMessages({
                ...errorMessages,
                email: translateErrorMessageWithStructure('"email" ERROR_INVALID_PATTERN', language),
            });
        } else {
            setErrorMessages({
                ...errorMessages,
                email: undefined,
            });
        }
    }, [signUpData.email]);
    // Password checking
    useEffect(() => {
        let newMessages: ISignUpData = {};
        // Not the same passwords
        if (signUpData.password?.trim() !== signUpData.password) {
            newMessages = {
                ...errorMessages,
                password: translateErrorMessageWithStructure('"password" ERROR_INVALID_CHAR', language),
            };
        } else if (signUpData.password !== signUpData.rePassword) {
            newMessages.password = translateErrorMessageWithStructure(
                '"repassword" ERROR_CONFIRM_PWD_NOT_MATCH',
                language,
            );
            newMessages.rePassword = translateErrorMessageWithStructure(
                '"repassword" ERROR_CONFIRM_PWD_NOT_MATCH',
                language,
            );
        } else {
            newMessages.password = undefined;
            newMessages.rePassword = undefined;
        }
        setErrorMessages({ ...newMessages });
    }, [signUpData.password, signUpData.rePassword]);

    const [onSubmitSignUp, setOnSubmitSignUp] = useState<boolean>(false);
    const signUpAccount = async () => {
        try {
            const response = await fetch(BE_API_URL + '/signup', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    displayName: signUpData.displayName,
                    avatarColor: signUpData.avatarColor,
                    avatarEmoji: signUpData.avatarEmoji,
                    password: signUpData.password,
                    email: signUpData.email,
                    username: signUpData.username,
                } as ISignUpData),
            });
            if (response.ok) {
                // Success sign up
                setSuccessSignUp(true);
            } else {
                const json = (await response.json()) as IErrorResponse;
                console.log(json);

                const errorField = json.message.split('"')[1] as keyof ISignUpData;
                setErrorMessages({
                    [errorField]: translateErrorMessageWithStructure(json.message, language),
                });
            }
        } catch (error) {
            console.log(error);
        }
        setOnSubmitSignUp(false);
    };
    const handleSubmitSignUp = () => {
        setErrorMessages({});
        setOnSubmitSignUp(true);
        signUpAccount();
    };
    const debouncedHandleSubmitSignUp = _.debounce(handleSubmitSignUp, 5000, {
        leading: true,
        trailing: false,
    });
    const handleVerifyOtp = async (otp?: string) => {
        try {
            const response = await fetch(BE_API_URL + '/signin', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    password: signUpData.password,
                    email: signUpData.email,
                    otpToken: otp,
                } as ISignUpData),
            });
            if (response.ok) {
                // close otp
                setSuccessSignUp(false);
                handleNavToSignIn();
            } else {
                const json = (await response.json()) as IErrorResponse;
                const errorField = json.message.split('"')[1] as keyof ISignUpData;
                setErrorMessages({
                    [errorField]: translateErrorMessageWithStructure(json.message, language),
                });
            }
        } catch (error) {
            console.log(error);
        }
    };
    const debouncedHandleResendOtp = _.debounce(handleVerifyOtp, 3 * 60 * 1000, {
        leading: true,
        trailing: false,
    });

    return (
        <DefaultLayout>
            <AvatarSettingModal
                handleSetAvatar={(e) => setSignUpData({ ...signUpData, ...e })}
                isSettingOpen={showAvatarSetting}
                handleOpenSetting={setShowAvatarSetting}
                previewAvatar={{
                    avatarColor: signUpData.avatarColor!,
                    avatarEmoji: signUpData.avatarEmoji! as EmojiKey,
                    profilePicture: signUpData.profilePicture,
                }}
            />
            {!successSignUp ? (
                <ScrollView>
                    <View className="flex flex-col justify-center items-center">
                        <View className="flex flex-row py-4 justify-center items-center">
                            <Image source={require('@/assets/images/icon-64x64.png')} className="w-6 h-6 mr-2" />
                            <ThemedText style={{ fontSize: 20, lineHeight: 24, fontFamily: 'System-Medium' }}>
                                PopShare
                            </ThemedText>
                        </View>
                        <ThemedText style={{ fontSize: 40, lineHeight: 50, fontFamily: 'System-Black' }}>
                            Sign Up Account
                        </ThemedText>
                    </View>
                    <View className="p-2 flex justify-center items-center my-4">
                        <ThemedText style={{ fontSize: 24, lineHeight: 24, fontFamily: 'System-Regular' }}>
                            Create new account.
                        </ThemedText>
                    </View>
                    <View className="flex items-center mt-4 gap-y-4">
                        <Pressable onPress={() => setShowAvatarSetting(true)}>
                            <PopshareAvatar
                                avatarEmoji={signUpData.avatarEmoji! as EmojiKey}
                                avatarColor={signUpData.avatarColor!}
                            >
                                <Avatar.Badge
                                    w={8}
                                    h={8}
                                    display={'flex'}
                                    justifyContent={'center'}
                                    alignItems={'center'}
                                    backgroundColor={BLUE_MAIN_COLOR}
                                >
                                    <TouchableOpacity onPress={() => setShowAvatarSetting(true)}>
                                        <Icon color={'#fff'} as={Entypo} name="pencil" />
                                    </TouchableOpacity>
                                </Avatar.Badge>
                            </PopshareAvatar>
                        </Pressable>
                        <FormControl isInvalid={!!errorMessages.displayName} w="80%" maxW="350px">
                            <Input
                                onChangeText={handleChangeData('displayName')}
                                h={'50px'}
                                focusOutlineColor={BLUE_MAIN_COLOR}
                                autoComplete={'nickname'}
                                type={'text'}
                                fontFamily={'System-Regular'}
                                placeholder={textData.displayName}
                                fontSize={16}
                                borderRadius={'xl'}
                                backgroundColor={'#fff'}
                                className="bg-white text-black dark:text-white dark:bg-black"
                            />
                            <FormControl.ErrorMessage leftIcon={<WarningOutlineIcon size="xs" />}>
                                {errorMessages.displayName}
                            </FormControl.ErrorMessage>
                        </FormControl>
                        <FormControl isInvalid={!!errorMessages.username} w="80%" maxW="350px">
                            <Input
                                onChangeText={handleChangeData('username')}
                                h={'50px'}
                                focusOutlineColor={BLUE_MAIN_COLOR}
                                autoComplete={'username-new'}
                                type={'text'}
                                fontFamily={'System-Regular'}
                                placeholder={textData.username}
                                fontSize={16}
                                borderRadius={'xl'}
                                backgroundColor={'#fff'}
                                className="bg-white text-black dark:text-white dark:bg-black"
                            />
                            <FormControl.ErrorMessage leftIcon={<WarningOutlineIcon size="xs" />}>
                                {errorMessages.username}
                            </FormControl.ErrorMessage>
                        </FormControl>
                        <FormControl isInvalid={!!errorMessages.email} w="80%" maxW="350px">
                            <Input
                                onChangeText={handleChangeData('email')}
                                h={'50px'}
                                focusOutlineColor={BLUE_MAIN_COLOR}
                                autoComplete={'email'}
                                type={'text'}
                                fontFamily={'System-Regular'}
                                placeholder={textData.email}
                                fontSize={16}
                                borderRadius={'xl'}
                                backgroundColor={'#fff'}
                                className="bg-white text-black dark:text-white dark:bg-black"
                            />
                            <FormControl.ErrorMessage leftIcon={<WarningOutlineIcon size="xs" />}>
                                {errorMessages.email}
                            </FormControl.ErrorMessage>
                        </FormControl>
                        <FormControl isInvalid={!!errorMessages.password} w="80%" maxW="350px">
                            <Input
                                onChangeText={handleChangeData('password')}
                                h={'50px'}
                                focusOutlineColor={BLUE_MAIN_COLOR}
                                autoComplete={'password-new'}
                                type={showPassword ? 'text' : 'password'}
                                fontFamily={'System-Regular'}
                                placeholder={textData.password}
                                fontSize={16}
                                _focus={{ backgroundColor: '#ffffff00' }}
                                borderRadius={'xl'}
                                className="bg-white text-black dark:text-white dark:bg-black"
                                InputRightElement={
                                    <Pressable
                                        onPress={handleShowPassword}
                                        display={'flex'}
                                        justifyContent={'center'}
                                        style={{ marginHorizontal: 15 }}
                                    >
                                        <Icon
                                            className="bg-white text-black dark:text-white dark:bg-black"
                                            as={FontAwesome}
                                            name={showPassword ? 'eye-slash' : 'eye'}
                                        />
                                    </Pressable>
                                }
                            />
                            <FormControl.ErrorMessage leftIcon={<WarningOutlineIcon size="xs" />}>
                                {errorMessages.password}
                            </FormControl.ErrorMessage>
                        </FormControl>
                        <FormControl isInvalid={!!errorMessages.rePassword} w="80%" maxW="350px">
                            <Input
                                onChangeText={handleChangeData('rePassword')}
                                h={'50px'}
                                focusOutlineColor={BLUE_MAIN_COLOR}
                                autoComplete={'password-new'}
                                type={showPassword ? 'text' : 'password'}
                                fontFamily={'System-Regular'}
                                placeholder={textData.rePassword}
                                fontSize={16}
                                _focus={{ backgroundColor: '#ffffff00' }}
                                borderRadius={'xl'}
                                className="bg-white text-black dark:text-white dark:bg-black"
                                InputRightElement={
                                    <Pressable
                                        onPress={handleShowPassword}
                                        display={'flex'}
                                        justifyContent={'center'}
                                        style={{ marginHorizontal: 15 }}
                                    >
                                        <Icon
                                            className="bg-white text-black dark:text-white dark:bg-black"
                                            as={FontAwesome}
                                            name={showPassword ? 'eye-slash' : 'eye'}
                                        />
                                    </Pressable>
                                }
                            />
                            <FormControl.ErrorMessage leftIcon={<WarningOutlineIcon size="xs" />}>
                                {errorMessages.rePassword}
                            </FormControl.ErrorMessage>
                        </FormControl>
                        <Button
                            disabled={onSubmitSignUp}
                            onPress={debouncedHandleSubmitSignUp}
                            w="80%"
                            maxW="350px"
                            backgroundColor={BLUE_MAIN_COLOR}
                            borderRadius={'md'}
                            _pressed={{
                                backgroundColor: `${BLUE_MAIN_COLOR}80`,
                            }}
                        >
                            {!onSubmitSignUp ? (
                                <Text
                                    color={'#fff'}
                                    fontFamily={'System-Regular'}
                                    fontSize={16}
                                    lineHeight={20}
                                    textTransform={'capitalize'}
                                >
                                    {textData.signUp}
                                </Text>
                            ) : (
                                <Spinner color={'#fff'} />
                            )}
                        </Button>
                        <Button
                            onPress={handleNavToSignIn}
                            variant={'outline'}
                            w="80%"
                            maxW="350px"
                            borderRadius={'md'}
                        >
                            <ThemedText
                                darkColor="#fff"
                                lightColor="#000"
                                style={{ fontSize: 16, lineHeight: 20, textTransform: 'capitalize' }}
                            >
                                {textData.signIn}
                            </ThemedText>
                        </Button>
                    </View>
                    <MoreOptions />
                </ScrollView>
            ) : (
                <ScrollView>
                    {/* Header */}
                    <View className="flex flex-row items-center justify-start px-4 h-14">
                        <TouchableOpacity
                            onPress={() => {
                                setSuccessSignUp(false);
                            }}
                        >
                            <ThemedText style={{ fontSize: 16, lineHeight: 20 }}>Cancel</ThemedText>
                        </TouchableOpacity>
                    </View>
                    <View className="flex flex-col justify-center items-center">
                        <View className="flex flex-row py-4 justify-center items-center">
                            <Image source={require('@/assets/images/icon-64x64.png')} className="w-6 h-6 mr-2" />
                            <ThemedText style={{ fontSize: 20, lineHeight: 24, fontFamily: 'System-Medium' }}>
                                PopShare
                            </ThemedText>
                        </View>
                        <ThemedText style={{ fontSize: 40, lineHeight: 50, fontFamily: 'System-Black' }}>
                            {textData.verifyAccount}
                        </ThemedText>
                    </View>
                    <View className="p-2 flex justify-center items-center my-2">
                        {!errorMessages.otp ? (
                            <ThemedText style={{ fontSize: 16, lineHeight: 20, fontFamily: 'System-Regular' }}>
                                {textData.subMessageVerifyAccount}
                            </ThemedText>
                        ) : (
                            <ThemedText
                                lightColor="#ef4444"
                                darkColor="#ef4444"
                                style={{ fontSize: 16, lineHeight: 20, fontFamily: 'System-Regular' }}
                            >
                                {errorMessages.otp}
                            </ThemedText>
                        )}
                    </View>

                    <View className="flex items-center mt-4 gap-y-4">
                        <View
                            style={{ width: '80%', maxWidth: 350 }}
                            className="bg-[#00000040] dark:bg-[#ffffff40] flex flex-row border-2 border-[#00000060] dark:border-[#ffffff70] rounded-2xl items-center h-[50px] justify-between"
                        >
                            <ThemedText
                                ellipsizeMode="tail"
                                numberOfLines={1}
                                style={{ fontSize: 16, lineHeight: 20, marginHorizontal: 10, width: '90%' }}
                            >
                                {signUpData.email ?? 'example@email.commmmmmmmmmmmmmmmmmmm'}
                            </ThemedText>
                        </View>
                        <AuthOTPInput
                            isInvalid={!!errorMessages.otp}
                            handleVerifyOtp={handleVerifyOtp}
                            handleResendOtp={debouncedHandleResendOtp}
                        />
                    </View>
                </ScrollView>
            )}
        </DefaultLayout>
    );
};

export default SignUp;
