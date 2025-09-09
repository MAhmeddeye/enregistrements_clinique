import { PersonalInfoModalProps } from "@/lib/context";
import { Picker } from "@react-native-picker/picker";
import { Modal, ScrollView, Text, TextInput, TouchableOpacity, View, KeyboardAvoidingView, Platform } from "react-native";
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { styles } from "./stylepers";

export const PersonalInfoModal = ({ visible, onClose, form, setForm }: PersonalInfoModalProps) => {
  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <KeyboardAvoidingView 
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={styles.keyboardAvoid}
        >
          <View style={styles.personalInfoModal}>
            {/* En-tête avec dégradé de couleur et icône fermer */}
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Informations Personnelles</Text>
              <TouchableOpacity 
                onPress={onClose}
                style={styles.closeButton}
                activeOpacity={0.7}
              >
                <MaterialIcons name="close" size={24} color="#fff" />
              </TouchableOpacity>
            </View>

            <ScrollView 
              style={styles.modalContent}
              showsVerticalScrollIndicator={false}
            >
              <View style={styles.inputGroup}>
                <Text style={styles.label}>Nom Patient *</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Entrez le nom complet"
                  placeholderTextColor="#9CA3AF"
                  value={form.nom}
                  onChangeText={(t) => setForm({ ...form, nom: t })}
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.label}>Âge Patient *</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Âge en années"
                  placeholderTextColor="#9CA3AF"
                  value={form.age}
                  onChangeText={(t) => setForm({ ...form, age: t })}
                  keyboardType="numeric"
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.label}>Sexe *</Text>
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

            <View style={styles.modalFooter}>
              <TouchableOpacity 
                style={[styles.modalButton, styles.primaryButton]} 
                onPress={onClose}
                activeOpacity={0.8}
              >
                <Text style={styles.primaryButtonText}>Enregistrer</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={[styles.modalButton, styles.secondaryButton]} 
                onPress={onClose}
                activeOpacity={0.8}
              >
                <Text style={styles.secondaryButtonText}>Annuler</Text>
              </TouchableOpacity>
            </View>
          </View>
        </KeyboardAvoidingView>
      </View>
    </Modal>
  );
};