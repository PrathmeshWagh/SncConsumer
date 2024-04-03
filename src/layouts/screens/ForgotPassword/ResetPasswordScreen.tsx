import React, { useState } from 'react';
import { View, Text, ScrollView, StyleSheet, Pressable, ActivityIndicator } from 'react-native';

import Snackbar from 'react-native-snackbar';
import { CommonActions } from '@react-navigation/native';
import { postMethod } from '../../../utils/helper';
import Appbar from '../../../components/Appbar';
import Colors from '../../style/colors';
import { TextInput } from 'react-native-paper';


const ResetPasswordScreen = ({ navigation, route }: any) => {
    const [newPsw, setNewPsw] = useState('');
    const [confirmPsw, setConfirmPsw] = useState('');
    const [loading, setLoading] = useState<boolean>(false);
    const { email } = route.params;

    const ResetPsw = async () => {
        const raw = {
            email: email,
            password: newPsw,
            password_confirmation: confirmPsw
        }
        console.log("raw", raw)
        try {
            setLoading(true)
            const api: any = await postMethod(`auth/forget-password/reset-password`, raw);
            if (api.data.status === true) {
                setLoading(false);
                console.log("api", api.data)
                Snackbar.show({
                    text: "Password Change Successfull!",
                    duration: Snackbar.LENGTH_SHORT,
                    textColor: 'white',
                    backgroundColor: 'green',
                });
                navigation.dispatch(
                    CommonActions.navigate({
                        name: 'LoginScreen',
                    })
                )
            } else {
                setLoading(false);
                Snackbar.show({
                    text: api.data.message,
                    duration: Snackbar.LENGTH_SHORT,
                    textColor: '#AE1717',
                    backgroundColor: '#F2A6A6',
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
                <TextInput
                    label="Enter Your New Password"
                    mode='outlined'
                    value={newPsw}
                    onChangeText={newPsw => setNewPsw(newPsw)}
                    activeOutlineColor={Colors.brand_primary}
                    outlineColor={Colors.brand_primary}
                    style={{marginBottom:40}}
                />
               
                <TextInput
                    label="Confirm Password Your Password"
                    mode='outlined'
                    value={confirmPsw}
                    onChangeText={confirmPsw => setConfirmPsw(confirmPsw)}
                    activeOutlineColor={Colors.brand_primary}
                    outlineColor={Colors.brand_primary}
                />
                <Pressable style={styles.add} onPress={ResetPsw}>
                    {
                        loading ? (
                            <ActivityIndicator size="small" color={Colors.white} />
                        )
                            :
                            (
                                <Text style={styles.addText}>Submit</Text>
                            )}
                </Pressable>
            </ScrollView>
        </View>
    );
};

export default ResetPasswordScreen;
const styles = StyleSheet.create({
    container: {
        padding: 14,
        marginTop: 30
    },
    input: {
        height: 60,
        margin: 12,
        borderWidth: 1,
        padding: 10,
        borderColor: 'white',
        backgroundColor: 'white',
        elevation: 8,
        color: Colors.text_primary
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
        width: 100,
        padding: 10,
        marginHorizontal: 14,
        borderRadius: 8,
        marginBottom: 50,
        marginTop: 20
    },
    email: {
        marginLeft: 12,
        marginTop: 30,
        marginBottom: 10,
        fontFamily: 'Roboto-Medium',
        color: Colors.text_primary,
        fontSize: 18,
    }
});