import React, {useEffect, useState} from 'react';
import {useNavigation} from '@react-navigation/native';
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
import API from '../API/api';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Qmilk = ({route, navigation}) => {
  const {qCoffee, qCoffeeid} = route.params;
  const [milkText, setMilkText] = useState([]);
  const [nonmilkText, setNonmilkText] = useState([]);
  const [iceItemText, setIceItemText] = useState([]);
  const [TeaItemText, setTeaItemText] = useState([]);
  const [softDrinkItemText, setSoftDrinkItemText] = useState([]);

  
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


  const fetchData = () => {
    API.get(`/category2/list/${qCoffeeid}`)
      .then(response => {
        console.log(response.data);
        setMilkText(
          response.data.find(item => item.name === '우유가 들어간 것'),
        );
        setNonmilkText(
          response.data.find(item => item.name === '우유가 안 들어간 것'),
        );
        setIceItemText(response.data.find(item => item.name === '얼음간 것'));
        setTeaItemText(response.data.find(item => item.name === '차'));
        setSoftDrinkItemText(
          response.data.find(item => item.name === '탄산이 들어간 것'),
        );
      })
      .catch(error => {
        console.error(error);
      });
  };

  useEffect(() => {
    fetchData();
  }, []);

  const goWelcome = () => {
    navigation.popToTop();
  }

  const handleNonMilk = () => {
    navigation.push('EasyMenu', {
      qMilk: nonmilkText ? nonmilkText.name : null,
      qMilkid: nonmilkText ? nonmilkText.id : null,
      qCoffee: qCoffee,
      whereScreen: 'EasyMenu',
    });
  };

  const handleMilk = () => {
    navigation.push('EasyMenu', {
      qMilk: milkText ? milkText.name : null,
      qMilkid: milkText ? milkText.id : null,
      qCoffee: qCoffee,
      whereScreen: 'EasyMenu',
    });
  };

  const handleIceItem = () => {
    navigation.push('EasyMenu', {
      qMilk: iceItemText ? iceItemText.name : null,
      qMilkid: iceItemText ? iceItemText.id : null,
      qCoffee: qCoffee,
      whereScreen: 'EasyMenu',
    });
  };

  const handleTeaItem = () => {
    navigation.push('EasyMenu', {
      qMilk: TeaItemText ? TeaItemText.name : null,
      qMilkid: TeaItemText ? TeaItemText.id : null,
      qCoffee: qCoffee,
      whereScreen: 'EasyMenu',
    });
  };

  const handleSoftDrinkItem = () => {
    navigation.push('EasyMenu', {
      qMilk: softDrinkItemText ? softDrinkItemText.name : null,
      qMilkid: softDrinkItemText ? softDrinkItemText.id : null,
      qCoffee: qCoffee,
      whereScreen: 'EasyMenu',
    });
  };

  const getEasy = () => {
    navigation.push('EasyMenu', {
      whereScreen: 'Qmilk',
      settingEasy: false,
    });
  };
  // let nonmilkdata;
  // let milkdata;
  // if (milkText && milkText.length > 0) {
  //   milkdata = milkText[0].name;
  //   milkdata = milkdata.replace('들', '\n들');

  // }
  // if (nonmilkText && nonmilkText.length > 0) {
  //   nonmilkdata = nonmilkText[0].name;
  //   nonmilkdata = nonmilkdata.replace('안', '\n안');

  // }
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
        <Toggle getEasy={getEasy} CoffeeScreen={'우유'}/>
      </View>
      <View
        style={{
          alignItems: 'center',
          justifyContent: 'center',
          width: '100%',
          marginTop: 22,
        }}>
        <Text
          style={{
            fontSize: 32,
            fontFamily: 'Pretendard',
            fontWeight: 'bold',
            color: '#212121',
          }}>
          {qCoffee}
        </Text>
      </View>
      <View
        style={{
          flex: 9,
          width: '100%',
          height: '100%',
          justifyContent: 'center',
          alignItems: 'center',
        }}>
        {qCoffeeid === 2 ? (
          <View style={styles.mid}>
            <View style={{padding: 20, width: '60%', height: '70%'}}>
              {iceItemText && (
                <Quiz
                  handleEvent={handleIceItem}
                  QuizText={iceItemText.name}
                  height={'40%'}
                />
              )}

              {TeaItemText && (
                <Quiz
                  handleEvent={handleTeaItem}
                  QuizText={TeaItemText.name}
                  height={'40%'}
                  marginBottom={50}
                />
              )}
            </View>
            <View style={{padding: 20, width: '60%', height: '70%'}}>
              {softDrinkItemText && (
                <Quiz
                  handleEvent={handleSoftDrinkItem}
                  QuizText={softDrinkItemText.name}
                  height={'40%'}
                />
              )}
              {milkText && (
                <Quiz
                  handleEvent={handleMilk}
                  QuizText={milkText.name}
                  height={qCoffeeid === 2 ? '40%' : '90%'}
                  marginBottom={50}
                />
              )}
            </View>
          </View>
        ) : (
          <View style={styles.mid}>
            {nonmilkText && (
              <Quiz
                handleEvent={handleNonMilk}
                QuizText={nonmilkText.name}
                height={qCoffeeid === 2 ? '40%' : '90%'}
              />
            )}
            {milkText && (
              <Quiz
                handleEvent={handleMilk}
                QuizText={milkText.name}
                height={qCoffeeid === 2 ? '40%' : '90%'}
              />
            )}
          </View>
        )}
        <View style={{flexDirection: 'row'}}>
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

export default Qmilk;

const styles = StyleSheet.create({
  header: {
    flex: 1,
    backgroundColor: '#F5F7FB',
    alignItems: 'center',
    justifyContent: 'center',
  },
  mid: {
    width: '80%',
    height: '100%',
    flex: 1,
    marginBottom: 100,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
});
