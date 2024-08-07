import { BLUE_MAIN_COLOR } from '@/constants/Colors';
import { Badge, IconButton, IIconButtonProps, VStack } from 'native-base';
import { InterfaceBadgeProps } from 'native-base/lib/typescript/components/composites/Badge/types';
import React from 'react';
import { ColorSchemeName, useColorScheme } from 'react-native';

type BadgeProps = InterfaceBadgeProps & {
    value?: number;
    max?: number;
    min?: number;
    show?: boolean;
};

type IconBtnProps = IIconButtonProps & {
    show?: boolean;
};
type ButtonIconWithBadgeProps = React.ComponentProps<typeof VStack> & {
    badgeProps?: BadgeProps;
    btnProps?: IconBtnProps;
};
const badgeValue = (value?: number | undefined, min?: number, max?: number): string => {
    if (value === undefined) return '';
    if (min === undefined || max === undefined) return value.toString();
    if (value > max) return max + '+';
    return value.toString();
};
const ButtonIconWithBadge: React.FC<ButtonIconWithBadgeProps> = ({ badgeProps = {}, btnProps = {}, ...props }) => {
    const showBtn = btnProps.show ?? true;
    if (!showBtn) return <></>;
    const minV = badgeProps.min ?? badgeProps.value;
    const maxV = badgeProps.max ?? badgeProps.value;
    const showBadge =
        badgeProps.show || badgeProps.value === undefined
            ? false
            : minV === undefined
            ? badgeProps.value
            : badgeProps.value >= minV;
    const theme = useColorScheme();
    const IconBtnStyleDefault = generateIconBtnStyleDefault(theme);
    return (
        <VStack {...props}>
            {showBadge && (
                <Badge {...IconBtnStyleDefault.badge} {...badgeProps}>
                    {badgeValue(badgeProps.value, minV, maxV)}
                </Badge>
            )}
            <IconButton
                {...IconBtnStyleDefault.btn}
                {...btnProps}
                _icon={{
                    ...IconBtnStyleDefault.btn._icon,
                    ...btnProps._icon,
                }}
            />
        </VStack>
    );
};

const generateIconBtnStyleDefault = (theme: ColorSchemeName): { badge: BadgeProps; btn: IIconButtonProps } => {
    const bgButtonColor = theme === 'light' ? '#fff' : '#000';
    const iconColor = theme === 'light' ? BLUE_MAIN_COLOR : '#fff';
    const buttonShadow = theme === 'light' ? '3' : '0';
    const borderButton = {
        borderWidth: theme === 'dark' ? 1 : 0,
        borderColor: theme === 'dark' ? '#ffffff30' : '',
    };
    return {
        badge: {
            padding: 0,
            paddingRight: '6px',
            paddingLeft: '6px',
            mb: -2,
            mr: -2,
            zIndex: 1,
            alignSelf: 'flex-end',
            alignItems: 'center',
            justifyContent: 'center',
            rounded: 'full',
            _text: { fontSize: 12, color: '#fff', fontFamily: 'System-Regular' },
            backgroundColor: BLUE_MAIN_COLOR,
        },
        btn: {
            _icon: {
                color: iconColor,
                size: 'md',
            },
            borderRadius: 'full',
            padding: 2,
            ...borderButton,
            shadow: buttonShadow,
            backgroundColor: bgButtonColor,
        },
    };
};
export default ButtonIconWithBadge;
