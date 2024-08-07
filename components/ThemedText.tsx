import { Text, type TextProps } from 'react-native';

import { useThemeColor } from '@/hooks/useThemeColor';

export type ThemedTextProps = TextProps & {
    lightColor?: string;
    darkColor?: string;
    type?: 'default' | 'title' | 'iconText' | 'link';
};

export function ThemedText({ style, lightColor, darkColor, type = 'default', ...rest }: ThemedTextProps) {
    const color = useThemeColor({ light: lightColor, dark: darkColor }, 'text');

    return <Text className={styles[type].className ?? ''} style={[{ color }, styles[type].styles, style]} {...rest} />;
}

interface CustomTextProps {
    className?: string;
    styles?: object;
}

const styles: { [key: string]: CustomTextProps } = {
    default: {
        className: 'text-lg',
        styles: {
            fontFamily: 'System-Regular',
        },
    },
    iconText: {
        className: 'text-xs',
        styles: {
            fontFamily: 'System-Regular',
        },
    },
    title: {
        className: 'uppercase leading-none',
        styles: {
            fontFamily: 'System-Black',
            fontSize: 30,
        },
    },
    link: {
        className: 'text-md underline',
        styles: {
            fontFamily: 'System-Regular',
            color: '#1C9EF6',
        },
    },
};
