import { FormType } from '@/lib/types';
import React, { useState } from 'react';
import { TraitementModal } from "@/lib/context";
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  TextInput,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
 
} from 'react-native';
import { SafeAreaView } from "react-native-safe-area-context";
import Ionicons from 'react-native-vector-icons/Ionicons';

export const ModalTraitementAdminstre = ({ visible, onClose, form, setForm }: TraitementModal) =>  {
  const [medicament, setMedicament] = useState(form.medicament || '');
  const [voieAdministration, setVoieAdministration] = useState(form.voieAdministration || '');
  const [dose, setDose] = useState(form.dose || '');
  const [unite, setUnite] = useState(form.unite || 'mg');
  const [showUniteDropdown, setShowUniteDropdown] = useState(false);

 const handleSave = () => {
  if (!form.nom || !form.age || !form.sexe || !medicament || !voieAdministration || !dose) {
    alert("Veuillez remplir tous les champs obligatoires");
    return;
  }

  // Préparer un objet JSON
  const traitementData = {
    medicament,
    voieAdministration,
    dose,
    unite
  };

  // Stocker sous forme de string JSON dans le formulaire
  setForm({
    ...form,
    medicament: JSON.stringify(traitementData)
  });

  onClose();
};

  const unites = [
    { value: "mg", label: "mg" },
    { value: "g", label: "g" },
    { value: "mL", label: "mL" },
    { value: "µg", label: "µg" },
    { value: "UI", label: "UI" },
    { value: "cp", label: "cp" }
  ];

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <SafeAreaView style={styles.safeArea}>
          <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            style={styles.keyboardAvoid}
          >
            <View style={styles.modalContent}>
              {/* Header */}
              <View style={styles.modalHeader}>
                <View style={styles.headerContent}>
                  <View style={styles.titleContainer}>
                    <View style={styles.iconContainer}>
                      <Ionicons name="medical" size={24} color="#FFFFFF" />
                    </View>
                    <View>
                      <Text style={styles.modalTitle}>Traitement Administré</Text>
                      <Text style={styles.modalSubtitle}>Renseignez les détails du traitement</Text>
                    </View>
                  </View>
                  <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                    <Ionicons name="close" size={24} color="#6B7280" />
                  </TouchableOpacity>
                </View>
              </View>
              
              {/* Body */}
              <ScrollView style={styles.modalBody} showsVerticalScrollIndicator={false}>
                {/* Médicament */}
                <View style={styles.inputGroup}>
                  <View style={styles.labelContainer}>
                    <Ionicons name="flask" size={18} color="#3B82F6" />
                    <Text style={styles.label}>Médicament administré</Text>
                    <Text style={styles.required}>*</Text>
                  </View>
                  <TextInput
                    style={styles.input}
                    placeholder="Saisissez le nom du médicament"
                    placeholderTextColor="#9CA3AF"
                    value={medicament}
                    onChangeText={setMedicament}
                    returnKeyType="next"
                  />
                </View>

                {/* Voie d'administration → maintenant un simple TextInput */}
                <View style={styles.inputGroup}>
                  <View style={styles.labelContainer}>
                    <Ionicons name="navigate" size={18} color="#3B82F6" />
                    <Text style={styles.label}>Voie d'administration</Text>
                    <Text style={styles.required}>*</Text>
                  </View>
                  <TextInput
                    style={styles.input}
                    placeholder="Saisissez la voie d'administration"
                    placeholderTextColor="#9CA3AF"
                    value={voieAdministration}
                    onChangeText={setVoieAdministration}
                    returnKeyType="next"
                  />
                </View>

                {/* Dose */}
                <View style={styles.inputGroup}>
                  <View style={styles.labelContainer}>
                    <Ionicons name="speedometer" size={18} color="#3B82F6" />
                    <Text style={styles.label}>Dose administrée</Text>
                    <Text style={styles.required}>*</Text>
                  </View>
                  
                  <View style={styles.doseContainer}>
                    <View style={styles.doseInputWrapper}>
                      <TextInput
                        style={styles.doseInput}
                        placeholder="0.00"
                        placeholderTextColor="#9CA3AF"
                        value={dose}
                        onChangeText={setDose}
                        keyboardType="decimal-pad"
                        returnKeyType="done"
                      />
                    </View>
                    
                    <TouchableOpacity 
                      style={styles.uniteSelector}
                      onPress={() => setShowUniteDropdown(!showUniteDropdown)}
                    >
                      <Text style={styles.uniteText}>{unite}</Text>
                      <Ionicons 
                        name={showUniteDropdown ? "chevron-up" : "chevron-down"} 
                        size={16} 
                        color="#6B7280" 
                      />
                      
                      {showUniteDropdown && (
                        <View style={styles.uniteDropdown}>
                          {unites.map((item, index) => (
                            <TouchableOpacity
                              key={index}
                              style={[
                                styles.uniteOption,
                                unite === item.value && styles.uniteOptionSelected
                              ]}
                              onPress={() => {
                                setUnite(item.value);
                                setShowUniteDropdown(false);
                              }}
                            >
                              <Text style={[
                                styles.uniteOptionText,
                                unite === item.value && styles.uniteOptionTextSelected
                              ]}>
                                {item.label}
                              </Text>
                            </TouchableOpacity>
                          ))}
                        </View>
                      )}
                    </TouchableOpacity>
                  </View>
                </View>
              </ScrollView>
              
              {/* Footer */}
              <View style={styles.modalFooter}>
                <TouchableOpacity 
                  style={styles.cancelButton} 
                  onPress={onClose}
                >
                  <Text style={styles.cancelButtonText}>Annuler</Text>
                </TouchableOpacity>
                
                <TouchableOpacity 
                  style={styles.saveButton} 
                  onPress={handleSave}
                >
                  <Ionicons name="checkmark" size={20} color="#FFFFFF" />
                  <Text style={styles.saveButtonText}>Enregistrer</Text>
                </TouchableOpacity>
              </View>
            </View>
          </KeyboardAvoidingView>
        </SafeAreaView>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  safeArea: {
    flex: 1,
    width: "100%",
  },
  keyboardAvoid: {
    flex: 1,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    width: '95%',
    maxHeight: '90%',
    borderRadius: 20,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.25,
    shadowRadius: 20,
    elevation: 15,
  },
  modalHeader: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 24,
    paddingTop: 24,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: '#3B82F6',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1E293B',
    marginBottom: 2,
  },
  modalSubtitle: {
    fontSize: 14,
    color: '#64748B',
    fontWeight: '400',
  },
  closeButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F8FAFC',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 12,
  },
  modalBody: {
    padding: 24,
    maxHeight: '70%',
  },
  inputGroup: {
    marginBottom: 28,
  },
  labelContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  label: {
    marginLeft: 8,
    fontSize: 15,
    fontWeight: '600',
    color: '#374151',
  },
  required: {
    color: '#EF4444',
    marginLeft: 4,
    fontWeight: 'bold',
  },
  input: {
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    color: '#1F2937',
    backgroundColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  doseContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  doseInputWrapper: {
    flex: 2,
    marginRight: 12,
  },
  doseInput: {
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    color: '#1F2937',
    backgroundColor: '#FFFFFF',
    textAlign: 'center',
    fontWeight: '600',
  },
  uniteSelector: {
    flex: 1,
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
    borderRadius: 12,
    padding: 16,
    backgroundColor: '#FFFFFF',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  uniteText: {
    color: '#1F2937',
    fontSize: 16,
    fontWeight: '600',
  },
  uniteDropdown: {
    position: 'absolute',
    top: '100%',
    left: 0,
    right: 0,
    backgroundColor: '#FFFFFF',
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
    borderRadius: 12,
    zIndex: 10,
    marginTop: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 6,
  },
  uniteOption: {
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  uniteOptionSelected: {
    backgroundColor: '#F1F5F9',
  },
  uniteOptionText: {
    color: '#1F2937',
    fontSize: 14,
    textAlign: 'center',
  },
  uniteOptionTextSelected: {
    color: '#3B82F6',
    fontWeight: '600',
  },
  modalFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 24,
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
    backgroundColor: '#FFFFFF',
  },
  cancelButton: {
    flex: 1,
    padding: 16,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
    backgroundColor: '#FFFFFF',
    marginRight: 12,
    alignItems: 'center',
  },
  cancelButtonText: {
    color: '#64748B',
    fontWeight: '600',
    fontSize: 16,
  },
  saveButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    borderRadius: 12,
    backgroundColor: '#3B82F6',
    marginLeft: 12,
    shadowColor: '#3B82F6',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  saveButtonText: {
    color: '#FFFFFF',
    fontWeight: '600',
    fontSize: 16,
    marginLeft: 8,
  },
});

export default ModalTraitementAdminstre;
