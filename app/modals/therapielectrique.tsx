import React, { useState } from 'react';
import { 
  View, 
  Text, 
  TouchableOpacity, 
  Modal, 
  StyleSheet, 
  Dimensions,
  ScrollView
} from 'react-native';

import { Feather, MaterialCommunityIcons } from '@expo/vector-icons';

const { width, height } = Dimensions.get('window');

interface TherapieElectriqueModalProps {
  visible: boolean;
  onClose: () => void;
  form: any;
  setForm: (form: any) => void;
}

export const TherapieElectriqueModal: React.FC<TherapieElectriqueModalProps> = ({ 
  visible, 
  onClose, 
  form, 
  setForm 
}) => {
  const [therapieElectrique, setTherapieElectrique] = useState<boolean | null>(
    form.therapieElectrique !== undefined ? form.therapieElectrique : null
  );

  const handleSelectOption = (option: boolean) => {
    setTherapieElectrique(option);
    setForm((prev: any) => ({
      ...prev,
      therapieElectrique: option
    }));
  };

  const handleConfirm = () => {
    onClose();
  };

  const handleReset = () => {
    setTherapieElectrique(null);
    setForm((prev: any) => ({
      ...prev,
      therapieElectrique: null
    }));
  };

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <View style={styles.centeredView}>
        <View style={styles.modalView}>
          {/* En-tête de la modal */}
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Thérapie Électrique</Text>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <Feather name="x" size={24} color="#64748b" />
            </TouchableOpacity>
          </View>

          <View style={styles.iconContainer}>
            <MaterialCommunityIcons name="lightning-bolt" size={40} color="#7e22ce" />
          </View>

          <Text style={styles.modalSubtitle}>
            Le patient a-t-il reçu une thérapie électrique?
          </Text>

          <View style={styles.optionsContainer}>
            <TouchableOpacity
              style={[
                styles.optionButton,
                therapieElectrique === true && styles.optionButtonSelected,
                { borderColor: '#16a34a' }
              ]}
              onPress={() => handleSelectOption(true)}
            >
              <View style={[
                styles.radioOuter,
                therapieElectrique === true && { borderColor: '#16a34a' }
              ]}>
                {therapieElectrique === true && (
                  <View style={[styles.radioInner, { backgroundColor: '#16a34a' }]} />
                )}
              </View>
              <Text style={styles.optionText}>Oui</Text>
              <Feather 
                name="check-circle" 
                size={24} 
                color={therapieElectrique === true ? '#16a34a' : '#d1d5db'} 
              />
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.optionButton,
                therapieElectrique === false && styles.optionButtonSelected,
                { borderColor: '#dc2626' }
              ]}
              onPress={() => handleSelectOption(false)}
            >
              <View style={[
                styles.radioOuter,
                therapieElectrique === false && { borderColor: '#dc2626' }
              ]}>
                {therapieElectrique === false && (
                  <View style={[styles.radioInner, { backgroundColor: '#dc2626' }]} />
                )}
              </View>
              <Text style={styles.optionText}>Non</Text>
              <Feather 
                name="x-circle" 
                size={24} 
                color={therapieElectrique === false ? '#dc2626' : '#d1d5db'} 
              />
            </TouchableOpacity>
          </View>

          {therapieElectrique !== null && (
            <ScrollView style={styles.detailsContainer}>
              <Text style={styles.detailsTitle}>
                Détails {therapieElectrique ? 'de la thérapie' : 'de l\'absence de thérapie'}
              </Text>
              
              {therapieElectrique ? (
                <View>
                  <Text style={styles.detailsText}>
                    • Type de thérapie électrique appliquée
                  </Text>
                  <Text style={styles.detailsText}>
                    • Durée du traitement
                  </Text>
                  <Text style={styles.detailsText}>
                    • Réponse du patient
                  </Text>
                  <Text style={styles.detailsText}>
                    • Paramètres utilisés
                  </Text>
                </View>
              ) : (
                <View>
                  <Text style={styles.detailsText}>
                    • Thérapie électrique non indiquée
                  </Text>
                  <Text style={styles.detailsText}>
                    • Raison de non-utilisation
                  </Text>
                  <Text style={styles.detailsText}>
                    • Alternative thérapeutique choisie
                  </Text>
                </View>
              )}
            </ScrollView>
          )}

          <View style={styles.buttonContainer}>
            <TouchableOpacity 
              style={[styles.button, styles.resetButton]} 
              onPress={handleReset}
              disabled={therapieElectrique === null}
            >
              <Text style={styles.resetButtonText}>Réinitialiser</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[styles.button, styles.confirmButton]} 
              onPress={handleConfirm}
            >
              <Text style={styles.confirmButtonText}>Confirmer</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

export const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalView: {
    width: width * 0.9,
    maxHeight: height * 0.7,
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1e293b',
    flex: 1,
  },
  closeButton: {
    padding: 4,
  },
  iconContainer: {
    alignItems: 'center',
    marginBottom: 15,
  },
  modalSubtitle: {
    fontSize: 16,
    color: '#64748b',
    textAlign: 'center',
    marginBottom: 20,
  },
  optionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  optionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 15,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#e5e7eb',
    marginHorizontal: 5,
    backgroundColor: '#f9fafb',
  },
  optionButtonSelected: {
    backgroundColor: '#f0f9ff',
  },
  radioOuter: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 2,
    borderColor: '#d1d5db',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  radioInner: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  optionText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#374151',
    flex: 1,
  },
  detailsContainer: {
    backgroundColor: '#f8fafc',
    borderRadius: 12,
    padding: 15,
    marginBottom: 20,
    maxHeight: 150,
  },
  detailsTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 10,
  },
  detailsText: {
    fontSize: 14,
    color: '#64748b',
    marginBottom: 5,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  button: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginHorizontal: 5,
  },
  resetButton: {
    backgroundColor: '#f1f5f9',
  },
  confirmButton: {
    backgroundColor: '#7e22ce',
  },
  resetButtonText: {
    color: '#64748b',
    fontWeight: '600',
  },
  confirmButtonText: {
    color: 'white',
    fontWeight: '600',
  },
});

export default TherapieElectriqueModal;