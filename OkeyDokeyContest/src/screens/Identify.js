import {StyleSheet, Image, View, Text, StatusBar} from 'react-native';
import React, {useState, useEffect} from 'react';
import InputModal from '../pages/InputModal';
import {SafeAreaView} from 'react-native-safe-area-context';
import FaceModal from '../components/FaceModal';
import CustomButton from '../components/CustomButton';
import {useNavigation} from '@react-navigation/native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Identify = () => {
  const navigation = useNavigation();
  const [userData, setUserData] = useState(null); // 회원 정보 상태

  const fetchData = async () => {
    const config = {
      headers: {
        Authorization: `Bearer ${await AsyncStorage.getItem('access')}`,
      },
    };
    try {
      const userDataGet = await axios.get(
        'http://3.36.95.105/account/user/',
        config,
      );
      console.log(JSON.stringify(userData));
      const nickname = userDataGet.data.user.nickname;
      const mode = userDataGet.data.user.mode;
      AsyncStorage.setItem('nickname', nickname);
      AsyncStorage.setItem('mode', mode);
      setUserData(userDataGet.data.user);
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
  useEffect(() => {
    fetchData();
  }, []);

  // 본인확인된 모종의 부분이 있을거아냐 여기선 userData라고 가정.
  const handleContinue = () => {
    navigation.navigate('Home');
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
        {userData ? (
          <FaceModal
            userData={userData}
            navigation={navigation}
            headerTitle="본인확인"
            title={userData.nickname}
            subTitle="으로 계속하시겠어요?"
            width="75%"
            height="100%"
          />
        ) : (
          <FaceModal
            userData={userData}
            navigation={navigation}
            headerTitle="본인확인"
            title="이름"
            subTitle="으로 계속하시겠어요?"
            width="75%"
            height="100%"
          />
        )}
      </View>
      <CustomButton
        title={'비회원으로 계속하기'}
        onPress={handleContinue}
        width={'100%'}
        height={110}
        backgroundColor="rgba(5, 108, 242, 0.5)"
        textColor={'white'}
        fontSize={35}
      />
    </SafeAreaView>
  );
};

export default Identify;

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
