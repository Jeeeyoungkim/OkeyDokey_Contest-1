import {StyleSheet, Image, View, Text, StatusBar} from 'react-native';
import React, {useState, useEffect, useCallback} from 'react';
import InputModal from '../pages/InputModal';
import {SafeAreaView} from 'react-native-safe-area-context';
import FaceModal from '../components/FaceModal';
import CustomButton from '../components/CustomButton';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Identify = () => {
  const [userData, setUserData] = useState(null); // 회원 정보 상태
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

  const fetchData = async () => {
   
    const config = {
      headers: {
        
        Authorization: `Bearer ${await AsyncStorage.getItem("access")}`,
      },
    };
    try {
      const userDataGet = await axios.get("http://3.36.95.105/account/user/", config);
      console.log(JSON.stringify(userData));
      const nickname = userDataGet.data.user.nickname;
      const mode = userDataGet.data.user.mode;
      AsyncStorage.setItem("nickname", nickname);
      AsyncStorage.setItem("mode", mode);
      setUserData(userDataGet.data.user);
     
    } catch (error) {
      console.error(error);
      if (error.response && error.response.status === 401) {
        try {
          // await refreshAccessToken();
          console.log("fetchData 재시도");
          navigation.popToTop();
          // await fetchData();
        } catch (refreshError) {
          console.error("토큰 갱신 중 오류:", refreshError);
          navigation.popToTop();
        }
      }
    }
  };

  const refreshAccessToken = async () => {
    const body = {
      refresh: AsyncStorage.getItem("refresh"),
    };

    try {
      const response = await axios.post(
        "http://3.36.95.105/account/refresh/access_token/",
        body,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      const access = response.data.access;
      const refresh = response.data.refresh;

      AsyncStorage.setItem("access", access);
      AsyncStorage.setItem("refresh", refresh);
      console.log("success : refresh Access Token");
    } catch (error) {
      console.error("Error refreshing access token:", error);
      throw error; // 함수를 호출하는 곳에서 오류를 처리할 수 있도록 오류를 다시 던집니다.
    }
  };
  useEffect(() => {
    fetchData();
  }, []);

  // 본인확인된 모종의 부분이 있을거아냐 여기선 userData라고 가정.
  
  const handleContinue = async () => {
    // await AsyncStorage.setItem("nonmember", "nonmember");
    // navigation.navigate('Home');
    console.log("여기는 없는게 맞아. 비활성화");
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
            title = {userData.nickname}
            subTitle="으로 계속하시겠어요?"
            width="75%"
            height="100%"
          />
         ) : (
          <FaceModal
            userData={userData}
            navigation={navigation}
            headerTitle="본인확인"
            title = ""
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
        backgroundColor =  'rgba(5, 108, 242, 0.3)'
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