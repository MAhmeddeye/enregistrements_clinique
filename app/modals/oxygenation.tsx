import { FormType } from '@/lib/types';
import React, { Dispatch, SetStateAction, useState } from 'react';
import {
  View,
  Text,
  Modal,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Alert,

  KeyboardAvoidingView,
  Platform
} from 'react-native';
import { SafeAreaView } from "react-native-safe-area-context";

// Types pour TypeScript
interface OxygenationModalProps {
  visible: boolean;
  onClose: () => void;
    form: FormType;  
      setForm: Dispatch<SetStateAction<FormType>>; 
}

type OxygenationOption = 'masque' | 'lunette' | 'autre';

interface SelectedOption {
  type: OxygenationOption | null;
  litreMinute: string;
  fio2: string;
}

export const OxygenationModal: React.FC<OxygenationModalProps> = ({ visible, onClose }) => {
  const [selectedOption, setSelectedOption] = useState<SelectedOption>({
    type: null,
    litreMinute: '',
    fio2: ''
  });

  const selectOption = (option: OxygenationOption) => {
    setSelectedOption({
      ...selectedOption,
      type: option
    });
  };

  const handleLitreMinuteChange = (value: string) => {
    // Validation: seulement des nombres
    if (/^\d*\.?\d*$/.test(value)) {
      setSelectedOption({
        ...selectedOption,
        litreMinute: value
      });
    }
  };

  const handleFio2Change = (value: string) => {
    // Validation: nombres entre 0 et 100
    if (/^\d*\.?\d*$/.test(value)) {
      const numValue = parseFloat(value);
      if ((numValue >= 0 && numValue <= 100) || value === '') {
        setSelectedOption({
          ...selectedOption,
          fio2: value
        });
      }
    }
  };

  const handleValidate = () => {
    if (!selectedOption.type) {
      Alert.alert(
        "Sélection manquante",
        "Veuillez sélectionner une option d'oxygénation.",
        [{ text: "OK" }]
      );
      return;
    }

    if (!selectedOption.litreMinute || !selectedOption.fio2) {
      Alert.alert(
        "Paramètres manquants",
        "Veuillez renseigner tous les paramètres.",
        [{ text: "OK" }]
      );
      return;
    }

    Alert.alert(
      "Paramètres validés",
      `Vous avez sélectionné: ${getSelectedOptionText()} avec ${selectedOption.litreMinute} L/min et FiO2 ${selectedOption.fio2}%`,
      [{ text: "OK", onPress: onClose }]
    );
  };

  const getSelectedOptionText = (): string => {
    switch (selectedOption.type) {
      case 'masque':
        return "Masque à oxygène";
      case 'lunette':
        return "Lunette à oxygène nasal";
      case 'autre':
        return "Autre méthode d'oxygénation";
      default:
        return "Aucune option sélectionnée";
    }
  };

  const resetSelection = () => {
    setSelectedOption({
      type: null,
      litreMinute: '',
      fio2: ''
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
        <KeyboardAvoidingView 
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={styles.keyboardAvoidingView}
        >
          <View style={styles.modalView}>
            <Text style={styles.modalTitle}>Oxygénation</Text>
            <Text style={styles.modalSubtitle}>Sélectionnez une méthode d'oxygénation</Text>
            
            <ScrollView style={styles.optionsContainer}>
              <TouchableOpacity 
                style={[
                  styles.optionButton, 
                  selectedOption.type === 'masque' && styles.optionButtonSelected
                ]}
                onPress={() => selectOption('masque')}
              >
                <Text style={styles.optionIcon}>😷</Text>
                <View style={styles.optionTextContainer}>
                  <Text style={[
                    styles.optionText,
                    selectedOption.type === 'masque' && styles.optionTextSelected
                  ]}>
                    Masque à oxygène
                  </Text>
                  <Text style={styles.optionDescription}>
                    Masque facial pour administration d'oxygène
                  </Text>
                </View>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={[
                  styles.optionButton, 
                  selectedOption.type === 'lunette' && styles.optionButtonSelected
                ]}
                onPress={() => selectOption('lunette')}
              >
                <Text style={styles.optionIcon}>👃</Text>
                <View style={styles.optionTextContainer}>
                  <Text style={[
                    styles.optionText,
                    selectedOption.type === 'lunette' && styles.optionTextSelected
                  ]}>
                    Lunette à oxygène nasal
                  </Text>
                  <Text style={styles.optionDescription}>
                    Canules nasales pour administration d'oxygène
                  </Text>
                </View>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={[
                  styles.optionButton, 
                  selectedOption.type === 'autre' && styles.optionButtonSelected
                ]}
                onPress={() => selectOption('autre')}
              >
                <Text style={styles.optionIcon}>🫁</Text>
                <View style={styles.optionTextContainer}>
                  <Text style={[
                    styles.optionText,
                    selectedOption.type === 'autre' && styles.optionTextSelected
                  ]}>
                    Autre méthode d'oxygénation
                  </Text>
                  <Text style={styles.optionDescription}>
                    Autre système d'administration d'oxygène
                  </Text>
                </View>
              </TouchableOpacity>
            </ScrollView>

            {selectedOption.type && (
              <View style={styles.parametersContainer}>
                <Text style={styles.parametersTitle}>Paramètres d'oxygénation</Text>
                
                <View style={styles.inputContainer}>
                  <Text style={styles.inputLabel}>Débit (L/min)</Text>
                  <TextInput
                    style={styles.input}
                    value={selectedOption.litreMinute}
                    onChangeText={handleLitreMinuteChange}
                    placeholder="Ex: 5"
                    keyboardType="numeric"
                    maxLength={3}
                  />
                </View>
                
                <View style={styles.inputContainer}>
                  <Text style={styles.inputLabel}>FiO2 (%)</Text>
                  <TextInput
                    style={styles.input}
                    value={selectedOption.fio2}
                    onChangeText={handleFio2Change}
                    placeholder="Ex: 40"
                    keyboardType="numeric"
                    maxLength={3}
                  />
                </View>
              </View>
            )}
            
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
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  keyboardAvoidingView: {
    width: '100%',
    alignItems: 'center'
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
    maxHeight: '90%'
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
  optionsContainer: {
    width: '100%',
    marginBottom: 20,
    maxHeight: 200
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
  parametersContainer: {
    width: '100%',
    backgroundColor: '#f8f9fa',
    padding: 15,
    borderRadius: 10,
    marginBottom: 20
  },
  parametersTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2c3e50',
    marginBottom: 15,
    textAlign: 'center'
  },
  inputContainer: {
    marginBottom: 15
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#2c3e50',
    marginBottom: 5
  },
  input: {
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 10,
    fontSize: 16
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

export default OxygenationModal;