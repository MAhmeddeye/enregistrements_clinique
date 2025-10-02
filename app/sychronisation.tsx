import React, { useEffect, useState } from "react";
import { Text, FlatList, StyleSheet, TouchableOpacity, TextInput, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import AsyncStorage from "@react-native-async-storage/async-storage";

type FormType = {
  nom: string;
  age: string;
  sexe: string;
  synced: boolean;
};

// 👉 Fonction pour récupérer les formulaires non synchronisés
const getUnsyncedForms = async (): Promise<FormType[]> => {
  try {
    const stored = await AsyncStorage.getItem("forms");
    const forms = stored ? JSON.parse(stored) : [];
    return forms.filter((f: any) => f.synced === false);
  } catch (error) {
    console.error("Erreur récupération données", error);
    return [];
  }
};

export default function UnsyncedFormsScreen() {
  const [unsyncedForms, setUnsyncedForms] = useState<FormType[]>([]);
  const [selectedForm, setSelectedForm] = useState<FormType | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      const data = await getUnsyncedForms();
      setUnsyncedForms(data);
    };
    fetchData();
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      {unsyncedForms.length === 0 ? (
        <Text style={styles.message}>✅ Toutes les données sont synchronisées</Text>
      ) : selectedForm ? (
        // 👉 Formulaire affiché quand on clique sur un enregistrement
        <View style={styles.formContainer}>
          <Text style={styles.formTitle}>📌 Détails du formulaire</Text>
          <TextInput
            style={styles.input}
            value={selectedForm.nom}
            editable={false}
            placeholder="Nom"
          />
          <TextInput
            style={styles.input}
            value={selectedForm.age}
            editable={false}
            placeholder="Âge"
          />
          <TextInput
            style={styles.input}
            value={selectedForm.sexe}
            editable={false}
            placeholder="Sexe"
          />

          <TouchableOpacity
            style={styles.backButton}
            onPress={() => setSelectedForm(null)}
          >
            <Text style={styles.backButtonText}>⬅️ Retour</Text>
          </TouchableOpacity>
        </View>
      ) : (
        // 👉 Liste des enregistrements
        <FlatList
          data={unsyncedForms}
          keyExtractor={(_, index) => index.toString()}
          renderItem={({ item, index }) => (
            <TouchableOpacity
              style={styles.button}
              onPress={() => setSelectedForm(item)}
            >
              <Text style={styles.buttonText}>Enregistrement {index + 1}</Text>
            </TouchableOpacity>
          )}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#f9f9f9",
  },
  button: {
    padding: 14,
    marginVertical: 6,
    backgroundColor: "#4CAF50",
    borderRadius: 8,
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 16,
  },
  message: {
    textAlign: "center",
    marginTop: 20,
    fontSize: 16,
    fontWeight: "500",
  },
  formContainer: {
    flex: 1,
    padding: 16,
    backgroundColor: "#fff",
    borderRadius: 8,
  },
  formTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 16,
    textAlign: "center",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
    backgroundColor: "#f2f2f2",
  },
  backButton: {
    marginTop: 20,
    padding: 12,
    backgroundColor: "#007BFF",
    borderRadius: 8,
    alignItems: "center",
  },
  backButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
});
