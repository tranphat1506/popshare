import React, { useState, useRef, useEffect } from 'react';
import {
    View,
    TextInput,
    StyleSheet,
    TextInputKeyPressEventData,
    NativeSyntheticEvent,
    TouchableOpacity,
} from 'react-native';
import { BLUE_ICON_COLOR, BLUE_MAIN_COLOR } from '@/constants/Colors';
import { ThemedText } from '@/components/ThemedText';

interface AuthOTPProps {
    isInvalid?: boolean;
    handleResendOtp: () => void;
    handleVerifyOtp: (otp: string) => void;
}
const OTP_EXPIRED_TIME = 3 * 60;
const AuthOTPInput: React.FC<AuthOTPProps> = ({ handleResendOtp, handleVerifyOtp, isInvalid }) => {
    const [otp, setOtp] = useState<string[]>(['', '', '', '', '', '']);
    const inputs = useRef<Array<TextInput | null>>([]);
    const [resendTime, setResendTime] = useState<number>(0);
    useEffect(() => {
        let idTimeout: NodeJS.Timeout;
        if (resendTime > 0) {
            idTimeout = setTimeout(() => {
                setResendTime((time) => {
                    if (time === 0) {
                        clearTimeout(idTimeout);
                        return 0;
                    }
                    return time - 1;
                });
            }, 1000);
        }

        return () => {
            clearTimeout(idTimeout);
        };
    }, [resendTime]);
    const handleChange = (text: string, index: number) => {
        if (/^[0-9]$/.test(text[text.length - 1])) {
            let newOtp = [...otp];
            if (!otp[index] || index < otp.length) {
                newOtp[index] = text[text.length - 1];
                setOtp(newOtp);
            }
            // Move to next input if not the last one
            if (index < 5) {
                inputs.current[index + 1]?.focus();
            }

            // If all 6 digits are entered, trigger fetch
            if (newOtp.every((digit) => digit !== '')) {
                handleFetch(newOtp.join(''));
                setOtp(['', '', '', '', '', '']);
                inputs.current[0]?.focus();
            }
        } else if (text === '') {
            let newOtp = [...otp];
            newOtp[index] = text;
            setOtp(newOtp);
            // Move to next input if not the last one
            if (index > 0) {
                inputs.current[index - 1]?.focus();
            }
        }
    };

    const handleKeyPress = (e: NativeSyntheticEvent<TextInputKeyPressEventData>, index: number) => {
        if (e.nativeEvent.key === 'Backspace' && index > 0 && otp[index] === '') {
            inputs.current[index - 1]?.focus();
        }
    };

    const handleFetch = (otpCode: string) => {
        console.log('OTP entered:', otpCode);
        handleVerifyOtp(otpCode);
        // Logic to handle OTP submission
    };

    return (
        <View>
            <View style={styles.container}>
                {otp.map((digit, index) => (
                    <TextInput
                        className={`border-slate-500 dark:border-white`}
                        key={index}
                        ref={(el) => (inputs.current[index] = el)}
                        style={[styles.input, { borderColor: isInvalid ? '#ef4444' : '' }]}
                        keyboardType="numeric"
                        maxLength={2}
                        value={digit}
                        onKeyPress={(e) => handleKeyPress(e, index)}
                        onChangeText={(text) => handleChange(text, index)}
                        autoFocus={index === 0}
                    />
                ))}
            </View>
            <View style={{ alignItems: 'flex-end', flexDirection: 'row', columnGap: 5, justifyContent: 'flex-end' }}>
                <ThemedText lightColor="#00000095" darkColor="#ffffff98" style={{ fontSize: 16, lineHeight: 20 }}>
                    Not recived OTP?
                </ThemedText>
                <TouchableOpacity
                    onPress={() => {
                        if (resendTime === 0) {
                            setResendTime(OTP_EXPIRED_TIME);
                            handleResendOtp();
                        }
                    }}
                >
                    <ThemedText style={{ fontSize: 16, lineHeight: 20, color: BLUE_ICON_COLOR }}>
                        {resendTime === 0 ? 'Resend' : resendTime + 's'}
                    </ThemedText>
                </TouchableOpacity>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        padding: 10,
        columnGap: 15,
        paddingVertical: 16,
    },
    input: {
        width: 45,
        height: 55,
        borderWidth: 1,
        borderRadius: 10,
        textAlign: 'center',
        fontSize: 27,
        fontFamily: 'System-Bold',
        color: BLUE_MAIN_COLOR,
    },
});

export default AuthOTPInput;
