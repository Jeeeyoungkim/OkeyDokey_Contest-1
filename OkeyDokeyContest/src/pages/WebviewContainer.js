import React, { useEffect, useRef } from 'react';
import { View } from 'react-native';
import { WebView } from 'react-native-webview';
import { useSelector } from 'react-redux';

const WebviewContainer = () => {
  const webviewRef = useRef(null);
  const orderNumber = useSelector(state => state.shopping.orderNumber); // 주문 번호
  useEffect(() => {
    const handleSendMessage = () => {
      const message = JSON.stringify({ type: orderNumber ? orderNumber : 0 });
      if (webviewRef.current) {
        webviewRef.current.postMessage(message);
      }
    };
    handleSendMessage(); // handleSendMessage 함수 호출을 추가
  }, [orderNumber]);

  const uri = { uri: 'receiptprinter.netlify.app' };

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
      />
    </View>
  );
};

export default WebviewContainer;
