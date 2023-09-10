import {
  StyleSheet,
  Image,
  View,
  Text,
  StatusBar,
  ScrollView,
  Alert,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import InputModal from '../pages/InputModal';
import {SafeAreaView} from 'react-native-safe-area-context';
import FaceModal from '../components/FaceModal';
import CustomButton from '../components/CustomButton';
import {useNavigation} from '@react-navigation/native';
import RNFS from 'react-native-fs';
import axios from 'axios';
import Coffee from '../components/Coffee';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useDispatch} from 'react-redux';
import {addShopping} from '../redux/slices/shoppingSlice';

//즐겨찾는 메뉴 페이지
////얼굴인식 성공 -> 본인확인 계속하기 -> 백엔드에서 받아온 이름, 커피(이름,가격,사진)등의 데이터 GET요청
const Favorites = () => {
  const [access, setAccess] = useState(null);
  const [name, setName] = useState(AsyncStorage.getItem('nickname'));
  const [totalCoffeePrice, setTotalCoffeePrice] = useState(0);
  const [menuData, setMenuData] = useState([]);

  const dispatch = useDispatch();

  const navigation = useNavigation();




  useEffect(() => {
    // 30초 뒤에 accessToken 삭제 및 페이지 이동
    const timer = setTimeout(async () => {
      try {
        // AsyncStorage에서 accessToken 삭제
        await AsyncStorage.removeItem('access');
        console.log('accessToken이 삭제되었습니다.');

        // 페이지 이동

        navigation.popToTop();
      } catch (error) {
        console.error('토큰 삭제 중 오류 발생:', error);
      }
    }, 300000); // 30초(30000밀리초) 후에 실행

    // 컴포넌트가 언마운트될 때 타이머 정리
    return () => clearTimeout(timer);
  }, [navigation]);
  


  
  const handleConfirm = () => {
    menuData.map((item, index) => {
      // console.log(item);
      dispatch(
        addShopping({
          title: item.menu.name,
          price: item.menu.price,
          quantity: 1,
          imgsrc: item.menu.image,
          ice: item.temperature.name,
          size: item.size.name,
        }),
      );
    });
  };

  const fetchData = async () => {
    const config = {
      headers: {
        Authorization: `Bearer ${await AsyncStorage.getItem('access')}`,
      },
    };
    try {
      const response = await axios.get(
        'http://15.164.232.208/menu/favorite/list/',
        config,
      );
      setMenuData(response.data.OKDK);
      console.log(response.data.OKDK);
    } catch (error) {
      console.error(error);
      if (error.response && error.response.status === 401) {
        try {
          await refreshAccessToken();
          console.log('fetchData 재시도');
          await fetchData();
        } catch (refreshError) {
          console.error('토큰 갱신 중 오류:', refreshError);
          // 추가적인 오류 처리 로직 필요 (예: 사용자를 로그인 페이지로 리다이렉트)
        }
      }
    }
  };

  const refreshAccessToken = async () => {
    const body = {
      refresh: AsyncStorage.getItem('refresh'),
    };

    try {
      const response = await axios.post(
        'http://3.36.95.105/account/refresh/access_token/',
        body,
        {
          headers: {
            'Content-Type': 'application/json',
          },
        },
      );

      const access = response.data.access;
      const refresh = response.data.refresh;

      AsyncStorage.setItem('access', access);
      AsyncStorage.setItem('refresh', refresh);
      console.log('success : refresh Access Token');
    } catch (error) {
      console.error('Error refreshing access token:', error);
      throw error; // 함수를 호출하는 곳에서 오류를 처리할 수 있도록 오류를 다시 던집니다.
    }
  };

      AsyncStorage.setItem('access', access);
      AsyncStorage.setItem('refresh', refresh);
      console.log('success : refresh Access Token');
    } catch (error) {
      console.error('Error refreshing access token:', error);
      throw error; // 함수를 호출하는 곳에서 오류를 처리할 수 있도록 오류를 다시 던집니다.
    }
  };
  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    if (menuData) {
      const totalPrice = menuData.reduce(
        (total, item) => total + item.menu.price,
        0,
      );
      setTotalCoffeePrice(totalPrice);
    }
  }, [menuData]);

  return (
    <SafeAreaView
      style={{
        backgroundColor: 'white',
        width: '100%',
        height: '100%',
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'column',
        position: 'relative',
      }}>
      <StatusBar barStyle="light-content" />
      <View style={styles.header}>
        <Image
          style={{width: 160, height: 80}}
          source={require('OkeyDokeyContest/assets/images/OkDkLogo.png')}
        />
      </View>
      <View style={styles.div}></View>
      <View style={styles.grayDiv}></View>
      <View
        style={{
          position: 'absolute',
          top: '15%',
          width: '100%',
          height: '100%',
          justifyContent: 'center',
          alignItems: 'center',
        }}>
        <View style={{width: '75%', height: '100%', position: 'absolute'}}>
          <View style={styles.main}>
            <View style={styles.header}>
              <Text style={{fontWeight: 'bold', color: 'black', fontSize: 40}}>
                {name ? name : ''}님이 즐겨찾는 메뉴
              </Text>
            </View>
            <View style={styles.mid}>
              <View style={styles.midItemBox}>
                {menuData && menuData.length !== 0 ? (
                  menuData.map(item => (
                    <Coffee
                      key={item.menu.id}
                      navigation={navigation}
                      goto={'ShoppingBasket'}
                      coffeeImageWidth={120}
                      coffeeImageHeight={140}
                      imgsrc={item.menu.image}
                      CoffeeName={item.menu.name}
                      CoffeePrice={item.menu.price}
                    />
                  ))
                ) : (
                  <Text
                    style={{
                      width: '100%',
                      height: '100%',
                      display: 'flex',
                      justifyContent: 'center',
                      alignItems: 'center',
                      textAlign: 'center',
                      color: 'black',
                      fontSize: 25,
                    }}>
                    즐겨찾는 메뉴가 없습니다.
                  </Text>
                )}
              </View>
            </View>
            <View
              style={{
                width: '100%',
                height: 100,
                backgroundColor: '#F5F7FB',
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              <Text
                style={{
                  fontSize: 30,
                  fontWeight: 'bold',
                  color: 'black',
                }}>
                결제금액 {totalCoffeePrice}원
              </Text>
            </View>
          </View>
          <CustomButton
            title={'확인'}
            onPress={() => {
              if (totalCoffeePrice > 0) {
                handleConfirm();
                navigation.navigate('Payment');
              } else {
                Alert.alert('알림', '결제할 메뉴가 없어요');
              }
            }}
            width={'100%'}
            height={110}
            backgroundColor={'#056CF2'}
            textColor={'white'}
            fontSize={35}
          />
        </View>
      </View>
      <View style={{flexDirection:'row'}}>
      <CustomButton
        title={'뒤로가기'}
        onPress={() =>  navigation.goBack()}
        width={'50%'}
        height={110}
        backgroundColor={'#056CF2'}
        textColor={'white'}
        fontSize={35}
      />
      <CustomButton
        title={'다른 메뉴 선택하기'}
        onPress={() => navigation.navigate('QCoffee' , { test: 'testing' })}
        width={'50%'}
        height={110}
        backgroundColor={'#056CF2'}
        textColor={'white'}
        fontSize={35}
      />
      </View>
    </SafeAreaView>
  );
};

export default Favorites;

const styles = StyleSheet.create({
  header: {
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    height: '15%',
    backgroundColor: '#F5F7FB',
    // flex:1,
  },
  div: {
    flex: 9,
  },
  grayDiv: {
    width: '100%',
    height: '100%',
    backgroundColor: '#000000',
    position: 'absolute',
    opacity: 0.3,
  },
  title: {
    fontSize: 80,
    color: '#056CF2',
    fontWeight: 'bold',
  },
  main: {
    backgroundColor: 'white',
    width: '100%',
    height: '60%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  subtitleView: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 30,
  },
  subtitle: {
    fontSize: 25,
    fontWeight: 'bold',
  },
  bottomButtons: {
    flexDirection: 'row',
    flex: 1,
  },
  inputView: {
    alignItems: 'center',
    justifyContent: 'center',
    width: '75%',
    borderColor: 'black',
    marginBottom: 60,
  },
  inputPhoneNumber: {
    width: '85%',
    height: 60,
    backgroundColor: '#F5F7FB',
    marginBottom: 30,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  inputPhoneNumberText: {
    fontSize: 25,
    color: 'black',
  },
  imageWrap: {
    flex: 2,
  },
  mid: {
    flex: 1,
    height: '100%',
    marginTop: 110,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  midItemBox: {
    width: '100%',
    height: '80%',
    justifyContent: 'flex-start',
    alignContent: 'center',
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 55,
    // paddingVertical: 30,
    backgroundColor: 'white',
    marginBottom: 120,
  },
});
