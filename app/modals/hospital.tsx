// HospitalModal.tsx
import React from "react";
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import { FormType } from "@/lib/types";
import { SafeAreaView } from "react-native-safe-area-context";

type Props = {
  visible: boolean;
  onClose: () => void;
  form: FormType;
  setForm: React.Dispatch<React.SetStateAction<FormType>>;
};

// Liste des hôpitaux mauritaniens (extrait principal)
const hospitals = [
  { id: "H1", name: "Centre Hospitalier National de Nouakchott" },
  { id: "H2", name: "Hôpital Cheikh Zayed" },
  { id: "H3", name: "Hôpital Militaire de Nouakchott" },
  { id: "H4", name: "Centre Hospitalier Mère et Enfant" },
  { id: "H5", name: "Hôpital de l'Amitié" },
  { id: "H6", name: "Centre National de Cardiologie" },
  { id: "H7", name: "Centre National d'Oncologie" },
  { id: "H8", name: "Hôpital Sabah" },
  { id: "H9", name: "Hôpital Régional de Kaédi" },
  { id: "H10", name: "Hôpital Régional de Sélibaby" },
  { id: "H11", name: "Centre Hospitalier d'Aioun" },
  { id: "H12", name: "Centre Hospitalier Akjoujt" },
];

export default function HospitalModal({ visible, onClose, form, setForm }: Props) {
  // Trouver l'hôpital sélectionné basé sur le nom stocké dans le form
  const selectedHospital = hospitals.find(h => h.name === form.hospitalDestination) || hospitals[0];

  return (
    <Modal visible={visible} animationType="slide" transparent onRequestClose={onClose}>
      <SafeAreaView style={styles.overlay}>
        <View style={styles.container}>
          <Text style={styles.title}>Choisir l'hôpital de destination</Text>

          <View style={styles.pickerWrapper}>
            <Picker
              selectedValue={selectedHospital.name}
              onValueChange={(val) =>
                setForm((prev) => ({ ...prev, hospitalDestination: String(val) }))
              }
              mode="dropdown"
            >
              {hospitals.map((h) => (
                <Picker.Item key={h.id} label={h.name} value={h.name} />
              ))}
            </Picker>
          </View>

          <View style={styles.selectedHospital}>
            <Text style={styles.selectedLabel}>Hôpital sélectionné :</Text>
            <Text style={styles.selectedName}>{selectedHospital.name}</Text>
          </View>

          <View style={styles.buttonsRow}>
            <TouchableOpacity style={[styles.btn, styles.cancelBtn]} onPress={onClose}>
              <Text style={styles.btnText}>Annuler</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.btn, styles.confirmBtn]} onPress={onClose}>
              <Text style={[styles.btnText, { color: "#fff" }]}>Valider</Text>
            </TouchableOpacity>
          </View>
        </View>
      </SafeAreaView>
    </Modal>
  );
}

export const styles = StyleSheet.create({
  overlay: { 
    flex: 1, 
    backgroundColor: "rgba(0,0,0,0.45)", 
    justifyContent: "center", 
    padding: 20 
  },
  container: { 
    backgroundColor: "#fff", 
    borderRadius: 16, 
    padding: 20, 
    elevation: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
  },
  title: { 
    fontSize: 20, 
    fontWeight: "700", 
    marginBottom: 16,
    color: "#1e293b",
    textAlign: "center"
  },
  pickerWrapper: { 
    borderWidth: 2, 
    borderColor: "#e2e8f0", 
    borderRadius: 12, 
    overflow: "hidden", 
    marginBottom: 16,
    backgroundColor: "#f8fafc"
  },
  selectedHospital: {
    backgroundColor: "#f1f5f9",
    padding: 12,
    borderRadius: 8,
    marginBottom: 20,
  },
  selectedLabel: {
    fontSize: 14,
    color: "#64748b",
    fontWeight: "500",
    marginBottom: 4,
  },
  selectedName: {
    fontSize: 16,
    color: "#1e293b",
    fontWeight: "600",
  },
  buttonsRow: { 
    flexDirection: "row", 
    justifyContent: "flex-end",
    gap: 12,
  },
  btn: { 
    paddingVertical: 12, 
    paddingHorizontal: 20, 
    borderRadius: 10, 
    minWidth: 100,
    alignItems: "center",
  },
  cancelBtn: { 
    backgroundColor: "#f1f5f9",
    borderWidth: 1,
    borderColor: "#e2e8f0",
  },
  confirmBtn: { 
    backgroundColor: "#3b82f6",
  },
  btnText: { 
    fontWeight: "600",
    fontSize: 16,
  },
});