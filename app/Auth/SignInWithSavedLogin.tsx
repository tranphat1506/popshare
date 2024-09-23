import { ThemedText } from '@/components/ThemedText';
import useLanguage from '@/languages/hooks/useLanguage';
import { ISessionToken, LoginSessionManager } from '@/storage/loginSession.storage';
import { MaterialIcons } from '@expo/vector-icons';
import { Icon } from 'native-base';
import React, { useCallback, useMemo, useState } from 'react';
import { FlatList, Image, ListRenderItem, ScrollView, View, TouchableOpacity } from 'react-native';
import UserSessionItem from './UserSessionItem';
import { useDispatch } from 'react-redux';
import { login } from '@/redux/auth/reducer';
import { refreshTokenAndFetchingData } from '@/helpers/fetching';
import _ from 'lodash';
import { NavigationProp, useNavigation } from '@react-navigation/native';
import { RootStackParamList } from '@/configs/routes.config';

interface SignInWithSavedLoginProps {
    setOpenSavedLogin: (state: boolean) => void;
    savedLoginArray?: ISessionToken[];
}
const SignInWithSavedLogin: React.FC<SignInWithSavedLoginProps> = ({ setOpenSavedLogin, savedLoginArray = [] }) => {
    const dispatch = useDispatch();
    const lang = useLanguage();
    const navigation = useNavigation<NavigationProp<RootStackParamList, '/'>>();
    const handleNavigateToSignIn = useCallback((account: string, errorMessage?: string) => {
        navigation.navigate('signIn', {
            account: account,
            error: errorMessage,
        });
    }, []);
    const textLanguage = useMemo(() => {
        return {
            TITLE_SIGN_IN: lang.SIGN_IN_TITLE,
            SIGN_IN_SUBMESSAGE: lang.SIGN_IN_SUBMESSAGE,
            MESSAGE_EMPTY_SAVED_SESSION_LIST: lang.MESSAGE_EMPTY_SAVED_SESSION_LIST,
        };
    }, [lang]);

    const [onLogin, setOnLogin] = useState<boolean>(false);
    const handleRefreshTokenAndFetchingData = async (session: ISessionToken) => {
        try {
            if (onLogin) return null;
            const fetch = await refreshTokenAndFetchingData({ rtoken: session.rtoken });
            if (fetch) {
                await LoginSessionManager.setSessionToSessionSaved(
                    {
                        authId: fetch.user.authId,
                        rtoken: session.rtoken,
                        userId: fetch.user.userId,
                        avatarColor: fetch.user.avatarColor,
                        avatarEmoji: fetch.user.avatarEmoji,
                        username: fetch.user.username,
                        profilePicture: fetch.user.profilePicture,
                        displayName: fetch.user.displayName,
                        token: fetch.user.token,
                    },
                    true,
                );
                dispatch(login());
            }
            setOnLogin(false);
        } catch (error) {
            await LoginSessionManager.removeSessionById(session.userId, true);
            handleNavigateToSignIn(session.username, 'ERROR_REFRESH_TOKEN_OUT_OF_TIME');
        }
    };
    const handleLoginWithSavedSession = _.debounce(handleRefreshTokenAndFetchingData, 5000, {
        leading: true,
        trailing: true,
    });
    const renderSessionItem: ListRenderItem<ISessionToken> = useCallback(({ item }) => {
        return <UserSessionItem key={item.userId} handleRefreshToken={handleLoginWithSavedSession} item={item} />;
    }, []);
    return (
        <ScrollView>
            {/* Header */}
            <View className="flex flex-row items-center justify-end px-4 h-14">
                <TouchableOpacity onPress={() => {}}>
                    <Icon
                        className="text-[#000000bd] dark:text-[#fffffff7]"
                        as={MaterialIcons}
                        name="settings"
                        size={'xl'}
                    />
                </TouchableOpacity>
            </View>
            <View className="flex flex-col justify-center items-center">
                <View className="flex flex-row py-4 justify-center items-center">
                    <Image source={require('@/assets/images/icon-64x64.png')} className="w-6 h-6 mr-2" />
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
                <View
                    style={{
                        paddingHorizontal: 20,
                        display: savedLoginArray?.length === 0 ? 'flex' : 'none',
                    }}
                >
                    <ThemedText style={{ fontSize: 16, lineHeight: 20 }}>
                        {textLanguage.MESSAGE_EMPTY_SAVED_SESSION_LIST}
                    </ThemedText>
                </View>
                <FlatList
                    horizontal={false}
                    scrollEnabled={false}
                    renderItem={renderSessionItem}
                    data={savedLoginArray}
                    keyExtractor={(item) => item.userId}
                    contentContainerStyle={{
                        display: 'flex',
                        width: '100%',
                        rowGap: 10,
                    }}
                />
            </View>
        </ScrollView>
    );
};

export default SignInWithSavedLogin;
