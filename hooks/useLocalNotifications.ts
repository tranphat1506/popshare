import { useEffect } from 'react';
import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';
import { RootStackParamList } from '@/configs/routes.config';
import { NavigationProp, useNavigation } from '@react-navigation/native';
export const useLocalNotification = () => {
    const navigation = useNavigation<NavigationProp<RootStackParamList, '/'>>();
    useEffect(() => {
        // Cấu hình để thông báo hiển thị ngay cả khi ứng dụng đang ở foreground
        Notifications.setNotificationHandler({
            handleNotification: async () => ({
                shouldShowAlert: true, // Hiển thị thông báo dạng banner khi app ở foreground
                shouldPlaySound: true, // Phát âm thanh
                shouldSetBadge: false, // Không thay đổi badge
            }),
        });
        const setupNotifications = async () => {
            // Kiểm tra thiết bị (Expo yêu cầu dùng thiết bị thật để thông báo push hoạt động)
            // if (!Device.isDevice) {
            //     console.log('Phải sử dụng thiết bị thật để push notification hoạt động.');
            //     return;
            // }

            // Xin quyền gửi thông báo
            const { status: existingStatus } = await Notifications.getPermissionsAsync();
            let finalStatus = existingStatus;

            // Nếu chưa được cấp quyền thì xin quyền
            if (existingStatus !== 'granted') {
                const { status } = await Notifications.requestPermissionsAsync();
                finalStatus = status;
            }

            // Nếu không được cấp quyền, thoát
            if (finalStatus !== 'granted') {
                console.log('Quyền gửi thông báo không được cấp.');
                return;
            }

            console.log('Quyền gửi thông báo đã được cấp.');
        };

        // Gọi hàm thiết lập quyền thông báo
        setupNotifications();

        // Lắng nghe sự kiện nhận thông báo khi ứng dụng ở foreground
        const notificationListener = Notifications.addNotificationReceivedListener((notification) => {
            // console.log(Platform.OS, 'Thông báo đã nhận:', notification);
        });

        // Lắng nghe sự kiện phản hồi (khi người dùng nhấn vào thông báo)
        const responseListener = Notifications.addNotificationResponseReceivedListener((response) => {
            // console.log(Platform.OS, 'Người dùng đã nhấn vào thông báo:', response);
            // Chuyển hướng đến màn hình mong muốn
            const screen = response.notification.request.content.data.redirect?.screen; // Lấy data từ thông báo
            const routeParams = response.notification.request.content.data.redirect?.routeParams; // Lấy data từ thông báo

            if (screen) {
                navigation.navigate(screen, routeParams); // Điều hướng đến trang cụ thể
            }
        });

        // Dọn dẹp listeners khi component bị unmount
        return () => {
            notificationListener.remove();
            responseListener.remove();
        };
    }, []);

    // Gửi local notification
    const sendLocalNotification = async <T extends keyof RootStackParamList>(
        title: string,
        body: string,
        time: number = 1,
        data: {
            redirect?: {
                screen: T;
                routeParams: RootStackParamList[T];
            };
        },
    ) => {
        await Notifications.scheduleNotificationAsync({
            content: {
                title,
                body,
                priority: Notifications.AndroidNotificationPriority.MAX,
                data,
            },
            trigger: {
                seconds: time,
            },
        });
    };

    return { sendLocalNotification };
};
