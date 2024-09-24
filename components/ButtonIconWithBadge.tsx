import { BLUE_MAIN_COLOR } from '@/constants/Colors';
import { useThemeColor } from '@/hooks/useThemeColor';
import { Badge, IconButton, IIconButtonProps, VStack } from 'native-base';
import { InterfaceBadgeProps } from 'native-base/lib/typescript/components/composites/Badge/types';
import React from 'react';

type BadgeProps = InterfaceBadgeProps & {
    value?: number;
    max?: number;
    min?: number;
    show?: boolean;
};

type IconBtnProps = IIconButtonProps & {
    show?: boolean;
};
export type ButtonIconWithBadgeProps = React.ComponentProps<typeof VStack> & {
    badgeProps?: BadgeProps;
    btnProps?: IconBtnProps;
    onPress?: () => void;
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
    const IconBtnStyleDefault = generateIconBtnStyleDefault();
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
                _pressed={{
                    ...btnProps._pressed,
                    opacity: 0.8,
                }}
            />
        </VStack>
    );
};

const generateIconBtnStyleDefault = (): { badge: BadgeProps; btn: IIconButtonProps } => {
    const bgButtonColor = useThemeColor({ light: '#fff', dark: '#000' });
    const iconColor = useThemeColor({ light: BLUE_MAIN_COLOR, dark: '#fff' });
    const buttonShadow = useThemeColor({ light: '3', dark: '0' });
    const borderButton = {
        borderWidth: useThemeColor({ light: '0', dark: '1' }),
        borderColor: useThemeColor({ light: '', dark: '#ffffff30' }),
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
