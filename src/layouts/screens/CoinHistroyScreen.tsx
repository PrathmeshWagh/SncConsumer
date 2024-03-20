import React, { useEffect, useState } from 'react';
import { FC } from 'react';
import { Image, Pressable, StyleSheet, Text, View } from 'react-native';
import Colors from '../style/colors';
import IonIcon from 'react-native-vector-icons/MaterialIcons';
import { getMethod } from '../../utils/helper';

const CoinHistroyScreen = ({ navigation }: any) => {
    const [coin, setCoin] = useState([]);

    const openDrawer = () => {
        navigation.openDrawer();
    };
    useEffect(() => {
        coinHistory();
    }, [])

    const coinHistory = async () => {
        try {
            const api: any = await getMethod('coins-history');
            if (api.status === 200) {
                setCoin(api.data.data);
            } else {
                console.log("else", api.data.message)
            }

        } catch (e) {
            console.log('Error while fetchinggg:', e);
        }
    }


    return (
        <View style={styles.container}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                <Pressable style={{ flexDirection: 'row', }} onPress={openDrawer}>
                    <IonIcon
                        name="menu"
                        size={24}
                        color={Colors.text_primary}
                        style={{ marginRight: 10 }}
                    />
                    <Text style={styles.headerText}>Coins Reward Page</Text>
                </Pressable>
            </View>
            <Text style={styles.history}>All History</Text>
            {coin.map((item, index) => (
                <View key={index} style={styles.textAlign}>
                    <Image source={require('../../../assets/img/Loyalty.png')} style={styles.imgBox} />
                    <View style={{ marginLeft: -50 }}>
                        <Text style={styles.Headingtext}>Coins</Text>
                        <Text style={styles.description}>{item.description}</Text>
                        <Text style={styles.description}>{item.created_at}</Text>
                    </View>
                    <View>
                        <Text style={styles.coins}>{item.points_type === 'plus' ? '+' : '-'}{item.points}</Text>
                    </View>
                </View>

            ))}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: Colors.white,
        flex: 1,
        padding: 14
    },
    imgBox: {
        width: 70,
        height: 70,
        borderRadius: 15
    },
    headerText: {
        color: Colors.text_primary,
        fontWeight: '500',
        fontSize: 20,
        marginLeft: 20
    },
    history: {
        color: Colors.text_primary,
        marginTop: 20,
        fontSize: 16,
    },
    textAlign: {
        marginTop: 30,
        flexDirection: 'row',
        justifyContent: "space-between"
    },
    Headingtext: {
        color: Colors.text_primary,
        fontWeight: '600',
        fontSize: 16,
    },
    description: {
        color: Colors.text_primary,
        width:180
    },
    date: {
        color: Colors.text_primary,
    },
    coins: {
        color: Colors.brand_primary,
        marginTop: 30
    }
});

export default CoinHistroyScreen;