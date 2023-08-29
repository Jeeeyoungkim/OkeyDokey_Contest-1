import React, {useEffect, useState, useRef} from 'react';
import {View, StyleSheet, Text, Image} from 'react-native';
import {Camera, useCameraDevices} from 'react-native-vision-camera';
import axios from 'axios';
import {useFocusEffect, useNavigation} from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import CustomButton from '../components/CustomButton';

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
  const [textIndex, setTextIndex] = useState(0);
  const textVariations = [
    '카메라 촬영중.',
    '카메라 촬영중..',
    '카메라 촬영중...',
  ];
  const handleContinue = () => {
    navigation.navigate('Home');
  };

  useFocusEffect(
    React.useCallback(() => {
      setFocusPage(true);

      return () => {
        setFocusPage(false);
      };
    }, []),
  );
  useEffect(() => {
    mounted.current = true; // 컴포넌트 마운트됨을 표시
    return () => {
      mounted.current = false; // 컴포넌트 언마운트됨을 표시
    };
  }, []);
  useEffect(() => {
    async function getPermission() {
      const newCameraPermission = await Camera.requestCameraPermission();
      console.log(`카메라 권한 ${newCameraPermission}`);
    }
    getPermission();
  }, []);

   const handleCameraInitialized = async() => {
    setShowCamera(true);
    try {
      const interval = setInterval(() => {
        setTextIndex((prevIndex) => (prevIndex + 1) % textVariations.length);
      }, 1000); // 1초마다 텍스트 변경

      await autoCapture();

      clearInterval(interval); // 사진 촬영 완료 후 인터벌 제거
      setShowText(textVariations[0]); // 초기 텍스트로 변경
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    if (showCamera && focusPage) {
      autoCapture();
    }
  }, [showCamera, focusPage]);

  const autoCapture = async () => {
    try {
      if (camera.current == null) {
        console.log('현재 카메라 Ref 없음');
        return;
      }
  
      setShowText('카메라 촬영중...');
      const photo = await camera.current.takeSnapshot({});
      console.log(`사진촬영됐음, ${photo.path}`);
      const imageSource = photo.path;
  
      if (!mounted.current) {
        clearTimeout(captureTimeout);
        console.log('컴포넌트가 언마운트되어 작업을 중단합니다.');
        return;
      }
  
      setShowText('얼굴 인식중...');
      await sendPhotoToBackend(imageSource);
   
    } catch (error) {
      console.log('autoCapture 에러:', error);
  
    }
  };
  

  const sendPhotoToBackend = async imageSource => {
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
    } catch (error) {
      console.log('😛 Error :', error);
      console.log('😛 Error :', error.message);
      if (error.response && error.response.status === 401) {
        setShowText('얼굴인식 실패...');
        captureTimeout = setTimeout(() => {
          autoCapture();
        }, 1000);
      }
    }
  };

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
      <View style={{flex: 1, backgroundColor: '#D9D9D9BF'}}>
        <View style={styles.header}>
          <Text
            style={{
              color: '#000',
              fontFamily: 'Pretendard',
              fontSize: 20, // 수정: 숫자 값으로 변경
              fontStyle: 'normal',
              fontWeight: '700',
            }}>
            {textVariations[textIndex]}
          </Text>
          <View
            style={{
              backgroundColor: '#D9D9D9',
              width: 120,
              height: 120,
            }}></View>
        </View>
      </View>

      {focusPage && (
        <View style={{position: 'relative', width: 400, height: 500}}>
          <View>
            <Text></Text>
          </View>
          <Camera
            ref={camera}
            style={{width: 400, height: 500}}
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
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    flex: 1,
    backgroundColor: 'rgba(217, 217, 217, 0.75)',
    flexDirection: 'row',
    backgroundColor: 'white',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default FaceRecognition;
