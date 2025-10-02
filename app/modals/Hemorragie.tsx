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
  Platform,
  Switch
} from 'react-native';
import { SafeAreaView } from "react-native-safe-area-context";

// Types pour TypeScript
interface HemorrhageControlModalProps {
  visible: boolean;
  onClose: () => void;
  form: FormType;  
  setForm: Dispatch<SetStateAction<FormType>>; 
}

type HemorrhageOption = 'bandage' | 'tourniquet';

interface SelectedOption {
  type: HemorrhageOption | null;
  location: string;
  timeApplied: string;
  tourniquetPainLevel: string;
}

export const HemorrhageControlModal: React.FC<HemorrhageControlModalProps> = ({ visible, onClose }) => {
  const [selectedOption, setSelectedOption] = useState<SelectedOption>({
    type: null,
    location: '',
    timeApplied: '',
    tourniquetPainLevel: ''
  });

  const selectOption = (option: HemorrhageOption) => {
    setSelectedOption({
      ...selectedOption,
      type: option
    });
  };

  const handleValidate = () => {
    if (!selectedOption.type) {
      Alert.alert(
        "Sélection manquante",
        "Veuillez sélectionner une méthode de contrôle de l'hémorragie.",
        [{ text: "OK" }]
      );
      return;
    }

    if (!selectedOption.location) {
      Alert.alert(
        "Localisation manquante",
        "Veuillez préciser la localisation de l'hémorragie.",
        [{ text: "OK" }]
      );
      return;
    }

    if (selectedOption.type === 'tourniquet' && !selectedOption.timeApplied) {
      Alert.alert(
        "Heure manquante",
        "Veuillez préciser l'heure de pose du tourniquet.",
        [{ text: "OK" }]
      );
      return;
    }

    Alert.alert(
      "Contrôle d'hémorragie validé",
      `Méthode: ${getSelectedOptionText()}\nLocalisation: ${selectedOption.location}${
        selectedOption.timeApplied ? `\nHeure de pose: ${selectedOption.timeApplied}` : ''
      }${
        selectedOption.tourniquetPainLevel ? `\nNiveau de douleur: ${selectedOption.tourniquetPainLevel}/10` : ''
      }`,
      [{ text: "OK", onPress: onClose }]
    );
  };

  const getSelectedOptionText = (): string => {
    switch (selectedOption.type) {
      case 'bandage':
        return "Bandage compressif";
      case 'tourniquet':
        return "Tourniquet";
      default:
        return "Aucune option sélectionnée";
    }
  };

  const resetSelection = () => {
    setSelectedOption({
      type: null,
      location: '',
      timeApplied: '',
      tourniquetPainLevel: ''
    });
  };

  const getCurrentTime = () => {
    const now = new Date();
    return `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
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
            <Text style={styles.modalTitle}>Contrôle de l'Hémorragie</Text>
            <Text style={styles.modalSubtitle}>Sélectionnez une méthode de contrôle</Text>
            
            <ScrollView style={styles.optionsContainer}>
              <TouchableOpacity 
                style={[
                  styles.optionButton, 
                  selectedOption.type === 'bandage' && styles.optionButtonSelected
                ]}
                onPress={() => selectOption('bandage')}
              >
                <Text style={styles.optionIcon}>🩹</Text>
                <View style={styles.optionTextContainer}>
                  <Text style={[
                    styles.optionText,
                    selectedOption.type === 'bandage' && styles.optionTextSelected
                  ]}>
                    Bandage compressif
                  </Text>
                  <Text style={styles.optionDescription}>
                    Pansement appliqué avec pression pour contrôler le saignement
                  </Text>
                </View>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={[
                  styles.optionButton, 
                  selectedOption.type === 'tourniquet' && styles.optionButtonSelected
                ]}
                onPress={() => selectOption('tourniquet')}
              >
                <Text style={styles.optionIcon}>⛑️</Text>
                <View style={styles.optionTextContainer}>
                  <Text style={[
                    styles.optionText,
                    selectedOption.type === 'tourniquet' && styles.optionTextSelected
                  ]}>
                    Tourniquet
                  </Text>
                  <Text style={styles.optionDescription}>
                    Dispositif pour comprimer les vaisseaux sanguins et arrêter l'hémorragie
                  </Text>
                </View>
              </TouchableOpacity>
            </ScrollView>

            {selectedOption.type && (
              <View style={styles.parametersContainer}>
                <Text style={styles.parametersTitle}>Détails d'application</Text>
                
                <View style={styles.inputContainer}>
                  <Text style={styles.inputLabel}>Localisation de l'hémorragie *</Text>
                  <TextInput
                    style={styles.input}
                    value={selectedOption.location}
                    onChangeText={(text) => setSelectedOption({...selectedOption, location: text})}
                    placeholder="Ex: Bras droit, cuisse gauche..."
                  />
                </View>
                
                {selectedOption.type === 'tourniquet' && (
                  <>
                    <View style={styles.inputContainer}>
                      <Text style={styles.inputLabel}>Heure de pose du tourniquet *</Text>
                      <View style={styles.timeInputRow}>
                        <TextInput
                          style={[styles.input, styles.timeInput]}
                          value={selectedOption.timeApplied}
                          onChangeText={(text) => setSelectedOption({...selectedOption, timeApplied: text})}
                          placeholder="HH:MM"
                          keyboardType="numeric"
                          maxLength={5}
                        />
                        <TouchableOpacity 
                          style={styles.timeButton}
                          onPress={() => setSelectedOption({...selectedOption, timeApplied: getCurrentTime()})}
                        >
                          <Text style={styles.timeButtonText}>Maintenant</Text>
                        </TouchableOpacity>
                      </View>
                    </View>
                    
                    <View style={styles.inputContainer}>
                      <Text style={styles.inputLabel}>Niveau de douleur (0-10)</Text>
                      <View style={styles.painLevelContainer}>
                        {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((level) => (
                          <TouchableOpacity
                            key={level}
                            style={[
                              styles.painLevelButton,
                              selectedOption.tourniquetPainLevel === level.toString() && styles.painLevelButtonSelected
                            ]}
                            onPress={() => setSelectedOption({...selectedOption, tourniquetPainLevel: level.toString()})}
                          >
                            <Text style={[
                              styles.painLevelText,
                              selectedOption.tourniquetPainLevel === level.toString() && styles.painLevelTextSelected
                            ]}>
                              {level}
                            </Text>
                          </TouchableOpacity>
                        ))}
                      </View>
                    </View>
                  </>
                )}
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
    color: '#c62828',
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
    backgroundColor: '#ffebee',
    borderColor: '#c62828'
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
    color: '#c62828',
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
  timeInputRow: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  timeInput: {
    flex: 1,
    marginRight: 10
  },
  timeButton: {
    backgroundColor: '#1976d2',
    padding: 10,
    borderRadius: 8
  },
  timeButtonText: {
    color: 'white',
    fontWeight: '500'
  },
  painLevelContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between'
  },
  painLevelButton: {
    width: '8.5%',
    aspectRatio: 1,
    backgroundColor: '#f5f5f5',
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 5
  },
  painLevelButtonSelected: {
    backgroundColor: '#c62828'
  },
  painLevelText: {
    fontSize: 12,
    color: '#333'
  },
  painLevelTextSelected: {
    color: 'white',
    fontWeight: 'bold'
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

export default HemorrhageControlModal;