import React, { useState } from 'react';
import { FC } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import Colors from '../../style/colors';
import Appbar from '../../../components/Appbar';
import { TextInput } from 'react-native-paper';
import Snackbar from 'react-native-snackbar';
import { CommonActions } from '@react-navigation/native';
import { postMethod } from '../../../utils/helper';

interface Props { }
const ForgotPasswordScreen = ({ navigation }: any) => {
    const [email, setEmail] = useState<string>('');
    const [loading, setLoading] = useState<boolean>(false);


    const ForgotPsw = async () => {
        const raw = {
            email: email,
        }
        console.log("raw", raw)
        try {
            setLoading(true)
            const api: any = await postMethod(`auth/forget-password/send-otp`, raw);
            if (api.data.status === true) {
                setLoading(false);
                Snackbar.show({
                    text: "OTP is sent to your Email",
                    duration: Snackbar.LENGTH_SHORT,
                    textColor: 'white',
                    backgroundColor: 'green',
                });
                navigation.dispatch(
                    CommonActions.navigate({
                        name: 'OtpVerificationScreen',
                        params: {
                            email: email
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
        <View style={styles.container}>
            <Appbar />
            <View style={styles.cover}>
                <Text style={styles.psw}>Forgot Password</Text>
                <View style={{ marginTop: 30 }}>
                    <TextInput
                        label="Enter Your Email Address"
                        mode='outlined'
                        value={email}
                        onChangeText={email => setEmail(email)}
                        activeOutlineColor={Colors.brand_primary}
                        outlineColor={Colors.brand_primary}
                    />
                    <Pressable style={styles.btn} onPress={ForgotPsw}>
                        <Text style={styles.Btntext}>Submit</Text>
                    </Pressable>
                </View>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.white
    },
    cover: {
        padding: 14
    },
    btn: {
        marginTop: 50,
        alignItems: 'center',
        borderWidth: 1,
        width: 100,
        paddingHorizontal: 15,
        paddingVertical: 8,
        borderRadius: 8,
        borderColor: Colors.brand_primary,
        backgroundColor: Colors.brand_primary,
        alignSelf: 'center'
    },
    Btntext: {
        fontWeight: '600',
        fontSize: 16,
    },
    psw: {
        fontSize: 20,
        color: Colors.black,
        fontWeight: '600',
        alignSelf: 'center'
    },
    pswText: {
        fontSize: 16,
        color: Colors.black,
        alignSelf: 'center',
        marginTop: 20
    }
});

export default ForgotPasswordScreen;