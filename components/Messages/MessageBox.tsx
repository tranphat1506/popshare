import React, { useMemo } from 'react';
import { Dimensions, TouchableOpacity, View } from 'react-native';
import PopshareAvatar from '../common/PopshareAvatar';
import { EmojiKey } from '../common/EmojiPicker';
import { ThemedText } from '../ThemedText';
import { IMemberDetail } from '@/redux/chatRoom/room.interface';
import { Peer } from '@/redux/peers/reducer';
import { ICurrentUserDetail } from '@/redux/auth/reducer';
import { ChatRoom } from '@/redux/chatRoom/reducer';
import { StringOnlineStateHelper } from '@/helpers/string';
import { ThemedView } from '../ThemedView';
import { BLUE_MAIN_COLOR } from '@/constants/Colors';
import useLanguage from '@/languages/hooks/useLanguage';
import { MessageChatBoxProps } from './MessageChatBox';

export interface IMessageRoom {
    room: ChatRoom;
    currentUser: ICurrentUserDetail;
    handleSetChatBox: (chatBox?: MessageChatBoxProps) => void;
}
export interface IP2PMessageRoom extends IMessageRoom {
    member: IMemberDetail;
    user: Peer;
}
export interface IGroupMessageRoom extends IMessageRoom {
    suffixNameColor: string;
    suffixRoomName: string;
    avatarColor: string;
}
export interface ICloudMessageRoom extends IMessageRoom {
    member: IMemberDetail;
}
const width = Dimensions.get('window').width;
const MESSAGE_BOX_HEIGHT = 75;
const MESSAGE_BOX_PADDING = 10;
const AVATAR_SIZE = 60;
const AVATAR_CONTAINER_WIDTH = AVATAR_SIZE + 5 * 2 + MESSAGE_BOX_PADDING * 2;
const MAIN_MESSAGE_BOX_WIDTH = width - AVATAR_CONTAINER_WIDTH;
const MAX_MAIN_MESSAGE_BOX_WIDTH = 400;

const P2PMessageRoom: React.FC<IP2PMessageRoom> = (props) => {
    const lang = useLanguage();
    const textData = useMemo(() => {
        return {
            DISPLAY_EMPTY_MESSAGES_DESCRIPTION: lang.DISPLAY_EMPTY_MESSAGES_DESCRIPTION,
            JUST_SENT: lang.JUST_SENT,
            ME: lang.YOU_TEXT,
        };
    }, [lang]);
    const handleOnClickChatBox = async () => {
        return props.handleSetChatBox({
            room: props,
            roomType: props.room.detail.roomType,
        });
    };
    return (
        <TouchableOpacity onPress={handleOnClickChatBox}>
            <View
                style={{
                    display: 'flex',
                    flexDirection: 'row',
                    height: MESSAGE_BOX_HEIGHT,
                    width: '100%',
                    paddingHorizontal: MESSAGE_BOX_PADDING,
                }}
            >
                {/* Avatar display */}
                <View
                    style={{
                        paddingVertical: 5,
                        paddingLeft: 0,
                        paddingRight: MESSAGE_BOX_PADDING,
                        // borderWidth: 1,
                        // borderColor: '#fff',
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                    }}
                >
                    <PopshareAvatar
                        size={50}
                        profilePicture={props.user.profilePicture}
                        avatarColor={props.user.avatarColor}
                        avatarEmoji={props.user.avatarEmoji as EmojiKey}
                        displayOnlineState={true}
                        onlineState={props.user.onlineState}
                    />
                </View>
                {/* Border bottom container */}
                <View
                    style={{
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'space-between',
                    }}
                >
                    {/* Main container */}
                    <View
                        style={{
                            padding: 5,
                            display: 'flex',
                            flexDirection: 'column',
                            maxWidth: MAX_MAIN_MESSAGE_BOX_WIDTH,
                            width: MAIN_MESSAGE_BOX_WIDTH,
                        }}
                    >
                        <View
                            style={{
                                display: 'flex',
                                flexDirection: 'row',
                                justifyContent: 'space-between',
                                alignItems: 'flex-end',
                            }}
                        >
                            {/* Title display */}
                            <View style={{ display: 'flex', flexDirection: 'row', columnGap: 4, flexBasis: '80%' }}>
                                <ThemedText numberOfLines={1} style={{ fontSize: 17, fontFamily: 'System-Bold' }}>
                                    {props.user.displayName}
                                </ThemedText>
                            </View>
                            {/* Time and status display */}
                            {props.room.lastMesssage && (
                                <View
                                    style={{
                                        display: 'flex',
                                        flexDirection: 'row',
                                        columnGap: 4,
                                        flexBasis: '20%',
                                        justifyContent: 'flex-end',
                                    }}
                                >
                                    <ThemedText style={{ fontSize: 13, lineHeight: 20, fontFamily: 'System-Regular' }}>
                                        {StringOnlineStateHelper.toLastOnlineTime(props.room.lastMesssage.createdAt) ??
                                            textData.JUST_SENT}
                                    </ThemedText>
                                </View>
                            )}
                        </View>

                        {/* Messages display */}
                        <View
                            style={{
                                display: 'flex',
                                flexDirection: 'row',
                                justifyContent: 'space-between',
                                alignItems: 'flex-end',
                            }}
                        >
                            {/* newest message display */}
                            <View
                                style={{
                                    display: 'flex',
                                    flexDirection: 'row',
                                    width: '60%',
                                    alignItems: 'flex-start',
                                }}
                            >
                                {props.room.lastMesssage ? (
                                    <>
                                        <ThemedText
                                            lightColor={!props.room.notRead ? '#7e7e7e' : '#000'}
                                            darkColor={!props.room.notRead ? '#7e7e7e' : '#fff'}
                                            numberOfLines={2}
                                            style={{ fontSize: 14, lineHeight: 20, fontFamily: 'System-Medium' }}
                                        >
                                            {props.room.lastMesssage.senderId === props.user.userId
                                                ? props.member.displayName || props.user.displayName
                                                : textData.ME}
                                            {': '}
                                        </ThemedText>
                                        <ThemedText
                                            lightColor={!props.room.notRead ? '#7e7e7e' : '#000'}
                                            darkColor={!props.room.notRead ? '#7e7e7e' : '#fff'}
                                            numberOfLines={2}
                                            style={{ fontSize: 14, lineHeight: 20, fontFamily: 'System-Regular' }}
                                        >
                                            {props.room.lastMesssage.content}
                                        </ThemedText>
                                    </>
                                ) : (
                                    <ThemedText
                                        lightColor="#7e7e7e"
                                        darkColor="#7e7e7e"
                                        numberOfLines={2}
                                        style={{ fontSize: 14, lineHeight: 20, fontFamily: 'System-Regular' }}
                                    >
                                        {textData.DISPLAY_EMPTY_MESSAGES_DESCRIPTION}
                                    </ThemedText>
                                )}
                            </View>
                            {/* Time and status display */}
                            <View
                                style={{
                                    display: 'flex',
                                    flexDirection: 'row',
                                    columnGap: 4,
                                }}
                            >
                                {!!props.room.notRead && (
                                    <ThemedView
                                        lightColor={BLUE_MAIN_COLOR}
                                        darkColor={BLUE_MAIN_COLOR}
                                        style={{ paddingHorizontal: 5, paddingVertical: 2, borderRadius: 9999 }}
                                    >
                                        <ThemedText
                                            style={{
                                                fontSize: 12,
                                                lineHeight: 14,
                                                fontFamily: 'System-Regular',
                                                color: '#fff',
                                            }}
                                        >
                                            {props.room.notRead}
                                        </ThemedText>
                                    </ThemedView>
                                )}
                            </View>
                        </View>
                    </View>
                    <ThemedView
                        lightColor={'#9e9e9e'}
                        darkColor={'#3e3e3e'}
                        style={{ paddingHorizontal: MESSAGE_BOX_PADDING, height: 1, width: '100%' }}
                    />
                </View>
            </View>
        </TouchableOpacity>
    );
};

const GroupMessageRoom: React.FC<IGroupMessageRoom> = (props) => {
    return (
        <View style={{ display: 'flex', flexDirection: 'row' }}>
            <View style={{ padding: 5 }}>
                <PopshareAvatar size={60} profilePicture={props.room.detail.roomAvatar} avatarColor={props.avatarColor}>
                    <ThemedText style={{ color: props.suffixNameColor, fontSize: 14, lineHeight: 16 }}>
                        {props.suffixRoomName}
                    </ThemedText>
                </PopshareAvatar>
            </View>
            <View style={{ padding: 5, display: 'flex', flexDirection: 'column' }}>
                <View style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
                    <ThemedText></ThemedText>
                </View>
            </View>
        </View>
    );
};

const CloudMessageRoom: React.FC<ICloudMessageRoom> = (props) => {
    return (
        <View style={{ display: 'flex', flexDirection: 'row' }}>
            <View style={{ padding: 5 }}>
                <PopshareAvatar
                    size={60}
                    profilePicture={props.currentUser.profilePicture}
                    avatarColor={props.currentUser.avatarColor}
                    avatarEmoji={props.currentUser.avatarEmoji as EmojiKey}
                />
            </View>
            <View style={{ padding: 5, display: 'flex', flexDirection: 'column' }}>
                <View style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
                    <ThemedText></ThemedText>
                </View>
            </View>
        </View>
    );
};

const SkeletonMessageRoom: React.FC = () => {
    return (
        <View style={{ display: 'flex', flexDirection: 'row' }}>
            <View style={{ padding: 5 }}>
                <PopshareAvatar size={60} skeleton={true} />
            </View>
            <View style={{ padding: 5, display: 'flex', flexDirection: 'column' }}>
                <View style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
                    <ThemedText></ThemedText>
                </View>
            </View>
        </View>
    );
};

export { P2PMessageRoom, GroupMessageRoom, CloudMessageRoom, SkeletonMessageRoom };
