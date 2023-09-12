import {useFocusEffect, useNavigation} from '@react-navigation/native';
import axios from 'axios';
import React, {useCallback, useEffect, useState} from 'react';
import {View, Text, StyleSheet, Image} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {useIsFocused} from '@react-navigation/native';
import {resetShopping} from '../redux/slices/shoppingSlice';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useDispatch } from 'react-redux';

const Welcome = () => {
  const [distanceSensor, setDistanceSensor] = useState(false);
  const navigation = useNavigation();
  const isFocused = useIsFocused();
  const dispatch = useDispatch();
  const fetchData = async () => {
    try {
      const response = await axios.get('https://www.okdkkiosk.shop/OKDK/signal/');
      console.log(response.data);
      if (response.data == true) {
        setDistanceSensor(true);
      }
      return response.data; // response.data가 true이면 무한 루프 탈출
    } catch (error) {
      console.error('error' + error);
      return false;
    }
  };
  useEffect(() => {
    clearAsyncStorage();
    dispatch(resetShopping());
  },[]);

  const clearAsyncStorage = async () => {
    try {
      await AsyncStorage.clear();
      console.log('AsyncStorage cleared successfully.');
    } catch (error) {
      console.error('Error clearing AsyncStorage:', error);
    }
  };
  
  useEffect(() => {
    let interval;
    const startLoop = () => {
      interval = setInterval(async () => {
        await fetchData();
        if (distanceSensor) {
          clearInterval(interval);
          navigation.navigate('FaceRecognition');
        }
      }, 1000);
    };

    const stopLoop = () => {
      clearInterval(interval); // interval 정리
    };

    startLoop();

    return () => {
      stopLoop();
    };
  }, [distanceSensor]);

  useFocusEffect(
    useCallback(() => {
      setDistanceSensor(false);
    }, []),
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={{flex: 1, backgroundColor: '#F5F7FB'}}>
        <View style={styles.header}>
          <Image
            style={{width: 150, height: 50}}
            source={require('OkeyDokeyContest/assets/images/OkDkLogo.png')}
          />
        </View>
      </View>
      <View
        style={{
          flex: 9,
          alignItems: 'center',
          backgroundColor: '#F5F7FB',
        }}>
        <Text
          style={{
            marginTop: 150,
            fontSize: 70,
            fontWeight: '700',
            color: 'black',
            zIndex: 1,
          }}>
          음메카우
        </Text>
        <Text
          style={{
            fontSize: 40,
            fontWeight: '700',
            color: 'black',
            zIndex: 1,
          }}>
          상명대점
        </Text>
        <Image
          style={{
            width: 500,
            height: 700,
            position: 'absolute',
            bottom: 0,
          }}
          source={require('OkeyDokeyContest/assets/images/welcome.png')}
          resizeMode="cover"
        />
      </View>
    </SafeAreaView>
  );
};

export default Welcome;

const styles = StyleSheet.create({
  header: {
    flex: 1,
    backgroundColor: '#F5F7FB',
    alignItems: 'center',
    justifyContent: 'center',
  },
  container: {
    flex: 1,
  },
});
