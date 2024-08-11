/**
 * Learn more about light and dark modes:
 * https://docs.expo.dev/guides/color-schemes/
 */

import { useColorScheme } from 'react-native';

import { Colors } from '@/constants/Colors';
import { useAppSelector } from '@/redux/hooks/hooks';
import { useLayoutEffect, useState } from 'react';

export function useThemeColor(
    props: { light?: string; dark?: string },
    colorName?: keyof typeof Colors.light & keyof typeof Colors.dark,
) {
    const deviceTheme = useColorScheme() ?? 'light';
    const setting = useAppSelector((state) => state.setting);
    const theme = setting.theme === 'device' ? deviceTheme : setting.theme;
    const colorFromProps = props[theme];
    if (colorFromProps) {
        return colorFromProps;
    } else {
        return Colors[theme][colorName ?? 'tint'];
    }
}
