import React, { useEffect, useRef } from 'react';
import { View } from 'react-native';
import { WebView } from 'react-native-webview';
import { useSelector } from 'react-redux';

const WebviewContainer = () => {
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
    <View style={{ flex: 1 }}>
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
    </View>
  );
};

export default WebviewContainer;
