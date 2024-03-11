import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Dimensions, Pressable, SafeAreaView, ScrollView, TouchableOpacity, RefreshControl, Image, } from 'react-native';
import { Svg, Path } from 'react-native-svg';
import HeaderScreen from './HeaderScreen';
import { getMethod } from '../../utils/helper';
import Colors from '../style/colors';

function Voucher({ navigation }: any) {
    const [refreshing, setRefreshing] = useState(false);

    useEffect(() => {
        getLoyalityCoins();
        getVoucherList();
    }, [])

    const [coins, setCoins] = useState(null);
    const [list, setList] = useState([]);
    const [reedem, setReedem] = useState();

    const onRefresh = () => {
        setRefreshing(true);
        getLoyalityCoins();
        getVoucherList();
        setRefreshing(false);
    };
    const getLoyalityCoins = async () => {
        try {
            const api: any = await getMethod('get-loyalty-coins');
            if (api.status === 200) {
                const data = api.data;
                setCoins(data);
            } else {
                console.log("else", api.data.message)
            }

        } catch (e) {
            console.log('Error while fetchinggg:', e);
        }
    }

    const getVoucherList = async () => {
        console.log("first");
        try {
            const api: any = await getMethod('voucher-list');
            if (api.status === 200) {
                setList(api.data.data);
            } else {
                console.log("else", api.data.message)
            }

        } catch (e) {
            console.log('Error while fetchinggg:', e);
        }
    }
    const redeemVoucher = async (id: number) => {
        try {
            const api: any = await getMethod(`voucher-redeem?voucher_id=${id}`);
            if (api.status === 200) {
                setReedem(api.data);
                console.log("Coins", api.data)
                getVoucherList()
            } else {
                console.log("else", api.data.message)
            }

        } catch (e) {
            console.log('Error while fetchinggg:', e);
        }
    }

    return (
        <View style={styles.container}>
            <SafeAreaView>

                <ScrollView
                    refreshControl={
                        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
                    }
                >
                    <HeaderScreen />
                    <View style={styles.body}>
                        <View style={styles.row}>
                            <Text style={styles.voucher}>Voucher</Text>
                        </View>
                        <View style={styles.col}>
                            <View style={{ flexDirection: 'row', gap: 5, marginTop: 15, }}>
                                <Svg
                                    width={28}
                                    height={28}
                                    viewBox="0 0 28 28"
                                    fill="none"
                                >
                                    <Path
                                        d="M1 14C1 15.7072 1.33625 17.3977 1.98957 18.9749C2.64288 20.5521 3.60045 21.9852 4.80761 23.1924C6.01477 24.3995 7.44788 25.3571 9.02512 26.0104C10.6023 26.6637 12.2928 27 14 27C15.7072 27 17.3977 26.6637 18.9749 26.0104C20.5521 25.3571 21.9852 24.3995 23.1924 23.1924C24.3995 21.9852 25.3571 20.5521 26.0104 18.9749C26.6637 17.3977 27 15.7072 27 14C27 12.2928 26.6637 10.6023 26.0104 9.02512C25.3571 7.44788 24.3995 6.01477 23.1924 4.80761C21.9852 3.60045 20.5521 2.64288 18.9749 1.98957C17.3977 1.33626 15.7072 1 14 1C12.2928 1 10.6023 1.33626 9.02512 1.98957C7.44788 2.64288 6.01477 3.60045 4.80761 4.80761C3.60045 6.01477 2.64288 7.44788 1.98957 9.02512C1.33625 10.6023 1 12.2928 1 14Z"
                                        stroke={Colors.brand_primary}
                                        strokeWidth={2}
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                    />
                                    <Path
                                        d="M18.0445 9.66672C17.7829 9.21282 17.4027 8.83862 16.9447 8.58419C16.4867 8.32975 15.9682 8.20465 15.4445 8.22228H12.5556C11.7895 8.22228 11.0547 8.52664 10.5129 9.06841C9.97111 9.61018 9.66675 10.345 9.66675 11.1112C9.66675 11.8773 9.97111 12.6121 10.5129 13.1539C11.0547 13.6957 11.7895 14.0001 12.5556 14.0001H15.4445C16.2107 14.0001 16.9455 14.3044 17.4873 14.8462C18.0291 15.388 18.3334 16.1228 18.3334 16.8889C18.3334 17.6551 18.0291 18.3899 17.4873 18.9317C16.9455 19.4735 16.2107 19.7778 15.4445 19.7778H12.5556C12.032 19.7955 11.5135 19.6704 11.0555 19.4159C10.5975 19.1615 10.2173 18.7873 9.95564 18.3334M14.0001 6.77783V21.2223"
                                        stroke={Colors.brand_primary}
                                        strokeWidth={2}
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                    />
                                </Svg>
                                {coins ? (
                                    <Text style={styles.discount}>{coins.data}</Text>
                                ) : (
                                    <Text style={styles.discount}>0</Text> // Display a loading message while data is being fetched
                                )}
                            </View>
                            <Text style={styles.text}>Total Earned Coin</Text>
                        </View>
                        <View>
                            {list.filter(item => item.status === "active").map((item) => (
                                <View key={item.id} style={styles.box} onPress={() => navigation.navigate('CouponColors.brand_primaryeem')}>
                                    <View style={{ flexDirection: 'row', }}  >
                                        <Image
                                            source={{ uri: item.image }}
                                            style={styles.image}
                                        />
                                        <Text style={styles.boxContent}>
                                            {item.description}
                                        </Text>
                                    </View>
                                    <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', }}>
                                        <View>
                                            <Text style={{ color: 'Colors.brand_primary', fontFamily: 'Poppins-Medium', lineHeight: 20, fontSize: 16 }}>Expires</Text>
                                            <Text style={{ color: 'black', fontFamily: 'Poppins-Regular', lineHeight: 20, fontSize: 16 }}>{item.expiry_date}</Text>
                                            <Text style={{ color: Colors.blue, fontFamily: 'Poppins-Regular', lineHeight: 20, fontSize: 12 }}>Terms & Condition</Text>
                                        </View>
                                        <View style={styles.rectangle} >
                                            {item.claimed === 'yes' ? (
                                                <Text style={{ color: 'white', fontSize: 14, textAlign: 'right', fontWeight: '900' }}>Already Claimed</Text>
                                            ) : (
                                                <Pressable
                                                    key={item.id}
                                                    onPress={() => redeemVoucher(item.id)}>
                                                    <Text style={{ color: 'white', fontSize: 14, textAlign: 'right', fontWeight: '900' }}>Claim</Text>
                                                </Pressable>
                                            )}
                                        </View>
                                    </View>
                                </View>
                            ))}
                        </View>
                    </View>
                </ScrollView>
            </SafeAreaView>
        </View>
    );
}

export default Voucher;

const width = Dimensions.get('window').width;
const height = Dimensions.get('window').height;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white'
    },
    image: {
        width: 50,
        height: 50,
        resizeMode: 'cover',
        marginRight: 10
    },
    body: {
        flex: 1,
        backgroundColor: '#FFFFFF',
        width: width * 0.9,
        alignSelf: 'center',
    },
    row: {
        width: width * 0.55,
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    col: {
        width: width * 0.9,
        flexDirection: 'column',
        justifyContent: 'center',
        alignContent: 'center',
        alignItems: 'center',
        marginBottom: 15,
    },
    product: {
        fontFamily: 'Poppins-SemiBold',
        fontWeight: '600',
        fontSize: 17,
    },
    voucher: {
        color: 'black',
        fontFamily: 'Poppins-SemiBold',
        fontWeight: '600',
        fontSize: 17,
        borderBottomColor: Colors.brand_primary,
        borderBottomWidth: 2,
        textAlign: 'center',
    },
    discount: {
        color: Colors.brand_primary,
        fontFamily: 'Poppins-Bold',
        fontWeight: '800',
        fontSize: 18,
    },
    text: {
        fontFamily: 'Poppins-SemiBold',
        color: '#212121',
        fontSize: 15,
        alignItems: 'center',
    },
    box: {
        width: width * 0.9,
        borderColor: 'Colors.brand_primary',
        borderWidth: 2,
        padding: 7,
        marginBottom: 30,
    },
    boxText: {
        width: width * 0.25,
        height: width * 0.15,
        color: Colors.brand_primary,
        fontFamily: 'Poppins-ExtraBold',
        fontSize: 18,
        fontWeight: '800',
    },
    boxContent: {
        width: width * 0.6,
        height: width * 0.15,
        textAlign: 'justify',
        fontSize: 13,
        color: 'black',
    },
    rectangle: {
        width: 150,
        borderRadius: 50,
        backgroundColor: Colors.brand_primary,
        padding: 10,
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'row',
        // gap: 15,
    },
});
