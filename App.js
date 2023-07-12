import { Alert, Button, Text, View, StyleSheet, Platform } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useState,useEffect,useRef } from 'react';
import { SafeAreaView, SafeAreaProvider  } from 'react-native-safe-area-context';

let QRCodeScanner;
const loadComponent = async () => {
  if (Platform.OS === "web") {
    const module = await import("./QRCodeScannerWeb");
    QRCodeScanner = module.default;
  }else{
    const module = await import("./QRCodeScanner");
    QRCodeScanner = module.default;
  }
  
}
loadComponent();

export default function App() {
  const [scanning,setScanning] = useState(false);

  const showResults = (results) => {
    let title = "Found " + results.length + ((results.length>1)?" results":" result")
    let message = "";
    for (let index = 0; index < results.length; index++) {
      const result = results[index];
      message = message + result.barcodeFormatString + ": " + result.barcodeText + "\n";
    }
    if (Platform.OS === "web"){
      alert(message);
    }else{
      Alert.alert(title,message);
    }
    setScanning(false);
  }

  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.container}>
        {scanning &&
          <QRCodeScanner
            onScanned={(results)=>showResults(results)}
            onClosed={()=>setScanning(false)}
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
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  title: {
    textAlign: 'center',
    marginVertical: 8,
  },
});
