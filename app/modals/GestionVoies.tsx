import { FormType } from '@/lib/types';
import React, { Dispatch, SetStateAction, useState } from 'react';
import {
    Alert,
    Modal,
   
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';
import { SafeAreaView } from "react-native-safe-area-context";

// Définir les types pour les props du composant
interface AirwayManagementModalProps {
  visible: boolean;
  onClose: () => void;
   form: FormType;  
  setForm: Dispatch<SetStateAction<FormType>>; 
}

// Définir le type pour les options
type AirwayOption = 'canuleDeGuedel' | 'masqueLarynge' | 'aspirationDesSecrets';

// ✅ Interface uniquement pour les options sélectionnées
interface SelectedOptionsState {
  canuleDeGuedel: boolean;
  masqueLarynge: boolean;
  aspirationDesSecrets: boolean;
}

const AirwayManagementModal: React.FC<AirwayManagementModalProps> = ({ visible, onClose }) => {
  // ✅ État pour les options sélectionnées
  const [selectedOptions, setSelectedOptions] = useState<SelectedOptionsState>({
    canuleDeGuedel: false,
    masqueLarynge: false,
    aspirationDesSecrets: false
  });

  // Fonction pour basculer une option
  const toggleOption = (option: AirwayOption): void => {
    const selectedCount = Object.values(selectedOptions).filter(val => val).length;
    
    if (selectedOptions[option]) {
      setSelectedOptions({
        ...selectedOptions,
        [option]: false
      });
    } else if (selectedCount < 2) {
      setSelectedOptions({
        ...selectedOptions,
        [option]: true
      });
    } else {
      Alert.alert(
        "Limite atteinte",
        "Vous ne pouvez sélectionner que deux options maximum.",
        [{ text: "OK" }]
      );
    }
  };

  // Fonction pour valider la sélection
  const handleValidate = (): void => {
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

  // Obtenir le texte des options sélectionnées
  const getSelectedOptionsText = (): string => {
    const selected: string[] = [];
    if (selectedOptions.canuleDeGuedel) selected.push("Canule de Guedel");
    if (selectedOptions.masqueLarynge) selected.push("Masque Laryngé");
    if (selectedOptions.aspirationDesSecrets) selected.push("Aspiration des Sécrétions");
    return selected.join(", ");
  };

  // Réinitialiser la sélection
  const resetSelection = (): void => {
    setSelectedOptions({
      canuleDeGuedel: false,
      masqueLarynge: false,
      aspirationDesSecrets: false
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
          <Text style={styles.modalTitle}>Gestion des Voies Aériennes</Text>
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
                selectedOptions.canuleDeGuedel && styles.optionButtonSelected
              ]}
              onPress={() => toggleOption('canuleDeGuedel')}
            >
              <Text style={styles.optionIcon}>🦷</Text>
              <Text style={[
                styles.optionText,
                selectedOptions.canuleDeGuedel && styles.optionTextSelected
              ]}>
                Canule de Guedel
              </Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[
                styles.optionButton, 
                selectedOptions.masqueLarynge && styles.optionButtonSelected
              ]}
              onPress={() => toggleOption('masqueLarynge')}
            >
              <Text style={styles.optionIcon}>🎭</Text>
              <Text style={[
                styles.optionText,
                selectedOptions.masqueLarynge && styles.optionTextSelected
              ]}>
                Masque Laryngé
              </Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[
                styles.optionButton, 
                selectedOptions.aspirationDesSecrets && styles.optionButtonSelected
              ]}
              onPress={() => toggleOption('aspirationDesSecrets')}
            >
              <Text style={styles.optionIcon}>💨</Text>
              <Text style={[
                styles.optionText,
                selectedOptions.aspirationDesSecrets && styles.optionTextSelected
              ]}>
                Aspiration des Sécrétions
              </Text>
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
    fontSize: 24,
    marginRight: 15
  },
  optionText: {
    fontSize: 16,
    color: '#2c3e50',
    fontWeight: '500'
  },
  optionTextSelected: {
    color: '#1976d2',
    fontWeight: '600'
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

export default AirwayManagementModal;
