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
import {useDispatch, useSelector} from 'react-redux';
import {addOrderNumber, setIsPack} from '../redux/slices/shoppingSlice';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Home = ({route}) => {
  const [userMode, setUserMode] = useState(null);

  const receivedData = route.params;
  const shoppings = useSelector(state => state.shopping.shoppings);
  const dispatch = useDispatch();
  const navigation = useNavigation();

  console.log(receivedData);

  // 데이터를 받는 부분이 존재하겠지
  const [data, setData] = useState({
    eatin: `매장에서\n먹기`,
    takeout: '들고 가기',
  });


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

 useEffect(() => {
    async function fetchData() {
      const mode = await AsyncStorage.getItem('mode');
      console.log('Async Storage에 없는 값이 나와야해' +mode);
      if (mode === 'normal') {
        setUserMode(mode); // 'easy' 모드일 때만 초기화
      }
    }
    fetchData();
  }, []); // 빈 배열로 설정하여 한 번만 실행

  const goWelcome = () => {
    navigation.popToTop();
  }

  const handleHere = () => {
    if (receivedData) {
      navigation.navigate('favorites');
    } else {
      dispatch(setIsPack(false));
      dispatch(addOrderNumber());

      if (userMode === 'normal') {
        navigation.navigate('EasyMenu', {
          whereScreen: 'Home',
        });
        setUserMode(null);
      } else {
        navigation.push('QCoffee', {
          qdata: data.eatin,
        });
      }
    }
  };

  const handleTakeOut = () => {
    if (receivedData) {
      navigation.navigate('favorites');
    } else {
      dispatch(setIsPack(true));
      dispatch(addOrderNumber());
      if (userMode === 'normal') {
        navigation.navigate('EasyMenu', {
          whereScreen: 'Home',
        });
        setUserMode(null);
      } else {
        navigation.push('QCoffee', {
          qdata: data.takeout,
        });
      }
    }
  };
  // const handleNonMembers = () => {
  //   navigation.push('QCoffee', {
  //     qdata: '비회원',
  //   });
  // };
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
        style={{
          flex: 9,
          width: '100%',
          height: '100%',
          justifyContent: 'center',
          alignItems: 'center',
        }}>
        <View style={styles.mid}>
          <Quiz handleEvent={handleHere} QuizText={data.eatin} height={'90%'} />
          <Quiz
            handleEvent={handleTakeOut}
            QuizText={data.takeout}
            height={'90%'}
          />
        </View>
        
        <View style={{width: '100%', marginBottom: 150}}></View>
        <View style={{flexDirection: 'row'}}>
          <CustomButton
            title={'뒤로가기'}
            onPress={() => {
              navigation.pop();
            }}
            width={'100%'}
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

export default Home;

const styles = StyleSheet.create({
  header: {
    flex: 1,
    backgroundColor: '#F5F7FB',
    alignItems: 'center',
    justifyContent: 'center',
  },
  mid: {
    width: '80%',
    height: '50%',
    flex: 1,
    marginTop: 100,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 100,
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
