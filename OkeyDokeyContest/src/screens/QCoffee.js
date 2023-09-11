import React, {useEffect, useState} from 'react';
import {useNavigation} from '@react-navigation/native';
import API from '../API/api';

import {
  Button,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import Quiz from '../components/Quiz';
import CustomButton from '../components/CustomButton';
import Toggle from '../components/Toggle';
import {useDispatch, useSelector} from 'react-redux';
import {resetOrderNumber} from '../redux/slices/shoppingSlice';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const QCoffee = ({navigation, route}) => {
  const dispatch = useDispatch();
  const [result, setResult] = useState([]);
  const [coffeeText, setCoffeeText] = useState([]);
  const [nonCoffeeText, setNonCoffeeText] = useState([]);
  const [userMode, setUserMode] = useState(null);
  
  const FavoriteMoveState = route.params;

  useEffect(() => {
    async function fetchData() {
      const mode = await AsyncStorage.getItem('mode');
        setUserMode(mode); // 'easy' 모드일 때만 초기화
      }
    fetchData();
  }, []); // 빈 배열로 설정하여 한 번만 실행

  
  useEffect(() => {
    if(userMode !== null || userMode !== undefined){
      if(userMode === 'normal'){
      navigation.navigate('EasyMenu', {
        whereScreen: 'QCoffee',
      });
      setUserMode(null);
    }
    }
  },[FavoriteMoveState, userMode])



  const goWelcome = () => {
    navigation.popToTop();
  }

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

  //userData가
  //일반메뉴 받아오기 함수
  const fetchData = async () => {
    const config = {
      headers: {
        Authorization: `Bearer ${AsyncStorage.getItem("access")}`,
      },
    };
    try {  
      const response = await API.get('/category1/list/');
      const results = response.data;
      setResult(results);
      console.log(results);
      const coffeeItem = results.find(item => item.name === '커피');
      const nonCoffeeItem = results.find(item => item.name === '커피가 아닌것');

      if (coffeeItem && nonCoffeeItem) {
        setCoffeeText(coffeeItem);
        setNonCoffeeText(nonCoffeeItem);
      }
    } catch (error) {
      console.error(error);
      }
    }

  useEffect(() => {
    fetchData();
  }, []);

  const handleCoffee = () => {
    const Coffee = coffeeText.name.replace(/\n/g, '');

    navigation.push('Qmilk', {
      qCoffee: Coffee,
      qCoffeeid: coffeeText.id,
    });
    };
  const handleNonCoffee = () => {
    const nonCoffee = nonCoffeeText.name.replace(/\n/g, '');

    navigation.push('Qmilk', {
      qCoffee: nonCoffee,
      qCoffeeid: nonCoffeeText.id,
    });
  
  };
  let coffeedata = nonCoffeeText.name;
  if (coffeedata) {
    coffeedata = coffeedata.replace(/\s/g, '\n');
  }
  const getEasy = () => {
    const Coffee = coffeeText.name.replace(/\n/g, '');
    console.log(Coffee, coffeeText.id);
    navigation.push('EasyMenu', {
      whereScreen: 'QCoffee',
      settingEasy: false,
      qCoffee: Coffee,
      qCoffeeid: coffeeText.id,
    });
  };
{/* 이부분의 getEasy부분의 settingEasy자리에 혹시나 easy를 넣어주면 되지 않을까 하는 생각 */}
  return (
    <View style={{flex: 1, backgroundColor: '#F5F7FB'}}>
      <View style={styles.header}>
        <View style={{position:'absolute', left:50, width:500}}>
      <CustomButton
          title={'처음으로'}
          onPress={goWelcome}
          width={'20%'}
          height={40}
          backgroundColor={'#056CF2'}
          textColor={'white'}
          fontSize={20}
        />
        </View>
        <Image
          style={{width: 150, height: 50}}
          source={require('OkeyDokeyContest/assets/images/OkDkLogo.png')}
        />
      </View>
      <View
        style={{alignItems: 'center', justifyContent: 'center', width: '100%'}}>
        <Toggle getEasy={getEasy} CoffeeScreen={'커피'} />
        
      </View>
      <View
        style={{
          flex: 9,
          width: '100%',
          justifyContent: 'center',
          alignItems: 'center',
        }}>
        <View style={styles.mid}>
          <Quiz
            handleEvent={handleCoffee}
            QuizText={coffeeText.name}
            height={'90%'}
          />
          <Quiz
            handleEvent={handleNonCoffee}
            QuizText={coffeedata}
            height={'90%'}
          />
        </View>
        <View style={{flexDirection: 'row'}}>
          <CustomButton
            title={'뒤로가기'}
            onPress={() => {
              dispatch(resetOrderNumber());
              navigation.pop();
            }}
            width={'50%'}
            height={150}
            backgroundColor={'#056CF2'}
            textColor={'white'}
            fontSize={50}
          />
          <CustomButton
            title={'장바구니'}
            onPress={() => navigation.push('ShoppingBasket', {})}
            width={'50%'}
            height={150}
            backgroundColor={'#056CF2'}
            textColor={'white'}
            fontSize={50}
          />
        </View>
      </View>
    </View>
  );
};

export default QCoffee;

const styles = StyleSheet.create({
  header: {
    flex: 1,
    backgroundColor: '#F5F7FB',
    alignItems: 'center',
    justifyContent: 'center',
  },
  mid: {
    marginTop: 50,
    width: '80%',
    height: '100%',
    flex: 1,
    marginBottom: 100,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  left: {
    height: '60%',
    marginLeft: 30,
    borderWidth: 1,
    borderColor: 'black',
    flex: 1,
    marginRight: 5,
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.18,
    shadowRadius: 1.0,

    elevation: 3,
  },
  right: {
    height: '60%',
    marginRight: 30,
    borderWidth: 1,
    borderColor: 'black',
    flex: 1,
    marginLeft: 5,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.18,
    shadowRadius: 1.0,

    elevation: 3,
  },
});
