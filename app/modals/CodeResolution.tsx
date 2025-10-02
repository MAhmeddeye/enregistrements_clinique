// ResolutionCodeModal.tsx
import React from "react";
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,

} from "react-native";
import { Picker } from "@react-native-picker/picker";
import { FormType } from "@/lib/types"; // ajuste selon ton projet
import { SafeAreaView } from "react-native-safe-area-context";

type Props = {
  visible: boolean;
  onClose: () => void;
  form: FormType;
  setForm: React.Dispatch<React.SetStateAction<FormType>>;
};

const codes = [
  { id: "30", title: "30 - Arrivée ambulance à l'hôpital", desc: "Arrivée de l'ambulance sur les lieux, assistance et transfert du patient à l'hôpital." },
  { id: "31", title: "31 - Orientation vers centre de santé", desc: "Arrivée de l'ambulance sur les lieux, assistance et orientation vers le centre de santé." },
  { id: "32", title: "32 - Résolution sur place", desc: "Arrivée de l'ambulance sur les lieux, assistance et résolution sur place." },
  { id: "33", title: "33 - Patient décédé", desc: "Arrivée de l'ambulance sur les lieux et patient décédé." },
];

export default function ResolutionCodeModal({ visible, onClose, form, setForm }: Props) {
  return (
    <Modal visible={visible} animationType="slide" transparent onRequestClose={onClose}>
      <SafeAreaView style={styles.overlay}>
        <View style={styles.container}>
          <Text style={styles.title}>Code de résolution</Text>

          <View style={styles.pickerWrapper}>
            <Picker
              selectedValue={form.codeResolution ?? "30"}
              onValueChange={(val) => setForm((prev) => ({ ...prev, codeResolution: String(val) }))}
              mode="dropdown"
            >
              {codes.map((c) => (
                <Picker.Item key={c.id} label={c.title} value={c.id} />
              ))}
            </Picker>
          </View>

          <View style={styles.descBox}>
            <Text style={styles.descText}>
              {codes.find((c) => c.id === (form.codeResolution ?? "30"))?.desc}
            </Text>
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
  title: { fontSize: 18, fontWeight: "700", marginBottom: 8 },
  pickerWrapper: { borderWidth: 1, borderColor: "#ddd", borderRadius: 8, overflow: "hidden", marginBottom: 12 },
  descBox: { padding: 10, borderRadius: 8, backgroundColor: "#f7f7f7", marginBottom: 12 },
  descText: { fontSize: 14, color: "#333" },
  buttonsRow: { flexDirection: "row", justifyContent: "flex-end" },
  btn: { paddingVertical: 10, paddingHorizontal: 14, borderRadius: 8, marginLeft: 8 },
  cancelBtn: { backgroundColor: "#eee" },
  confirmBtn: { backgroundColor: "#007AFF" },
  btnText: { fontWeight: "600" },
});
