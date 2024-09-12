import { ThemedText } from '@/components/ThemedText';
import { RootStackParamList } from '@/configs/routes.config';
import { BLUE_MAIN_COLOR } from '@/constants/Colors';
import { NavigationProp, useNavigation } from '@react-navigation/native';
import { Button, Checkbox, FormControl, Icon, Input, Pressable, Spinner, Text, WarningOutlineIcon } from 'native-base';
import React, { useEffect, useLayoutEffect, useMemo, useState } from 'react';
import { Dimensions, Image, ScrollView, View } from 'react-native';
import MoreOptions from './MoreOptions';
import useLanguage from '@/languages/hooks/useLanguage';
import { FontAwesome } from '@expo/vector-icons';
import { useAppSelector } from '@/redux/hooks/hooks';
import { translateErrorMessageWithStructure } from '@/helpers/string';
import _ from 'lodash';
import { BE_API_URL } from '@/constants/Constants';
import { IErrorResponse } from '@/interfaces/ResponsePayload.interfaces';
import { TouchableOpacity } from 'react-native-gesture-handler';
import AuthOTPInput from './AuthOTPInput';
import { useDispatch } from 'react-redux';
import DefaultLayout from '@/components/layout/DefaultLayout';
import { login } from '@/redux/auth/reducer';
import { ISessionToken, LoginSessionManager } from '@/storage/loginSession.storage';
import SignInWithSavedLogin from './SignInWithSavedLogin';
const wWindow = Dimensions.get('window').width;
interface ISignInData {
    account?: string;
    password?: string;
    otp?: string;
    rememberDevice?: boolean;
}
interface ISignInSuccessResponse {
    message: string;
    rtoken?: string;
    token: string;
    user: any;
}
const SignIn = () => {
    const dispatch = useDispatch();
    const language = useAppSelector((state) => state.setting.language);
    const navigation = useNavigation<NavigationProp<RootStackParamList, 'signIn'>>();
    const handleNavToSignUp = () => {
        navigation.navigate('signUp');
    };
    const [signInData, setSignInData] = useState<ISignInData>({});
    const handleChangeData = (field: keyof ISignInData) => (data: string | boolean) => {
        setSignInData((signInData) => {
            return {
                ...signInData,
                [field]: data,
            };
        });
    };
    // useEffect(() => {
    //     console.log(signInData);
    // }, [signInData]);
    const [showPassword, setShowPassword] = useState<boolean>(false);
    const handleShowPassword = () => {
        setShowPassword(!showPassword);
    };
    const [errorMessages, setErrorMessages] = useState<ISignInData>({});
    const [userIsNeedVerifyOtp, setUserIsNeedVerifyOtp] = useState<boolean>(false);
    const lang = useLanguage();
    const textLanguage = useMemo(() => {
        return {
            TITLE_SIGN_IN: lang.SIGN_IN_TITLE,
            SIGN_IN_SUBMESSAGE: lang.SIGN_IN_SUBMESSAGE,
            SIGNIN_BUTTON_TITLE: lang.SIGN_IN,
            SIGNUP_BUTTON_TITLE: lang.MESSAGE_SIGN_UP_NOW,
            ACCOUNT_PLACEHOLDER: lang.USERNAME_OR_EMAIL,
            PASSWORD_PLACEHOLDER: lang.PASSWORD,
            TITLE_REMEMBER_ACCOUNT: lang.REMEMBER_ACCOUNT,
            TITLE_VERIFY_ACCOUNT: lang.VERIFY_ACCOUNT,
            SUBMESSAGE_VERIFY_ACCOUNT: lang.OTP_JUST_SEND_TO_EMAIL,
            TITLE_SIGN_IN_WITH_OTHER_ACCOUNT: lang.SIGN_IN_WITH_OTHER_ACCOUNT,
            TITLE_CANCEL: lang.CANCEL,
            MESSAGE_EMPTY_SAVED_SESSION_LIST: lang.MESSAGE_EMPTY_SAVED_SESSION_LIST,
            TITLE_LOGIN_SESSION_LIST: lang.LOGIN_SESSION_LIST,
        };
    }, [lang]);

    const [onSubmitSignIn, setOnSubmitSignIn] = useState<boolean>(false);
    const signInAccount = async (otpToken?: string) => {
        try {
            const response = await fetch(BE_API_URL + '/signin', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    account: signInData.account,
                    password: signInData.password,
                    otpToken: otpToken,
                    rememberDevice: signInData.rememberDevice,
                }),
            });
            if (response.ok) {
                const success = (await response.json()) as ISignInSuccessResponse;
                const session = {
                    authId: success.user.authId,
                    rtoken: success.rtoken,
                    userId: success.user._id,
                    avatarColor: success.user.avatarColor,
                    avatarEmoji: success.user.avatarEmoji,
                    username: success.user.username,
                    profilePicture: success.user.profilePicture,
                    displayName: success.user.displayName,
                    token: success.token,
                } as ISessionToken;
                // Success sign in
                if (success.rtoken) await LoginSessionManager.setSessionToSessionSaved(session, true);
                else await LoginSessionManager.setCurrentSession(session);
                dispatch(login());
            } else {
                const json = (await response.json()) as IErrorResponse;
                // Not acceptable (mean user not verify)
                if (json.statusCode === 406) {
                    setUserIsNeedVerifyOtp(true);
                } else {
                    const errorField = json.message.split('"')[1] as keyof ISignInData;
                    if (errorField === 'otp') {
                        setErrorMessages({
                            [errorField]: translateErrorMessageWithStructure(json.message, language),
                        });
                    } else {
                        setErrorMessages({
                            account: translateErrorMessageWithStructure(`ERROR_INVALID_CREDENTIALS`, language),
                        });
                    }
                }
            }
        } catch (error) {
            console.log(error);
        }
        setOnSubmitSignIn(false);
    };
    const handleSubmitSignIn = () => {
        setErrorMessages({});
        setOnSubmitSignIn(true);
        signInAccount();
    };
    const debouncedHandleSubmitSignIn = _.debounce(handleSubmitSignIn, 5000, {
        leading: true,
        trailing: false,
    });
    const debouncedHandleVerifyOtp = _.debounce(signInAccount, 5000, {
        leading: true,
        trailing: false,
    });
    const debouncedHandleResendOtp = _.debounce(handleSubmitSignIn, 3 * 60 * 1000, {
        leading: true,
        trailing: false,
    });

    // --------------------------------------------------------------------------
    // Use for SignInWithSavedLogin component
    const [openSavedLogin, setOpenSavedLogin] = useState<boolean>(false);
    const [savedLoginArray, setSavedLoginArray] = useState<ISessionToken[]>();
    const handleSetSessionsLogin = async (forceOpen?: boolean) => {
        const savedList = (await LoginSessionManager.getLoginSessionSaved()).sessions;
        const toArray = Object.keys(savedList).map((s) => savedList[s]);
        if (toArray.length !== 0 || forceOpen) {
            setOpenSavedLogin(true);
            setSavedLoginArray(toArray);
        }
    };
    const handleCloseSavedLogin = () => {
        setOpenSavedLogin(false);
    };
    useLayoutEffect(() => {
        handleSetSessionsLogin(false);
    }, []);

    // useEffect(() => {
    //     // AsyncStorage.clear();
    //     const a = async () => (await LoginSessionManager.getLoginSessionSaved()).sessions;
    //     a().then((t) => {
    //         console.log(t);
    //     });
    // }, []);
    // --------------------------------------------------------------------------
    return (
        <DefaultLayout>
            {!userIsNeedVerifyOtp && (
                <React.Fragment>
                    {!openSavedLogin && (
                        <ScrollView>
                            <View className="flex flex-col justify-center items-center">
                                <View className="flex flex-row py-4 justify-center items-center">
                                    <Image
                                        source={require('@/assets/images/icon-64x64.png')}
                                        className="w-6 h-6 mr-2"
                                    />
                                    <ThemedText style={{ fontSize: 20, lineHeight: 24, fontFamily: 'System-Medium' }}>
                                        PopShare
                                    </ThemedText>
                                </View>
                                <ThemedText
                                    style={{
                                        fontSize: 40,
                                        lineHeight: 50,
                                        fontFamily: 'System-Black',
                                        textTransform: 'capitalize',
                                    }}
                                >
                                    {textLanguage.TITLE_SIGN_IN}
                                </ThemedText>
                            </View>
                            <View className="p-2 flex justify-center items-center my-4">
                                <ThemedText
                                    style={{
                                        fontSize: 24,
                                        lineHeight: 24,
                                        fontFamily: 'System-Regular',
                                        textTransform: 'capitalize',
                                    }}
                                >
                                    {textLanguage.SIGN_IN_SUBMESSAGE}
                                </ThemedText>
                            </View>
                            <View className="flex items-center mt-4 gap-y-4">
                                <FormControl isInvalid={!!errorMessages.account} w="80%" maxW="350px">
                                    <Input
                                        value={signInData.account}
                                        onChangeText={handleChangeData('account')}
                                        h={'50px'}
                                        focusOutlineColor={BLUE_MAIN_COLOR}
                                        autoComplete={'email'}
                                        type={'text'}
                                        fontFamily={'System-Regular'}
                                        placeholder={textLanguage.ACCOUNT_PLACEHOLDER}
                                        fontSize={16}
                                        borderRadius={'xl'}
                                        backgroundColor={'#fff'}
                                        className="bg-white text-black dark:text-white dark:bg-black"
                                    />
                                    <FormControl.ErrorMessage leftIcon={<WarningOutlineIcon size="xs" />}>
                                        {errorMessages.account}
                                    </FormControl.ErrorMessage>
                                </FormControl>
                                <FormControl isInvalid={!!errorMessages.password} w="80%" maxW="350px">
                                    <Input
                                        value={signInData.password}
                                        onChangeText={handleChangeData('password')}
                                        placeholder={textLanguage.PASSWORD_PLACEHOLDER}
                                        h={'50px'}
                                        focusOutlineColor={BLUE_MAIN_COLOR}
                                        autoComplete={'password-new'}
                                        type={showPassword ? 'text' : 'password'}
                                        fontFamily={'System-Regular'}
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
                                <FormControl w="80%" maxW="350px">
                                    <Checkbox
                                        onChange={(e) => handleChangeData('rememberDevice')(e)}
                                        value="1"
                                        _checked={{
                                            bgColor: BLUE_MAIN_COLOR,
                                            borderColor: '#00000000',
                                        }}
                                    >
                                        <ThemedText style={{ fontSize: 16, lineHeight: 20 }}>
                                            {textLanguage.TITLE_REMEMBER_ACCOUNT}
                                        </ThemedText>
                                    </Checkbox>
                                </FormControl>
                                <Button
                                    onPress={debouncedHandleSubmitSignIn}
                                    w="80%"
                                    maxW="350px"
                                    backgroundColor={BLUE_MAIN_COLOR}
                                    borderRadius={'md'}
                                >
                                    {!onSubmitSignIn ? (
                                        <Text
                                            color={'#fff'}
                                            fontFamily={'System-Regular'}
                                            fontSize={16}
                                            lineHeight={20}
                                            textTransform={'capitalize'}
                                        >
                                            {textLanguage.SIGNIN_BUTTON_TITLE}
                                        </Text>
                                    ) : (
                                        <Spinner color={'#fff'} />
                                    )}
                                </Button>
                                <MoreOptions />
                            </View>
                        </ScrollView>
                    )}
                    {openSavedLogin && (
                        <SignInWithSavedLogin savedLoginArray={savedLoginArray} setOpenSavedLogin={setOpenSavedLogin} />
                    )}
                    <View className="flex items-center py-6 gap-y-4">
                        {!openSavedLogin && (
                            <Button
                                onPress={() => handleSetSessionsLogin(true)}
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
                                    {textLanguage.TITLE_LOGIN_SESSION_LIST}
                                </ThemedText>
                            </Button>
                        )}
                        {openSavedLogin && (
                            <Button
                                onPress={handleCloseSavedLogin}
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
                                    {textLanguage.TITLE_SIGN_IN_WITH_OTHER_ACCOUNT}
                                </ThemedText>
                            </Button>
                        )}
                        <Button
                            onPress={handleNavToSignUp}
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
                                {textLanguage.SIGNUP_BUTTON_TITLE}
                            </ThemedText>
                        </Button>
                    </View>
                </React.Fragment>
            )}
            {userIsNeedVerifyOtp && (
                <ScrollView>
                    {/* Header */}
                    <View className="flex flex-row items-center justify-start px-4 h-14">
                        <TouchableOpacity
                            onPress={() => {
                                setUserIsNeedVerifyOtp(false);
                            }}
                        >
                            <ThemedText style={{ fontSize: 16, lineHeight: 20 }}>
                                {textLanguage.TITLE_CANCEL}
                            </ThemedText>
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
                            {textLanguage.TITLE_VERIFY_ACCOUNT}
                        </ThemedText>
                    </View>
                    <View className="p-2 flex justify-center items-center my-2">
                        {!errorMessages.otp ? (
                            <ThemedText style={{ fontSize: 16, lineHeight: 20, fontFamily: 'System-Regular' }}>
                                {textLanguage.SUBMESSAGE_VERIFY_ACCOUNT}
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
                        <AuthOTPInput
                            isInvalid={!!errorMessages.otp}
                            handleVerifyOtp={debouncedHandleVerifyOtp}
                            handleResendOtp={debouncedHandleResendOtp}
                        />
                    </View>
                </ScrollView>
            )}
        </DefaultLayout>
    );
};

export default SignIn;
