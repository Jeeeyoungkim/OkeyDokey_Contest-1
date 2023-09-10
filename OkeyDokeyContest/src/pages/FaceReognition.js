import React, {useEffect, useState, useRef} from 'react';
import {View, StyleSheet, Text, Image} from 'react-native';
import {Camera, useCameraDevices} from 'react-native-vision-camera';
import axios from 'axios';
import {useFocusEffect, useNavigation} from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import CustomButton from '../components/CustomButton';
import {resetShopping} from '../redux/slices/shoppingSlice';
import {TouchableOpacity} from 'react-native';
import { useDispatch } from 'react-redux';

const FaceRecognition = ({route}) => {
  const camera = useRef(null);
  const devices = useCameraDevices();
  const device = devices.front;
  const reRenderPage = route.params;
  const navigation = useNavigation();
  const [showCamera, setShowCamera] = useState(false);
  const [focusPage, setFocusPage] = useState(false);
  const mounted = useRef(true); // 추가: 컴포넌트 마운트 여부를 추적하기 위한 변수
  const [showText, setShowText] = useState(
    '오키도키로 키오스크를 편리하게 이용하세요! ',
  );
  let captureTimeout;
  const dispatch = useDispatch();
  //AsyncStorage는 비회원일때 비워주고, 회원일때 이페이지 다시오면 비워준다.
  const clearAsyncStorage = async () => {
    try {
      await AsyncStorage.clear();
      console.log('AsyncStorage cleared successfully.');
    } catch (error) {
      console.error('Error clearing AsyncStorage:', error);
    }
  };
  

  const handleContinue = async () => {
    clearAsyncStorage();
    await AsyncStorage.setItem("nonmember", "nonmember");
    navigation.navigate('Home');
  };

  useEffect(() => {
    dispatch(resetShopping());
    clearAsyncStorage();
  },[]);

  useFocusEffect(
    React.useCallback(() => {
      console.log('useCallback setFocus true');
      setShowCamera(true);
      setShowText('카메라 준비중...');
      setFocusPage(true);

      return () => {
        console.log('useCallback setFocus false');
        clearTimeout(captureTimeout);
        setShowCamera(false);
        setFocusPage(false);
      };
    }, []),
  );

  const handleCameraInitialized = async () => {
    try {
      autoCapture();
    } catch (err) {
      console.error(err);
    }
  };

  const Recapture = async () => {
    try {
      console.log('카매라 초기화 안되서 재촬영');
      autoCapture();
    } catch (err) {
      console.error(err);
    }
  };

  const autoCapture = async () => {
    console.log('autoCapture function');
    try {
      if (!showCamera) {
        // 카메라가 활성화되어 있지 않으면 촬영 시도하지 않음
        console.log('!showCamera에 걸림');
        return;
      }
      if (camera.current == null) {
        console.log('현재 카메라 Ref 없음');
        return;
      }

      console.log('takeSnapShot');
      setShowText('사진 촬영중 입니다...');
      const photo = await camera.current.takeSnapshot({});
      console.log(`사진촬영됐음, ${photo.path}`);
      const imageSource = photo.path;

      await sendPhotoToBackend(imageSource);
    } catch (error) {
      console.log('autoCapture 에러:', error);
      Recapture();
      return;
    }
  };

  // 카메라 재호출

  const sendPhotoToBackend = async imageSource => {
    if(focusPage){
    setShowText('얼굴 인식중 입니다...');
    let formdata = new FormData();
    formdata.append('image', {
      name: 'test.jpg',
      type: 'image/jpeg',
      uri: 'file://' + imageSource,
    });

    try {
      const response = await axios.post(
        'http://3.36.95.105/account/user/face/recognition/',
        formdata,
        {
          headers: {'Content-Type': 'multipart/form-data'},
          transformRequest: (data, headers) => {
            return data;
          },
        },
      );

      console.log(`성공 ${response.data}`);
      console.log(response);
      console.log('Access 토큰:', response.data.access);
      console.log('Refresh 토큰:', response.data.refresh);

      await AsyncStorage.setItem('access', response.data.access);
      await AsyncStorage.setItem('refresh', response.data.refresh);

      navigation.navigate('Identify');
      return;
    } catch (error) {
      console.log('😛 Error :', error);
      console.log('😛 Error :', error.message);
      if (error.response && error.response.status === 400) {
        setShowText('인식 실패... 재촬영 중');
        captureTimeout = setTimeout(() => {
          autoCapture();
        }, 300);
      }
      if (error.response && error.response.status === 401) {
        alert('회원가입 후 사진을 먼저 등록해주세요');
      }
    }
  };
}
  if (device == null) {
    return <Text>Camera not available</Text>;
  }

  return (
    <View style={styles.container}>
      <View style={{flex: 1, backgroundColor: 'white'}}>
        <View style={styles.header}>
          <Image
            style={{width: 150, height: 50, backgroundColor: 'white'}}
            source={require('OkeyDokeyContest/assets/images/OkDkLogo.png')}
          />
        </View>
      </View>
      <View
        style={{
          flex: 1,
          backgroundColor: '#D9D9D9BF',
          position: 'relative',
          zIndex: 1,
          height: 200,
          top: 50,
          right: 500,
        }}>
        <View style={styles.guideText}>
          <Text
            style={{
              color: '#000',
              fontFamily: 'Pretendard',
              fontSize: 40, // 수정: 숫자 값으로 변경
              fontStyle: 'normal',
              fontWeight: '700',
            }}>
            {showText}
          </Text>
          {/* <TouchableOpacity onPress={cameraReInit}
            style={{
              backgroundColor: '#D9D9D9',
              width: 120,
              height: 120,
            }}>
              <Text>카메라 재촬영</Text>
            </TouchableOpacity> */}
        </View>
      </View>

      {focusPage && (
        <View style={{position: 'relative', width: 1204, height: 900}}>
        {/* <View style={{position: 'relative', width: 600, height: 700}}> */}
          <View>
            <Text></Text>
          </View>
          <Camera
            ref={camera}
            style={{width: 1024, height: 1280}}
            device={device}
            isActive={showCamera}
            photo={true}
            onInitialized={handleCameraInitialized} // 카메라 초기화 후에 호출되는 콜백
          />
          <View
            style={{
              width: '100%',
              height: '100%',
              position: 'absolute',
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <Text style={{color: 'white'}}>정면을 응시해 주세요</Text>
          </View>
        </View>
      )}

      <CustomButton
        title={'비회원으로 계속하기'}
        onPress={handleContinue}
        width={'100%'}
        height={110}
        backgroundColor="#056CF2"
        textColor={'white'}
        fontSize={35}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    position: 'relative',
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    flex: 1,
    backgroundColor: 'white',
    flexDirection: 'row',

    alignItems: 'center',
    justifyContent: 'center',
  },
  guideText: {
    position: 'absolute',
    width: 1024,
    flex: 1,
    backgroundColor: 'rgba(217, 217, 217, 0.75)',
    flexDirection: 'row',
    height: 100,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default FaceRecognition;
