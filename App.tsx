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

      let fileToRead = bundleFile;

      if (Platform.OS === "ios") {
        addLog("iOS detected — copying file out of bundle (read-only)…");

        const destFile = FileSystem.documentDirectory + fileName;
        addLog(`Destination: ${destFile}`);

        const destInfo = await FileSystem.getInfoAsync(destFile);
        if (destInfo.exists) {
          addLog("Deleting old file from documentDirectory...");
          await FileSystem.deleteAsync(destFile);
        }

        await FileSystem.copyAsync({
          from: bundleFile,
          to: destFile,
        });

        addLog("Copy success!");
        fileToRead = destFile;
      } else {
        addLog(
          "Android detected — reading directly from bundle (no copy needed)."
        );
      }

      // Read content
      addLog("Reading file content...");
      const content = await FileSystem.readAsStringAsync(fileToRead, {
        encoding: "utf8",
      });

      addLog(`File Content: ${content}`);
      addLog("File read successfully!");
    } catch (error: any) {
      addLog(`Error: ${error.message}`);
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Native Bundle File Reader</Text>
        <Button
          title={loading ? "Processing..." : "Read Native File"}
          onPress={readNativeFile}
          disabled={loading}
        />
      </View>

      <ScrollView style={styles.logContainer}>
        {logs.map((log, i) => (
          <Text key={i} style={styles.logText}>
            {log}
          </Text>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F5F5F5" },
  header: {
    padding: 20,
    backgroundColor: "#fff",
    alignItems: "center",
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
    paddingTop: 50,
  },
  title: { fontSize: 20, fontWeight: "bold", marginBottom: 15 },
  logContainer: { flex: 1, padding: 15 },
  logText: {
    fontFamily: "monospace",
    fontSize: 12,
    color: "#333",
    backgroundColor: "#fff",
    padding: 10,
    borderRadius: 5,
    marginBottom: 8,
    borderLeftColor: "green",
    borderLeftWidth: 4,
  },
});
