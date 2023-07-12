import { WebView } from 'react-native-webview';
import { Alert, StyleSheet, View, Text } from 'react-native';
import { useState, useEffect } from 'react';
import { Camera } from 'expo-camera';

export default function QRCodeScanner(props) {
  const [hasPermission, setHasPermission] = useState(null);

  const encodedLicense = () => {
    return encodeURIComponent("DLS2eyJoYW5kc2hha2VDb2RlIjoiMTAwMjI3NzYzLVRYbFhaV0pRY205cVgyUmljZyIsIm1haW5TZXJ2ZXJVUkwiOiJodHRwczovL21sdHMuZHluYW1zb2Z0LmNvbSIsInN0YW5kYnlTZXJ2ZXJVUkwiOiJodHRwczovL3NsdHMuZHluYW1zb2Z0LmNvbSIsIm9yZ2FuaXphdGlvbklEIjoiMTAwMjI3NzYzIiwiY2hlY2tDb2RlIjotOTE5MTE2NzE3fQ==");
  }

  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === "granted");
    })();
  }, []);

  if (hasPermission === null) {
    return <View />;
  }
  if (hasPermission === false) {
    return <Text>No access to camera</Text>;
  }
  if (hasPermission) {
    return (
      <WebView
        style={styles.container}
        allowsInlineMediaPlayback={true}
        mediaPlaybackRequiresUserAction={false}
        onMessage={(event) => {
          if (!event.nativeEvent.data) {
            if (props.onClosed) {
              props.onClosed();
            }
          }else{
            if (props.onScanned) {
              const results = JSON.parse(event.nativeEvent.data)
              props.onScanned(results);
            }
          }
        }}
        source={{ uri: 'https://tony-xlh.github.io/Vanilla-JS-Barcode-Reader-Demos/React-Native-Webview/?startScan=true&license='+encodedLicense() }}
      />
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
