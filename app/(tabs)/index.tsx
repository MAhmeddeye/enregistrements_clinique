import React from "react";
import { SafeAreaView, ScrollView, Text, StyleSheet, View } from "react-native";

export default function DemandesScreen() {

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>📋 Liste des Demandes</Text>
      
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ecf0f1",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "center",
    marginVertical: 16,
    color: "#2c3e50",
  },
  listContainer: {
    paddingHorizontal: 16,
    paddingBottom: 20,
  },
  item: {
    backgroundColor: "#fff",
    padding: 16,
    marginBottom: 10,
    borderRadius: 8,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 3,
  },
  itemText: {
    fontSize: 16,
    color: "#34495e",
  },
});
