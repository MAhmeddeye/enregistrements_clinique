import React from "react";
import { PersonalInfoModalProps } from "@/lib/context";
import { Picker } from "@react-native-picker/picker";
import {
  Modal,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  KeyboardAvoidingView,
  Platform,
 
  StyleSheet,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import Ionicons from "react-native-vector-icons/Ionicons";

export const PersonalInfoModal = ({ visible, onClose, form, setForm }: PersonalInfoModalProps) => {
  const handleSave = () => {
    if (!form.nom || !form.age || !form.sexe) {
      alert("Veuillez remplir tous les champs obligatoires");
      return;
    }
    onClose();
  };

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <SafeAreaView style={{ flex: 1, width: "100%" }}>
          <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            style={styles.keyboardAvoid}
          >
            <View style={styles.modalContainer}>
              {/* Header */}
              <View style={styles.modalHeader}>
                <View style={styles.headerIconContainer}>
                  <FontAwesome name="user-md" size={24} color="#4A6FFF" />
                </View>
                <Text style={styles.modalTitle}>Informations Personnelles</Text>
                <TouchableOpacity
                  onPress={onClose}
                  style={styles.closeButton}
                  activeOpacity={0.7}
                >
                  <MaterialIcons name="close" size={24} color="#6B7280" />
                </TouchableOpacity>
              </View>

              {/* Contenu scrollable */}
              <ScrollView
                style={styles.modalContent}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.scrollContent}
                keyboardShouldPersistTaps="handled"
              >
                {/* Champ Nom */}
                <View style={styles.inputGroup}>
                  <View style={styles.labelContainer}>
                    <Ionicons name="person-outline" size={20} color="#4A6FFF" />
                    <Text style={styles.label}>Nom Patient *</Text>
                  </View>
                  <View style={styles.inputContainer}>
                    <TextInput
                      style={styles.input}
                      placeholder="Entrez le nom complet"
                      placeholderTextColor="#A1A8B9"
                      value={form.nom}
                      onChangeText={(t) => setForm({ ...form, nom: t })}
                      returnKeyType="next"
                    />
                  </View>
                </View>

                {/* Champ Âge */}
                <View style={styles.inputGroup}>
                  <View style={styles.labelContainer}>
                    <Ionicons name="calendar-outline" size={20} color="#4A6FFF" />
                    <Text style={styles.label}>Âge Patient *</Text>
                  </View>
                  <View style={styles.inputContainer}>
                    <TextInput
                      style={styles.input}
                      placeholder="Âge en années"
                      placeholderTextColor="#A1A8B9"
                      value={form.age}
                      onChangeText={(t) => setForm({ ...form, age: t })}
                      keyboardType="numeric"
                      returnKeyType="next"
                    />
                  </View>
                </View>

                {/* Champ Sexe */}
                <View style={styles.inputGroup}>
                  <View style={styles.labelContainer}>
                    <Ionicons name="male-female-outline" size={20} color="#4A6FFF" />
                    <Text style={styles.label}>Sexe *</Text>
                  </View>
                  <View style={styles.pickerContainer}>
                    <Picker
                      selectedValue={form.sexe}
                      onValueChange={(itemValue) => setForm({ ...form, sexe: itemValue })}
                      style={styles.picker}
                      dropdownIconColor="#6B7280"
                    >
                      <Picker.Item label="Sélectionner le sexe" value="" />
                      <Picker.Item label="Homme" value="Homme" />
                      <Picker.Item label="Femme" value="Femme" />
                    </Picker>
                  </View>
                </View>
              </ScrollView>

              {/* Footer */}
              <View style={styles.modalFooter}>
                <TouchableOpacity
                  style={[styles.modalButton, styles.secondaryButton]}
                  onPress={onClose}
                  activeOpacity={0.8}
                >
                  <Text style={styles.secondaryButtonText}>Annuler</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.modalButton, styles.primaryButton]}
                  onPress={handleSave}
                  activeOpacity={0.8}
                >
                  <MaterialIcons name="check" size={20} color="#FFF" />
                  <Text style={styles.primaryButtonText}>Enregistrer</Text>
                </TouchableOpacity>
              </View>
            </View>
          </KeyboardAvoidingView>
        </SafeAreaView>
      </View>
    </Modal>
  );
};


export const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "flex-end",
  },
  keyboardAvoid: {
    flex: 1,
  },
  modalContainer: {
    backgroundColor: "#FFFFFF",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: "90%",
    minHeight: "90%",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
  },
  modalHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#F1F3F9",
  },
  headerIconContainer: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "#F0F4FF",
    justifyContent: "center",
    alignItems: "center",
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#1A1F36",
    flex: 1,
    textAlign: "center",
    marginHorizontal: 10,
  },
  closeButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#F5F7FB",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
  },
  inputGroup: {
    marginBottom: 16,
  },
  labelContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 6,
  },
  label: {
    fontSize: 15,
    fontWeight: "600",
    color: "#1A1F36",
    marginLeft: 6,
  },
  inputContainer: {
    borderWidth: 1,
    borderColor: "#D1D7E2",
    borderRadius: 10,
    backgroundColor: "#FFFFFF",
    overflow: "hidden",
  },
  input: {
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 15,
    color: "#1A1F36",
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: "#D1D7E2",
    borderRadius: 10,
    backgroundColor: "#FFFFFF",
    overflow: "hidden",
  },
  picker: {
    paddingHorizontal: 12,
    color: "#1A1F36",
  },
  modalFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: "#F1F3F9",
    backgroundColor: "#FFFFFF",
    gap: 12,
  },
  modalButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 10,
    flex: 1,
  },
  primaryButton: {
    backgroundColor: "#42c6f5ff",
  },
  primaryButtonText: {
    color: "#FFFFFF",
    fontSize: 15,
    fontWeight: "600",
    marginLeft: 6,
  },
  secondaryButton: {
    backgroundColor: "#F5F7FB",
    borderWidth: 1,
    borderColor: "#D1D7E2",
  },
  secondaryButtonText: {
    color: "#6B7280",
    fontSize: 15,
    fontWeight: "600",
  },
});

export default PersonalInfoModal;