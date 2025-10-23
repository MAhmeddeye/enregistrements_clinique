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
} from 'react-native';
import { SafeAreaView } from "react-native-safe-area-context";

// Types pour TypeScript
interface VentilationModalProps {
  visible: boolean;
  onClose: () => void;
  form: FormType;  
  setForm: Dispatch<SetStateAction<FormType>>; 
}

export const VentilationModal: React.FC<VentilationModalProps> = ({ 
  visible, 
  onClose, 
  form, 
  setForm 
}) => {
  const [inputValue, setInputValue] = useState<string>('');

  const handleValidate = () => {
    if (inputValue.trim()) {
      // Mettre à jour le formulaire avec la valeur saisie
      setForm(prevForm => ({
        ...prevForm,
        ventilation: inputValue.trim()
      }));

      Alert.alert(
        "Succès",
        "La ventilation a été enregistrée avec succès.",
        [{ text: "OK", onPress: onClose }]
      );
    } else {
      Alert.alert(
        "Champ vide",
        "Veuillez saisir une valeur pour la ventilation.",
        [{ text: "OK" }]
      );
    }
  };

  const resetInput = () => {
    setInputValue('');
    // Optionnel : réinitialiser aussi le champ dans le formulaire
    setForm(prevForm => ({
      ...prevForm,
      ventilation: ''
    }));
  };

  const handleClose = () => {
    // Sauvegarder automatiquement si il y a une valeur
    if (inputValue.trim()) {
      setForm(prevForm => ({
        ...prevForm,
        ventilation: inputValue.trim()
      }));
    }
    onClose();
  };

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={handleClose}
    >
      <SafeAreaView style={styles.centeredView}>
        <View style={styles.modalView}>
          <Text style={styles.modalTitle}>Gestion de Ventilation</Text>
          <Text style={styles.modalSubtitle}>
            Saisissez le type de ventilation utilisé
          </Text>
          
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.textInput}
              value={inputValue}
              onChangeText={setInputValue}
              placeholder="Ex: Ventilation avec AMBU, Scellement de plaie..."
              placeholderTextColor="#999"
              multiline={true}
              numberOfLines={3}
              textAlignVertical="top"
            />
          </View>
          
          <View style={styles.buttonContainer}>
            <TouchableOpacity 
              style={[styles.button, styles.resetButton]}
              onPress={resetInput}
            >
              <Text style={styles.buttonText}>Effacer</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[styles.button, styles.validateButton]}
              onPress={handleValidate}
            >
              <Text style={styles.buttonText}>Valider</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[styles.button, styles.closeButton]}
              onPress={handleClose}
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
  inputContainer: {
    width: '100%',
    marginBottom: 25,
  },
  textInput: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 10,
    padding: 15,
    fontSize: 16,
    backgroundColor: '#f8f9fa',
    minHeight: 100,
    textAlignVertical: 'top',
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
    alignItems: 'center',
    flex: 1,
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