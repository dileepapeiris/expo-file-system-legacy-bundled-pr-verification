import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  SafeAreaView,
  Button,
  Platform,
} from "react-native";

import * as FileSystem from "expo-file-system/legacy";

export default function App() {
  const [logs, setLogs] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  const addLog = (msg: string) =>
    setLogs((prev) => [...prev, `[${new Date().toLocaleTimeString()}] ${msg}`]);

  const readNativeFile = async () => {
    setLogs([]);
    setLoading(true);

    try {
      addLog("Starting native-file read test...");

      const fileName = "example.txt";

      // Path inside the native bundle
      const bundleFile = FileSystem.bundleDirectory + fileName;
      addLog(`Bundle file: ${bundleFile}`);

      // Check if file exists in bundle
      const fileInfo = await FileSystem.getInfoAsync(bundleFile);
      if (!fileInfo.exists) {
        addLog("File not found in native bundle");
        return;
      }
  return (
  );
}

const styles = StyleSheet.create({
  },
});
