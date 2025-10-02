import React, { useState } from 'react';
import { 
  View, 
  Text, 
  TouchableOpacity, 
  Modal, 
  StyleSheet, 
  ScrollView,
  Dimensions 
} from 'react-native';

import { MaterialIcons } from '@expo/vector-icons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';

const { width } = Dimensions.get('window');

interface InhalationTherapyModalProps {
  visible: boolean;
  onClose: () => void;
  form: any;
  setForm: (form: any) => void;
}

export default function InhalationTherapyModal({ 
  visible, 
  onClose, 
  form, 
  setForm 
}: InhalationTherapyModalProps) {
  const [inhalationTherapy, setInhalationTherapy] = useState<boolean | null>(
    form.inhalationTherapy !== undefined ? form.inhalationTherapy : null
  );

  const handleSave = () => {
    setForm({
      ...form,
      inhalationTherapy
    });
    onClose();
  };

  const handleReset = () => {
    setInhalationTherapy(null);
    setForm({
      ...form,
      inhalationTherapy: null
    });
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
    >
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          {/* En-tête du modal */}
          <View style={styles.modalHeader}>
            <View style={styles.headerIcon}>
              <FontAwesome name="medkit" size={24} color="#3b82f6" />
            </View>
            <Text style={styles.modalTitle}>Thérapie par Inhalation</Text>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <MaterialIcons name="close" size={24} color="#64748b" />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.modalBody}>
            <Text style={styles.modalDescription}>
              Le patient a-t-il reçu une thérapie par inhalation?
            </Text>

            <View style={styles.optionsContainer}>
              <TouchableOpacity 
                style={[
                  styles.optionButton,
                  inhalationTherapy === true && styles.optionSelected
                ]}
                onPress={() => setInhalationTherapy(true)}
              >
                <View style={styles.optionContent}>
                  <View style={[
                    styles.optionIconContainer,
                    { backgroundColor: inhalationTherapy === true ? '#dcfce7' : '#f1f5f9' }
                  ]}>
                    <MaterialIcons 
                      name="check" 
                      size={24} 
                      color={inhalationTherapy === true ? '#16a34a' : '#94a3b8'} 
                    />
                  </View>
                  <Text style={styles.optionText}>Oui</Text>
                </View>
                {inhalationTherapy === true && (
                  <View style={styles.selectedIndicator}>
                    <MaterialIcons name="check-circle" size={20} color="#16a34a" />
                  </View>
                )}
              </TouchableOpacity>

              <TouchableOpacity 
                style={[
                  styles.optionButton,
                  inhalationTherapy === false && styles.optionSelected
                ]}
                onPress={() => setInhalationTherapy(false)}
              >
                <View style={styles.optionContent}>
                  <View style={[
                    styles.optionIconContainer,
                    { backgroundColor: inhalationTherapy === false ? '#fee2e2' : '#f1f5f9' }
                  ]}>
                    <MaterialIcons 
                      name="close" 
                      size={24} 
                      color={inhalationTherapy === false ? '#dc2626' : '#94a3b8'} 
                    />
                  </View>
                  <Text style={styles.optionText}>Non</Text>
                </View>
                {inhalationTherapy === false && (
                  <View style={styles.selectedIndicator}>
                    <MaterialIcons name="check-circle" size={20} color="#16a34a" />
                  </View>
                )}
              </TouchableOpacity>
            </View>

            {inhalationTherapy !== null && (
              <View style={styles.statusContainer}>
                <Text style={styles.statusText}>
                  Statut: {inhalationTherapy ? 
                    <Text style={styles.statusYes}>Thérapie administrée</Text> : 
                    <Text style={styles.statusNo}>Aucune thérapie</Text>
                  }
                </Text>
              </View>
            )}
          </ScrollView>

          {/* Pied du modal avec boutons d'action */}
          <View style={styles.modalFooter}>
            <TouchableOpacity 
              style={styles.resetButton}
              onPress={handleReset}
            >
              <Text style={styles.resetButtonText}>Réinitialiser</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.saveButton}
              onPress={handleSave}
            >
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
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
    backgroundColor: '#f8fafc',
  },
  headerIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#dbeafe',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1e293b',
    flex: 1,
    marginLeft: 12,
  },
  closeButton: {
    padding: 4,
  },
  modalBody: {
    padding: 20,
  },
  modalDescription: {
    fontSize: 16,
    color: '#64748b',
    marginBottom: 24,
    textAlign: 'center',
  },
  optionsContainer: {
    marginBottom: 20,
  },
  optionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderRadius: 12,
    backgroundColor: '#f8fafc',
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  optionSelected: {
    borderColor: '#3b82f6',
    backgroundColor: '#eff6ff',
  },
  optionContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  optionIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  optionText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#334155',
  },
  selectedIndicator: {
    marginLeft: 8,
  },
  statusContainer: {
    padding: 16,
    backgroundColor: '#f1f5f9',
    borderRadius: 12,
    alignItems: 'center',
  },
  statusText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#334155',
  },
  statusYes: {
    color: '#16a34a',
    fontWeight: '600',
  },
  statusNo: {
    color: '#dc2626',
    fontWeight: '600',
  },
  modalFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: '#e2e8f0',
    backgroundColor: '#f8fafc',
  },
  resetButton: {
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 10,
    backgroundColor: '#f1f5f9',
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  resetButtonText: {
    color: '#64748b',
    fontWeight: '600',
  },
  saveButton: {
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 10,
    backgroundColor: '#3b82f6',
  },
  saveButtonText: {
    color: 'white',
    fontWeight: '600',
  },
});