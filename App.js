import { WebView } from 'react-native-webview';
import { Alert, StyleSheet } from 'react-native';

export default function App() {
  return (
    <WebView
      style={styles.container}
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
