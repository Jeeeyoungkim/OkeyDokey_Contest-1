import React, { useEffect } from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {NavigationContainer} from '@react-navigation/native';

import Home from './src/screens/Home';
import QCoffee from './src/screens/QCoffee';
import Qmilk from './src/screens/Qmilk';
import OrderCheck from './src/screens/OrderCheck';
import EasyMenu from './src/screens/EasyMenu';
import ShoppingBasket from './src/screens/ShoppingBasket';
import InputPhoneNum from './src/screens/InputPhoneNum'; //비회원 적립 화면
import Payment from './src/screens/Payment';
import OrderNum from './src/screens/OrderNum';
import {Provider} from 'react-redux';
import {store} from './src/redux/store';
import Welcome from './src/screens/Welcome';
import Identify from './src/screens/Identify';
import Favorites from './src/screens/Favorites';
import WebviewContainer from './src/pages/WebviewContainer';
import FaceRecognition from './src/pages/FaceReognition';
import {Camera, useCameraDevices} from 'react-native-vision-camera';
import AsyncStorage from '@react-native-async-storage/async-storage';
const Stack = createNativeStackNavigator();


const App = () => {

  useEffect(() => {
    async function getPermission() {
      console.log("getPermission");
      const newCameraPermission = await Camera.requestCameraPermission();
      console.log(`카메라 권한 ${newCameraPermission}`);
    }
    getPermission();
  }, []);

  useEffect(() => {
    clearAsyncStorage();
  },[]);

  const clearAsyncStorage = async () => {
  try {
      await AsyncStorage.clear();
      console.log('AsyncStorage cleared successfully.');
    } catch (error) {
      console.error('Error clearing AsyncStorage:', error);
    }
  };
  
  return (
    <NavigationContainer>
      <Provider store={store}>
        <Stack.Navigator screenOptions={{headerShown: false}}>
          <Stack.Screen name="Welcome" component={Welcome} />
          <Stack.Screen name="FaceRecognition" component={FaceRecognition} />
          <Stack.Screen name="Identify" component={Identify} />
          <Stack.Screen name="favorites" component={Favorites} />
          <Stack.Screen name="Home" component={Home} />
          <Stack.Screen name="QCoffee" component={QCoffee} />
          <Stack.Screen name="Qmilk" component={Qmilk} />
          <Stack.Screen name="EasyMenu" component={EasyMenu} />
          <Stack.Screen name="OrderCheck" component={OrderCheck} />
          <Stack.Screen name="ShoppingBasket" component={ShoppingBasket} />
          <Stack.Screen name="OrderNum" component={OrderNum} />
          <Stack.Screen name="WebviewContainer" component={WebviewContainer} />
          <Stack.Screen name="Payment" component={Payment} />
          <Stack.Screen name="InputPhoneNum" component={InputPhoneNum} />
        </Stack.Navigator>
      </Provider>
    </NavigationContainer>
  );
};
export default App;
