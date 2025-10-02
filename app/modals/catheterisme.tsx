import { FormType } from '@/lib/types';
import React, { Dispatch, SetStateAction, useState } from 'react';
import { SafeAreaView } from "react-native-safe-area-context";
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

// Types pour TypeScript
interface CatheterModalProps {
  visible: boolean;
  onClose: () => void;
  form: FormType;  
    setForm: Dispatch<SetStateAction<FormType>>; 
}

type CatheterType = 'nasogastrique' | 'vesical' | null;

interface CatheterData {
  type: CatheterType;
  size: string;
  insertionDate: string;
  insertionTime: string;
  location: string;
  notes: string;
  balloonVolume: string;
}

const CatheterModal: React.FC<CatheterModalProps> = ({ visible, onClose }) => {
  const [catheterData, setCatheterData] = useState<CatheterData>({
    type: null,
    size: '',
    insertionDate: '',
    insertionTime: '',
    location: '',
    notes: '',
    balloonVolume: ''
  });

  const selectCatheterType = (type: CatheterType) => {
    setCatheterData({
      ...catheterData,
      type
    });
  };

  const handleValidate = () => {
    if (!catheterData.type) {
      Alert.alert(
        "Type manquant",
        "Veuillez sélectionner un type de cathétérisme.",
        [{ text: "OK" }]
      );
      return;
    }

    if (!catheterData.size) {
      Alert.alert(
        "Taille manquante",
        "Veuillez spécifier la taille du cathéter.",
        [{ text: "OK" }]
      );
      return;
    }

    const message = `Type: ${getCatheterTypeText()}
Taille: ${catheterData.size}
Date et heure: ${catheterData.insertionDate} ${catheterData.insertionTime}
Localisation: ${catheterData.location || 'Non spécifiée'}
${catheterData.type === 'vesical' ? `Volume ballonnet: ${catheterData.balloonVolume || 'Non spécifié'}` : ''}
Notes: ${catheterData.notes || 'Aucune'}`;

    Alert.alert(
      "Cathétérisme enregistré",
      message,
      [{ text: "OK", onPress: onClose }]
    );
  };

  const getCatheterTypeText = (): string => {
    switch (catheterData.type) {
      case 'nasogastrique':
        return "Cathétérisme Nasogastrique";
      case 'vesical':
        return "Cathétérisme Vésical";
      default:
        return "Aucun type sélectionné";
    }
  };

  const getCurrentDateTime = () => {
    const now = new Date();
    const date = now.toISOString().split('T')[0];
    const time = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
    
    setCatheterData({
      ...catheterData,
      insertionDate: date,
      insertionTime: time
    });
  };

  const resetForm = () => {
    setCatheterData({
      type: null,
      size: '',
      insertionDate: '',
      insertionTime: '',
      location: '',
      notes: '',
      balloonVolume: ''
    });
  };

  const CatheterTypeButton = ({ 
    type, 
    icon, 
    title, 
    description 
  }: { 
    type: CatheterType; 
    icon: string; 
    title: string; 
    description: string; 
  }) => (
    <TouchableOpacity 
      style={[
        styles.catheterTypeButton, 
        catheterData.type === type && styles.catheterTypeButtonSelected
      ]}
      onPress={() => selectCatheterType(type)}
    >
      <Text style={styles.catheterTypeIcon}>{icon}</Text>
      <View style={styles.catheterTypeTextContainer}>
        <Text style={[
          styles.catheterTypeTitle,
          catheterData.type === type && styles.catheterTypeTitleSelected
        ]}>
          {title}
        </Text>
        <Text style={styles.catheterTypeDescription}>{description}</Text>
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
            <Text style={styles.modalTitle}>Cathétérisme</Text>
            <Text style={styles.modalSubtitle}>Sélectionnez et configurez le type de cathéter</Text>
            
            <ScrollView style={styles.container}>
              <Text style={styles.sectionTitle}>Type de cathéter</Text>
              
              <CatheterTypeButton
                type="nasogastrique"
                icon="👃"
                title="Cathéter Nasogastrique"
                description="Sonde gastrique par voie nasale"
              />
              
              <CatheterTypeButton
                type="vesical"
                icon="🚽"
                title="Cathéter Vésical"
                description="Sonde urinaire par voie urétrale"
              />

              {catheterData.type && (
                <View style={styles.detailsContainer}>
                  <Text style={styles.sectionTitle}>Détails du cathétérisme</Text>
                  
                  <View style={styles.inputRow}>
                    <View style={[styles.inputContainer, { flex: 1 }]}>
                      <Text style={styles.inputLabel}>Taille (French) *</Text>
                      <TextInput
                        style={styles.input}
                        value={catheterData.size}
                        onChangeText={(text) => setCatheterData({...catheterData, size: text})}
                        placeholder="Ex: 12, 16, 18..."
                        keyboardType="numeric"
                      />
                    </View>

                    {catheterData.type === 'vesical' && (
                      <View style={[styles.inputContainer, { flex: 1, marginLeft: 10 }]}>
                        <Text style={styles.inputLabel}>Volume ballonnet (ml)</Text>
                        <TextInput
                          style={styles.input}
                          value={catheterData.balloonVolume}
                          onChangeText={(text) => setCatheterData({...catheterData, balloonVolume: text})}
                          placeholder="Ex: 10"
                          keyboardType="numeric"
                        />
                      </View>
                    )}
                  </View>
                  
                  <View style={styles.inputRow}>
                    <View style={[styles.inputContainer, { flex: 1 }]}>
                      <Text style={styles.inputLabel}>Date d'insertion</Text>
                      <TextInput
                        style={styles.input}
                        value={catheterData.insertionDate}
                        onChangeText={(text) => setCatheterData({...catheterData, insertionDate: text})}
                        placeholder="AAAA-MM-JJ"
                      />
                    </View>
                    
                    <View style={[styles.inputContainer, { flex: 1, marginLeft: 10 }]}>
                      <Text style={styles.inputLabel}>Heure d'insertion</Text>
                      <TextInput
                        style={styles.input}
                        value={catheterData.insertionTime}
                        onChangeText={(text) => setCatheterData({...catheterData, insertionTime: text})}
                        placeholder="HH:MM"
                      />
                    </View>
                    
                    <TouchableOpacity 
                      style={styles.timeButton}
                      onPress={getCurrentDateTime}
                    >
                      <Text style={styles.timeButtonText}>Maintenant</Text>
                    </TouchableOpacity>
                  </View>
                  
                  <View style={styles.inputContainer}>
                    <Text style={styles.inputLabel}>
                      {catheterData.type === 'nasogastrique' ? 'Narine utilisée' : 'Localisation'}
                    </Text>
                    <TextInput
                      style={styles.input}
                      value={catheterData.location}
                      onChangeText={(text) => setCatheterData({...catheterData, location: text})}
                      placeholder={catheterData.type === 'nasogastrique' ? 'Ex: Narine droite' : 'Ex: Urètre'}
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
  catheterTypeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
    padding: 15,
    borderRadius: 10,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#e9ecef'
  },
  catheterTypeButtonSelected: {
    backgroundColor: '#e8f5e9',
    borderColor: '#2ecc71'
  },
  catheterTypeIcon: {
    fontSize: 28,
    marginRight: 15
  },
  catheterTypeTextContainer: {
    flex: 1
  },
  catheterTypeTitle: {
    fontSize: 16,
    color: '#2c3e50',
    fontWeight: '500',
    marginBottom: 4
  },
  catheterTypeTitleSelected: {
    color: '#27ae60',
    fontWeight: '600'
  },
  catheterTypeDescription: {
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
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15
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
  timeButton: {
    backgroundColor: '#3498db',
    padding: 10,
    borderRadius: 8,
    marginLeft: 10
  },
  timeButtonText: {
    color: 'white',
    fontWeight: '500',
    fontSize: 12
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

export default CatheterModal;