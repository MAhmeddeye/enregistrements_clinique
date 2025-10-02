import { CirculatoireModalProps } from "@/lib/context";
import { Modal, ScrollView, Text, TouchableOpacity, View } from "react-native";
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { StyleSheet } from 'react-native';
import { CouleurPeauType, EtatPeauType, ExamansCirculatoireType, HydratationPeauType, PoulsStatus, RemplissageCapillaireType, RythmeCardiaqueType, TemperaturePeauType } from "@/lib/types";
import { Picker } from "@react-native-picker/picker";
import { useState } from "react";

export const CirculatoireModal = ({ visible, onClose, form, setForm }: CirculatoireModalProps) => {
  const [activeSection, setActiveSection] = useState<string | null>(null);

  const toggleSection = (section: string) => {
    setActiveSection(activeSection === section ? null : section);
  };

  const renderPickerItem = (label: string, value: string) => (
    <Picker.Item 
      label={label} 
      value={value} 
      style={styles.pickerItem}
    />
  );

  const handleSave = () => {
 const circulatoireData: ExamansCirculatoireType = {
  etatPeau: form.etatPeau,
  temperaturePeau: form.temperaturePeau,
  hydratationPeau: form.hydratationPeau,
  couleurPeau: form.couleurPeau,
  rythmeCardiaque: form.rythmeCardiaque,
  remplissageCapillaire: form.remplissageCapillaire,
  pouls_radial: form.pouls_radial,
  pouls_femoral: form.pouls_femoral,
  pouls_carotide: form.pouls_carotide,
};


  setForm({ 
    ...form, 
    examansCirculatoire: circulatoireData 
  });

  onClose();
};

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <View style={styles.headerTitleContainer}>
              <MaterialCommunityIcons name="heart-pulse" size={24} color="#fff" />
              <Text style={styles.modalTitle}>Examen Circulatoire</Text>
            </View>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <MaterialIcons name="close" size={24} color="#fff" />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.modalContent} showsVerticalScrollIndicator={false}>
            {/* État de la peau */}
            <TouchableOpacity 
              style={styles.sectionHeader}
              onPress={() => toggleSection('peau')}
              activeOpacity={0.7}
            >
              <View style={styles.sectionTitleContainer}>
                <MaterialCommunityIcons name="face-man" size={24} color="black" />
                <Text style={styles.sectionTitle}>État de la peau</Text>
              </View>
              <MaterialIcons 
                name={activeSection === 'peau' ? 'expand-less' : 'expand-more'} 
                size={24} 
                color="#6B7280" 
              />
            </TouchableOpacity>

            {activeSection === 'peau' && (
              <View style={styles.sectionContent}>
                {/* État */}
                <View style={styles.inputGroup}>
                  <View style={styles.labelContainer}>
                    <MaterialCommunityIcons name="texture-box" size={16} color="#4B5563" />
                    <Text style={styles.label}>État</Text>
                  </View>
                  <Picker
                    selectedValue={form.etatPeau || ""}
                    onValueChange={(val) => setForm({ ...form, etatPeau: val as EtatPeauType })}
                    style={styles.picker}
                  >
                    {renderPickerItem("Sélectionner", "")}
                    {renderPickerItem("Normal", "Normal")}
                    {renderPickerItem("Anormal", "Anormal")}
                  </Picker>
                </View>

                {/* Température */}
                <View style={styles.inputGroup}>
                  <View style={styles.labelContainer}>
                    <MaterialCommunityIcons name="thermometer" size={16} color="#4B5563" />
                    <Text style={styles.label}>Température</Text>
                  </View>
                  <Picker
                    selectedValue={form.temperaturePeau || ""}
                    onValueChange={(val) => setForm({ ...form, temperaturePeau: val as TemperaturePeauType })}
                    style={styles.picker}
                  >
                    {renderPickerItem("Sélectionner", "")}
                    {renderPickerItem("Normal", "Normal")}
                    {renderPickerItem("Froide", "Froide")}
                    {renderPickerItem("Chaude", "Chaude")}
                  </Picker>
                </View>

                {/* Hydratation */}
                <View style={styles.inputGroup}>
                  <View style={styles.labelContainer}>
                    <MaterialCommunityIcons name="water" size={16} color="#4B5563" />
                    <Text style={styles.label}>Hydratation</Text>
                  </View>
                  <Picker
                    selectedValue={form.hydratationPeau || ""}
                    onValueChange={(val) => setForm({ ...form, hydratationPeau: val as HydratationPeauType })}
                    style={styles.picker}
                  >
                    {renderPickerItem("Sélectionner", "")}
                    {renderPickerItem("Normal", "Normal")}
                    {renderPickerItem("Sèche", "Sèche")}
                    {renderPickerItem("Mouillée", "Mouillée")}
                  </Picker>
                </View>

                {/* Couleur */}
                <View style={styles.inputGroup}>
                  <View style={styles.labelContainer}>
                    <MaterialCommunityIcons name="palette" size={16} color="#4B5563" />
                    <Text style={styles.label}>Couleur</Text>
                  </View>
                  <Picker
                    selectedValue={form.couleurPeau || ""}
                    onValueChange={(val) => setForm({ ...form, couleurPeau: val as CouleurPeauType })}
                    style={styles.picker}
                  >
                    {renderPickerItem("Sélectionner la couleur", "")}
                    {renderPickerItem("Normal", "Normal")}
                    {renderPickerItem("Pâle", "Pâle")}
                    {renderPickerItem("Cyanotique", "Cyanotique")}
                    {renderPickerItem("Érythémateux", "Érythémateux")}
                    {renderPickerItem("Ictérique", "Ictérique")}
                  </Picker>
                </View>
              </View>
            )}

            {/* Rythme cardiaque */}
            <TouchableOpacity 
              style={styles.sectionHeader}
              onPress={() => toggleSection('rythme')}
              activeOpacity={0.7}
            >
              <View style={styles.sectionTitleContainer}>
                <MaterialCommunityIcons name="heart" size={20} color="#EF4444" />
                <Text style={styles.sectionTitle}>Rythme cardiaque</Text>
              </View>
              <MaterialIcons 
                name={activeSection === 'rythme' ? 'expand-less' : 'expand-more'} 
                size={24} 
                color="#6B7280" 
              />
            </TouchableOpacity>

            {activeSection === 'rythme' && (
              <View style={styles.sectionContent}>
                <View style={styles.inputGroup}>
                  <View style={styles.labelContainer}>
                    <MaterialCommunityIcons name="heart-flash" size={16} color="#4B5563" />
                    <Text style={styles.label}>Battement de cœur</Text>
                  </View>
                  <Picker
                    selectedValue={form.rythmeCardiaque || ""}
                    onValueChange={(val) => setForm({ ...form, rythmeCardiaque: val as RythmeCardiaqueType })}
                    style={styles.picker}
                  >
                    {renderPickerItem("Sélectionner", "")}
                    {renderPickerItem("Rythmique", "Rythmique")}
                    {renderPickerItem("Arythmique", "Arythmique")}
                  </Picker>
                </View>

                <View style={styles.inputGroup}>
                  <View style={styles.labelContainer}>
                    <MaterialCommunityIcons name="timer" size={16} color="#4B5563" />
                    <Text style={styles.label}>Remplissage capillaire</Text>
                  </View>
                  <Picker
                    selectedValue={form.remplissageCapillaire || ""}
                    onValueChange={(val) => setForm({ ...form, remplissageCapillaire: val as RemplissageCapillaireType })}
                    style={styles.picker}
                  >
                    {renderPickerItem("Sélectionner", "")}
                    {renderPickerItem("≤ 2 secondes", "≤2s")}
                    {renderPickerItem("> 2 secondes", ">2s")}
                  </Picker>
                </View>
              </View>
            )}

            {/* Pouls */}
            <TouchableOpacity 
              style={styles.sectionHeader}
              onPress={() => toggleSection('pouls')}
              activeOpacity={0.7}
            >
              <View style={styles.sectionTitleContainer}>
                <MaterialCommunityIcons name="pulse" size={20} color="#10B981" />
                <Text style={styles.sectionTitle}>Pouls</Text>
              </View>
              <MaterialIcons 
                name={activeSection === 'pouls' ? 'expand-less' : 'expand-more'} 
                size={24} 
                color="#6B7280" 
              />
            </TouchableOpacity>

            {activeSection === 'pouls' && (
              <View style={styles.sectionContent}>
                <View style={styles.inputGroup}>
                  <View style={styles.labelContainer}>
                    <MaterialCommunityIcons name="hand-pointing-right" size={16} color="#4B5563" />
                    <Text style={styles.label}>Radial</Text>
                  </View>
                  <Picker
                    selectedValue={form.pouls_radial || ""}
                    onValueChange={(val) => setForm({ ...form, pouls_radial: val as PoulsStatus })}
                    style={styles.picker}
                  >
                    {renderPickerItem("Sélectionner", "")}
                    {renderPickerItem("Normal", "Normal")}
                    {renderPickerItem("Faible", "Faible")}
                    {renderPickerItem("Absent", "Absent")}
                  </Picker>
                </View>

                <View style={styles.inputGroup}>
                  <View style={styles.labelContainer}>
                    <MaterialCommunityIcons name="run" size={16} color="#4B5563" />
                    <Text style={styles.label}>Fémoral</Text>
                  </View>
                  <Picker
                    selectedValue={form.pouls_femoral || ""}
                    onValueChange={(val) => setForm({ ...form, pouls_femoral: val as PoulsStatus })}
                    style={styles.picker}
                  >
                    {renderPickerItem("Sélectionner", "")}
                    {renderPickerItem("Normal", "Normal")}
                    {renderPickerItem("Faible", "Faible")}
                    {renderPickerItem("Absent", "Absent")}
                  </Picker>
                </View>

                <View style={styles.inputGroup}>
                  <View style={styles.labelContainer}>
                    <MaterialCommunityIcons name="necklace" size={16} color="#4B5563" />
                    <Text style={styles.label}>Carotide</Text>
                  </View>
                  <Picker
                    selectedValue={form.pouls_carotide || ""}
                    onValueChange={(val) => setForm({ ...form, pouls_carotide: val as PoulsStatus })}
                    style={styles.picker}
                  >
                    {renderPickerItem("Sélectionner", "")}
                    {renderPickerItem("Normal", "Normal")}
                    {renderPickerItem("Faible", "Faible")}
                    {renderPickerItem("Absent", "Absent")}
                  </Picker>
                </View>
              </View>
            )}
          </ScrollView>

          <View style={styles.modalFooter}>
            <TouchableOpacity 
              style={[styles.modalButton, styles.saveButton]} 
              onPress={handleSave}
              activeOpacity={0.8}
            >
              <MaterialIcons name="check" size={20} color="#fff" />
              <Text style={styles.modalButtonText}>Enregistrer</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

// Styles inchangés
export const styles = StyleSheet.create({
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0, 0, 0, 0.5)', justifyContent: 'center', alignItems: 'center', padding: 16 },
  modalContainer: { width: '100%', maxWidth: 500, maxHeight: '90%', backgroundColor: '#FFFFFF', borderRadius: 20, overflow: 'hidden', shadowColor: '#000', shadowOffset: { width: 0, height: 10 }, shadowOpacity: 0.25, shadowRadius: 20, elevation: 10 },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 20, backgroundColor: '#5dbbfaff' },
  headerTitleContainer: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  modalTitle: { fontSize: 20, fontWeight: '700', color: '#FFFFFF' },
  closeButton: { padding: 4 },
  modalContent: { padding: 20, maxHeight: '70%' },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 16, backgroundColor: '#F9FAFB', borderRadius: 12, marginBottom: 12, borderWidth: 1, borderColor: '#E5E7EB' },
  sectionTitleContainer: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  sectionTitle: { fontSize: 16, fontWeight: '600', color: '#111827' },
  sectionContent: { backgroundColor: '#FFFFFF', borderRadius: 12, padding: 16, marginBottom: 16, borderWidth: 1, borderColor: '#F3F4F6' },
  inputGroup: { marginBottom: 16 },
  labelContainer: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 8 },
  label: { fontSize: 14, fontWeight: '500', color: '#374151' },
  pickerContainer: { borderWidth: 1, borderColor: '#D1D5DB', borderRadius: 10, backgroundColor: '#FFFFFF', overflow: 'hidden' },
  picker: { height: 50, width: '100%' },
  pickerItem: { fontSize: 14 },
  modalFooter: { padding: 20, borderTopWidth: 1, borderTopColor: '#E5E7EB', backgroundColor: '#F9FAFB' },
  modalButton: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center', padding: 16, borderRadius: 12, gap: 8 },
  saveButton: { backgroundColor: '#60bbf3ff' },
  modalButtonText: { fontSize: 16, fontWeight: '600', color: '#FFFFFF' },
});

export default CirculatoireModal;
