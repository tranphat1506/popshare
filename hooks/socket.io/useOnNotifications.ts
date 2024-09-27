import { useEffect, useRef, useState } from 'react';
import { socketConnection, SocketEvent } from '@/lib/SocketFactory';
import { useAppDispatch, useAppSelector } from '@/redux/hooks/hooks';
import { addMoreNoti, NotificationType } from '@/redux/notifications/reducer';
import { useLocalNotification } from '../useLocalNotifications';
import { Peers } from '@/redux/peers/reducer';
import { LoginSessionManager } from '@/storage/loginSession.storage';
import { FetchUserProfileById } from '@/helpers/fetching';
import { DataLanguageType, KeyDataLanguageType, LanguageType } from '@/languages/@types';
import useLanguage from '@/languages/hooks/useLanguage';
import { Platform } from 'react-native';

const useOnNotifications = () => {
    const socket = socketConnection.socket;
    const dispatch = useAppDispatch();
    const peers = useAppSelector((state) => state.peers.peers);
    const [notificaton, setNotification] = useState<NotificationType>();
    const notificationsBatch = useRef<NotificationType[]>([]);
    const { sendLocalNotification } = useLocalNotification();
    const batchInterval = 1000; // Khoảng thời gian batch (500ms)
    const isBatching = useRef(false);
    const lang = useLanguage();
    useEffect(() => {
        socket.on(SocketEvent.sendNotification, (payload: NotificationType) => {
            setNotification(payload);
        });
        return () => {
            socket.off(SocketEvent.onSendSeenStatus);
        };
    }, []);
    useEffect(() => {
        isBatching.current = false;
        if (!notificaton) return;
        const updateMessages = async () => {
            const batchNotifications = [...notificationsBatch.current];
            notificationsBatch.current = []; // reset queue
            dispatch(addMoreNoti(batchNotifications));
            for (const noti of batchNotifications) {
                const pushData = await createPushNotif(noti, peers, lang);
                sendLocalNotification(pushData.title, pushData.body, 1, {
                    redirect: {
                        screen: 'user-detail',
                        routeParams: {
                            userId: noti.sender.userId!,
                        },
                    },
                });
            }
        };
        notificationsBatch.current = notificationsBatch.current.concat(notificaton);
        if (notificationsBatch.current.length >= 10) {
            // If batch reaches 10, send immediately
            updateMessages();
        } else if (!isBatching.current) {
            // Start batching if not already in progress
            isBatching.current = true;
            setTimeout(() => {
                updateMessages();
            }, batchInterval);
        }
    }, [notificaton]);
    return notificaton;
};
const createPushNotif = async (
    noti: NotificationType,
    peers: Peers,
    lang: DataLanguageType,
): Promise<{ title: string; body: string }> => {
    try {
        const session = await LoginSessionManager.getCurrentSession();
        switch (noti.notificationType) {
            case 'friend_request':
                if (noti.sender.entityType !== 'user') throw Error('Invalid entity type on Friend Request Action');
                let senderDisplayName: string | undefined = peers[noti.sender.userId!]?.displayName;
                let senderUsername: string | undefined = peers[noti.sender.userId!]?.username;

                if (!senderDisplayName) {
                    const userData = await FetchUserProfileById(noti.sender.userId!, {
                        token: session?.token,
                        rtoken: session?.rtoken,
                    });
                    senderDisplayName = userData?.user.displayName;
                    senderUsername = userData?.user.username;
                }
                const message = noti.notificationMessages[0].split(' ');
                return {
                    title:
                        (senderDisplayName ?? 'UNDEFINED_SENDER') +
                        ' ' +
                        `(@${senderUsername ?? 'UNDEFINED_USERNAME'})`,
                    body:
                        (senderDisplayName ?? 'UNDEFINED_SENDER') +
                        ' ' +
                        `${lang[message[1] as KeyDataLanguageType]?.toLowerCase() ?? 'UNDEFINDED_MESSAGE'}.`,
                };
            default:
                throw Error('INVALID NOTIFICATION TYPE');
        }
    } catch (error) {
        console.error(error);
        return {
            title: 'UNDEFINED_SENDER',
            body: 'UNDEFINDED_MESSAGE',
        };
    }
};
export default useOnNotifications;
