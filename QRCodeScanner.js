import { WebView } from 'react-native-webview';
import { Alert, StyleSheet, View, Text } from 'react-native';
import { useState, useEffect } from 'react';
import { Camera } from 'expo-camera';

export default function QRCodeScanner(props) {
  const [hasPermission, setHasPermission] = useState(null);
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
          const results = JSON.parse(event.nativeEvent.data)
          if (props.onScanned) {
            props.onScanned(results);
          }
        }}
        source={{ uri: 'https://tony-xlh.github.io/Vanilla-JS-Barcode-Reader-Demos/React-Native-Webview/?startScan=true' }}
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