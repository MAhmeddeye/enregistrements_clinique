import { FormType } from '@/lib/types';
import React, { Dispatch, SetStateAction, useState } from 'react';
import {
  View,
  Text,
  Modal,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
  
} from 'react-native';
import { SafeAreaView } from "react-native-safe-area-context";

// Types pour TypeScript
interface VentilationModalProps {
  visible: boolean;
  onClose: () => void;
  form: FormType;  
    setForm: Dispatch<SetStateAction<FormType>>; 
}

type VentilationOption = 'ambu' | 'scellement' | 'drainage';

interface SelectedOptions {
  ambu: boolean;
  scellement: boolean;
  drainage: boolean;
}

export const VentilationModal: React.FC<VentilationModalProps> = ({ visible, onClose }) => {
  const [selectedOptions, setSelectedOptions] = useState<SelectedOptions>({
    ambu: false,
    scellement: false,
    drainage: false
  });

  const toggleOption = (option: VentilationOption) => {
    // Vérifier combien d'options sont déjà sélectionnées
    const selectedCount = Object.values(selectedOptions).filter(val => val).length;
    
    if (selectedOptions[option]) {
      // Désélectionner une option déjà cochée
      setSelectedOptions({
        ...selectedOptions,
        [option]: false
      });
    } else if (selectedCount < 2) {
      // Sélectionner une nouvelle option (max 2)
      setSelectedOptions({
        ...selectedOptions,
        [option]: true
      });
    } else {
      // Afficher une alerte si on essaie de sélectionner plus de 2 options
      Alert.alert(
        "Limite atteinte",
        "Vous ne pouvez sélectionner que deux options maximum.",
        [{ text: "OK" }]
      );
    }
  };

  const handleValidate = () => {
    const selectedCount = Object.values(selectedOptions).filter(val => val).length;
    
    if (selectedCount === 2) {
      Alert.alert(
        "Options validées",
        `Vous avez sélectionné: ${getSelectedOptionsText()}`,
        [{ text: "OK", onPress: onClose }]
      );
    } else {
      Alert.alert(
        "Sélection incomplète",
        "Veuillez sélectionner exactement deux options.",
        [{ text: "OK" }]
      );
    }
  };

  const getSelectedOptionsText = (): string => {
    const selected: string[] = [];
    if (selectedOptions.ambu) selected.push("Ventilation avec AMBU");
    if (selectedOptions.scellement) selected.push("Scellement de plaie thoracique");
    if (selectedOptions.drainage) selected.push("Ponction au drainage thoracique");
    return selected.join(", ");
  };

  const resetSelection = () => {
    setSelectedOptions({
      ambu: false,
      scellement: false,
      drainage: false
    });
  };

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <SafeAreaView style={styles.centeredView}>
        <View style={styles.modalView}>
          <Text style={styles.modalTitle}>Gestion de Ventilation</Text>
          <Text style={styles.modalSubtitle}>Sélectionnez deux options</Text>
          
          <View style={styles.selectionInfo}>
            <Text style={styles.selectionInfoText}>
              Sélectionnées: {Object.values(selectedOptions).filter(val => val).length}/2
            </Text>
          </View>
          
          <ScrollView style={styles.optionsContainer}>
            <TouchableOpacity 
              style={[
                styles.optionButton, 
                selectedOptions.ambu && styles.optionButtonSelected
              ]}
              onPress={() => toggleOption('ambu')}
            >
              <Text style={styles.optionIcon}>🫁</Text>
              <View style={styles.optionTextContainer}>
                <Text style={[
                  styles.optionText,
                  selectedOptions.ambu && styles.optionTextSelected
                ]}>
                  Ventilation avec AMBU
                </Text>
                <Text style={styles.optionDescription}>
                  Masque de poche (ballon auto-remplisseur)
                </Text>
              </View>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[
                styles.optionButton, 
                selectedOptions.scellement && styles.optionButtonSelected
              ]}
              onPress={() => toggleOption('scellement')}
            >
              <Text style={styles.optionIcon}>🩹</Text>
              <View style={styles.optionTextContainer}>
                <Text style={[
                  styles.optionText,
                  selectedOptions.scellement && styles.optionTextSelected
                ]}>
                  Scellement de plaie thoracique
                </Text>
                <Text style={styles.optionDescription}>
                  Fermeture d'une plaie thoracique ouverte
                </Text>
              </View>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[
                styles.optionButton, 
                selectedOptions.drainage && styles.optionButtonSelected
              ]}
              onPress={() => toggleOption('drainage')}
            >
              <Text style={styles.optionIcon}>💉</Text>
              <View style={styles.optionTextContainer}>
                <Text style={[
                  styles.optionText,
                  selectedOptions.drainage && styles.optionTextSelected
                ]}>
                  Ponction au drainage thoracique
                </Text>
                <Text style={styles.optionDescription}>
                  Évacuation d'air ou de liquide de la plèvre
                </Text>
              </View>
            </TouchableOpacity>
          </ScrollView>
          
          <View style={styles.buttonContainer}>
            <TouchableOpacity 
              style={[styles.button, styles.resetButton]}
              onPress={resetSelection}
            >
              <Text style={styles.buttonText}>Réinitialiser</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[styles.button, styles.validateButton]}
              onPress={handleValidate}
            >
              <Text style={styles.buttonText}>Valider</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[styles.button, styles.closeButton]}
              onPress={onClose}
            >
              <Text style={styles.buttonText}>Fermer</Text>
            </TouchableOpacity>
          </View>
        </View>
      </SafeAreaView>
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
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 25,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    width: '90%',
    maxHeight: '80%'
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 5,
    color: '#2c3e50',
    textAlign: 'center'
  },
  modalSubtitle: {
    fontSize: 16,
    marginBottom: 20,
    color: '#7f8c8d',
    textAlign: 'center'
  },
  selectionInfo: {
    backgroundColor: '#e8f5e9',
    padding: 10,
    borderRadius: 8,
    marginBottom: 20,
    width: '100%',
    alignItems: 'center'
  },
  selectionInfoText: {
    color: '#2e7d32',
    fontWeight: '600'
  },
  optionsContainer: {
    width: '100%',
    marginBottom: 20
  },
  optionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#e9ecef'
  },
  optionButtonSelected: {
    backgroundColor: '#e3f2fd',
    borderColor: '#1976d2'
  },
  optionIcon: {
    fontSize: 28,
    marginRight: 15
  },
  optionTextContainer: {
    flex: 1
  },
  optionText: {
    fontSize: 16,
    color: '#2c3e50',
    fontWeight: '500',
    marginBottom: 4
  },
  optionTextSelected: {
    color: '#1976d2',
    fontWeight: '600'
  },
  optionDescription: {
    fontSize: 12,
    color: '#7f8c8d',
    fontStyle: 'italic'
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    width: '100%'
  },
  button: {
    borderRadius: 10,
    padding: 12,
    elevation: 2,
    minWidth: 100,
    margin: 5,
    alignItems: 'center'
  },
  resetButton: {
    backgroundColor: '#e74c3c',
  },
  validateButton: {
    backgroundColor: '#2ecc71',
  },
  closeButton: {
    backgroundColor: '#95a5a6',
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center'
  }
});

export default VentilationModal;