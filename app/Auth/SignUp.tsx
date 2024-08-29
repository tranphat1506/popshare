import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { RootStackParamList } from '@/configs/routes.config';
import { BLUE_MAIN_COLOR } from '@/constants/Colors';
import { NavigationProp, useNavigation } from '@react-navigation/native';
import {
    Avatar,
    Button,
    Flex,
    FormControl,
    Icon,
    IconButton,
    Input,
    Pressable,
    Text,
    WarningOutlineIcon,
} from 'native-base';
import React, { useEffect, useState } from 'react';
import { Image, ScrollView, TextInput, View } from 'react-native';
import MoreOptions from './MoreOptions';
import { Entypo, FontAwesome } from '@expo/vector-icons';
import DefaultLayout from '@/components/layout/DefaultLayout';
import { Emoji } from '@/constants/EmojiConstants';
import EmojiPicker, { EmojiKey } from '@/components/common/EmojiPicker';
import AvatarSettingModal from './AvatarSettingModal';

interface ISignUpData {
    displayName?: string;
    username?: string;
    email?: string;
    password?: string;
    rePassword?: string;
    avatarEmoji?: string;
    avatarColor?: string;
    profilePicture?: string;
}

const SignUp = () => {
    const navigation = useNavigation<NavigationProp<RootStackParamList, 'signIn'>>();
    const handleNavToSignIn = () => {
        navigation.navigate('signIn', {});
    };
    const [showAvatarSetting, setShowAvatarSetting] = useState<boolean>(false);
    const [showColorPicker, setShowColorPicker] = useState<boolean>(false);
    const [showEmojiPicker, setShowEmojiPicker] = useState<boolean>(false);
    const [showPassword, setShowPassword] = useState<boolean>(false);
    const handleShowPassword = () => {
        setShowPassword(!showPassword);
    };
    const [signUpData, setSignUpData] = useState<ISignUpData>({
        avatarColor: '#F4F5F7',
        avatarEmoji: 'Slightly Smiling Face',
    });
    const handleChangeData = (dataField: keyof ISignUpData) => (e: string | EmojiKey | null) => {
        setSignUpData({ ...signUpData, [dataField]: e });
    };

    useEffect(() => {
        console.log(signUpData);
    }, [signUpData]);

    return (
        <DefaultLayout>
            <AvatarSettingModal
                emojiPicker={{
                    isPickerOpen: showEmojiPicker,
                    handleSetEmoji: handleChangeData('avatarEmoji'),
                    handleOpenPicker: setShowEmojiPicker,
                }}
                isPickerVisible={showAvatarSetting}
                handleChangePickerVisible={setShowAvatarSetting}
            />
            <ScrollView>
                <View className="flex flex-col justify-center items-center">
                    <View className="flex flex-row py-4 justify-center items-center">
                        <Image source={require('@/assets/images/radar.png')} className="w-6 h-6 mr-2" />
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
                    <View>
                        <Avatar
                            source={Emoji[signUpData.avatarEmoji! as EmojiKey]}
                            backgroundColor={signUpData.avatarColor}
                            size={'2xl'}
                            padding={5}
                            key={signUpData.avatarEmoji}
                        >
                            <Avatar.Badge
                                display={'flex'}
                                justifyContent={'center'}
                                alignItems={'center'}
                                backgroundColor={BLUE_MAIN_COLOR}
                            >
                                <Pressable onPress={() => setShowAvatarSetting(true)}>
                                    <Icon color={'#fff'} as={Entypo} name="pencil" />
                                </Pressable>
                            </Avatar.Badge>
                        </Avatar>
                    </View>
                    <FormControl w="80%" maxW="350px">
                        <Input
                            onChangeText={handleChangeData('username')}
                            h={'50px'}
                            focusOutlineColor={BLUE_MAIN_COLOR}
                            autoComplete={'username-new'}
                            type={'text'}
                            fontFamily={'System-Regular'}
                            placeholder="Username"
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
                            onChangeText={handleChangeData('email')}
                            h={'50px'}
                            focusOutlineColor={BLUE_MAIN_COLOR}
                            autoComplete={'email'}
                            type={'text'}
                            fontFamily={'System-Regular'}
                            placeholder="Email"
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
                            onChangeText={handleChangeData('password')}
                            h={'50px'}
                            focusOutlineColor={BLUE_MAIN_COLOR}
                            autoComplete={'password-new'}
                            type={showPassword ? 'text' : 'password'}
                            fontFamily={'System-Regular'}
                            placeholder="Password"
                            fontSize={16}
                            borderRadius={'xl'}
                            className="bg-white text-black dark:text-white dark:bg-black"
                            InputRightElement={
                                <Pressable
                                    onPress={handleShowPassword}
                                    display={'flex'}
                                    justifyContent={'center'}
                                    style={{ backgroundColor: '#fff', marginHorizontal: 15 }}
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
                            Try different from previous passwords.
                        </FormControl.ErrorMessage>
                    </FormControl>
                    <FormControl w="80%" maxW="350px">
                        <Input
                            onChangeText={handleChangeData('rePassword')}
                            h={'50px'}
                            focusOutlineColor={BLUE_MAIN_COLOR}
                            autoComplete={'password-new'}
                            type={showPassword ? 'text' : 'password'}
                            fontFamily={'System-Regular'}
                            placeholder="Confirm password"
                            fontSize={16}
                            borderRadius={'xl'}
                            className="bg-white text-black dark:text-white dark:bg-black"
                            InputRightElement={
                                <Pressable
                                    onPress={handleShowPassword}
                                    display={'flex'}
                                    justifyContent={'center'}
                                    style={{ backgroundColor: '#fff', marginHorizontal: 15 }}
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
                            Try different from previous passwords.
                        </FormControl.ErrorMessage>
                    </FormControl>
                    <Button w="80%" maxW="350px" backgroundColor={BLUE_MAIN_COLOR} borderRadius={'md'}>
                        <Text color={'#fff'} fontFamily={'System-Regular'} fontSize={16} lineHeight={20}>
                            Sign Up
                        </Text>
                    </Button>
                    <Button onPress={handleNavToSignIn} variant={'outline'} w="80%" maxW="350px" borderRadius={'md'}>
                        <ThemedText darkColor="#fff" lightColor="#000" style={{ fontSize: 16, lineHeight: 20 }}>
                            Sign In
                        </ThemedText>
                    </Button>
                </View>

                <MoreOptions />
            </ScrollView>
        </DefaultLayout>
    );
};

export default SignUp;
