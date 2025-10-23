import { FormType } from '@/lib/types';
import React, { Dispatch, SetStateAction, useState } from 'react';
import {
  View,
  Text,
  Modal,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView
} from 'react-native';
import { SafeAreaView } from "react-native-safe-area-context";
import { MaterialIcons, FontAwesome5 } from '@expo/vector-icons';

// Types pour TypeScript
interface DressingModalProps {
  visible: boolean;
  onClose: () => void;
  form: FormType;  
  setForm: Dispatch<SetStateAction<FormType>>; 
}

const PansementModal: React.FC<DressingModalProps> = ({ visible, onClose, form, setForm }) => {
  const [dressingInput, setDressingInput] = useState<string>(form.pansement || '');

  const handleValidate = () => {
    if (!dressingInput.trim()) {
      Alert.alert(
        "Champ requis",
        "Veuillez décrire le pansement appliqué.",
        [{ text: "OK" }]
      );
      return;
    }

    // Sauvegarder les données dans le formulaire principal
    setForm(prev => ({
      ...prev,
      pansement: dressingInput.trim()
    }));

    Alert.alert(
      "Succès ✅", 
      "Le pansement a été enregistré.",
      [{ text: "OK", onPress: onClose }]
    );
  };

  const resetInput = () => {
    setDressingInput('');
    setForm(prev => ({
      ...prev,
      pansement: ''
    }));
  };

  const handleClose = () => {
    onClose();
  };

  const quickExamples = [
    { 
      icon: "band-aid" as const, 
      text: "Pansement compressif - Avant-bras droit",
      color: "#ef4444"
    },
    { 
      icon: "shield-alt" as const, 
      text: "Pansement sec - Main gauche", 
      color: "#3b82f6"
    },
    { 
      icon: "tint" as const, 
      text: "Pansement humide - Jambe droite",
      color: "#10b981"
    },
    { 
      icon: "star" as const, 
      text: "Pansement hydrocolloïde - Dos",
      color: "#f59e0b"
    }
  ];

  return (
    <Modal animationType="slide" transparent={true} visible={visible} onRequestClose={handleClose}>
      <SafeAreaView style={styles.centeredView}>
        <KeyboardAvoidingView 
          behavior={Platform.OS === "ios" ? "padding" : "height"} 
          style={styles.keyboardAvoidingView}
        >
          <View style={styles.modalView}>
            {/* En-tête */}
            <View style={styles.modalHeader}>
              <View style={styles.headerContent}>
                <View style={styles.headerIcon}>
                  <FontAwesome5 name="band-aid" size={24} color="#3b82f6" />
                </View>
                <View style={styles.headerText}>
                  <Text style={styles.modalTitle}>Application de Pansement</Text>
                  <Text style={styles.modalSubtitle}>Décrivez le pansement appliqué</Text>
                </View>
              </View>
              <TouchableOpacity onPress={handleClose} style={styles.closeButton}>
                <MaterialIcons name="close" size={24} color="#64748b" />
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.modalBody} showsVerticalScrollIndicator={false}>
              {/* Section d'entrée principale */}
              <View style={styles.inputSection}>
                <View style={styles.inputHeader}>
                  <MaterialIcons name="healing" size={20} color="#3b82f6" />
                  <Text style={styles.inputLabel}>Description du pansement *</Text>
                </View>
                <TextInput
                  style={styles.textInput}
                  value={dressingInput}
                  onChangeText={setDressingInput}
                  placeholder="Ex: Pansement compressif sur avant-bras droit, Pansement sec sur main gauche, Pansement hydrocolloïde 10x10 cm..."
                  placeholderTextColor="#94a3b8"
                  multiline={true}
                  numberOfLines={4}
                  textAlignVertical="top"
                  autoFocus={true}
                />
                <View style={styles.inputFooter}>
                  <MaterialIcons name="info" size={16} color="#64748b" />
                  <Text style={styles.inputHint}>
                    Décrivez le type, la localisation et les caractéristiques
                  </Text>
                </View>
              </View>

              {/* Exemples rapides */}
              <View style={styles.examplesSection}>
                <View style={styles.examplesHeader}>
                  <MaterialIcons name="flash-on" size={18} color="#f59e0b" />
                  <Text style={styles.examplesTitle}>Exemples rapides</Text>
                </View>
                <Text style={styles.examplesSubtitle}>
                  Cliquez pour insérer un exemple
                </Text>
                <View style={styles.examplesGrid}>
                  {quickExamples.map((example, index) => (
                    <TouchableOpacity 
                      key={index}
                      style={[styles.exampleButton, { borderLeftColor: example.color }]}
                      onPress={() => setDressingInput(example.text)}
                    >
                      <FontAwesome5 
                        name={example.icon} 
                        size={14} 
                        color={example.color} 
                        style={styles.exampleIcon}
                      />
                      <Text style={styles.exampleText}>{example.text}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              {/* Indicateur de statut */}
              <View style={styles.statusIndicator}>
                <View style={styles.statusItem}>
                  <View style={[
                    styles.statusDot, 
                    dressingInput.trim() ? styles.statusComplete : styles.statusPending
                  ]}>
                    {dressingInput.trim() && (
                      <MaterialIcons name="check" size={12} color="#fff" />
                    )}
                  </View>
                  <Text style={styles.statusText}>
                    {dressingInput.trim() ? "Complété" : "En attente"}
                  </Text>
                </View>
                <Text style={styles.charCount}>
                  {dressingInput.length}/300 caractères
                </Text>
              </View>
            </ScrollView>

            {/* Pied du modal */}
            <View style={styles.modalFooter}>
              <TouchableOpacity 
                style={[styles.button, styles.cancelButton]}
                onPress={handleClose}
              >
                <MaterialIcons name="close" size={18} color="#64748b" />
                <Text style={styles.cancelButtonText}>Annuler</Text>
              </TouchableOpacity>

              <TouchableOpacity 
                style={[styles.button, styles.resetButton]}
                onPress={resetInput}
              >
                <MaterialIcons name="refresh" size={18} color="#64748b" />
                <Text style={styles.resetButtonText}>Effacer</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={[styles.button, styles.validateButton, !dressingInput.trim() && styles.buttonDisabled]}
                onPress={handleValidate}
                disabled={!dressingInput.trim()}
              >
                <MaterialIcons name="check" size={18} color="#fff" />
                <Text style={styles.validateButtonText}>Enregistrer</Text>
              </TouchableOpacity>
            </View>
          </View>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </Modal>
  );
};

export const styles = StyleSheet.create({
  centeredView: { 
    flex: 1, 
    justifyContent: 'center', 
    alignItems: 'center', 
    backgroundColor: 'rgba(0, 0, 0, 0.5)' 
  },
  keyboardAvoidingView: { 
    width: '100%', 
    alignItems: 'center' 
  },
  modalView: { 
    margin: 20, 
    backgroundColor: 'white', 
    borderRadius: 20, 
    padding: 0,
    width: '90%', 
    maxHeight: '85%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 12,
    elevation: 8,
    overflow: 'hidden'
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 24,
    backgroundColor: '#f0f9ff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0f2fe',
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  headerIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#dbeafe',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  headerText: {
    flex: 1,
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: '#1e40af',
    marginBottom: 2,
  },
  modalSubtitle: {
    fontSize: 14,
    color: '#3b82f6',
    fontWeight: '500',
  },
  closeButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#f1f5f9',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalBody: {
    padding: 24,
    maxHeight: 400,
  },
  inputSection: {
    marginBottom: 28,
  },
  inputHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1e293b',
    marginLeft: 8,
  },
  textInput: {
    borderWidth: 2,
    borderColor: '#e2e8f0',
    borderRadius: 16,
    padding: 16,
    fontSize: 16,
    backgroundColor: '#f8fafc',
    minHeight: 120,
    textAlignVertical: 'top',
    color: '#1e293b',
    lineHeight: 22,
  },
  inputFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
  },
  inputHint: {
    fontSize: 13,
    color: '#64748b',
    marginLeft: 6,
    fontStyle: 'italic',
  },
  examplesSection: {
    marginBottom: 24,
  },
  examplesHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  examplesTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1e293b',
    marginLeft: 8,
  },
  examplesSubtitle: {
    fontSize: 13,
    color: '#64748b',
    marginBottom: 12,
  },
  examplesGrid: {
    gap: 10,
  },
  exampleButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8fafc',
    padding: 14,
    borderRadius: 12,
    borderLeftWidth: 4,
    borderWidth: 1,
    borderColor: '#f1f5f9',
  },
  exampleIcon: {
    marginRight: 10,
  },
  exampleText: {
    fontSize: 13,
    color: '#475569',
    fontWeight: '500',
    flex: 1,
    lineHeight: 16,
  },
  statusIndicator: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#f1f5f9',
    borderRadius: 12,
    marginTop: 8,
  },
  statusItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusDot: {
    width: 20,
    height: 20,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },
  statusPending: {
    backgroundColor: '#94a3b8',
  },
  statusComplete: {
    backgroundColor: '#10b981',
  },
  statusText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#475569',
  },
  charCount: {
    fontSize: 12,
    color: '#64748b',
    fontWeight: '500',
  },
  modalFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: '#e2e8f0',
    backgroundColor: '#f8fafc',
    gap: 8,
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
    gap: 6,
    minHeight: 44,
  },
  cancelButton: {
    backgroundColor: '#f1f5f9',
    borderWidth: 1.5,
    borderColor: '#e2e8f0',
    flex: 1,
  },
  resetButton: {
    backgroundColor: '#fff',
    borderWidth: 1.5,
    borderColor: '#e2e8f0',
    flex: 1,
  },
  validateButton: {
    backgroundColor: '#3b82f6',
    flex: 2,
  },
  buttonDisabled: {
    backgroundColor: '#cbd5e1',
  },
  cancelButtonText: {
    color: '#64748b',
    fontSize: 14,
    fontWeight: '600',
  },
  resetButtonText: {
    color: '#475569',
    fontSize: 14,
    fontWeight: '600',
  },
  validateButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '700',
  },
});

export default PansementModal;