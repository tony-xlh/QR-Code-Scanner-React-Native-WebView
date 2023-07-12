import { useEffect, useRef, useState } from "react";
import { loadLibrary } from "./Utils";

export default function QRCodeScanner(props) {
  const enhancer = useRef(null);
  const reader = useRef(null);
  const container = useRef(null);
  const interval = useRef(null);
  const processing = useRef(false);
  const [status,setStatus] = useState("");
  useEffect(() => {
    const loadLibrariesAndInit = async () => {
      setStatus("Initializing...");
      await loadLibrary("https://cdn.jsdelivr.net/npm/dynamsoft-camera-enhancer@3.3.4/dist/dce.js","text/javascript");
      await loadLibrary("https://cdn.jsdelivr.net/npm/dynamsoft-javascript-barcode@9.6.20/dist/dbr.js","text/javascript");
      await init();
      setStatus("");
    }
    const init = async () => {
      Dynamsoft.DBR.BarcodeScanner.license = 'DLS2eyJoYW5kc2hha2VDb2RlIjoiMjAwMDAxLTE2NDk4Mjk3OTI2MzUiLCJvcmdhbml6YXRpb25JRCI6IjIwMDAwMSIsInNlc3Npb25QYXNzd29yZCI6IndTcGR6Vm05WDJrcEQ5YUoifQ=='; // one-day trial
      reader.current = await Dynamsoft.DBR.BarcodeScanner.createInstance();
      enhancer.current = await Dynamsoft.DCE.CameraEnhancer.createInstance();
      enhancer.current.on("played", (playCallbackInfo) => {
        console.log("camera started");
        startProcessingLoop();
      });
      enhancer.current.on("cameraClose", playCallBackInfo => {
        if (props.onClosed) {
          props.onClosed();
        }
        stopScan();
      });
      await enhancer.current.setUIElement(Dynamsoft.DCE.CameraEnhancer.defaultUIElementURL);
      container.current.appendChild(enhancer.current.getUIElement());
      startScan();
    }
    loadLibrariesAndInit();
  },[]);

  const startProcessingLoop = () => {
    stopProcessingLoop();
    interval.current = setInterval(captureAndDecode,100); // read barcodes
  }

  const stopProcessingLoop = () => {
    if (interval.current) {
      clearInterval(interval.current);
      interval.current = undefined;
    }
    processing.current = false;
  }

  async function captureAndDecode() {
    if (!enhancer.current || !reader.current) {
      return
    }
    if (enhancer.current.isOpen() === false) {
      return;
    }
    if (processing.current == true) {
      return;
    }
    processing.current = true; // set processing to true so that the next frame will be skipped if the processing has not completed.
    let frame = enhancer.current.getFrame();
    if (frame) {  
      let results = await reader.current.decode(frame);
      if (results.length > 0) {
        stopScan();
        if (props.onScanned) {
          props.onScanned(results);
        }
      }
      processing.current = false;
    }
  };

  const startScan = () => {
    if (!enhancer.current || !reader.current) {
      alert("Please wait for the initialization of Dynamsoft Barcode Reader");
      return;
    }
    enhancer.current.open(true); //start the camera
  }
    
  const stopScan = () => {
    stopProcessingLoop();
    enhancer.current.close(true);
  }

  return (
    <div>
      <div>{status}</div>
      <div ref={container} className="scanner" style={{position:"absolute",top:0,left:0,width:"100%",height:"100%"}}></div>
    </div>
  );
}
