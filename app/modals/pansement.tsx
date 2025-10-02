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
interface DressingModalProps {
  visible: boolean;
  onClose: () => void;
  form: FormType;  
  setForm: Dispatch<SetStateAction<FormType>>; 
}

type DressingType = 'compressif' | 'sec' | 'humide' | 'specialise' | null;

interface DressingData {
  type: DressingType;
  location: string;
  size: string;
  material: string;
  notes: string;
  
}

const PansementModal: React.FC<DressingModalProps> = ({ visible, onClose }) => {
  const [dressingData, setDressingData] = useState<DressingData>({
    type: null,
    location: '',
    size: '',
    material: '',
    notes: ''
  });

  const selectDressingType = (type: DressingType) => {
    setDressingData({
      ...dressingData,
      type
    });
  };

  const handleValidate = () => {
    if (!dressingData.type) {
      Alert.alert(
        "Type manquant",
        "Veuillez sélectionner un type de pansement.",
        [{ text: "OK" }]
      );
      return;
    }

    if (!dressingData.location) {
      Alert.alert(
        "Localisation manquante",
        "Veuillez préciser la localisation du pansement.",
        [{ text: "OK" }]
      );
      return;
    }

    Alert.alert(
      "Pansement appliqué",
      `Type: ${getDressingTypeText()}\nLocalisation: ${dressingData.location}\nTaille: ${dressingData.size || 'Non spécifiée'}\nMatériau: ${dressingData.material || 'Non spécifié'}`,
      [{ text: "OK", onPress: onClose }]
    );
  };

  const getDressingTypeText = (): string => {
    switch (dressingData.type) {
      case 'compressif':
        return "Pansement compressif";
      case 'sec':
        return "Pansement sec";
      case 'humide':
        return "Pansement humide";
      case 'specialise':
        return "Pansement spécialisé";
      default:
        return "Aucun type sélectionné";
    }
  };

  const resetForm = () => {
    setDressingData({
      type: null,
      location: '',
      size: '',
      material: '',
      notes: ''
    });
  };

  const DressingTypeButton = ({ 
    type, 
    icon, 
    title, 
    description 
  }: { 
    type: DressingType; 
    icon: string; 
    title: string; 
    description: string; 
  }) => (
    <TouchableOpacity 
      style={[
        styles.dressingTypeButton, 
        dressingData.type === type && styles.dressingTypeButtonSelected
      ]}
      onPress={() => selectDressingType(type)}
    >
      <Text style={styles.dressingTypeIcon}>{icon}</Text>
      <View style={styles.dressingTypeTextContainer}>
        <Text style={[
          styles.dressingTypeTitle,
          dressingData.type === type && styles.dressingTypeTitleSelected
        ]}>
          {title}
        </Text>
        <Text style={styles.dressingTypeDescription}>{description}</Text>
      </View>
    </TouchableOpacity>
  );

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
            <Text style={styles.modalTitle}>Application de Pansement</Text>
            <Text style={styles.modalSubtitle}>Sélectionnez et configurez le pansement</Text>
            
            <ScrollView style={styles.container}>
              <Text style={styles.sectionTitle}>Type de pansement</Text>
              
              <DressingTypeButton
                type="compressif"
                icon="🩹"
                title="Pansement compressif"
                description="Pour contrôler les saignements"
              />
              
              <DressingTypeButton
                type="sec"
                icon="✅"
                title="Pansement sec"
                description="Protection simple des plaies"
              />
              
              <DressingTypeButton
                type="humide"
                icon="💧"
                title="Pansement humide"
                description="Pour plaies nécessitant humidité"
              />
              
              <DressingTypeButton
                type="specialise"
                icon="⭐"
                title="Pansement spécialisé"
                description="Brûlures, ulcères, etc."
              />

              {dressingData.type && (
                <View style={styles.detailsContainer}>
                  <Text style={styles.sectionTitle}>Détails du pansement</Text>
                  
                  <View style={styles.inputContainer}>
                    <Text style={styles.inputLabel}>Localisation *</Text>
                    <TextInput
                      style={styles.input}
                      value={dressingData.location}
                      onChangeText={(text) => setDressingData({...dressingData, location: text})}
                      placeholder="Ex: Avant-bras droit, jambe gauche..."
                    />
                  </View>
                  
                  <View style={styles.inputContainer}>
                    <Text style={styles.inputLabel}>Taille</Text>
                    <TextInput
                      style={styles.input}
                      value={dressingData.size}
                      onChangeText={(text) => setDressingData({...dressingData, size: text})}
                      placeholder="Ex: 10x10 cm, moyen, grand..."
                    />
                  </View>
                  
                  <View style={styles.inputContainer}>
                    <Text style={styles.inputLabel}>Matériau</Text>
                    <TextInput
                      style={styles.input}
                      value={dressingData.material}
                      onChangeText={(text) => setDressingData({...dressingData, material: text})}
                      placeholder="Ex: Gauze, hydrocolloïde, alginate..."
                    />
                  </View>
                  
                  <View style={styles.inputContainer}>
                    <Text style={styles.inputLabel}>Notes supplémentaires</Text>
                    <TextInput
                      style={[styles.input, styles.notesInput]}
                      value={dressingData.notes}
                      onChangeText={(text) => setDressingData({...dressingData, notes: text})}
                      placeholder="Observations, précisions..."
                      multiline
                      numberOfLines={3}
                    />
                  </View>
                </View>
              )}
            </ScrollView>
            
            <View style={styles.buttonContainer}>
              <TouchableOpacity 
                style={[styles.button, styles.resetButton]}
                onPress={resetForm}
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
  container: {
    width: '100%',
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#2c3e50',
    marginBottom: 15,
    marginTop: 10
  },
  dressingTypeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
    padding: 15,
    borderRadius: 10,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#e9ecef'
  },
  dressingTypeButtonSelected: {
    backgroundColor: '#e3f2fd',
    borderColor: '#1976d2'
  },
  dressingTypeIcon: {
    fontSize: 28,
    marginRight: 15
  },
  dressingTypeTextContainer: {
    flex: 1
  },
  dressingTypeTitle: {
    fontSize: 16,
    color: '#2c3e50',
    fontWeight: '500',
    marginBottom: 4
  },
  dressingTypeTitleSelected: {
    color: '#1976d2',
    fontWeight: '600'
  },
  dressingTypeDescription: {
    fontSize: 12,
    color: '#7f8c8d',
    fontStyle: 'italic'
  },
  detailsContainer: {
    width: '100%',
    backgroundColor: '#f8f9fa',
    padding: 15,
    borderRadius: 10,
    marginTop: 10
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
  notesInput: {
    minHeight: 80,
    textAlignVertical: 'top'
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

export default PansementModal;