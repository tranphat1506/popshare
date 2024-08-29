import DefaultLayout from '@/components/layout/DefaultLayout';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

const Test = () => {
    return (
        <DefaultLayout style={{ backgroundColor: '#537479', justifyContent: 'center' }}>
            <Text style={{ color: '#fff', fontFamily: 'System-Regular', fontSize: 30, textAlign: 'center' }}>
                Sản Phẩm #537479
            </Text>
            <Text style={{ color: '#000', fontFamily: 'System-Regular', fontSize: 30, textAlign: 'center' }}>
                Sản Phẩm #537479
            </Text>
        </DefaultLayout>
    );
};

export default Test;
