import React, { useState } from 'react';
import { Dimensions, Modal, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

const { width, height } = Dimensions.get('window');

const COLORS = {
  primary: '#67c7f3ff',
  primaryLight: '#a3ddf9ff',
  primaryLighter: '#d8effdff',
  primaryDark: '#3ea8e0ff',
  text: '#2d3748ff',
  textLight: '#718096ff',
  background: '#ffffffff',
  card: '#f8fafcff',
  border: '#e2e8f0ff',
  success: '#48bb78ff',
  warning: '#ed8936ff',
  error: '#f56565ff'
};

export interface Neurologique {
  visible: boolean;
  onClose: () => void;
  form: any;
  setForm: React.Dispatch<React.SetStateAction<any>>;
}

export default function NeurologiqueModal({ visible, onClose, form, setForm }: Neurologique) {
  const [openSections, setOpenSections] = useState({
    conscience: false,
    orientation: false,
    perteConscience: false,
    pupilleGauche: false,
    pupilleDroite: false
  });

  const toggleSection = (section: keyof typeof openSections) => {
    setOpenSections(prev => ({ ...prev, [section]: !prev[section] }));
  };

  const conscienceOptions = [
    { value: 'Vigilance', icon: 'wb-sunny', color: COLORS.success },
    { value: 'Réaction verbale', icon: 'record-voice-over', color: COLORS.primary },
    { value: 'Réaction à la douleur', icon: 'healing', color: COLORS.warning },
    { value: 'Inconscience', icon: 'brightness-3', color: COLORS.error }
  ];

  const orientationOptions = [
    { value: 'Orienté', icon: 'explore', color: COLORS.success },
    { value: 'Confuse', icon: 'help-outline', color: COLORS.warning },
    { value: 'Désorienté', icon: 'not-listed-location', color: COLORS.warning },
    { value: 'Violent agressif', icon: 'warning', color: COLORS.error }
  ];

  const perteConscienceOptions = [
    { value: 'Oui', icon: 'check-circle', color: COLORS.error },
    { value: 'Non', icon: 'cancel', color: COLORS.success }
  ];

  const pupilleOptions = [
    { value: 'Miotique', icon: 'zoom-out', color: COLORS.primary },
    { value: 'Normal', icon: 'adjust', color: COLORS.success },
    { value: 'Mydriatique', icon: 'zoom-in', color: COLORS.error }
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
  ) => (
    <View style={styles.section}>
      <TouchableOpacity 
        style={[styles.sectionHeader, openSections[sectionKey] && styles.sectionHeaderActive]}
        onPress={() => toggleSection(sectionKey)}
        activeOpacity={0.7}
      >
        <View style={styles.sectionHeaderContent}>
          <View style={styles.iconContainer}>
            <MaterialIcons name={iconName} size={22} color={COLORS.primary} />
          </View>
          <Text style={styles.sectionTitle}>{title}</Text>
        </View>
        <View style={styles.sectionIndicator}>
          {selectedValue && (
            <View style={styles.selectedIndicator}>
              <MaterialIcons name="check-circle" size={16} color={COLORS.success} style={styles.indicatorIcon} />
            </View>
          )}
          <MaterialIcons
            name={openSections[sectionKey] ? "keyboard-arrow-up" : "keyboard-arrow-down"}
            size={24}
            color={COLORS.primary}
          />
        </View>
      </TouchableOpacity>

      {openSections[sectionKey] && (
        <View style={styles.optionsContainer}>
          {options.map((option, index) => (
            <TouchableOpacity
              key={index}
              style={[styles.optionButton, selectedValue === option.value && styles.selectedOption]}
              onPress={() => selectOption(fieldName, option.value)}
            >
              <View style={styles.optionContent}>
                <View style={[
                  styles.optionIconContainer,
                  { backgroundColor: selectedValue === option.value ? option.color : COLORS.primaryLighter }
                ]}>
                  <MaterialIcons name={option.icon} size={18} color={selectedValue === option.value ? '#fff' : option.color} />
                </View>
                <Text style={[styles.optionText, selectedValue === option.value && styles.selectedOptionText]}>
                  {option.value}
                </Text>
              </View>
              {selectedValue === option.value && <MaterialIcons name="check" size={20} color="#fff" />}
            </TouchableOpacity>
          ))}
        </View>
      )}

      {!openSections[sectionKey] && selectedValue && (
        <View style={styles.selectedPreview}>
          <View style={styles.selectedPreviewContent}>
            <View style={[styles.previewIconContainer, { backgroundColor: COLORS.primaryLighter }]}>
              <MaterialIcons 
                name={options.find(o => o.value === selectedValue)?.icon} 
                size={18} 
                color={options.find(o => o.value === selectedValue)?.color} 
              />
            </View>
            <Text style={styles.selectedPreviewText}>{selectedValue}</Text>
          </View>
        </View>
      )}
    </View>
  );

  const handleSave = () => {
    const neurologiqueData = {
      etatConscience: form.etatConscience || null,
      orientation: form.orientation || null,
      perteConscience: form.perteConscience || null,
      pupilleGauche: form.pupilleGauche || null,
      pupilleDroite: form.pupilleDroite || null,
      reactiviteGauche: form.reactiviteGauche || null,
      reactiviteDroite: form.reactiviteDroite || null,
    };

    setForm({
      ...form,
      examans_neuralogique: neurologiqueData,
    });

    onClose();
  };

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View style={styles.modalOverlay}>
        <View style={styles.modalContainer}>
          {/* Header */}
          <View style={styles.modalHeader}>
            <View style={styles.modalHeaderContent}>
              <View style={styles.titleContainer}>
                <MaterialIcons name="keyboard" size={28} color="#fff" />
                <Text style={styles.modalHeaderText}>Examen Neurologique</Text>
              </View>
              <Text style={styles.modalSubtitle}>Évaluation des fonctions cérébrales</Text>
            </View>
            <TouchableOpacity onPress={onClose} style={styles.closeIcon}>
              <MaterialIcons name="close" size={24} color="#fff" />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.modalContent} showsVerticalScrollIndicator={false}>
            {renderDropdown('conscience', 'Niveau de conscience', 'psychology', conscienceOptions, 'etatConscience', form.etatConscience)}
            {renderDropdown('orientation', 'Orientation', 'navigation', orientationOptions, 'orientation', form.orientation)}
            {renderDropdown('perteConscience', 'Perte de conscience antérieure', 'history', perteConscienceOptions, 'perteConscience', form.perteConscience)}

            {/* Pupilles */}
            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <View style={styles.sectionHeaderContent}>
                  <View style={styles.iconContainer}>
                    <MaterialIcons name="remove-red-eye" size={22} color={COLORS.primary} />
                  </View>
                  <Text style={styles.sectionTitle}>Taille des pupilles</Text>
                </View>
              </View>
              <View style={styles.pupilContainer}>
                <View style={styles.pupilSubSection}>
                  {renderDropdown('pupilleGauche', 'Œil gauche', 'visibility', pupilleOptions, 'pupilleGauche', form.pupilleGauche)}
                </View>
                <View style={styles.pupilSubSection}>
                  {renderDropdown('pupilleDroite', 'Œil droit', 'visibility', pupilleOptions, 'pupilleDroite', form.pupilleDroite)}
                </View>
              </View>
            </View>

            {/* Réactivité pupillaire */}
            <View style={styles.section}>
              <View style={styles.reactivityContainer}>
                <TouchableOpacity 
                  style={[styles.reactivityButton, form.reactiviteGauche === 'Normale' && styles.reactivityButtonSelected]}
                  onPress={() => setForm({...form, reactiviteGauche: 'Normale'})}
                >
                  <Text style={[styles.reactivityText, form.reactiviteGauche === 'Normale' && styles.reactivityTextSelected]}>
                    Gauche: {form.reactiviteGauche || 'Normale'}
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity 
                  style={[styles.reactivityButton, form.reactiviteDroite === 'Normale' && styles.reactivityButtonSelected]}
                  onPress={() => setForm({...form, reactiviteDroite: 'Normale'})}
                >
                  <Text style={[styles.reactivityText, form.reactiviteDroite === 'Normale' && styles.reactivityTextSelected]}>
                    Droite: {form.reactiviteDroite || 'Normale'}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </ScrollView>

          {/* Footer */}
          <View style={styles.modalFooter}>
            <TouchableOpacity style={styles.cancelButton} onPress={onClose}>
              <Text style={styles.cancelButtonText}>Annuler</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
              <MaterialIcons name="check" size={20} color="#fff" style={styles.saveIcon} />
              <Text style={styles.saveButtonText}>Enregistrer</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

// (styles restent inchangés)
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
    backgroundColor: COLORS.background,
    borderRadius: 20,
    overflow: 'hidden',
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 12,
  },

  // Header du modal
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    backgroundColor: COLORS.primary,
    paddingHorizontal: 24,
    paddingVertical: 24,
  },
  modalHeaderContent: {
    flex: 1,
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  modalHeaderText: {
    color: '#fff',
    fontSize: 22,
    fontWeight: '700',
    marginLeft: 12,
    letterSpacing: 0.5,
  },
  modalSubtitle: {
    color: 'rgba(255,255,255,0.9)',
    fontSize: 14,
    marginLeft: 40,
    fontWeight: '500',
  },
  closeIcon: {
    padding: 4,
    marginTop: 4,
  },

  // Contenu du modal
  modalContent: {
    paddingHorizontal: 20,
    paddingVertical: 24,
    maxHeight: height * 0.6,
  },

  // Section
  section: {
    marginBottom: 20,
    backgroundColor: COLORS.background,
    borderRadius: 16,
    padding: 0,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: COLORS.border,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 18,
    backgroundColor: COLORS.card,
  },
  sectionHeaderActive: {
    backgroundColor: COLORS.primaryLighter,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  sectionHeaderContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.primaryLight,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.text,
  },
  sectionIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  selectedIndicator: {
    marginRight: 10,
  },
  indicatorIcon: {
    backgroundColor: '#fff',
    borderRadius: 10,
  },

  // Options container
  optionsContainer: {
    padding: 8,
  },
  optionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 12,
    marginBottom: 6,
  },
  optionContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  optionIconContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
  },
  optionText: {
    fontSize: 15,
    color: COLORS.text,
    fontWeight: '500',
  },
  selectedOption: {
    backgroundColor: COLORS.primaryLighter,
  },
  selectedOptionText: {
    color: COLORS.primaryDark,
    fontWeight: '600',
  },

  // Selected preview
  selectedPreview: {
    padding: 16,
    paddingTop: 0,
  },
  selectedPreviewContent: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.card,
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  previewIconContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
    backgroundColor: COLORS.primaryLight,
  },
  selectedPreviewText: {
    fontSize: 15,
    color: COLORS.text,
    fontWeight: '500',
  },

  // Pupilles
  pupilContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 16,
    paddingTop: 0,
    gap: 12,
  },
  pupilSubSection: {
    flex: 1,
  },

  // Réactivité pupillaire
  reactivityContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 16,
    paddingTop: 0,
    gap: 12,
  },
  reactivityButton: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
    backgroundColor: COLORS.card,
    borderWidth: 1,
    borderColor: COLORS.border,
    alignItems: 'center',
  },
  reactivityButtonSelected: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  reactivityText: {
    fontSize: 14,
    color: COLORS.textLight,
    fontWeight: '500',
  },
  reactivityTextSelected: {
    color: '#fff',
    fontWeight: '600',
  },

  // Footer
  modalFooter: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    padding: 20,
    borderTopWidth: 1,
    borderColor: COLORS.border,
    backgroundColor: COLORS.card,
    gap: 12,
  },
  cancelButton: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 10,
    backgroundColor: COLORS.background,
    borderWidth: 1,
    borderColor: COLORS.border,
    minWidth: 100,
    alignItems: 'center',
  },
  cancelButtonText: {
    color: COLORS.textLight,
    fontSize: 16,
    fontWeight: '600',
  },
  saveButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 10,
    backgroundColor: COLORS.primary,
    minWidth: 140,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 3,
  },
  saveIcon: {
    marginRight: 8,
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});
