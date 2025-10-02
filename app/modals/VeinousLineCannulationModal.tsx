import React, { useState } from 'react';
import { 
  View, 
  Text, 
  TouchableOpacity, 
  Modal, 
  StyleSheet, 
  ScrollView,
  Dimensions,
  TextInput,
  Platform
} from 'react-native';

import { MaterialIcons, FontAwesome5, MaterialCommunityIcons } from '@expo/vector-icons';
import { Picker } from '@react-native-picker/picker';

const { width } = Dimensions.get('window');

interface VeinousLineCannulationModalProps {
  visible: boolean;
  onClose: () => void;
  form: any;
  setForm: (form: any) => void;
}

export default function VeinousLineCannulationModal({ 
  visible, 
  onClose, 
  form, 
  setForm 
}: VeinousLineCannulationModalProps) {
  const [catheterSize, setCatheterSize] = useState<string>(form.catheterSize || '');
  const [placement, setPlacement] = useState<string>(form.catheterPlacement || '');
  const [customPlacement, setCustomPlacement] = useState<string>(form.customCatheterPlacement || '');
  const [notes, setNotes] = useState<string>(form.catheterNotes || '');

  const catheterSizes = [
    '14G', '16G', '18G', '20G', '22G', '24G'
  ];

  const placementOptions = [
    'Avant-bras droit',
    'Avant-bras gauche',
    'Main droite',
    'Main gauche',
    'Pli du coude droit',
    'Pli du coude gauche',
    'Autre'
  ];

  const handleSave = () => {
    const finalPlacement = placement === 'Autre' ? customPlacement : placement;
    
    setForm({
      ...form,
      catheterSize,
      catheterPlacement: placement,
      customCatheterPlacement: customPlacement,
      catheterNotes: notes,
      venousCannulation: catheterSize && finalPlacement ? true : false
    });
    onClose();
  };

  const handleReset = () => {
    setCatheterSize('');
    setPlacement('');
    setCustomPlacement('');
    setNotes('');
    setForm({
      ...form,
      catheterSize: '',
      catheterPlacement: '',
      customCatheterPlacement: '',
      catheterNotes: '',
      venousCannulation: false
    });
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
    >
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          {/* En-tête du modal */}
          <View style={styles.modalHeader}>
            <View style={styles.headerIcon}>
              <MaterialCommunityIcons name="needle" size={24} color="#3b82f6" />
            </View>
            <Text style={styles.modalTitle}>Cannulation de Ligne Veineuse</Text>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <MaterialIcons name="close" size={24} color="#64748b" />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.modalBody}>
            <Text style={styles.sectionTitle}>Détails de la Cannulation</Text>
            
            {/* Calibre du cathéter */}
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Calibre du cathéter</Text>
              <View style={styles.pickerContainer}>
                <MaterialCommunityIcons name="pipe" size={20} color="#64748b" style={styles.inputIcon} />
                {Platform.OS === 'ios' ? (
                  <Picker
                    selectedValue={catheterSize}
                    onValueChange={(itemValue) => setCatheterSize(itemValue)}
                    style={styles.picker}
                  >
                    <Picker.Item label="Sélectionner un calibre" value="" />
                    {catheterSizes.map((size) => (
                      <Picker.Item key={size} label={size} value={size} />
                    ))}
                  </Picker>
                ) : (
                  <Picker
                    selectedValue={catheterSize}
                    onValueChange={(itemValue) => setCatheterSize(itemValue)}
                    style={styles.picker}
                    mode="dropdown"
                  >
                    <Picker.Item label="Sélectionner un calibre" value="" />
                    {catheterSizes.map((size) => (
                      <Picker.Item key={size} label={size} value={size} />
                    ))}
                  </Picker>
                )}
              </View>
            </View>

            {/* Emplacement */}
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Emplacement</Text>
              <View style={styles.pickerContainer}>
                <MaterialCommunityIcons name="human-handsdown" size={20} color="#64748b" style={styles.inputIcon} />
                {Platform.OS === 'ios' ? (
                  <Picker
                    selectedValue={placement}
                    onValueChange={(itemValue) => setPlacement(itemValue)}
                    style={styles.picker}
                  >
                    <Picker.Item label="Sélectionner un emplacement" value="" />
                    {placementOptions.map((option) => (
                      <Picker.Item key={option} label={option} value={option} />
                    ))}
                  </Picker>
                ) : (
                  <Picker
                    selectedValue={placement}
                    onValueChange={(itemValue) => setPlacement(itemValue)}
                    style={styles.picker}
                    mode="dropdown"
                  >
                    <Picker.Item label="Sélectionner un emplacement" value="" />
                    {placementOptions.map((option) => (
                      <Picker.Item key={option} label={option} value={option} />
                    ))}
                  </Picker>
                )}
              </View>
            </View>

            {/* Emplacement personnalisé */}
            {placement === 'Autre' && (
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Préciser l'emplacement</Text>
                <View style={styles.inputContainer}>
                  <MaterialIcons name="edit" size={20} color="#64748b" style={styles.inputIcon} />
                  <TextInput
                    style={styles.textInput}
                    value={customPlacement}
                    onChangeText={setCustomPlacement}
                    placeholder="Ex: Veine jugulaire, veine fémorale..."
                    placeholderTextColor="#94a3b8"
                  />
                </View>
              </View>
            )}

           

           
          </ScrollView>

          {/* Pied du modal avec boutons d'action */}
          <View style={styles.modalFooter}>
            <TouchableOpacity 
              style={styles.resetButton}
              onPress={handleReset}
            >
              <MaterialIcons name="refresh" size={18} color="#64748b" />
              <Text style={styles.resetButtonText}>Réinitialiser</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[styles.saveButton, (!catheterSize || !placement || (placement === 'Autre' && !customPlacement)) && styles.saveButtonDisabled]}
              onPress={handleSave}
              disabled={!catheterSize || !placement || (placement === 'Autre' && !customPlacement)}
            >
              <MaterialIcons name="save" size={18} color="white" />
              <Text style={styles.saveButtonText}>Enregistrer</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

export const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    padding: 20,
  },
  modalContent: {
    backgroundColor: 'white',
    borderRadius: 20,
    width: '100%',
    maxHeight: '90%',
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
    backgroundColor: '#f8fafc',
  },
  headerIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#dbeafe',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1e293b',
    flex: 1,
    marginLeft: 12,
  },
  closeButton: {
    padding: 4,
  },
  modalBody: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1e293b',
    marginBottom: 20,
  },
  inputGroup: {
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#334155',
    marginBottom: 8,
  },
  pickerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#cbd5e1',
    borderRadius: 10,
    backgroundColor: '#f8fafc',
    paddingHorizontal: 12,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#cbd5e1',
    borderRadius: 10,
    backgroundColor: '#f8fafc',
    paddingHorizontal: 12,
    height: 50,
  },
  inputIcon: {
    marginRight: 10,
  },
  picker: {
    flex: 1,
    height: 50,
    color: '#334155',
  },
  textInput: {
    flex: 1,
    height: 48,
    color: '#334155',
    fontSize: 16,
  },
  summaryContainer: {
    padding: 16,
    backgroundColor: '#f1f5f9',
    borderRadius: 12,
    marginTop: 10,
  },
  summaryTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#334155',
    marginBottom: 10,
  },
  summaryContent: {
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 12,
  },
  summaryItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  summaryLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#64748b',
  },
  summaryValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#334155',
  },
  modalFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: '#e2e8f0',
    backgroundColor: '#f8fafc',
  },
  resetButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 10,
    backgroundColor: '#f1f5f9',
    borderWidth: 1,
    borderColor: '#e2e8f0',
    gap: 8,
  },
  resetButtonText: {
    color: '#64748b',
    fontWeight: '600',
  },
  saveButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 10,
    backgroundColor: '#3b82f6',
    gap: 8,
  },
  saveButtonDisabled: {
    backgroundColor: '#93c5fd',
  },
  saveButtonText: {
    color: 'white',
    fontWeight: '600',
  },
});