import React from 'react';
import { View, ViewProps } from 'react-native';
import { ThemedText } from '../ThemedText';
import { Link } from '@react-navigation/native';
import { To } from '@react-navigation/native/lib/typescript/src/useLinkTo';
import { RootStackParamList } from '@/configs/routes.config';
import { Skeleton } from 'native-base';
const PADDING_DISPLAY_SCREEN = 15;
interface SectionContainerProps {
    loadingSkeleton?: boolean;
    sectionTitle?: string;
    showTitle?: boolean;
    linkProps?: {
        to: To<RootStackParamList>;
        title: string;
    };
}
const SectionContainer: React.FC<SectionContainerProps & ViewProps> = ({ showTitle = true, ...props }) => {
    if (props.loadingSkeleton)
        return (
            <View
                className={props.className}
                style={[
                    props.style,
                    {
                        marginHorizontal: PADDING_DISPLAY_SCREEN,
                        paddingBottom: 20,
                    },
                ]}
            >
                <View
                    style={{
                        paddingTop: 5,
                        paddingBottom: 5,
                        display: 'flex',
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                    }}
                >
                    <Skeleton size={'28px'} w={100} rounded={'md'} />
                </View>
            </View>
        );
    return (
        <View
            className={props.className}
            style={[
                props.style,
                {
                    marginHorizontal: PADDING_DISPLAY_SCREEN,
                    paddingBottom: 20,
                },
            ]}
        >
            {showTitle && (
                <View
                    style={{
                        paddingTop: 5,
                        paddingBottom: 5,
                        display: 'flex',
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                    }}
                >
                    <ThemedText
                        type="title"
                        style={{
                            fontFamily: 'System-Bold',
                            fontSize: 26,
                            lineHeight: 28,
                            textTransform: 'capitalize',
                        }}
                    >
                        {props.sectionTitle}
                    </ThemedText>
                    {props.linkProps && (
                        <Link to={props.linkProps.to}>
                            <ThemedText
                                type="default"
                                style={{
                                    fontFamily: 'System-Regular',
                                    fontSize: 13,
                                }}
                                lightColor="#6e6e6e"
                            >
                                {props.linkProps.title}
                            </ThemedText>
                        </Link>
                    )}
                </View>
            )}
            {props.children}
        </View>
    );
};

export default SectionContainer;
