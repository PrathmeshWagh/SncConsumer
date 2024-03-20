import { FlatList, Image, Pressable, StyleSheet, Text, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import IonIcon from 'react-native-vector-icons/MaterialIcons';
import { getMethod } from '../../utils/helper'
import Icon from 'react-native-vector-icons/MaterialIcons';
import { Colors } from 'react-native/Libraries/NewAppScreen';
import Snackbar from 'react-native-snackbar';


const DailyCheckIn = ({ navigation }: any) => {
  const [coin, setCoin] = useState();
  const [listCoin, setListCoin] = useState([]);
  useEffect(() => {
    getCoins();
    getCoinList();
  }, [])

  const getCoins = async () => {
    try {
      const api: any = await getMethod('get-loyalty-coins');
      if (api.status === 200) {
        setCoin(api.data.data);
      } else {
        console.log("else", api.data.message)
      }

    } catch (e) {
      console.log('Error while fetchinggg:', e);
    }
  }

  const getCoinList = async () => {
    try {
      const api: any = await getMethod('get-daily-coins-data');
      if (api.status === 200) {
        setListCoin(api.data.data);
      } else {
        console.log("else", api.data.message)
      }

    } catch (e) {
      console.log('Error while fetchinggg:', e);
    }
  }

  const dailyCoins = async (day:string) => {
    try {
      const api: any = await getMethod(`daily-check-in?day=${day}`);
      if (api.status === 200) {
        getCoins()
        Snackbar.show({
          text: api.data.message,
          duration: Snackbar.LENGTH_SHORT,
          textColor: 'white',
          backgroundColor: 'green',
      });
      } else {
        console.log("else", api.data.message)
      }

    } catch (e) {
      console.log('Error while fetchinggg:', e);
    }
  }
  const openDrawer = () => {
    navigation.openDrawer();
  };


  const renderData = ({ item }:any) => {
    const backgroundColor = item.checkin_status === 2 ? '#E5AC22' : 'white';
    const isClickable = item.checkin_status === 2;
    return (
      <Pressable onPress={() => isClickable && dailyCoins(item.day)}>
        <View style={[styles.dayBox, { backgroundColor }]}>
          <Text>+{item.points}</Text>
          <Image source={require('../../../assets/img/Loyalty.png')} style={styles.imgBox} />
        </View>
        <Text style={{ textAlign: 'center' }}>{item.day}</Text>
      </Pressable>
    );
  };
  return (
    <View style={styles.container}>
      <View style={styles.firstConntainer}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
          <Pressable style={{ flexDirection: 'row', }} onPress={openDrawer}>
            <IonIcon
              name="menu"
              size={24}
              color={'white'}
              style={{ marginRight: 10 }}
            />
            <Text style={styles.headerText}>Coins Reward Page</Text>
          </Pressable>
          <Icon name='bookmark-outline' color={'white'} size={24} />
        </View>


        <View style={styles.coinAndPriceContainer}>
          <Image source={require('../../../assets/img/Loyalty.png')} style={styles.imgBox} />
          <Text style={styles.priceText}>{coin}</Text>
        </View>

        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 10 }}>
          {/* <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Text style={styles.subHeadingTextBold}>189</Text>
            <Text style={styles.subHeadingText}> coin(s) expiring on <Text style={styles.subHeadingTextBold}>31-03-2024</Text></Text>
          </View> */}

          {/* <View style={styles.historyTextBox}>
            <Text style={styles.historyText}>History</Text>
            <Icon name='chevron-right' size={16} color={'white'} />
          </View> */}
        </View>
      </View>

      <View style={styles.secondContainer}>
        <FlatList 
          data={listCoin}
          renderItem={renderData}
          horizontal={true}
          keyExtractor={(item) => item.id.toString()}
        />

        {/* <View style={styles.checkInBtn}> */}
        <Text style={styles.text}>Check in today to get 1 coins</Text>
      </View>
    </View>
  )
}

export default DailyCheckIn

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // backgroundColor: '#ffffff'
  },
  text: {
    textAlign: 'center',
    color: 'black',
    fontWeight: '500',
    marginBottom: 20
  },
  firstConntainer: {
    paddingHorizontal: 10,
    paddingTop: 10,
    width: '100%',
    height: '30%',
    backgroundColor: '#E5AC22',
    borderBottomRightRadius: 30,
    borderBottomLeftRadius: 30,
    padding: 18
  },
  headerText: {
    color: 'white',
    fontWeight: '500',
    fontSize: 17
  },
  imgBox: {
    width: 30,
    height: 30,
    borderRadius: 15
  },
  coinAndPriceContainer: {
    marginTop: 30,
    flexDirection: 'row',
    alignItems: 'center',
  },
  priceText: {
    marginLeft: 20,
    color: 'white',
    fontWeight: '700',
    fontSize: 20
  },
  historyTextBox: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 5,
    width: 70,
    height: 25,
    borderRadius: 20,
    borderWidth: 0.5,
    borderColor: '#fff3',
    backgroundColor: '#fff3',

  },
  historyText: {
    color: 'white',
    textAlign: 'center',
    fontSize: 12,
    fontWeight: '600'
  },
  subHeadingTextBold: {
    fontSize: 13,
    color: 'white',
    fontWeight: '600'
  },
  subHeadingText: {
    fontSize: 12,
    color: 'white'
  },
  secondContainer: {
    marginTop: -100,
    width: '90%',
    backgroundColor: '#ffffffff',
    height: '20%',
    borderWidth: 1,
    alignSelf: 'center',
    borderColor: '#ffffffff',
    borderRadius: 3
  },
  dayBox: {
    alignItems: 'center',
    width: 40,
    height: 55,
    borderWidth: 1,
    borderRadius: 3,
    borderColor: 'red',
    marginHorizontal: 10,
    marginTop: 10
  },
  checkInBtn: {
    width: '80%',
    height: 30,
    alignSelf: 'center',
    justifyContent: 'center',
    backgroundColor: 'red',
    borderRadius: 20,
    marginBottom: 20
  }
})