import { Linking, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React from 'react'
import HeaderScreen from './HeaderScreen'

const Policy = ({ navigation }: any) => {

    const openUrl = (url: string) => {
        Linking.openURL(url).catch((err) => console.error('Error opening URL: ' + err));
    };

    return (
        <View style={styles.container}>
            <HeaderScreen />
            <View style={styles.HeadView}>
                <Text style={styles.text}>Return Policy</Text>
                <TouchableOpacity onPress={() => openUrl('https://snc.braincave.work//return-policy')}>
                    <Text style={styles.url}>https://snc.braincave.work//return-policy</Text>
                </TouchableOpacity>
            </View>
            <View style={styles.HeadView}>
                <Text style={styles.text}>Terms and Condition</Text>
                <TouchableOpacity onPress={() => openUrl('https://snc.braincave.work/terms')}>
                    <Text style={styles.url}>https://snc.braincave.work/terms</Text>
                </TouchableOpacity>
            </View>
            <View style={styles.HeadView}>
                <Text style={styles.text}>Data Protection Policy</Text>
                <TouchableOpacity onPress={() => openUrl('https://snc.braincave.work/data-protection-policy')}>
                    <Text style={styles.url}>https://snc.braincave.work/data-protection-policy</Text>
                </TouchableOpacity>
            </View>
            <View style={styles.HeadView}>
                <Text style={styles.text}>Privacy Policy</Text>
                <TouchableOpacity onPress={() => openUrl('https://snc.braincave.work/privacy-policy')}>
                    <Text style={styles.url}>https://snc.braincave.work/privacy-policy</Text>
                </TouchableOpacity>
            </View>
        </View>
    )
}

export default Policy

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white',
    },
    HeadView: {
        justifyContent: 'center',
        alignItems: 'center',
        marginVertical: 20,
    },
    text: {
        color: 'black',
        fontSize: 22,
    },
    url: {
        fontSize: 14,
        color: 'blue',
        marginTop: 5,
    },
})