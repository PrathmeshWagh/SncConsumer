import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Dimensions, Pressable, SafeAreaView, ScrollView, TouchableOpacity, RefreshControl, Image, } from 'react-native';
import { Svg, Path } from 'react-native-svg';
import HeaderScreen from './HeaderScreen';
import { getMethod } from '../../utils/helper';
import Colors from '../style/colors';


const CouponScreen = (): JSX.Element => {
    const [refreshing, setRefreshing] = useState(false);

    useEffect(() => {
        getCouponList();
    }, [])

    const [coupon, setCoupon] = useState([]);

    const onRefresh = () => {
        setRefreshing(true);
      
        getCouponList();
        setRefreshing(false);
    };
    
    const getCouponList = async () => {
        console.log("first");
        try {
            const api: any = await getMethod('all-coupons');
            if (api.status === 200) {
                setCoupon(api.data.data);
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
                            <Text style={styles.voucher}>Coupon</Text>
                        </View>

                        {coupon.map((item, index) => (
                            <View key={index} style={styles.container}>
                                <View style={styles.boxContent}>
                                    <Text>S&C Furniture</Text>
                                </View>
                                <Text style={styles.discount}>{item.discount_type === 'percent' ? `${item.discount}% OFF` : `$${item.discount} OFF`}</Text>
                                <View>
                                    <Text style={styles.terms}>{item.description}</Text>
                                    <Text style={styles.code}> Code: {item.code}</Text>
                                </View>
                            </View>
                        ))}
                    </View>
                </ScrollView>
            </SafeAreaView>
        </View>
    );
}

export default CouponScreen;
const width = Dimensions.get('window').width;
const height = Dimensions.get('window').height;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white',
        marginTop: 20,
        borderColor: Colors.black,
        borderWidth: 1,
        padding: 14,
        borderRadius: 8
    },
    terms: {

    },
    store: {
        marginLeft: 20,
        borderBottomWidth: 1
    },
    code: {
        alignSelf: 'flex-end',
        marginTop: 20
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
        borderBottomWidth: 1,
        paddingBottom: 20
    },
    text: {
        fontFamily: 'Poppins-SemiBold',
        color: '#212121',
        fontSize: 15,
        alignItems: 'center',
    },

    boxContent: {
        fontSize: 13,
        flexDirection: 'row'
    },

});
