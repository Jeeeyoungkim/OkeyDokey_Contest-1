import React, { useEffect, useRef } from 'react';
import { TouchableOpacity, View } from 'react-native';
import { WebView } from 'react-native-webview';
import { useSelector } from 'react-redux';
import {useNavigation} from '@react-navigation/native';

const WebviewContainer = () => {
  const navigation = useNavigation();
  const webviewRef = useRef(null);
  const orderNumber = useSelector(state => state.shopping.orderNumber); // 주문 번호
    const handleSendMessage = () => {
      const message = JSON.stringify({ type: orderNumber ? orderNumber : 0 });
      console.log('메시지' + message);
      console.log('메시지' + {message});
        webviewRef.current.postMessage(message);
      
    };


  const uri = { uri: 'https://receiptprinter.netlify.app' };

  return (
    <TouchableOpacity style={{ flex: 1 }} onPress={() => navigation.popToTop()}>
      <WebView
        ref={webviewRef}
        source={uri}
        javaScriptEnabled={true}
        allowUniversalAccessFromFileURLs
        allowFileAccess
        allowFileAccessFromFileURLs
        mixedContentMode="always"
        onLoad={() => {
          handleSendMessage();
        }}
      />
    </TouchableOpacity>
  );
};

export default WebviewContainer;
