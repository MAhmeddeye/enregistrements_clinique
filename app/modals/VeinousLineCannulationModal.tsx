import React, { useState } from 'react';
import { 
  View, 
  Text, 
  TouchableOpacity, 
  Modal, 
  StyleSheet, 
  TextInput,
  Alert,
  ScrollView
} from 'react-native';
import { MaterialIcons, MaterialCommunityIcons } from '@expo/vector-icons';

interface VeinousLineCannulationModalProps {
  visible: boolean;
  onClose: () => void;
  form: any;
  setForm: (form: any) => void;
}

export default function VeinousLineCannulationModal({ 
  visible, 
  onClose, 
  form, 
  setForm 
}: VeinousLineCannulationModalProps) {
  const [cannulationInput, setCannulationInput] = useState<string>(form.venousCannulation || '');

  const handleSave = () => {
    if (!cannulationInput.trim()) {
      Alert.alert(
        "Champ requis",
        "Veuillez saisir les informations de cannulation veineuse.",
        [{ text: "OK" }]
      );
      return;
    }

    setForm({
      ...form,
      cannulationVeineuse: cannulationInput.trim()
    });
    
    Alert.alert(
      "Succès",
      "La cannulation veineuse a été enregistrée.",
      [{ text: "OK", onPress: onClose }]
    );
  };

  const handleReset = () => {
    setCannulationInput('');
    setForm({
      ...form,
      cannulationVeineuse: ''
    });
  };

  const handleClose = () => {
    onClose();
  };

  const quickExamples = [
    { 
      icon: "pipe" as const, 
      text: "Cathéter 18G - Avant-bras droit",
      color: "#3b82f6"
    },
    { 
      icon: "needle" as const, 
      text: "Cathéter 20G - Main gauche", 
      color: "#ef4444"
    },
    { 
      icon: "human-handsdown" as const, 
      text: "Cathéter 16G - Pli du coude",
      color: "#10b981"
    },
    { 
      icon: "arm-flex" as const, 
      text: "Cathéter 22G - Veine basilique",
      color: "#f59e0b"
    }
  ];

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={handleClose}
    >
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          {/* En-tête du modal */}
          <View style={styles.modalHeader}>
            <View style={styles.headerIcon}>
              <MaterialCommunityIcons name="needle" size={24} color="#3b82f6" />
            </View>
            <View style={styles.headerText}>
              <Text style={styles.modalTitle}>Cannulation Veineuse</Text>
              <Text style={styles.modalSubtitle}>Détails de la pose</Text>
            </View>
            <TouchableOpacity onPress={handleClose} style={styles.closeButton}>
              <MaterialIcons name="close" size={24} color="#64748b" />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.modalBody} showsVerticalScrollIndicator={false}>
            {/* Input principal */}
            <View style={styles.inputSection}>
              <View style={styles.inputHeader}>
                <MaterialCommunityIcons name="needle" size={20} color="#3b82f6" />
                <Text style={styles.inputLabel}>Description de la cannulation *</Text>
              </View>
              <TextInput
                style={styles.textInput}
                value={cannulationInput}
                onChangeText={setCannulationInput}
                placeholder="Ex: Cathéter 18G sur avant-bras droit, Cathéter 20G sur main gauche..."
                placeholderTextColor="#94a3b8"
                multiline={true}
                numberOfLines={4}
                textAlignVertical="top"
                autoFocus={true}
              />
              <View style={styles.inputFooter}>
                <MaterialIcons name="info" size={16} color="#64748b" />
                <Text style={styles.inputHint}>
                  Décrivez le calibre et l'emplacement
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
                    onPress={() => setCannulationInput(example.text)}
                  >
                    <MaterialCommunityIcons 
                      name={example.icon} 
                      size={16} 
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
                  cannulationInput.trim() ? styles.statusComplete : styles.statusPending
                ]}>
                  {cannulationInput.trim() && (
                    <MaterialIcons name="check" size={12} color="#fff" />
                  )}
                </View>
                <Text style={styles.statusText}>
                  {cannulationInput.trim() ? "Complété" : "En attente"}
                </Text>
              </View>
              <Text style={styles.charCount}>
                {cannulationInput.length}/200 caractères
              </Text>
            </View>
          </ScrollView>

          {/* Pied du modal avec boutons d'action */}
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
              onPress={handleReset}
            >
              <MaterialIcons name="refresh" size={18} color="#64748b" />
              <Text style={styles.resetButtonText}>Effacer</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[styles.button, styles.saveButton, !cannulationInput.trim() && styles.saveButtonDisabled]}
              onPress={handleSave}
              disabled={!cannulationInput.trim()}
            >
              <MaterialIcons name="check" size={18} color="white" />
              <Text style={styles.saveButtonText}>Enregistrer</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

export const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    padding: 20,
  },
  modalContent: {
    backgroundColor: 'white',
    borderRadius: 20,
    width: '100%',
    maxHeight: '80%',
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
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
  headerIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#dbeafe',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerText: {
    flex: 1,
    marginLeft: 12,
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
  saveButton: {
    backgroundColor: '#3b82f6',
    flex: 2,
  },
  saveButtonDisabled: {
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
  saveButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '700',
  },
});