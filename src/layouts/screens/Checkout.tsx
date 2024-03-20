import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, Dimensions, Image, TouchableOpacity, TextInput, SafeAreaView, ScrollView, RefreshControl, ActivityIndicator } from 'react-native';
import IonIcon from 'react-native-vector-icons/Ionicons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { Portal, RadioButton, Modal } from 'react-native-paper';
import CalendarPicker from 'react-native-calendar-picker';
import { getMethod, postMethod } from '../../utils/helper';
import moment from 'moment';
import Snackbar from 'react-native-snackbar';
import Appbar from '../../components/Appbar';
import { useFocusEffect } from '@react-navigation/native';
import Colors from '../style/colors';
import { Pressable } from 'react-native';


const Checkout = ({ navigation, route }: any) => {
  const { deliveryValue } = route.params;
  const [paymentMethod, setPaymentMethod] = useState('');
  const [details, setDetails] = useState([]);
  const [deliveryAddress, setDeliveryAddress] = useState({});
  const [subtotal, setSubtotal] = useState(0);
  const [deliveryAmt, setDeliveryAmt] = useState(0);
  const [deliveryFeeIcon, setDeliveryFeeIcon] = useState('-');
  const [availableDates, setAvailableDates] = useState([]);
  const [deliveryDate, setDeliverydate] = useState();
  const [remark, setRemark] = useState('');
  const [newRemark, setNewRemark] = useState('');
  const [refreshing, setRefreshing] = useState(false);
  const [payMethod, setPayMethod] = useState('cash_on_delivery');
  const [selectedDate, setSelectedDate] = useState(null);
  const [add, setAdd] = useState();
  const [newPaymentMethod, setNewPaymentMethod] = useState('');
  const [loadingDeliveryChange, setLoadingDeliveryChange] = useState(false);
  const [loadingGetDetails, setLoadingGetDetails] = useState(false);
  const [isSelfCollection, setIsSelfCollection] = useState(false);
  const [deliveryType, setDeliveryType] = useState('');
  const [coupon, setCoupon] = useState('');
  const [amountDetails, setAmountDetails] = useState();
  const [couponCode, setCouponCode] = useState('');
  const [couponDiscount, setCouponDiscount] = useState(0);
  const [visible, setVisible] = useState(false);
  const [vouchar, setVouchar] = useState([]);
  const [reedemVouchar, setReedemVouchar] = useState();

  const showModal = () => setVisible(true);
  const hideModal = () => setVisible(false);


  useFocusEffect(
    useCallback(() => {
      handleDelivery();
      availableDeliveryDates();
      claimedVouchar();
    }, [])
  );

  const onRefresh = async () => {
    setRefreshing(true);
    handleDelivery();
    getDetails();
    availableDeliveryDates();
    setRefreshing(false);
  };
  const handlePaymentMethodChange = (value: any) => {
    setPaymentMethod(value);
    setNewPaymentMethod(value);
  };

  const handleDelivery = async () => {

    setLoadingDeliveryChange(true);

    try {
      const api: any = await getMethod(`checkout/get-selected-cart-delivery-address`);
      if (api.status === 200) {
        setDeliveryAddress(api.data.data);
        setDeliveryType(api.data.delivery_type)
        setAdd(api.data.data.id);
        await getDetails();
      } else {
        console.log('API Error:', api.data.message);
      }
    } catch (e) {
      console.log('Error while fetching:', e);
    } finally {
      setLoadingDeliveryChange(false);
    }
  };


  const getDetails = async () => {
    setLoadingGetDetails(true); // Set loading state to true
    try {
      const api: any = await getMethod(`checkout/cart-details?coupon_code=${couponCode}&coupon_discount=${couponDiscount}`);
      if (api.status === 200) {
        console.log("tax", api.data.tax, api.data.tax_amt);
        setDetails(api.data.data);
        setAmountDetails(api.data);
        setSubtotal(api.data.subtotal);
        setDeliveryAmt(api.data.delivery_amt);
        setDeliveryFeeIcon(api.data.delivery_fee_icon);
        setDeliverydate(api.data.old_data.delivery_date);
        setRemark(api.data.old_data.remark);
        setPaymentMethod(api.data.old_payment_type);
      } else {
        console.log('API Error:', api.data.message);
      }
    } catch (e) {
      console.log('Error while fetching:', e);
    } finally {
      setLoadingGetDetails(false); // Reset loading state
    }
  };


  const availableDeliveryDates = async () => {
    try {
      const api: any = await getMethod('checkout/get-available-delivery-dates');
      if (api.status === 200) {
        const availableDateStrings = api.data.available_dates;
        setAvailableDates(availableDateStrings);
      } else {
        console.log('API Error:', api.data.message);
      }
    } catch (e) {
      console.log('Error while fetching:', e);
    }
  };

  const isDateDisabled = (date: moment.MomentInput) => {
    return availableDates ? !availableDates.includes(moment(date).format('DD-MM-YYYY')) : false;
  };

  5
  const handlePayMethodChange = (value: any) => {
    console.log('Selected payment method:', value); // Add this line to log the selected value
    setPayMethod(value);
  };

  const placeOrder = async () => {
    try {
      const data = {
        delivery_type: deliveryValue,
        address_id: add,
        remark: remark,
        payment_type: payMethod,
        delivery_date: selectedDate,
        coupon_code: couponCode,
        voucher_id: reedemVouchar
      };
      console.log("place-order", data);
      const api: any = await postMethod('place-order', data);
      if (api.data.status === true) {
        // console.log("place-orderDATA---", api.data);
        Snackbar.show({
          text: api.data.message,
          duration: Snackbar.LENGTH_SHORT,
          textColor: 'white',
          backgroundColor: 'green',
        });
        navigation.navigate("TabNavigator");
      } else {
        console.log('else', api.data);
        Snackbar.show({
          text: api.data.message,
          duration: Snackbar.LENGTH_SHORT,
          textColor: 'white',
          backgroundColor: 'red',
        });
      }
    } catch (error: any) {
      console.log('catch', error);
    }
  };

  const couponApply = async () => {
    try {
      const api: any = await getMethod(`checkout/apply-coupon?coupon_code=${coupon}`);
      if (api.status === 200) {
        setCouponCode(api.data.coupon_code)
        setCouponDiscount(api.data.discount)
        await getDetails();
      } else {
        console.log('API Error:', api.data.message);
      }
    } catch (e) {
      console.log('Error while fetching:', e);
    } finally {
      // setLoadingDeliveryChange(false);
      console.log('Error while fetching:');
    }
  };

  const claimedVouchar = async () => {
    try {
      const api: any = await getMethod(`claimed-vouchers`);
      if (api.status === 200) {
        setVouchar(api.data.data);
        console.log('API data:', api.data.data);
      } else {
        console.log('API Error:', api.data.message);
      }
    } catch (e) {
      console.log('Error while fetching:', e);
    } finally {
      // setLoadingDeliveryChange(false);
      console.log('Error while fetching:');
    }
  };
  const reddemVouchar = async (voucherId:any) => {
    try {
      const api: any = await getMethod(`checkout/apply-vouchers?voucher_id=${voucherId}`);
      if (api.status === 200) {
        setReedemVouchar(api.data.voucher_id);
        hideModal();
        if (api.data.voucher_type === 'discount') {
          // If voucher type is discount, pass voucher_discount and voucher_id to getDetailsWithVoucher
          await getDetailsWithVoucher(api.data.voucher_id, api.data.voucher_discount, api.data.voucher_type);
        } else if (api.data.voucher_type === 'loyalty_points') {
          // If voucher type is loyalty_points, pass voucher_id and loyalty_coins to getDetailsWithVoucher
          await getDetailsWithVoucher(api.data.voucher_id, api.data.loyalty_coins, api.data.voucher_type);
        }
        Snackbar.show({
          text: api.data.message,
          duration: Snackbar.LENGTH_SHORT,
          textColor: 'white',
          backgroundColor: 'green',
        });
      } else {
        console.log('API Error:', api.data.message);
      }
    } catch (e) {
      console.log('Error while fetching:', e);
    } finally {
      console.log('Error while fetching:');
    }
  };
  
  const getDetailsWithVoucher = async (voucherId: any, voucherDiscount: any, voucherType: string,) => {
    setLoadingGetDetails(true);
    try {
      let apiEndpoint = 'checkout/cart-details';
      let queryParams = '';
      if (voucherType === 'discount') {
        // If the voucher type is discount, add voucher_discount and voucher_id to the query parameters
        queryParams = `?voucher_id=${voucherId}&voucher_discount=${voucherDiscount}`;
      } else if (voucherType === 'loyalty_points') {
        // If the voucher type is loyalty points, add voucher_id and voucher_loyalty_coins to the query parameters
        queryParams = `?voucher_id=${voucherId}&voucher_loyalty_coins=${voucherDiscount}`;
      }
      console.log("apiEndpoint+queryParams",apiEndpoint + queryParams)
      const api: any = await getMethod(apiEndpoint + queryParams);
      if (api.status === 200) {
        console.log("tax", api.data.tax, api.data.tax_amt);
        setDetails(api.data.data);
        setAmountDetails(api.data);
        setSubtotal(api.data.subtotal);
        setDeliveryAmt(api.data.delivery_amt);
        setDeliveryFeeIcon(api.data.delivery_fee_icon);
        setDeliverydate(api.data.old_data.delivery_date);
        setRemark(api.data.old_data.remark);
        setPaymentMethod(api.data.old_payment_type);
      } else {
        console.log('API Error:', api.data.message);
      }
    } catch (e) {
      console.log('Error while fetching:', e);
    } finally {
      setLoadingGetDetails(false); // Reset loading state
    }
  };
  
  return (
    <>
      <SafeAreaView>
        <ScrollView refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}>
          <Appbar />
          <View style={styles.body}>
            <View style={styles.searchContianer}>
              <Text style={styles.home}>Checkout</Text>
            </View>
            <View style={{ marginLeft: 15, marginTop: -20 }}>
              <Text style={{ color: 'black', fontSize: 25, fontFamily: 'Poppins-SemiBold' }} onPress={getDetails}>
                Order Shipment
              </Text>
            </View>
            {deliveryAddress ? (
              <View style={styles.detailedContainer}>
                {loadingDeliveryChange ? (
                  <ActivityIndicator size="small" color={Colors.brand_primary} />
                ) : (
                  <View>
                    <View style={styles.nameNo}>
                      <View style={{ width: width * 0.5, flexDirection: 'row' }}>
                        <Text style={styles.name}>{deliveryAddress.name}</Text>
                        <IonIcon name="call" size={width * 0.04} color={Colors.brand_primary} style={styles.phone} />
                        <Text style={styles.phoneNo}>+ {deliveryAddress.phone}</Text>
                      </View>

                    </View>
                    <View>
                      <View style={styles.mailDiv}>
                        <MaterialCommunityIcons name="email-outline" size={width * 0.04} color={Colors.brand_primary} style={{ marginRight: 10 }} />
                        <Text style={styles.email}>{deliveryAddress.email}</Text>
                      </View>
                      <View style={styles.addressDiv}>
                        <Ionicons name="location" size={width * 0.04} color={Colors.brand_primary} style={{ marginRight: 10 }} />
                        <Text style={styles.address}>{deliveryAddress.address}</Text>
                      </View>
                    </View>
                  </View>
                )}
              </View>
            ) : null}
            <View style={styles.align}>
              <TextInput
                style={styles.input}
                onChangeText={setCoupon}
                value={coupon}
                placeholder="Apply Coupon"
              />
              <Pressable onPress={couponApply}>
                <Text style={styles.applyText}>Apply</Text>
              </Pressable>
            </View>
            <Pressable style={styles.vouchar} onPress={showModal}>
              <Text style={styles.voucharText}>Vouchar</Text>
            </Pressable>
            <View style={styles.detailedContainer}>
              {loadingGetDetails ? (
                <ActivityIndicator size="small" color={Colors.brand_primary} />
              ) : (
                <View>
                  <Text style={styles.column}>
                    Your Order
                  </Text>
                  {details.map((item, index) => (

                    <View style={styles.content} key={index}>
                      <Image
                        //  source={require('../../../assets/img/Rectangle18.png')} 
                        source={{ uri: item.product_image }}
                        style={styles.arrow1} />
                      <Text style={styles.column_text}>{item.product_name}</Text>
                      <Text style={styles.price_1}>X{item.quantity} Qty</Text>
                      <Text style={styles.price_0}>${item.total}</Text>
                    </View>
                  ))}
                  {/* <View style={styles.shippingView}>
                    <Text style={styles.column_text_0}>Shipping Charges</Text>
                    <Text style={styles.column_text_0}>{deliveryFeeIcon} ${deliveryAmt}</Text>
                  </View> */}
                  <View style={styles.shippingView}>
                    <Text style={styles.column_text_0}>Subtotal </Text>
                    <Text style={styles.column_text_0}>{subtotal}</Text>
                  </View>
                  {amountDetails && amountDetails.coupon_discount !== 0 && (
                    <View style={styles.shippingView}>
                      <Text style={styles.column_text_0}>Coupon Discount</Text>
                      <Text style={styles.column_text_0}>{amountDetails.coupon_discount}</Text>
                    </View>
                  )}
                  {amountDetails && amountDetails.voucher_discount !== 0 && (
                    <View style={styles.shippingView}>
                      <Text style={styles.column_text_0}>Voucher Discount</Text>
                      <Text style={styles.column_text_0}>{amountDetails?.voucher_discount}</Text>
                    </View>
                  )}
                   {amountDetails && amountDetails.voucher_loyalty_coins !== 0 && (
                    <View style={styles.shippingView}>
                      <Text style={styles.column_text_0}>You will earn$</Text>
                      <Text style={styles.column_text_0}>{amountDetails?.voucher_loyalty_coins}</Text>
                    </View>
                  )}
                  <View style={styles.shippingView}>
                    <Text style={styles.column_text_0}>Tax</Text>
                    <Text style={styles.column_text_0}>{amountDetails?.tax_amt} ({amountDetails?.tax}%)</Text>
                  </View>
                  <View style={styles.shippingView}>
                    <Text style={styles.column_text_0}>Total</Text>
                    <Text style={styles.column_text_0}>{amountDetails?.total}</Text>
                  </View>
                  {amountDetails && amountDetails.total_loyalty_coins !== 0 && (
                    <View style={styles.totalView}>
                      <Text style={styles.column_text_0}>Total Loyalty Coins </Text>
                      <Text style={styles.column_text_0}>{amountDetails?.total_loyalty_coins}</Text>
                    </View>
                  )}
                </View>
              )}
            </View>

            {deliveryDate ? (
              <View style={{ width: width * 0.9, alignSelf: 'center', }}>
                <Text style={styles.dateContent_1}>Your Delivery Date</Text>
                <View style={styles.totalView}>
                  <Text style={styles.column_text_0}>Date</Text>
                  <Text style={styles.column_text_0}>{deliveryDate}</Text>
                </View>
                <View style={styles.totalView2}>
                  <Text style={styles.column_text_0}>Remark</Text>
                  <View style={{ backgroundColor: 'lightgrey', padding: 15, borderRadius: 8, marginVertical: 10, }}>
                    <Text style={{ color: 'black' }}>{remark}</Text>
                  </View>
                </View>
                <View style={styles.totalView2}>
                  <View><Text style={styles.dateContent_1}>Payment Type</Text></View>
                  <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 20, }}>
                    <Text style={{ color: 'black', }}>Cash on Delivery</Text>
                    <RadioButton.Android
                      value="cash_on_delivery"
                      color="red"
                      uncheckedColor="red"
                      status={paymentMethod === "cash_on_delivery" ? 'checked' : 'unchecked'} // Set the status based on the payment method
                      onPress={() => handlePayMethodChange("cash_on_delivery")} // Handle the change
                    />
                  </View>
                </View>
              </View>
            ) : (
              <Text> </Text>
            )}
            {deliveryDate ? null : (
              <View>
                <View style={{ width: width * 0.99, alignSelf: 'center', }}>
                  <Text style={styles.dateContent_0}>Choose Delivery Date</Text>
                  <View style={{ width: width * 0.99, alignSelf: 'center' }}>
                    <View>
                      {deliveryValue === 'self_collection' ? (
                        // Render CalendarPicker with all dates enabled
                        <CalendarPicker
                          onDateChange={(date) => {
                            const formattedDate: any = moment(date).format('YYYY-MM-DD');
                            setSelectedDate(formattedDate);
                            console.log('Selected Date:', formattedDate);
                          }}
                        />
                      ) : (
                        // Render CalendarPicker with dates obtained from availableDeliveryDates
                        <CalendarPicker
                          disabledDates={isDateDisabled}
                          onDateChange={(date) => {
                            const formattedDate: any = moment(date).format('YYYY-MM-DD');
                            setSelectedDate(formattedDate);
                            console.log('Selected Date:', formattedDate);
                          }}
                        />
                      )}
                    </View>
                  </View>
                </View>
                <View style={{ alignSelf: 'center' }}>
                  <Text style={styles.dateContent}>Remarks</Text>
                  {/* <TextInput style={styles.comments} value={""} /> */}
                  <TextInput
                    style={styles.comments}
                    value={newRemark}
                    onChangeText={(text) => setNewRemark(text)}
                  />
                </View>
                <View style={{ flexDirection: 'row', marginLeft: 5 }}>
                  <RadioButton.Group
                    // onValueChange={handlePaymentMethodChange}
                    // value={paymentMethod}
                    onValueChange={(value) => {
                      handlePaymentMethodChange(value); // Update the payment method state
                      console.log('Selected payment method:', value); // Log the selected value
                    }}
                    value={paymentMethod}
                  >
                    <View style={{ flexDirection: 'row', marginLeft: 5, alignItems: 'center' }}>
                      <RadioButton.Android value="cash_on_delivery" color={Colors.brand_primary}
                        uncheckedColor={Colors.brand_primary} />
                      <Text style={{ color: 'black', fontFamily: 'Poppins-SemiBold' }}>Cash On Delivery</Text>
                    </View >
                    <View style={{ flexDirection: 'row', marginLeft: 5, alignItems: 'center' }}>
                      <RadioButton.Android value="hitpay" color={Colors.brand_primary}
                        uncheckedColor={Colors.brand_primary} />
                      <Text style={{ color: 'black', fontFamily: 'Poppins-SemiBold' }}>Paynow</Text>
                    </View>
                  </RadioButton.Group>
                </View>
              </View>
            )}
            <View style={styles.cart_container}>
              <View style={styles.cart_content}>
                <Text style={styles.textContent}>Back </Text>
              </View>
              <View style={styles.cart_content_0}>
                <TouchableOpacity onPress={placeOrder}>
                  <Text style={styles.textContent_0}>Place Order</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </ScrollView >
        <Portal>
          <Modal visible={visible} onDismiss={hideModal} contentContainerStyle={styles.modalContainer}>
            <Text style={styles.voucharDetails}>Vouchar Details</Text>
            <ScrollView>
              {vouchar.map((voucher, index) => (
                <View key={index} style={styles.voucherContainer}>
                  <Image
                    style={styles.tinyLogo}
                    source={{ uri: voucher.image }}
                  />
                  <View style={styles.voucherDetails}>
                    <Text style={styles.voucherDetailText}>Voucher Details: {voucher.voucher_name}</Text>
                    <Text style={styles.voucherDetailText}>Expires on: {voucher.expiry_date}</Text>
                  </View>
                  <View style={styles.buttonContainer}>
                    <Pressable style={styles.removeButton}>
                      <Text style={styles.buttonText}>Remove</Text>
                    </Pressable>
                    <Pressable
                      style={styles.applyButton}
                      onPress={() => reddemVouchar(voucher.id)}>
                      <Text style={styles.buttonText}>Apply</Text>
                    </Pressable>
                  </View>
                </View>
              ))}
            </ScrollView>
          </Modal>
        </Portal>
      </SafeAreaView >
    </>

  );
};

export default Checkout;

const width = Dimensions.get('window').width;
const height = Dimensions.get('window').height;

const styles = StyleSheet.create({
  detailedContainer: {
    width: width * 0.9,
    backgroundColor: '#E3E3E3',
    borderRadius: 10,
    marginBottom: width * 0.05,
    alignSelf: 'center',
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  voucherDetailText: {
    color: Colors.text_primary
  },
  voucherDetails: {
    marginVertical: 10
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginVertical: 15
  },
  buttonText: {
    fontWeight: '500',
    fontSize: 16,
    color: Colors.white
  },
  removeButton: {
    borderWidth: 1,
    borderColor: Colors.brand_primary,
    borderRadius: 8,
    padding: 8,
    paddingHorizontal: 15,
    backgroundColor: Colors.brand_primary,
    width: 120,
    alignItems: 'center'
  },
  applyButton: {
    borderWidth: 1,
    borderColor: 'green',
    borderRadius: 8,
    padding: 8,
    paddingHorizontal: 15,
    backgroundColor: 'green',
    width: 150,
    alignItems: 'center'
  },
  applyButtonText: {

  },
  alignVouchar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 10
  },
  modalContainer: {
    backgroundColor: 'white',
    padding: 20,
    margin: 20,
    borderRadius: 10,
  },
  tinyLogo: {
    width: 150,
    height: 80
  },
  vouchar: {
    padding: 10,
    borderWidth: 1,
    borderColor: Colors.brand_primary,
    backgroundColor: Colors.brand_primary,
    width: 150,
    marginLeft: 20,
    alignItems: 'center',
    marginBottom: 20,
    borderRadius: 8
  },
  voucharText: {
    color: Colors.text_primary,
    fontWeight: '500',
    fontSize: 16
  },
  voucharDetailText: {
    color: Colors.text_primary,
    fontSize: 12,
    marginLeft: -140
  },

  voucharDetails: {
    color: Colors.text_primary,
    fontWeight: '500',
    fontSize: 16,
  },
  align: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  applyText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.brand_primary,
    paddingHorizontal: 20
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#E3E3E3',
    backgroundColor: '#E3E3E3',
    padding: 10,
    marginLeft: 20,
    marginVertical: 20,
    borderRadius: 8
  },
  nameNo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  name: {
    color: Colors.brand_primary,
    fontSize: 14,
    fontFamily: 'Poppins-SemiBold',
    borderRightWidth: 1,
    paddingRight: 15,
  },
  phoneNo: {
    color: 'black',
    fontSize: 14,
  },
  mailDiv: {
    flexDirection: 'row',
  },
  addressDiv: {
    flexDirection: 'row',
  },
  email: {
    color: 'black',
    fontFamily: 'Poppins-SemiBold',

  },
  address: {
    color: '#515151',
    fontFamily: 'Poppins-Regular',
  },
  body: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
    zIndex: -5,
    color: 'black',
  },
  columnH: {
    color: 'red',
    fontSize: width * 0.05,
    fontFamily: 'Poppins_ExtraBold',
  },
  home: {
    color: '#515151',
    fontSize: width * 0.05,
    fontFamily: 'Poppins_ExtraBold',
  },
  main: {
    zIndex: -2,
    position: 'relative',
    paddingLeft: width * 0.03,
    marginBottom: width * 0.01,
  },
  searchContianer: {
    width: '100%',
    height: width * 0.12,
    backgroundColor: '#E3E3E3',
    fontSize: width * 0.05,
    fontFamily: 'Poppins_Bold',
    flexDirection: 'row',
    color: '#515151',
    alignItems: 'center',
    paddingLeft: 8,

    marginBottom: width * 0.1,
    zIndex: -2,
    position: 'relative',
  },
  phone: {
    fontSize: width * 0.04,
    marginLeft: width * 0.03,
    marginRight: width * 0.02,
  },
  title_2: {
    width: width * 0.4,
    height: width * 0.05,
    fontFamily: 'Poppins-Medium',
    fontSize: width * 0.02,
    marginTop: width * 0.02,
    color: 'black',

  },
  container_0: {
    width: width * 0.9,
    // height: width * 0.55,
    backgroundColor: '#E3E3E3',
    borderRadius: 10,
    // alignItems: 'center',
    alignSelf: 'center',
    zIndex: -2,
    position: 'relative',
    marginBottom: width * 0.05,
  },
  column: {
    width: width * 0.8,
    borderBottomWidth: 2,
    borderBottomColor: '#BBBBBB',
    fontSize: width * 0.03,
    paddingBottom: width * 0.02,
    // paddingLeft: width * 0.04,
    color: 'black'
  },
  content: {
    flexDirection: 'row',
    borderBottomWidth: 2,
    borderBottomColor: '#BBBBBB',
    // marginBottom: width * 0.1,
    alignItems: 'center',
    paddingVertical: width * 0.03,
    justifyContent: 'space-between',
  },
  arrow1: {
    width: width * 0.14,
    height: width * 0.14,
    borderRadius: 5,
    justifyContent: 'center',


  },
  column_text: {
    width: width * 0.3,
    fontFamily: 'Poppins-SemiBold',
    fontSize: 14,
    color: 'black',

  },
  shippingView: {
    flexDirection: 'row',
    borderBottomWidth: 2,
    borderBottomColor: '#BBBBBB',
    textAlign: 'center',
    paddingVertical: width * 0.03,
    justifyContent: 'space-between',
  },
  totalView: {
    flexDirection: 'row',
    textAlign: 'center',
    paddingVertical: width * 0.03,
    justifyContent: 'space-between',
  },
  totalView2: {
    // flexDirection: 'row',
    textAlign: 'center',
    // paddingVertical: width * 0.03,
    justifyContent: 'space-between',
  },
  column_text_0: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 14,
    color: 'black',
    // marginBottom: width * 0.05,
    // marginTop: -25,
  },
  price_1: {
    width: width * 0.14,
    fontFamily: 'Poppins-SemiBold',
    fontSize: width * 0.02,
    fontWeight: '400',
    alignItems: 'center',
    justifyContent: 'center',
    textAlign: 'center',
    color: 'black',
  },
  price_0: {
    width: width * 0.14,
    fontFamily: 'Poppins-SemiBold',
    fontSize: width * 0.03,
    fontWeight: '800',
    alignItems: 'center',
    justifyContent: 'center',
    textAlign: 'center',
    color: 'black',
  },
  content_0: {
    width: width * 0.9,
    flexDirection: 'row',
    flexWrap: 'nowrap',
    gap: 130,
    paddingLeft: 20,
    paddingRight: 20,
    paddingBottom: width * 0.0,
    borderBottomWidth: 2,
    borderBottomColor: '#BBBBBB',
    marginBottom: width * 0.05,
    textAlign: 'center',
    justifyContent: 'flex-start',
    zIndex: -2,
    position: 'relative',
  },
  content_1: {
    width: width * 0.9,
    flexDirection: 'row',
    flexWrap: 'nowrap',
    gap: 190,
    paddingLeft: 20,
    paddingTop: width * 0.03,
    paddingBottom: width * 0.00,
    marginBottom: width * 0.05,
    textAlign: 'center',
    zIndex: -2,
    position: 'relative',
    justifyContent: 'flex-start',
  },
  dateContent: {
    width: width * 0.8,
    fontFamily: 'Poppins-Bold',
    fontSize: 16,
    zIndex: -2,
    position: 'relative',
    marginBottom: width * 0.03,
    color: 'black',
    marginVertical: 20

  },
  dateContent_0: {
    width: width * 0.8,
    paddingLeft: width * 0.05,
    paddingRight: width * 0.02,
    fontFamily: 'Poppins-SemiBold',
    fontSize: 16,
    zIndex: -2,
    position: 'relative',
    marginBottom: width * 0.03,
    color: 'black',
  },
  dateContent_1: {
    width: width * 0.8,
    // paddingLeft: width * 0.05,
    paddingRight: width * 0.02,
    fontFamily: 'Poppins-SemiBold',
    fontSize: 16,
    zIndex: -2,
    position: 'relative',
    marginBottom: width * 0.03,
    color: 'black',
  },
  dateImg: {
    width: width * 0.9,
    marginBottom: width * 0.05,
    zIndex: -2,
    position: 'relative',
  },
  paymentContent: {
    paddingLeft: width * 0.05,
    paddingRight: width * 0.02,
    marginBottom: width * 0.05,

  },
  comments: {
    width: width * 0.9,
    height: width * 0.25,
    backgroundColor: '#E3E3E3',
    marginBottom: width * 0.02,
    fontFamily: 'Poppins-Medium',
    fontSize: width * 0.04,
    alignItems: 'center',
    paddingLeft: width * 0.02,
    paddingRight: width * 0.02,
    paddingBottom: height * 0.07,
    justifyContent: 'flex-start',
    color: 'black'
  },
  cart_container: {
    width: width * 1,
    height: width * 0.15,
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'nowrap',
    fontFamily: 'Poppins-SemiBold',
    fontSize: width * 0.04,
    fontWeight: '500',
    zIndex: -2,
    position: 'relative',
  },
  cart_content: {
    width: width * 0.5,
    height: width * 0.15,
    alignItems: 'center',
    textAlign: 'center',
    borderColor: ' black',
    borderWidth: 1,
    padding: width * 0.04,
    backgroundColor: 'white',
    zIndex: -2,
    position: 'relative',
  },
  cart_content_0: {
    width: width * 0.5,
    height: width * 0.15,
    alignItems: 'center',
    textAlign: 'center',
    padding: width * 0.04,
    backgroundColor: Colors.brand_primary,
    zIndex: -2,
    position: 'relative',
  },
  contentTitle: {
    width: width * 1,
    height: width * 0.05,
  },
  textContent: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: width * 0.04,
    color: 'black',
  },
  textContent_0: {
    color: 'white',
    fontFamily: 'Poppins-SemiBold',
    fontSize: width * 0.04,
  },
  addressBtn: {
    backgroundColor: 'red',
    paddingHorizontal: 10,
    paddingVertical: 3,
    alignSelf: 'center',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
  },
  addressBtnṬext: {
    color: 'white',
    fontSize: 10,
    alignSelf: 'center',
    justifyContent: 'center',
    alignItems: 'center',
  },
});