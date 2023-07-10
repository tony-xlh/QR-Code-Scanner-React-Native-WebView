import { StatusBar } from 'expo-status-bar';
import { WebView } from 'react-native-webview';
import { StyleSheet, Text, View } from 'react-native';

export default function App() {
  return (
    <WebView
      style={styles.container}
      allowsInlineMediaPlayback={true}
      source={{ uri: 'https://demo.dynamsoft.com/barcode-reader-js/' }}
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
