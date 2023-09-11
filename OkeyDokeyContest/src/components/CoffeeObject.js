import {TouchableOpacity, Image, StyleSheet, Text, View} from 'react-native';
import React, {useState} from 'react';
import Coffee from './Coffee';
import {useDispatch} from 'react-redux';
import {
  deleteShopping,
  minusShopping,
  plusShopping,
} from '../redux/slices/shoppingSlice';

const CoffeeObject = ({
  id,
  height,
  width,
  imageSize,
  title,
  price,
  imgsrc,
  quantity,
  ice,
  size,
  getQuantity,
}) => {
  const styles = StyleSheet.create({
    container: {
      width: width,
      height: height,
      flexDirection: 'row',
    },
    imageWrap: {
      flex: 2,
    },
    mainWrap: {
      flex: 3,
      flexDirection: 'row',
      height: '100%',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginLeft: 30,
    },
    mainMid: {
      flexDirection: 'column',
      height: '100%',
      justifyContent: 'space-around',
      alignItems: 'center',
    },
    mainRight: {
      fontSize: 25,
      fontWeight: 'bold',
      color: 'black',
    },
  });
  const dispatch = useDispatch();
  const handleMinus = () => {
    if (quantity <= 1) return;
    else if (getQuantity) getQuantity(quantity - 1);
    else {
      dispatch(minusShopping(id));
    }
  };

  const handlePlus = () => {
    if (getQuantity) getQuantity(quantity + 1);
    else {
      dispatch(plusShopping(id));
      console.log(id);
    }
  };

  const handleDelete = () => {
    dispatch(deleteShopping(id));
  };
  console.log(imgsrc);
  return (
    <View style={styles.container}>
      <Coffee
        backgroundImageSize={imageSize}
        coffeeImageWidth={150}
        coffeeImageHeight={180}
        style={styles.imageWrap}
        imgsrc={imgsrc}
      />
      <View style={styles.mainWrap}>
        {size ? (
          <>
            <View style={styles.mainMid}>
              <Text style={{fontSize: 25, fontWeight: 'bold', color: 'black'}}>
                {title}
              </Text>
              <Text style={{fontSize: 20, color: 'black'}}>{price}</Text>
              <Text style={{fontSize: 20, color: 'black'}}>{size}</Text>
              <Text style={{fontSize: 20, color: 'black'}}>
                {ice ? 'ICE' : 'HOT'}
              </Text>

              <View
                style={{
                  width: 120,
                  height: 40,
                  backgroundColor: '#D9D9D9',
                  flexDirection: 'row',
                  justifyContent: 'space-around',
                  alignItems: 'center',
                  borderRadius: 100,
                }}>
                <TouchableOpacity
                  onPress={handleMinus}
                  style={{
                    backgroundColor: 'white',
                    width: 30,
                    height: 30,
                    flexDirection: 'row',
                    justifyContent: 'center',
                    alignItems: 'center',
                    borderRadius: 100,
                    textAlign: 'center',
                  }}>
                  <Text
                    style={{
                      fontSize: 20,
                      fontWeight: 'bold',
                    }}>
                    -
                  </Text>
                </TouchableOpacity>
                <Text style={{fontSize: 20}}>{quantity}</Text>
                <TouchableOpacity
                  onPress={handlePlus}
                  style={{
                    backgroundColor: '#056CF2',
                    width: 30,
                    height: 30,
                    borderRadius: 100,
                    flexDirection: 'row',
                    justifyContent: 'center',
                    alignItems: 'center',
                    textAlign: 'center',
                  }}>
                  <Text
                    style={{
                      fontSize: 20,
                      color: 'white',
                      fontWeight: 'bold',
                    }}>
                    +
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
            <TouchableOpacity
              onPress={handleDelete}
              style={{
                backgroundColor: '#F25D07',
                width: 100,
                height: 40,
                justifyContent: 'center',
                alignItems: 'center',
                borderRadius: 20,
              }}>
              <Text
                style={{
                  color: 'white',
                  fontSize: 20,
                }}>
                삭제
              </Text>
            </TouchableOpacity>
          </>
        ) : (
          <>
            <View style={styles.mainMid}>
              <Text style={{fontSize: 25, fontWeight: 'bold', color: 'black'}}>
                {title}
              </Text>
              <View
                style={{
                  width: 120,
                  height: 40,
                  backgroundColor: '#D9D9D9',
                  flexDirection: 'row',
                  justifyContent: 'space-around',
                  alignItems: 'center',
                  borderRadius: 100,
                }}>
                <TouchableOpacity
                  onPress={handleMinus}
                  style={{
                    backgroundColor: 'white',
                    width: 30,
                    height: 30,
                    flexDirection: 'row',
                    justifyContent: 'center',
                    alignItems: 'center',
                    borderRadius: 100,
                    textAlign: 'center',
                  }}>
                  <Text
                    style={{
                      fontSize: 20,
                      fontWeight: 'bold',
                    }}>
                    -
                  </Text>
                </TouchableOpacity>
                <Text style={{fontSize: 20}}>{quantity}</Text>
                <TouchableOpacity
                  onPress={handlePlus}
                  style={{
                    backgroundColor: '#056CF2',
                    width: 30,
                    height: 30,
                    borderRadius: 100,
                    flexDirection: 'row',
                    justifyContent: 'center',
                    alignItems: 'center',
                    textAlign: 'center',
                  }}>
                  <Text
                    style={{
                      fontSize: 20,
                      color: 'white',
                      fontWeight: 'bold',
                    }}>
                    +
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
            <Text style={styles.mainRight}>{price}원</Text>
          </>
        )}
      </View>
    </View>
  );
};

export default CoffeeObject;
