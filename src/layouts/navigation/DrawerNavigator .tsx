import React from 'react';
import { createDrawerNavigator } from '@react-navigation/drawer';
import AboutScreen from '../screens/AboutScreen';
import CustomDrawer from './CustomDrawer';
import TabNavigator from './TabNavigator';
import ProductScreen from '../screens/ProductScreen';
import Policy from '../screens/Policy';
import ProductVoucher from '../screens/ProductVoucher';
import Voucher from '../screens/Voucher';
import CouponScreen from '../screens/CouponScreen';

const Drawer = createDrawerNavigator();

export default function DrawerNavigator() {

  return (

    <Drawer.Navigator initialRouteName="TabNavigator"
      screenOptions={{
        headerShown: false,
      }} drawerContent={props => <CustomDrawer {...props} />} >
      <Drawer.Screen name="DrawerHome" component={TabNavigator} />
      <Drawer.Screen name="AboutName" component={AboutScreen} />
      <Drawer.Screen name="ProductName" component={ProductScreen} />
      <Drawer.Screen name="ProductVoucherName" component={ProductVoucher} />
      <Drawer.Screen name="VoucherName" component={Voucher} />
      <Drawer.Screen name="CouponScreenDrawer" component={CouponScreen} />

      <Drawer.Screen name="Policy" component={Policy} />

      {/* <Drawer.Screen name="" component={} />
      <Drawer.Screen name="" component={} />
      <Drawer.Screen name="" component={} /> */}

      {/* <Drawer.Screen name="ProfileAddress" component={ProfileAddress} />
      <Drawer.Screen name="ProfileAddress" component={ProfileAddress} /> */}


    </Drawer.Navigator>

  );

}

