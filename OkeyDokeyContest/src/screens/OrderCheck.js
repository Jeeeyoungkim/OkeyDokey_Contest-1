import {StyleSheet, Image, View, Text, StatusBar} from 'react-native';
import React, {useEffect, useState} from 'react';
import {SafeAreaView} from 'react-native-safe-area-context';
import CoffeeObject from '../components/CoffeeObject';
import CustomButton from '../components/CustomButton';
import {useNavigation} from '@react-navigation/native';
import {useDispatch} from 'react-redux';
import {addShopping} from '../redux/slices/shoppingSlice';
import AsyncStorage from '@react-native-async-storage/async-storage';
const OrderCheck = ({route}) => {
  const {qdata, goto} = route.params;
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const [ice, setIce] = useState(true);
  const [size, setSize] = useState('Tall');
  const [quantity, setquantity] = useState(1);

  
  useEffect(() => {
    // 30초 뒤에 accessToken 삭제 및 페이지 이동
    const timer = setTimeout(async () => {
      try {
        // AsyncStorage에서 accessToken 삭제
        await AsyncStorage.removeItem('access');
        console.log('accessToken이 삭제되었습니다.');

        // 페이지 이동
        const nonmember = await AsyncStorage.getItem('nonmember');
        if(!nonmember){
        navigation.popToTop();
      }
      } catch (error) {
        console.error('토큰 삭제 중 오류 발생:', error);
      }
    }, 300000); // 30초(30000밀리초) 후에 실행

    // 컴포넌트가 언마운트될 때 타이머 정리
    return () => clearTimeout(timer);
  }, [navigation]);


  const getQuantity = x => {
    setquantity(x);
  };
  const handleConfirm = () => {
    dispatch(
      addShopping({
        title: qdata[0].name,
        price: qdata[0].price,
        quantity: quantity,
        imgsrc: qdata[0].src,
        ice: ice,
        size: size,
      }),
    );
    setquantity(1);
    if (goto === 'ShoppingBasket') {
      navigation.push('ShoppingBasket', {
        data: 'confirm',
      });
    } else if (goto === 'EasyMenu') {
      navigation.pop();
    }
  };

  const handleShoppingBacket = () => {
    setquantity(1);
    navigation.push('ShoppingBasket', {});
  };

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
          style={{width: 150, height: 50}}
          source={require('OkeyDokeyContest/assets/images/OkDkLogo.png')}
        />
      </View>
      <View style={styles.div}></View>
      <View style={styles.grayDiv}></View>
      <View
        style={{
          position: 'absolute',
          width: '100%',
          height: '100%',
        }}>
        <View
          style={{
            flex: 8,
            width: '100%',
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <View style={{width: '75%', height: '70%', position: 'absolute'}}>
            <View
              style={{
                backgroundColor: '#F5F7FB',
                alignItems: 'center',
                width: '100%',
                flex: 1,
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              <Text
                style={{
                  fontSize: 30,
                  color: 'black',
                  fontWeight: 'bold',
                }}>
                주문정보확인
              </Text>
            </View>
            <View
              style={{
                backgroundColor: 'white',
                width: '100%',
                flex: 7,
                paddingHorizontal: 30,
                justifyContent: 'space-around',
              }}>
              <CoffeeObject
                width={'100%'}
                height={220}
                imageSize={200}
                imgsrc={qdata[0].src}
                title={qdata[0].name}
                price={qdata[0].price}
                quantity={quantity}
                getQuantity={getQuantity}
              />

              <Text style={{fontSize: 30, color: 'black', fontWeight: 'bold'}}>
                온도
              </Text>
              <View
                style={{
                  width: '60%',
                  flexDirection: 'row',
                  justifyContent: 'space-around',
                }}>
                <CustomButton
                  onPress={() => {
                    setIce(true);
                  }}
                  title={'차갑게'}
                  backgroundColor={ice ? '#0583F2' : '#6D6D6D'}
                  textColor={'white'}
                  fontSize={20}
                  height={50}
                  width={150}
                />
                <CustomButton
                  onPress={() => {
                    setIce(false);
                  }}
                  title={'따뜻하게'}
                  backgroundColor={ice ? '#6D6D6D' : '#F25D07'}
                  textColor={'white'}
                  fontSize={20}
                  height={50}
                  width={150}
                />
              </View>
              <Text style={{fontSize: 30, color: 'black', fontWeight: 'bold'}}>
                사이즈
              </Text>
              <View
                style={{
                  width: '90%',
                  flexDirection: 'row',
                  justifyContent: 'space-around',
                }}>
                <CustomButton
                  title={'톨'}
                  onPress={() => setSize('Tall')}
                  backgroundColor={size === 'Tall' ? '#373737' : '#6D6D6D'}
                  textColor={'white'}
                  fontSize={20}
                  height={50}
                  width={150}
                />
                <CustomButton
                  title={'그란데'}
                  onPress={() => setSize('Grande')}
                  backgroundColor={size === 'Grande' ? '#373737' : '#6D6D6D'}
                  textColor={'white'}
                  fontSize={20}
                  height={50}
                  width={150}
                />
                <CustomButton
                  title={'벤티'}
                  onPress={() => setSize('Venti')}
                  backgroundColor={size === 'Venti' ? '#373737' : '#6D6D6D'}
                  textColor={'white'}
                  fontSize={20}
                  height={50}
                  width={150}
                />
              </View>
            </View>
            <View
              style={{
                flex: 1,
              }}>
              <CustomButton
                onPress={handleConfirm}
                width={'100%'}
                title={'담기'}
                backgroundColor={'#056CF2'}
                fontSize={35}
                height={100}
                textColor={'white'}
              />
            </View>
          </View>
        </View>
        <View
          style={{
            flexDirection: 'row',
            flex: 1,
          }}>
          <CustomButton
            title={'뒤로가기'}
            onPress={() => navigation.pop()}
            width={'50%'}
            height={150}
            backgroundColor={'#6D6D6D'}
            textColor={'white'}
            fontSize={50}
          />
          <CustomButton
            title={'장바구니'}
            onPress={handleShoppingBacket}
            width={'50%'}
            height={150}
            backgroundColor={'#056CF2'}
            textColor={'white'}
            fontSize={50}
          />
        </View>
      </View>
    </SafeAreaView>
  );
};

export default OrderCheck;

const styles = StyleSheet.create({
  header: {
    flex: 1,
    backgroundColor: '#F5F7FB',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
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
});
