import React, { useState, useRef } from 'react';
import {
    View,
    TextInput,
    StyleSheet,
    TextInputKeyPressEventData,
    NativeSyntheticEvent,
    TouchableOpacity,
} from 'react-native';
import { ThemedText } from '../ThemedText';
import { BLUE_ICON_COLOR } from '@/constants/Colors';

const OTPInput: React.FC = () => {
    const [otp, setOtp] = useState<string[]>(['', '', '', '', '', '']);
    const inputs = useRef<Array<TextInput | null>>([]);

    const handleChange = (text: string, index: number) => {
        if (/^[0-9]$/.test(text[text.length - 1])) {
            let newOtp = [...otp];
            newOtp[index] = text[text.length - 1];
            setOtp(newOtp);

            // Move to next input if not the last one
            if (index < 5) {
                inputs.current[index + 1]?.focus();
            }

            // If all 6 digits are entered, trigger fetch
            if (newOtp.every((digit) => digit !== '')) {
                handleFetch(newOtp.join(''));
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
        if (e.nativeEvent.key === 'Backspace' && index > 0) {
            inputs.current[index - 1]?.focus();
        }
    };

    const handleFetch = (otpCode: string) => {
        console.log('OTP entered:', otpCode);
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
                        style={styles.input}
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
                <TouchableOpacity>
                    <ThemedText style={{ fontSize: 16, lineHeight: 20, color: BLUE_ICON_COLOR }}>Resend</ThemedText>
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
        color: BLUE_ICON_COLOR,
    },
});

export default OTPInput;
