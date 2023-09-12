import React, {useEffect, useState} from 'react';
import {useNavigation} from '@react-navigation/native';
import {
  Button,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  ScrollView,
  View,
} from 'react-native';
import Quiz from '../components/Quiz';
import CustomButton from '../components/CustomButton';
import Toggle from '../components/Toggle';
import Coffee from '../components/Coffee';
import {coffeeDatas} from './../components/datas';
import {useSelector} from 'react-redux';
import {useDispatch} from 'react-redux';
import {
  addShopping,
  deleteShopping,
  minusShopping,
  plusShopping,
  resetShopping,
} from '../redux/slices/shoppingSlice';

import API from '../API/api';
import axios from 'axios';
import QCoffee from './QCoffee';
import AsyncStorage from '@react-native-async-storage/async-storage';

const EasyMenu = ({navigation, route}) => {
  const shoppings = useSelector(state => state.shopping.shoppings);
  const dispatch = useDispatch();
  const {qCoffee, qMilk, qMilkid, whereScreen, settingEasy} = route.params;
  const [easy, seteasy] = useState(false);
  const [routereasy, setRoutereasy] = useState(false);
  const getEasy = () => {
    seteasy(!easy);
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


  const navigationQcoffee = () => {
    if (whereScreen === 'QCoffee') {
      navigation.pop();
    }
  };
  const navigationQmilk = () => {
    if(whereScreen === 'Qmilk'){
      navigation.pop();
    }
  }
  const navigationHome = () => {
    if(whereScreen === 'Home'){
      navigation.navigate('Home');
    }
  }
  //쉬운메뉴 response값
  const [drinkItem, setDrinkItem] = useState([]);

  const [totalPrice, setTotalPrice] = useState(0);

  //카테고리별 저장
  const [coffeeList, setCoffeeList] = useState([]);
  const [nonCoffeeList, setNonCoffeeList] = useState([]);
  const [adeList, setAdeList] = useState([]);
  const [smoothieList, setSmoothieList] = useState([]);
  const [teaList, setTeaList] = useState([]);

  // 어떤 카테고리인지
  const [category, setCategory] = useState([]);

  //일반메뉴 받아오기 함수
  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    if (coffeeList != []) {
      setCategory(coffeeList);
    }
  }, [coffeeList]);

  const fetchData = () => {
    axios
      .get('https://www.okdkkiosk.shop/menu/list/')
      .then(response => {
        setCoffeeList(response.data.find(item => item.name === '커피'));
        setNonCoffeeList(response.data.find(item => item.name === '논커피'));
        setAdeList(response.data.find(item => item.name === '에이드'));
        setSmoothieList(response.data.find(item => item.name === '스무디'));
        setTeaList(response.data.find(item => item.name === '티'));
        
        if (whereScreen === 'QCoffee') {
          getEasy();
        } else if (whereScreen === 'Qmilk') {
          getEasy();
        } else if (whereScreen === 'Home') {
          getEasy();
        }
      })
      .catch(error => {
        console.error(error);
      });
  };

  useEffect(() => {
    let newTotalPrice = 0;
    shoppings.forEach(item => {
      newTotalPrice += item.price * item.quantity;
    });
    setTotalPrice(newTotalPrice);
  }, [shoppings]);

  const fetchDataEasy = () => {
    API.get(`/menu/list/${qMilkid}`)
      .then(response => {
        console.log(response.data);
        setDrinkItem(response.data);
      })
      .catch(error => {
        console.log("fetchDataEasy(easymenu)에러"+ error);
      });
  };

  useEffect(() => {
    fetchDataEasy();
  }, []);

  const handleMinus = (id, quantity) => {
    if (quantity <= 1) return;
    else {
      dispatch(minusShopping(id));
    }
  };
  const handlePlus = id => {
    dispatch(plusShopping(id));
  };
  const handleDelete = id => {
    dispatch(deleteShopping(id));
  };

  // const { networkData } = await API.get("/menu/list/1/");
  // console.log(networkData);

  return (
    <View style={{flex: 1, backgroundColor: '#F5F7FB', alignItems: 'center'}}>
      <View style={styles.header}>
        
        <Image
          style={{width: 150, height: 50}}
          source={require('OkeyDokeyContest/assets/images/OkDkLogo.png')}
        />
      </View>
      <View
        style={{
          alignItems: 'center',
          justifyContent: 'center',
          width: '100%',
          position: 'relative',
        }}>
        <TouchableOpacity
          onPress={() => {
            navigation.popToTop();
            dispatch(resetShopping());
          }}
          style={{
            flexDirection: 'row',
            position: 'absolute',
            left: 30,
            borderColor: 'white',
            borderWidth: 1,
            paddingHorizontal: 15,
            paddingVertical: 10,
            borderRadius: 10,
            backgroundColor: '#056CF2',
          }}>
          <Text
            style={{
              fontSize: 20,
              fontWeight: 'bold',
              color: 'white',
            }}>
            처음으로
          </Text>
        </TouchableOpacity>
        <Toggle
          settingEasy={false}
          getEasy={getEasy}
          navigationQcoffee={navigationQcoffee}
          navigationQmilk={navigationQmilk}
          navigationHome={navigationHome}
          whereScreen={whereScreen}
        />
      </View>
      {/* easy값이 false가 되야 쉬운 메뉴 화면이 나타남. */}
      {!easy ? (
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
            {qMilk}
          </Text>
        </View>
      ) : (
        <View
          style={{
            width: '80%',
            flexDirection: 'row',
            justifyContent: 'space-around',
            marginTop: 25,
          }}>
          <TouchableOpacity
            style={styles.navItemWrap}
            onPress={() => setCategory(coffeeList)}>
            <Text
              style={[
                styles.navItem,
                {
                  backgroundColor:
                    category === coffeeList ? '#056CF2' : 'white',
                  color: category === coffeeList ? 'white' : 'black',
                },
              ]}>
              커피
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.navItemWrap}
            onPress={() => setCategory(nonCoffeeList)}>
            <Text
              style={[
                styles.navItem,
                {
                  backgroundColor:
                    category === nonCoffeeList ? '#056CF2' : 'white',
                  color: category === nonCoffeeList ? 'white' : 'black',
                },
              ]}>
              논커피
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.navItemWrap}
            onPress={() => setCategory(adeList)}>
            <Text
              style={[
                styles.navItem,
                {
                  backgroundColor: category === adeList ? '#056CF2' : 'white',
                  color: category === adeList ? 'white' : 'black',
                },
              ]}>
              에이드
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.navItemWrap}
            onPress={() => setCategory(smoothieList)}>
            <Text
              style={[
                styles.navItem,
                {
                  backgroundColor:
                    category === smoothieList ? '#056CF2' : 'white',
                  color: category === smoothieList ? 'white' : 'black',
                },
              ]}>
              스무디
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.navItemWrap}
            onPress={() => setCategory(teaList)}>
            <Text
              style={[
                styles.navItem,
                {
                  backgroundColor: category === teaList ? '#056CF2' : 'white',
                  color: category === teaList ? 'white' : 'black',
                },
              ]}>
              티
            </Text>
          </TouchableOpacity>
        </View>
      )}

      {!easy ? (
        <View style={{flex: 9, height: '100%'}}>
          <View style={styles.mid}>
            <View style={styles.midItemBox}>
              {drinkItem.map(item => {
                return (
                  
                    <Coffee
                      key={item.id}
                      navigation={navigation}
                      goto={'ShoppingBasket'}
                      coffeeImageWidth={140}
                      coffeeImageHeight={160}
                      style={styles.imageWrap}
                      imgsrc={item.image}
                      CoffeeName={item.name}
                      CoffeePrice={item.price}
                    />
                  
                );
              })}
            </View>
          </View>
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
      ) : (
        <View
          style={{
            flex: 9,
            height: '100%',
            width: '100%',
            flexDirection: 'column',
            alignItems: 'center',
          }}>
          <View
            style={{
              width: '80%',
              flexDirection: 'row',
              justifyContent: 'flex-start',
              alignItems: 'center',
              backgroundColor: 'white',
              height: '80%',
              flexWrap: 'wrap',
              elevation: 3,
              paddingHorizontal: 30,
            }}>
            {category.menues.map(item => {
              return (
                
                  <Coffee
                    navigation={navigation}
                    key={item.id}
                    goto={'EasyMenu'}
                    coffeeImageWidth={140}
                    coffeeImageHeight={160}
                    imgsrc={item.image}
                    CoffeeName={item.name}
                    CoffeePrice={item.price}
                  />
                
              );
            })}
          </View>
          <View
            style={{
              marginTop: 30,
              backgroundColor: 'white',
              width: '100%',
              paddingHorizontal: 20,
              flex: 1,
            }}>
            <Text
              style={{
                fontSize: 20,
                fontWeight: 'bold',
                color: 'black',
              }}>
              장바구니
            </Text>
            <View
              style={{
                flexDirection: 'row',
                flex: 1,
              }}>
              <ScrollView
                style={{
                  flex: 3 / 5,
                  flexDirection: 'column',
                }}>
                {shoppings.map(item => {
                  console.log('MAP에 붙일거임' + item);
                  return (
                    <View key={item.id}
                      style={{
                        width: '100%',
                        marginTop: 10,
                        backgroundColor: '#F5F7FB',
                        borderRadius: 10,
                        flexDirection: 'row',
                        paddingHorizontal: 10,
                        paddingVertical: 5,
                        position: 'relative',
                        alignItems: 'center',
                      }}>
                      <View
                        style={{
                          flexDirection: 'row',
                          flex:  3 / 6,
                        }}>
                        <Text
                          style={{
                            fontSize: 16,
                            color: 'black',
                            fontWeight: 'bold',
                          }}>
                          {item.ice ? '아이스' : '핫'}
                        </Text>
                        <Text
                          style={{
                            fontSize: 16,
                            marginRight: 10,
                            color: 'black',
                            fontWeight: 'bold',
                          }}>
                          {item.title}
                        </Text>
                      </View>

                      <View
                        style={{
                          flexDirection: 'row',
                          flex:  2 / 6,
                        }}>
                     
                        <Text
                          style={{
                           
                            fontSize: 16,
                            marginRight: 10,
                            color: 'black',
                            fontWeight: 'bold',
                          }}>
                          {item.size}
                        </Text>
                        <Text
                          style={{
                           
                            fontSize: 16,
                            marginRight: 10,
                            color: 'black',
                            fontWeight: 'bold',
                          }}>
                          {item.price}원
                        </Text>
                        <Text
                          style={{
                          
                            fontSize: 16,
                            color: 'black',
                            fontWeight: 'bold',
                          }}>
                          {item.quantity}잔
                        </Text>
                        </View>
          

                      <View
                        style={{
                          flexDirection: 'row',
                          flex: 1/6,
                        }}>
                        <CustomButton
                          width={20}
                          height={20}
                          backgroundColor={'#0583F2'}
                          title={'+'}
                          fontSize={10}
                          textColor={'white'}
                          onPress={() => handlePlus(item.id)}
                          borderRadius={20}
                          margin={5}
                        />
                        <CustomButton
                          width={20}
                          height={20}
                          backgroundColor={'#0583F2'}
                          title={'-'}
                          fontSize={10}
                          textColor={'white'}
                          onPress={() => handleMinus(item.id, item.quantity)}
                          borderRadius={20}
                          margin={5}
                        />
                        <CustomButton
                          width={20}
                          height={20}
                          backgroundColor={'#F25D07'}
                          title={'x'}
                          fontSize={10}
                          textColor={'white'}
                          onPress={() => handleDelete(item.id)}
                          borderRadius={20}
                          margin={5}
                        />
                      </View>
                    </View>
                  );
                })}
              </ScrollView>

              <View
                style={{
                  flex: 2 / 5,
                  paddingLeft: 5,
                  width: '100%',
                  height: '100%',
                  flexDirection: 'column',
                  textAlign: 'center',
                  alignItems: 'center',
                }}>
                <Text
                  style={{
                    flex: 1,
                    fontSize: 20,
                    fontWeight: 'bold',
                    color: 'black',
                  }}>
                  결제금액{'    '}
                  {totalPrice}원
                </Text>
                <CustomButton
                  width={'100%'}
                  height={'70%'}
                  backgroundColor={'#056CF2'}
                  title={'결제하기'}
                  fontSize={20}
                  textColor={'white'}
                  onPress={() => {
                    if (totalPrice != 0) {
                      navigation.push('InputPhoneNum');
                    }
                  }}
                />
              </View>
            </View>
          </View>
        </View>
      )}
    </View>
  );
};

export default EasyMenu;

const styles = StyleSheet.create({
  header: {
    flex: 1,
    backgroundColor: '#F5F7FB',
    alignItems: 'center',
    justifyContent: 'center',
  },
  navItemWrap: {
    flex: 1,
  },
  navItem: {
    backgroundColor: 'white',
    justifyContent: 'center',
    textAlign: 'center',
    paddingVertical: 20,
    alignItems: 'center',
    color: 'black',
    fontSize: 24,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    borderColor: '#B9B8B8',
    borderStyle: 'solid',
    borderWidth: 1,
  },
  mid: {
    flex: 1,
    height: '100%',
    marginTop: 20,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  midItemBox: {
    paddingHorizontal: 50,
    width: '80%',
    height: '80%',
    justifyContent: 'flex-start',
    alignContent: 'center',
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 30,

    backgroundColor: 'white',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.18,
    shadowRadius: 1.0,

    elevation: 3,
    marginBottom: 120,
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
  imageWrap: {
    flex: 2,
  },
});
