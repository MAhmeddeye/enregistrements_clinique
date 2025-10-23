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
import { Ionicons, MaterialIcons, FontAwesome5 } from '@expo/vector-icons';

// Types pour TypeScript
interface HemorrhageControlModalProps {
  visible: boolean;
  onClose: () => void;
  form: FormType;  
  setForm: Dispatch<SetStateAction<FormType>>; 
}

export const HemorrhageControlModal: React.FC<HemorrhageControlModalProps> = ({ 
  visible, 
  onClose, 
  form, 
  setForm 
}) => {
  const [controlMethod, setControlMethod] = useState<string>(form.controleHemorragie || '');

  const handleValidate = () => {
    if (!controlMethod.trim()) {
      Alert.alert(
        "Champ requis",
        "Veuillez décrire la méthode de contrôle de l'hémorragie.",
        [{ text: "OK" }]
      );
      return;
    }

    setForm(prevForm => ({
      ...prevForm,
      controleHemorragie: controlMethod.trim()
    }));

    Alert.alert(
      "Succès 🎉",
      "Le contrôle d'hémorragie a été enregistré.",
      [{ 
        text: "OK", 
        onPress: () => onClose()
      }]
    );
  };

  const resetInput = () => {
    setControlMethod('');
    setForm(prevForm => ({
      ...prevForm,
      controleHemorragie: ''
    }));
  };

  const handleCloseWithoutSave = () => {
    onClose();
  };

  const quickExamples = [
    { 
      icon: "band-aid" as const, 
      text: "Bandage compressif - Bras droit",
      color: "#3b82f6"
    },
    { 
      icon: "first-aid" as const, 
      text: "Tourniquet - Cuisse gauche", 
      color: "#ef4444"
    },
    { 
      icon: "medkit" as const, 
      text: "Pansement hémostatique - Abdomen",
      color: "#10b981"
    },
    { 
      icon: "hand-holding-medical" as const, 
      text: "Compression directe - Plaie main",
      color: "#f59e0b"
    }
  ];

  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={visible}
      onRequestClose={handleCloseWithoutSave}
    >
      <SafeAreaView style={styles.centeredView}>
        <KeyboardAvoidingView 
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={styles.keyboardAvoidingView}
        >
          <View style={styles.modalView}>
            {/* En-tête avec dégradé */}
            <View style={styles.modalHeader}>
              <View style={styles.headerContent}>
                <View style={styles.headerIconContainer}>
                  <FontAwesome5 name="tint-slash" size={24} color="#fff" />
                </View>
                <View style={styles.headerTextContainer}>
                  <Text style={styles.modalTitle}>Contrôle Hémorragique</Text>
                  <Text style={styles.modalSubtitle}>
                    Méthode de contrôle utilisée
                  </Text>
                </View>
              </View>
              <TouchableOpacity 
                onPress={handleCloseWithoutSave} 
                style={styles.closeButton}
                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
              >
                <Ionicons name="close" size={24} color="#fff" />
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.modalBody} showsVerticalScrollIndicator={false}>
              {/* Section d'entrée principale */}
              <View style={styles.inputSection}>
                <View style={styles.inputHeader}>
                  <MaterialIcons name="healing" size={20} color="#dc2626" />
                  <Text style={styles.inputLabel}>
                    Description de la méthode *
                  </Text>
                </View>
                <TextInput
                  style={styles.textInput}
                  value={controlMethod}
                  onChangeText={setControlMethod}
                  placeholder="Ex: Bandage compressif sur bras droit, Tourniquet à la cuisse gauche, Pansement hémostatique..."
                  placeholderTextColor="#94a3b8"
                  multiline={true}
                  numberOfLines={4}
                  textAlignVertical="top"
                />
                <View style={styles.inputFooter}>
                  <Ionicons name="information-circle-outline" size={16} color="#64748b" />
                  <Text style={styles.inputHint}>
                    Décrivez précisément la méthode et la localisation
                  </Text>
                </View>
              </View>

              {/* Exemples rapides */}
              <View style={styles.examplesSection}>
                <View style={styles.examplesHeader}>
                  <Ionicons name="flash" size={18} color="#f59e0b" />
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
                      onPress={() => setControlMethod(example.text)}
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
                    controlMethod.trim() ? styles.statusComplete : styles.statusPending
                  ]}>
                    {controlMethod.trim() && (
                      <Ionicons name="checkmark" size={12} color="#fff" />
                    )}
                  </View>
                  <Text style={styles.statusText}>
                    {controlMethod.trim() ? "Complété" : "En attente"}
                  </Text>
                </View>
                <Text style={styles.charCount}>
                  {controlMethod.length}/500 caractères
                </Text>
              </View>
            </ScrollView>

            {/* Pied du modal */}
            <View style={styles.modalFooter}>
              <TouchableOpacity 
                style={[styles.button, styles.cancelButton]}
                onPress={handleCloseWithoutSave}
              >
                <Ionicons name="close" size={18} color="#64748b" />
                <Text style={styles.cancelButtonText}>Annuler</Text>
              </TouchableOpacity>

              <TouchableOpacity 
                style={[styles.button, styles.resetButton]}
                onPress={resetInput}
              >
                <Ionicons name="refresh" size={18} color="#64748b" />
                <Text style={styles.resetButtonText}>Effacer</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={[styles.button, styles.validateButton, !controlMethod.trim() && styles.buttonDisabled]}
                onPress={handleValidate}
                disabled={!controlMethod.trim()}
              >
                <Ionicons name="checkmark-done" size={18} color="#fff" />
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
    backgroundColor: 'rgba(15, 23, 42, 0.7)',
  },
  keyboardAvoidingView: {
    width: '100%',
    alignItems: 'center'
  },
  modalView: {
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 20,
    width: '90%',
    maxHeight: '85%',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 8
    },
    shadowOpacity: 0.25,
    shadowRadius: 20,
    elevation: 12,
    overflow: 'hidden',
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 24,
    backgroundColor: '#dc2626',
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  headerIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  headerTextContainer: {
    flex: 1,
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: '#fff',
    marginBottom: 4,
    letterSpacing: -0.5,
  },
  modalSubtitle: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.9)',
    fontWeight: '500',
  },
  closeButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
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
    backgroundColor: '#f8fafc',
    borderTopWidth: 1,
    borderTopColor: '#e2e8f0',
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
    backgroundColor: '#dc2626',
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

export default HemorrhageControlModal;