import { WebView } from 'react-native-webview';
import { Alert, StyleSheet, View, Text } from 'react-native';
import { useState, useEffect } from 'react';
import { Camera } from 'expo-camera';

export default function App() {
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
        originWhitelist={['*']}
        javaScriptEnabled={true}
        androidHardwareAccelerationDisabled={true}
        mediaCapturePermissionGrantType={true}
        allowsInlineMediaPlayback={true}
        mediaPlaybackRequiresUserAction={false}
        onMessage={(event) => {
          const results = JSON.parse(event.nativeEvent.data)
          let title = "Found " + results.length + ((results.length>1)?" results":" result")
          let message = "";
          for (let index = 0; index < results.length; index++) {
            const result = results[index];
            message = message + result.barcodeFormatString + ": " + result.barcodeText + "\n";
          }
          Alert.alert(title,message);
        }}
        source={{ uri: 'https://tony-xlh.github.io/Vanilla-JS-Barcode-Reader-Demos/React-Native-Webview/' }}
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
