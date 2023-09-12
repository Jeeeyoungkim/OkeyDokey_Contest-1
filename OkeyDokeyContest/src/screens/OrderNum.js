import {StyleSheet, Image, View, Text, StatusBar, BackHandler} from 'react-native';
import React from 'react';
import CustomButton from '../components/CustomButton';
import {SafeAreaView} from 'react-native-safe-area-context';
import {useNavigation} from '@react-navigation/native';
import {useSelector, useDispatch} from 'react-redux';
import {resetShopping} from '../redux/slices/shoppingSlice';
import WebviewContainer from '../pages/WebviewContainer';
import { useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const OrderNum = () => {
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const orderNumber = useSelector(state => state.shopping.orderNumber); //order number

  const navigateHome = () => {
    //쇼핑 배열 초기화함
    dispatch(resetShopping());
    //홈으로 돌아감
    navigation.reset({
      index: 0,
      routes: [{name: 'Welcome'}],
    });
  };

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
    }, 600000); // 30초(30000밀리초) 후에 실행

    // 컴포넌트가 언마운트될 때 타이머 정리
    return () => clearTimeout(timer);
  }, [navigation]);

  useEffect(() => {
    const onBackPress = () => {
      return true; // 뒤로가기 막음
    };

    BackHandler.addEventListener('hardwareBackPress', onBackPress);

    return () => {
      BackHandler.removeEventListener('hardwareBackPress', onBackPress);
    };
  }, []);

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
          top: '20%',
          width: '100%',
          height: '100%',
          justifyContent: 'center',
          alignItems: 'center',
        }}>
        <View style={{width: '75%', height: '100%', position: 'absolute'}}>
          <View style={styles.main}>
            <View style={styles.modalHeader}>
              <Text style={styles.headerTitle}>주문번호</Text>
            </View>
            <View style={styles.subtitleView}>
              <Text style={styles.orderNumber}>{orderNumber}</Text>
              <Text style={styles.subtitle}>주문이 완료되었습니다</Text>
            </View>
            <View style={styles.inputView}></View>
          </View>
         
        <View style={{flexDirection:'row'}}>
          <CustomButton
            title={'확인'}
            onPress={() => navigateHome()}
            width={'50%'}
            height={110}
            backgroundColor={'#056CF2'}
            textColor={'white'}
            fontSize={35}
          />
            <WebviewContainer />
        </View>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default OrderNum;

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
  modalHeader: {
    backgroundColor: '#F5F7FB',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    height: '15%',
    marginTop: 0,
  },
  headerTitle: {
    fontSize: 35,
    color: 'black',
    fontWeight: 'bold',
  },
  main: {
    backgroundColor: 'white',
    width: '100%',
    height: '50%',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  subtitleView: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 30,
  },
  subtitle: {
    fontSize: 30,
    fontWeight: 'bold',
    color: 'black',
  },
  orderNumber: {
    fontSize: 80,
    fontWeight: 'bold',
    color: '#F25D07',
  },
});
