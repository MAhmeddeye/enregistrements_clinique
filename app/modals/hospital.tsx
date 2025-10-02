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
  { id: "H5", name: "Hôpital de l’Amitié" },
  { id: "H6", name: "Centre National de Cardiologie" },
  { id: "H7", name: "Centre National d’Oncologie" },
  { id: "H8", name: "Hôpital Sabah" },
  { id: "H9", name: "Hôpital Régional de Kaédi" },
  { id: "H10", name: "Hôpital Régional de Sélibaby" },
  { id: "H11", name: "Centre Hospitalier d’Aioun" },
  { id: "H12", name: "Centre Hospitalier Akjoujt" },
];

export default function HospitalModal({ visible, onClose, form, setForm }: Props) {
  return (
    <Modal visible={visible} animationType="slide" transparent onRequestClose={onClose}>
      <SafeAreaView style={styles.overlay}>
        <View style={styles.container}>
          <Text style={styles.title}>Choisir l’hôpital de destination</Text>

          <View style={styles.pickerWrapper}>
            <Picker
              selectedValue={form.hospitalDestination ?? hospitals[0].id}
              onValueChange={(val) =>
                setForm((prev) => ({ ...prev, hospitalDestination: String(val) }))
              }
              mode="dropdown"
            >
              {hospitals.map((h) => (
                <Picker.Item key={h.id} label={h.name} value={h.id} />
              ))}
            </Picker>
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
  overlay: { flex: 1, backgroundColor: "rgba(0,0,0,0.45)", justifyContent: "center", padding: 20 },
  container: { backgroundColor: "#fff", borderRadius: 12, padding: 16, elevation: 6 },
  title: { fontSize: 18, fontWeight: "700", marginBottom: 12 },
  pickerWrapper: { borderWidth: 1, borderColor: "#ddd", borderRadius: 8, overflow: "hidden", marginBottom: 20 },
  buttonsRow: { flexDirection: "row", justifyContent: "flex-end" },
  btn: { paddingVertical: 10, paddingHorizontal: 14, borderRadius: 8, marginLeft: 8 },
  cancelBtn: { backgroundColor: "#eee" },
  confirmBtn: { backgroundColor: "#007AFF" },
  btnText: { fontWeight: "600" },
});
