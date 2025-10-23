import React, { ComponentProps, useState } from 'react';
import { 
  View, 
  Text, 
  TouchableOpacity, 
  Modal, 
  StyleSheet, 
  ScrollView,
  Dimensions
} from 'react-native';

import { MaterialCommunityIcons, Feather } from '@expo/vector-icons';
import { CodeAlerteModalProps } from '@/lib/context';
type StrictIconName = ComponentProps<typeof MaterialCommunityIcons>['name'];
type MaterialCommunityIconName = StrictIconName | (string & {});

const { width, height } = Dimensions.get('window');

// Types simplifiés : uniquement MaterialCommunityIcons
interface CodeAlerte {
  id: string;
  title: string;
  icon:  MaterialCommunityIconName  // Icônes MaterialCommunityIcons
  color: string;
  bgColor: string;
  description: string;
}

export const CodeAlerteModal: React.FC<CodeAlerteModalProps> = ({ 
  visible, 
  onClose, 
  form, 
  setForm 
}) => {
  const [selectedCode, setSelectedCode] = useState<string | null>(form.codeResolution || null);

  const codesAlerte: CodeAlerte[] = [
    {
      id: 'trauma',
      title: 'Code de traumatisme grave',
      icon: 'ambulance',
      color: '#dc2626',
      bgColor: '#fef2f2',
      description: 'Patient présentant un traumatisme sévère nécessitant une prise en charge urgente'
    },
    {
      id: 'infarctus',
      title: "Code d'infarctus",
      icon: 'heart-pulse',
      color: '#ea580c',
      bgColor: '#fff7ed',
      description: "Suspicion d'infarctus du myocarde nécessitant une intervention cardiaque"
    },
    {
      id: 'avc',
      title: 'Code de AVC',
      icon: 'brain',
      color: '#2563eb',
      bgColor: '#eff6ff',
      description: 'Suspicion d\'accident vasculaire cérébral nécessitant une imagerie urgente'
    },
    {
      id: 'pcr',
      title: 'Code de PCR',
      icon: 'brain',
      color: '#2563eb',
      bgColor: '#eff6ff',
      description: ''
    },
    
    
  ];

  const handleSelectCode = (code: string) => {
    setSelectedCode(code);
    setForm(prev => ({
      ...prev,
      codePreAlerte: code
    }));
  };

  const handleConfirm = () => {
    onClose();
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
          {/* En-tête */}
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Codes de Pré-alerte Hospitalière</Text>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <Feather name="x" size={24} color="#64748b" />
            </TouchableOpacity>
          </View>

          <Text style={styles.modalSubtitle}>
            Sélectionnez le code correspondant à l'état du patient
          </Text>

          {/* Liste des codes */}
          <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
            {codesAlerte.map((code) => (
              <TouchableOpacity
                key={code.id}
                style={[
                  styles.codeCard,
                  selectedCode === code.id && styles.codeCardSelected,
                  { borderLeftColor: code.color }
                ]}
                onPress={() => handleSelectCode(code.id)}
              >
                <View style={[styles.codeIconContainer, { backgroundColor: code.bgColor }]}>
                  
                </View>
                
                <View style={styles.codeContent}>
                  <Text style={styles.codeTitle}>{code.title}</Text>
                  <Text style={styles.codeDescription}>{code.description}</Text>
                </View>
                
                <View style={styles.radioContainer}>
                  {selectedCode === code.id ? (
                    <View style={[styles.radioSelected, { backgroundColor: code.color }]}>
                      <Feather name="check" size={16} color="white" />
                    </View>
                  ) : (
                    <View style={styles.radio} />
                  )}
                </View>
              </TouchableOpacity>
            ))}
          </ScrollView>

          {/* Boutons */}
          <View style={styles.buttonContainer}>
            <TouchableOpacity 
              style={[styles.button, styles.cancelButton]} 
              onPress={onClose}
            >
              <Text style={styles.cancelButtonText}>Annuler</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[styles.button, styles.confirmButton, !selectedCode && styles.buttonDisabled]} 
              onPress={handleConfirm}
              disabled={!selectedCode}
            >
              <Text style={styles.confirmButtonText}>Confirmer</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

export const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalView: {
    width: screenWidth * 0.9,
    maxHeight: screenHeight * 0.8,
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
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
  modalSubtitle: {
    fontSize: 14,
    color: '#64748b',
    marginBottom: 20,
  },
  scrollView: {
    maxHeight: screenHeight * 0.5,
    marginBottom: 20,
  },
  codeCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#f8fafc',
    borderRadius: 12,
    marginBottom: 12,
    borderLeftWidth: 4,
    borderLeftColor: '#e2e8f0',
  },
  codeCardSelected: {
    backgroundColor: '#f1f5f9',
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  codeIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  codeContent: {
    flex: 1,
  },
  codeTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1e293b',
    marginBottom: 4,
  },
  codeDescription: {
    fontSize: 14,
    color: '#64748b',
  },
  radioContainer: {
    marginLeft: 10,
  },
  radio: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#cbd5e1',
  },
  radioSelected: {
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  button: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginHorizontal: 5,
  },
  cancelButton: {
    backgroundColor: '#f1f5f9',
  },
  confirmButton: {
    backgroundColor: '#3b82f6',
  },
  buttonDisabled: {
    backgroundColor: '#cbd5e1',
  },
  cancelButtonText: {
    color: '#64748b',
    fontWeight: '600',
  },
  confirmButtonText: {
    color: 'white',
    fontWeight: '600',
  },
});

export default CodeAlerteModal;
