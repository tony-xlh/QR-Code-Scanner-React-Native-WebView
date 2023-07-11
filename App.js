import { Alert, Button, Text, View, StyleSheet, Platform } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import QRCodeScanner from './QRCodeScanner';
import { useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function App() {
  const [scanning,setScanning] = useState(false);
  
  const showResults = (results) => {
    let title = "Found " + results.length + ((results.length>1)?" results":" result")
    let message = "";
    for (let index = 0; index < results.length; index++) {
      const result = results[index];
      message = message + result.barcodeFormatString + ": " + result.barcodeText + "\n";
    }
    Alert.alert(title,message);
    setScanning(false);
  }
  return (
    <SafeAreaView style={styles.container}>
      {scanning &&
        <QRCodeScanner
          onScanned={(results)=>showResults(results)}
        ></QRCodeScanner>
      }
      {!scanning &&
        <View style={{alignItems:'center'}}>
          <Text style={styles.title}>
              Dynamsoft Barcode Reader Demo
            </Text>
          <Button title='Start QR Code Scanner' onPress={() => setScanning(true)}></Button>
        </View>
      }
      <StatusBar style="auto"/>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  title: {
    textAlign: 'center',
    marginTop: Platform.OS === "ios" ? 20 : 0,
    marginVertical: 8,
  },
});
