import React, { useState } from 'react';
import { View, Text, ScrollView, StyleSheet, Pressable, ActivityIndicator, KeyboardAvoidingView, Platform } from 'react-native';
import Snackbar from 'react-native-snackbar';
import { CommonActions } from '@react-navigation/native';
import Appbar from '../../../components/Appbar';
import Colors from '../../style/colors';
import { TextInput } from 'react-native-paper';
import { postMethod } from '../../../utils/helper';

const OtpVerificationScreen = ({ navigation, route }: any) => {
    const [code, setCode] = useState('');
    const [loading, setLoading] = useState<boolean>(false);
    const [load, setLoad] = useState<boolean>(false);

    const { email } = route.params;


    const ForgotPsw = async () => {
        const raw = {
            email: email,
            otp: code
        }
        console.log("raw", raw)
        try {
            setLoading(true)
            const api: any = await postMethod(`auth/forget-password/verify-otp`, raw);
            if (api.data.status === true) {
                setLoading(false);
                Snackbar.show({
                    text: api.data.message,
                    duration: Snackbar.LENGTH_SHORT,
                    textColor: 'white',
                    backgroundColor: 'green',
                });
                navigation.dispatch(
                    CommonActions.navigate({
                        name: 'ResetPasswordScreen',
                        params: {
                            email: email,
                        },
                    })
                )
            } else {
                setLoading(false);
                Snackbar.show({
                    text: api.data.message,
                    duration: Snackbar.LENGTH_SHORT,
                    textColor: 'white',
                    backgroundColor: 'red',
                });
            }
        }
        catch (e) {
            setLoading(false);
            Snackbar.show({
                text: "Some Error Occured" + e,
                duration: Snackbar.LENGTH_SHORT,
                textColor: '#AE1717',
                backgroundColor: '#F2A6A6',
            });
        }

    }


    return (
        <View style={{backgroundColor:Colors.white,flex:1}}>
            <Appbar />
            <ScrollView style={styles.container}>
                <Text style={styles.email}>Enter Verification code</Text>
                    <TextInput
                        label="Enter Your OTP"
                        mode='outlined'
                        value={code}
                        onChangeText={code => setCode(code)}
                        activeOutlineColor={Colors.brand_primary}
                        outlineColor={Colors.brand_primary}
                    />
              
                <Pressable
                    onPress={ForgotPsw}
                    style={styles.add}>
                    {
                        loading ? (
                            <ActivityIndicator size="small" color={Colors.white} />
                        )
                            :
                            (
                                <Text style={styles.addText}>Submit</Text>

                            )

                    }
                </Pressable>
            </ScrollView>
        </View>
    );
};
export default OtpVerificationScreen;
const styles = StyleSheet.create({
    container: {
        padding: 14,
        backgroundColor:Colors.white,
    },
    input: {
        height: 60,
        margin: 12,
        borderWidth: 1,
        padding: 10,
        borderColor: 'white',
        backgroundColor: 'white',
        elevation: 8
    },
    resend: {
        fontSize: 16,
        fontFamily: 'Roboto-Medium',
        textAlign: 'center',
        color: 'gray'
    },
    resendText: {
        fontSize: 16,
        fontFamily: 'Roboto-Medium',
        textAlign: 'center',
        color: 'red'
    },
    addText: {
        color: 'white',
        textAlign: 'center',
        fontFamily: 'Roboto-Medium',
    },
    add: {
        borderWidth: 1,
        borderColor: Colors.brand_primary,
        backgroundColor: Colors.brand_primary,
        alignSelf: 'center',
        height: 45,
        width: 200,
        padding: 10,
        marginHorizontal: 14,
        borderRadius: 8,
        marginBottom: 50,
        marginTop: 20
    },
    email: {
        marginLeft: 20,
        marginTop: 30,
        marginBottom: 10,
        fontFamily: 'Roboto-Medium',
        color: Colors.text_primary,
        fontSize: 18,
        textAlign: 'center'
    },
    borderStyleBase: {
        width: 30,
        height: 45
    },

    borderStyleHighLighted: {
        borderColor: "#03DAC6",
    },
    underlineStyleBase: {
        width: 30,
        height: 45,
        borderWidth: 0,
        borderBottomWidth: 1,
        color: Colors.text_primary,
        borderBottomColor: Colors.text_secondary
    },

    underlineStyleHighLighted: {
        borderColor: Colors.text_primary,
    },
});