import React, { useState } from 'react';
import { Modal, View, Text, TouchableOpacity, ScrollView, Dimensions } from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { StyleSheet } from 'react-native';

const { width, height } = Dimensions.get('window');
interface Props {
  visible: boolean;
  onClose: () => void;
  form: any;
  setForm: React.Dispatch<React.SetStateAction<any>>;
}

export default function NeurologiqueModal({ visible, onClose, form, setForm }: Props) {
  const [openSections, setOpenSections] = useState({
    conscience: false,
    orientation: false,
    perteConscience: false,
    pupilleGauche: false,
    pupilleBien: false
  });

  const toggleSection = (section: keyof typeof openSections) => {
    setOpenSections(prev => ({ ...prev, [section]: !prev[section] }));
  };

  const conscienceOptions = [
    { value: 'Vigilance', icon: 'visibility', color: '#4CAF50' },
    { value: 'Réaction verbale', icon: 'record-voice-over', color: '#2196F3' },
    { value: 'Réaction à la douleur', icon: 'healing', color: '#FF9800' },
    { value: 'Inconscience', icon: 'visibility-off', color: '#F44336' }
  ];

  const orientationOptions = [
    { value: 'Orienté', icon: 'explore', color: '#4CAF50' },
    { value: 'Confuse', icon: 'help-outline', color: '#FFC107' },
    { value: 'Désorienté', icon: 'not-listed-location', color: '#FF9800' },
    { value: 'Violent agressif', icon: 'warning', color: '#F44336' }
  ];

  const perteConscienceOptions = [
    { value: 'Oui', icon: 'check-circle', color: '#F44336' },
    { value: 'Non', icon: 'cancel', color: '#4CAF50' }
  ];

  const pupilleOptions = [
    { value: 'Miotique', color: '#2196F3' },
    { value: 'Normal', color: '#4CAF50' },
    { value: 'Mydriatique', color: '#F44336' }
  ];

  const selectOption = (field: string, option: string) => {
    setForm({ ...form, [field]: option });
    setOpenSections(prev => ({ ...prev, [field]: false }));
  };

  const renderDropdown = (
    sectionKey: keyof typeof openSections,
    title: string,
    iconName: string,
    options: any[],
    fieldName: string,
    selectedValue: string
  ) => {
    return (
      <View style={styles.section}>
        <TouchableOpacity 
          style={styles.sectionHeader}
          onPress={() => toggleSection(sectionKey)}
          activeOpacity={0.7}
        >
          <View style={styles.sectionHeaderContent}>
            <MaterialIcons name={iconName} size={20} color="#7E57C2" />
            <Text style={styles.sectionTitle}>{title}</Text>
          </View>
          <MaterialIcons
            name={openSections[sectionKey] ? "keyboard-arrow-up" : "keyboard-arrow-down"}
            size={22}
            color="#7E57C2"
          />
        </TouchableOpacity>
        
        {openSections[sectionKey] && (
          <View style={styles.optionsContainer}>
            {options.map((option, index) => (
              <TouchableOpacity
                key={index}
                style={[
                  styles.optionButton,
                  selectedValue === option.value && styles.selectedOption
                ]}
                onPress={() => selectOption(fieldName, option.value)}
              >
                {option.icon && (
                  <MaterialIcons 
                    name={option.icon} 
                    size={18} 
                    color={selectedValue === option.value ? '#fff' : option.color} 
                    style={styles.optionIcon}
                  />
                )}
                <Text style={[
                  styles.optionText,
                  selectedValue === option.value && styles.selectedOptionText
                ]}>
                  {option.value}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        )}
        
        {!openSections[sectionKey] && selectedValue && (
          <View style={styles.selectedPreview}>
            <View style={styles.selectedPreviewContent}>
              {options.find(o => o.value === selectedValue)?.icon && (
                <MaterialIcons 
                  name={options.find(o => o.value === selectedValue)?.icon} 
                  size={16} 
                  color={options.find(o => o.value === selectedValue)?.color} 
                />
              )}
              <Text style={styles.selectedPreviewText}>{selectedValue}</Text>
            </View>
          </View>
        )}
      </View>
    );
  };

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View style={styles.modalOverlay}>
        <View style={styles.modalContainer}>
          {/* Header */}
          <View style={styles.modalHeader}>
            <Text style={styles.modalHeaderText}>Examen Neurologique</Text>
            <TouchableOpacity onPress={onClose} style={styles.closeIcon}>
              <MaterialIcons name="close" size={24} color="#fff" />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.modalContent}>
            {renderDropdown(
              'conscience', 
              'Niveau de conscience', 
              'psychology', 
              conscienceOptions, 
              'etatConscience', 
              form.etatConscience
            )}
            
            {renderDropdown(
              'orientation', 
              'Orientation', 
              'navigation', 
              orientationOptions, 
              'orientation', 
              form.orientation
            )}
            
            {renderDropdown(
              'perteConscience', 
              'Perte de conscience antérieure', 
              'history', 
              perteConscienceOptions, 
              'perteConscience', 
              form.perteConscience
            )}

            {/* Taille des élèves */}
            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <MaterialIcons name="remove-red-eye" size={20} color="#7E57C2" />
                <Text style={styles.sectionTitle}>Taille des élèves</Text>
              </View>
              
              <View style={styles.pupilContainer}>
                <View style={styles.pupilSubSection}>
                  {renderDropdown(
                    'pupilleGauche', 
                    'Gauche', 
                    'visibility', 
                    pupilleOptions, 
                    'pupilleGauche', 
                    form.pupilleGauche
                  )}
                </View>
                
                <View style={styles.pupilSubSection}>
                  {renderDropdown(
                    'pupilleBien', 
                    'Bien', 
                    'visibility', 
                    pupilleOptions, 
                    'pupilleBien', 
                    form.pupilleBien
                  )}
                </View>
              </View>
            </View>
          </ScrollView>

          <View style={styles.modalFooter}>
            <TouchableOpacity style={styles.saveButton} onPress={onClose}>
              <Text style={styles.saveButtonText}>Enregistrer</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  // Overlay du modal
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },

  // Container principal
  modalContainer: {
    width: '100%',
    maxHeight: '90%',
    backgroundColor: '#fff',
    borderRadius: 16,
    overflow: 'hidden',
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
  },

  // Header du modal
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#7E57C2',
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  modalHeaderText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '700',
  },
  closeIcon: {
    padding: 4,
  },

  // Contenu du modal
  modalContent: {
    paddingHorizontal: 20,
    paddingVertical: 16,
  },

  // Section
  section: {
    marginBottom: 20,
    backgroundColor: '#f8f9fc',
    borderRadius: 12,
    padding: 16,
    overflow: 'hidden',
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  sectionHeaderContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
    color: '#2D3748',
  },

  // Options container
  optionsContainer: {
    marginTop: 12,
    borderRadius: 8,
    backgroundColor: '#fff',
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  optionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
  },
  optionIcon: {
    marginRight: 12,
  },
  optionText: {
    fontSize: 15,
    color: '#2D3748',
  },
  selectedOption: {
    backgroundColor: '#7E57C2',
  },
  selectedOptionText: {
    color: '#fff',
    fontWeight: '500',
  },

  // Selected preview
  selectedPreview: {
    marginTop: 12,
  },
  selectedPreviewContent: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  selectedPreviewText: {
    fontSize: 15,
    color: '#2D3748',
    marginLeft: 8,
    fontWeight: '500',
  },

  // Pupil section
  pupilContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 12,
  },
  pupilSubSection: {
    width: '48%',
  },

  // Footer
  modalFooter: {
    padding: 20,
    borderTopWidth: 1,
    borderColor: '#E2E8F0',
    backgroundColor: '#F8F9FC',
  },
  saveButton: {
    backgroundColor: '#7E57C2',
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#7E57C2',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});