import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, TextInput, Platform, Modal, StyleSheet, Dimensions } from 'react-native';
import { FormType } from '@/lib/types';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

const { width } = Dimensions.get('window');

interface MobilisationModalProps {
  visible: boolean;
  onClose: () => void;
  form: FormType;
  setForm: React.Dispatch<React.SetStateAction<FormType>>;
}

export default function MobilisationModal({ visible, onClose, form, setForm }: MobilisationModalProps) {
  const [autresTechniques, setAutresTechniques] = useState(form.technique_autres ?? '');

  // ✅ Toggle technique de manière safe
  const toggleTechnique = (technique: string) => {
    setForm(prev => ({
      ...prev,
      technique_immobilisation: prev.technique_immobilisation
        ? prev.technique_immobilisation.includes(technique)
          ? prev.technique_immobilisation.filter(t => t !== technique)
          : [...prev.technique_immobilisation, technique]
        : [technique], // si undefined, on crée un tableau avec la technique sélectionnée
    }));
  };

  const handleSave = () => {
    setForm(prev => ({
      ...prev,
      technique_autres: autresTechniques,
    }));
    onClose();
  };

  const techniques = [
    { key: 'technique_colier_cervical', label: 'Collier cervical' },
    { key: 'technique_brancard_pagaie', label: 'Brancard de pagaie' },
    { key: 'technique_corset_spinal', label: 'Corset spinal' },
    { key: 'technique_planche_dorsale', label: 'Planche dorsale' },
    { key: 'technique_attelle_membre', label: 'Attelle de membre' },
    { key: 'technique_aspirateur_metalas', label: 'Aspirateur metalas' },
    { key: 'technique_immobilisateur_tetracameral', label: 'Immobilisateur tétracaméral' },
    { key: 'technique_retrait_casque', label: 'Retrait du casque par les membres d’équipe' },
  ];

  const selectedCount = form.technique_immobilisation?.length ?? 0;
  const hasOtherTechniques = autresTechniques.trim() !== '';

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Techniques d'Immobilisation</Text>
            <TouchableOpacity onPress={onClose}>
              <MaterialIcons name="close" size={24} color="#64748b" />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.modalBody}>
            <Text style={styles.inputLabel}>Sélectionnez les techniques utilisées :</Text>

            <View style={{ flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' }}>
              {techniques.map(tech => {
                const isSelected = form.technique_immobilisation?.includes(tech.key) ?? false;
                return (
                  <TouchableOpacity
                    key={tech.key}
                    style={[styles.checkboxItem, isSelected && styles.checkboxItemSelected, { width: '48%', marginBottom: 8 }]}
                    onPress={() => toggleTechnique(tech.key)}
                  >
                    <View style={styles.checkbox}>
                      {isSelected && <MaterialIcons name="check" size={20} color="#3b82f6" />}
                    </View>
                    <Text style={styles.checkboxLabel}>{tech.label}</Text>
                  </TouchableOpacity>
                );
              })}
            </View>

            <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 8 }}>
              <View
                style={{
                  width: 8,
                  height: 8,
                  borderRadius: 4,
                  backgroundColor: selectedCount > 0 || hasOtherTechniques ? '#10b981' : '#94a3b8',
                  marginRight: 6,
                }}
              />
              <Text style={{ fontSize: 12, color: '#64748b' }}>
                {selectedCount} technique(s) sélectionnée(s)
                {hasOtherTechniques && ' + autres techniques'}
              </Text>
            </View>

            <View style={{ marginTop: 16 }}>
              <Text style={styles.autresTechniquesLabel}>Autres techniques :</Text>
              <TextInput
                style={styles.autresTechniquesInput}
                value={autresTechniques}
                onChangeText={setAutresTechniques}
                multiline
              />
            </View>
          </ScrollView>

          <View style={styles.modalFooter}>
            <TouchableOpacity style={[styles.secondaryButton, { flex: 1 }]} onPress={onClose}>
              <Text style={styles.secondaryButtonText}>Annuler</Text>
            </TouchableOpacity>

            <TouchableOpacity style={[styles.primaryButton, { flex: 1 }]} onPress={handleSave}>
              <Text style={styles.primaryButtonText}>Enregistrer</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

// 🔹 Styles simplifiés pour exemple
const styles = StyleSheet.create({
  modalContainer: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', alignItems: 'center' },
  modalContent: { backgroundColor: 'white', borderRadius: 20, width: '90%', maxHeight: '80%' },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 16, borderBottomWidth: 1, borderBottomColor: '#e2e8f0' },
  modalTitle: { fontSize: 18, fontWeight: '700' },
  modalBody: { padding: 16 },
  modalFooter: { flexDirection: 'row', justifyContent: 'flex-end', padding: 16, gap: 12 },
  inputLabel: { fontSize: 14, fontWeight: '600', marginBottom: 8 },
  checkboxItem: { flexDirection: 'row', alignItems: 'center', padding: 12, marginVertical: 4, backgroundColor: '#f8fafc', borderRadius: 8, borderWidth: 1, borderColor: '#e2e8f0' },
  checkboxItemSelected: { backgroundColor: '#dbeafe', borderColor: '#3b82f6' },
  checkbox: { width: 24, height: 24, borderRadius: 4, borderWidth: 2, borderColor: '#3b82f6', marginRight: 12, alignItems: 'center', justifyContent: 'center' },
  checkboxLabel: { fontSize: 14, color: '#334155' },
  primaryButton: { backgroundColor: '#3b82f6', padding: 16, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  primaryButtonText: { color: 'white', fontWeight: '600' },
  secondaryButton: { backgroundColor: '#f1f5f9', padding: 16, borderRadius: 12, alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: '#e2e8f0' },
  secondaryButtonText: { color: '#64748b', fontWeight: '600' },
  autresTechniquesLabel: { fontSize: 14, fontWeight: '600', marginBottom: 4 },
  autresTechniquesInput: { backgroundColor: '#f8fafc', borderWidth: 1, borderColor: '#e2e8f0', borderRadius: 8, padding: 12, minHeight: 80, textAlignVertical: 'top' },
});
