import { FormType } from '@/lib/types';
import React, { Dispatch, SetStateAction, useState } from 'react';
import { SafeAreaView } from "react-native-safe-area-context";
import {
  View,
  Text,
  Modal,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Alert,
  KeyboardAvoidingView,
  Platform
} from 'react-native';

// Types pour TypeScript
interface CatheterModalProps {
  visible: boolean;
  onClose: () => void;
  form: FormType;  
  setForm: Dispatch<SetStateAction<FormType>>; 
}

const CatheterModal: React.FC<CatheterModalProps> = ({ visible, onClose, form, setForm }) => {
  const [catheterInput, setCatheterInput] = useState('');

  const handleValidate = () => {
    if (!catheterInput.trim()) {
      Alert.alert(
        "Saisie manquante",
        "Veuillez saisir les informations du cathétérisme.",
        [{ text: "OK" }]
      );
      return;
    }

    // Mettre à jour le form avec les données saisies
    setForm(prevForm => ({
      ...prevForm,
      catheterisme: catheterInput
    }));

    Alert.alert(
      "Cathétérisme enregistré",
      `Informations enregistrées : ${catheterInput}`,
      [{ 
        text: "OK", 
        onPress: () => {
          setCatheterInput('');
          onClose();
        }
      }]
    );
  };

  const resetInput = () => {
    setCatheterInput('');
  };

  const handleClose = () => {
    setCatheterInput('');
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
        <KeyboardAvoidingView 
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={styles.keyboardAvoidingView}
        >
          <View style={styles.modalView}>
            <Text style={styles.modalTitle}>Cathétérisme</Text>
            <Text style={styles.modalSubtitle}>
              Saisissez les informations du cathétérisme
            </Text>
            
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>
                Informations du cathétérisme *
              </Text>
              <TextInput
                style={styles.textInput}
                value={catheterInput}
                onChangeText={setCatheterInput}
                placeholder="Ex: Cathéter vésical 16Fr, insertion le 15/12/2023, volume ballonnet 10ml..."
                multiline={true}
                numberOfLines={4}
                textAlignVertical="top"
              />
            </View>

            <Text style={styles.exampleText}>
              Exemples : "Nasogastrique 12Fr - Narine droite", "Vésical 16Fr - Volume 10ml"
            </Text>
            
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
    marginBottom: 15,
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: '500',
    color: '#2c3e50',
    marginBottom: 8
  },
  textInput: {
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    minHeight: 100,
    textAlignVertical: 'top'
  },
  exampleText: {
    fontSize: 12,
    color: '#7f8c8d',
    fontStyle: 'italic',
    marginBottom: 20,
    textAlign: 'center'
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    flexWrap: 'wrap'
  },
  button: {
    borderRadius: 10,
    padding: 12,
    elevation: 2,
    minWidth: 100,
    margin: 5,
    alignItems: 'center',
    flex: 1
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

export default CatheterModal;