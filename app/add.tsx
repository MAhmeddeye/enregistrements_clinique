import { Text, StyleSheet, TextInput, View, TouchableOpacity, ScrollView, ImageBackground, SafeAreaView, KeyboardAvoidingView, Platform, Modal, Image, Alert } from 'react-native';
import React, { useState } from 'react';
import Collapsible from 'react-native-collapsible';
import { Picker } from '@react-native-picker/picker';
import Icon from 'react-native-vector-icons/MaterialIcons';

type RespOption =
  | "Obstruction de la langue"
  | "Corps étranger"
  | "Œdème de glotte"
  | "Brûlure des voies respiratoires"
  | "Traumatisme maxillo-facial"
  | "Traumatisme laryngo-trachéal";

type CircOption =
  | "La peau"
  | "Température de la peau"
  | "Hydratation de la peau"
  | "Couleur de la peau"
  | "Battement de coeur descendant"
  | "Remplissage capillaire";

type ConstanteType = "initial" | "transfert" | "final" | null;
type OuiNonType = "oui" | "non" | null;
type MobiliteType = "Normale" | "Asymétrique" | "Paradoxal" | null;

type CouleurPeauType = "Normal" | "Pâle" | "Cyanotique" | "Érythémateux" | "Ictérique" | null;
type RythmeCardiaqueType = "Rythmique" | "Arythmique" | null;
type RemplissageCapillaireType = "≤2s" | ">2s" | null;
type PoulsStatus = "Normal" | "Faible" | "Absent" | null;
type TemperaturePeauType = "Normal" | "Froide" | "Chaude" | null;
type HydratationPeauType = "Normal" | "Sèche" | "Mouillée" | null;
type EtatPeauType = "Normal" | "Anormal" | null;

interface FormType {
  nom: string;
  age: string;
  sexe: string;
  motif: string;
  motifDesc: string;
  traitementPrecedent: string;
  DescPreTraitement: string;
  allergie: string;
  Descallergie: string;
  constante_Fréquence_respiratoire: ConstanteType;
  constante_Saturation_en_oxygène_périphérique: ConstanteType;
  constante_Fréquence_cardiaque: ConstanteType;
  constante_Pression_sanguine: ConstanteType;
  constante_Température_du_corps: ConstanteType;
  constante_Glycémie: ConstanteType;
  constante_Échelle_de_Glasgow: ConstanteType;
  constante_Ventilation_spontanee: OuiNonType;
  constante_Dyspnee: OuiNonType;
  constante_Cyanose: OuiNonType;
  constante_Stridor: OuiNonType;
  constante_Tirage: OuiNonType;
  constante_Mobilité_thoracique: MobiliteType;
  examenResp: RespOption[];
  DescResp: string;
  examenCirc: CircOption[];
  DescCirc: string;
  pouls: string;
  pressionArterielle: string;

  // --- CHAMPS CIRCULATOIRES ---
  couleurPeau: CouleurPeauType;
  rythmeCardiaque: RythmeCardiaqueType;
  remplissageCapillaire: RemplissageCapillaireType;
  pouls_radial: PoulsStatus;
  pouls_femoral: PoulsStatus;
  pouls_carotide: PoulsStatus;
  temperaturePeau: TemperaturePeauType;
  hydratationPeau: HydratationPeauType;
  etatPeau: EtatPeauType;
}

const constantes = [
  "Fréquence respiratoire",
  "Saturation en oxygène périphérique",
  "Fréquence cardiaque",
  "Pression sanguine",
  "Température du corps",
  "Glycémie",
  "Échelle de Glasgow",
];

interface OuiNonSelectorProps {
  label: string;
  value: OuiNonType;
  onChange: (val: OuiNonType) => void;
}

const OuiNonSelector = ({
  label,
  value,
  onChange,
}: OuiNonSelectorProps) => {
  const [openMenu, setOpenMenu] = useState(false);
  const options: OuiNonType[] = ["oui", "non"];

  return (
    <View style={{ marginBottom: 10 }}>
      <TouchableOpacity
        style={{
          padding: 10,
          borderWidth: 1,
          borderColor: "#bdc3c7",
          borderRadius: 8,
          backgroundColor: "#fff",
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
        onPress={() => setOpenMenu(!openMenu)}
      >
        <Text style={{ fontWeight: 'bold' }}>{label}</Text>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <Text style={{ marginRight: 8, color: value ? '#2c3e50' : '#95a5a6' }}>
            {value ? value.toUpperCase() : "Sélectionner"}
          </Text>
          <Icon name={openMenu ? "keyboard-arrow-up" : "keyboard-arrow-down"} size={20} color="#7f8c8d" />
        </View>
      </TouchableOpacity>

      {openMenu && (
        <View style={{ marginTop: 5, borderWidth: 1, borderColor: "#bdc3c7", borderRadius: 8, backgroundColor: "#fff" }}>
          {options.map((opt: any) => (
            <TouchableOpacity
              key={opt}
              style={{
                padding: 12,
                borderBottomWidth: 1,
                borderBottomColor: "#eee",
                backgroundColor: value === opt ? '#ecf0f1' : '#fff'
              }}
              onPress={() => {
                onChange(opt);
                setOpenMenu(false);
              }}
            >
              <Text style={{ color: value === opt ? '#3498db' : '#2c3e50', fontWeight: value === opt ? 'bold' : 'normal' }}>
                {opt.toUpperCase()}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      )}
    </View>
  );
};

interface ConstanteSelectorProps {
  label: string;
  value: ConstanteType;
  onChange: (val: ConstanteType) => void;
}

const ConstanteSelector = ({
  label,
  value,
  onChange,
}: ConstanteSelectorProps) => {
  const [modalVisible, setModalVisible] = useState(false);
  const options: ConstanteType[] = ["initial", "transfert", "final"];

  const getColor = (val: ConstanteType) => {
    switch (val) {
      case "initial": return "#bfdbafff";
      case "transfert": return "#bbdff7ff";
      case "final": return "#8dbefeff";
      default: return "#fff";
    }
  };

  return (
    <View style={{ flex: 1, marginBottom: 5, marginHorizontal: 2 }}>
      <TouchableOpacity
        style={{
          padding: 8,
          borderWidth: 1,
          borderColor: "#bdc3c7",
          borderRadius: 8,
          backgroundColor: getColor(value),
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
        onPress={() => setModalVisible(true)}
      >
        <Text style={{ fontSize: 12 }} numberOfLines={1}>{label}</Text>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <Text style={{ fontSize: 12, marginRight: 4, color: value ? '#2c3e50' : '#95a5a6' }}>
            {value ? value.charAt(0).toUpperCase() : "S"}
          </Text>
          <Icon name="keyboard-arrow-down" size={16} color="#7f8c8d" />
        </View>
      </TouchableOpacity>

      <Modal
        visible={modalVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Sélection pour {label}</Text>
            {options.map((opt) => (
              <TouchableOpacity
                key={opt}
                style={[styles.modalOption, { backgroundColor: value === opt ? getColor(opt) : '#fff' }]}
                onPress={() => {
                  onChange(opt);
                  setModalVisible(false);
                }}
              >
                <Text style={styles.modalOptionText}>{opt?.toUpperCase()}</Text>
              </TouchableOpacity>
            ))}
            <TouchableOpacity
              style={styles.modalCancel}
              onPress={() => setModalVisible(false)}
            >
              <Text style={styles.modalCancelText}>Annuler</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

interface PersonalInfoModalProps {
  visible: boolean;
  onClose: () => void;
  form: FormType;
  setForm: React.Dispatch<React.SetStateAction<FormType>>;
}

const PersonalInfoModal = ({ visible, onClose, form, setForm }: PersonalInfoModalProps) => {
  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.personalInfoModal}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Informations Personnelles</Text>
            <TouchableOpacity onPress={onClose}>
              <Icon name="close" size={24} color="#fff" />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.modalContent}>
            <Text style={styles.label}>Nom Patient *</Text>
            <TextInput
              style={styles.input}
              placeholder="Entrez le nom complet"
              value={form.nom}
              onChangeText={(t) => setForm({ ...form, nom: t })}
            />

            <Text style={styles.label}>Âge Patient *</Text>
            <TextInput
              style={styles.input}
              placeholder="Âge en années"
              value={form.age}
              onChangeText={(t) => setForm({ ...form, age: t })}
              keyboardType="numeric"
            />

            <Text style={styles.label}>Sexe *</Text>
            <View style={styles.pickerBox}>
              <Picker
                selectedValue={form.sexe}
                onValueChange={(itemValue) => setForm({ ...form, sexe: itemValue })}
              >
                <Picker.Item label="Sélectionner le sexe" value="" />
                <Picker.Item label="Homme" value="Homme" />
                <Picker.Item label="Femme" value="Femme" />
              </Picker>
            </View>
          </ScrollView>

          <View style={styles.modalFooter}>
            <TouchableOpacity style={styles.modalButton} onPress={onClose}>
              <Text style={styles.modalButtonText}>Fermer</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

interface ConsultationModalProps {
  visible: boolean;
  onClose: () => void;
  form: FormType;
  setForm: React.Dispatch<React.SetStateAction<FormType>>;
  showMotifDesc: boolean;
  setShowMotifDesc: (show: boolean) => void;
  showObsDesc: boolean;
  setShowObsDesc: (show: boolean) => void;
  showAllergieDesc: boolean;
  setShowAllergieDesc: (show: boolean) => void;
}

const ConsultationModal = ({
  visible,
  onClose,
  form,
  setForm,
  showMotifDesc,
  setShowMotifDesc,
  showObsDesc,
  setShowObsDesc,
  showAllergieDesc,
  setShowAllergieDesc
}: ConsultationModalProps) => {
  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={[styles.personalInfoModal, { height: '90%' }]}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Consultation</Text>
            <TouchableOpacity onPress={onClose}>
              <Icon name="close" size={20} color="#fff" />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.modalContent}>

            <TouchableOpacity
              onPress={() => setShowMotifDesc(!showMotifDesc)}
              style={styles.expandableHeader}
            >
              <Text>Description du motif {showMotifDesc ? "▼" : "►"}</Text>
            </TouchableOpacity>
            {showMotifDesc && (
              <TextInput
                style={styles.textarea}
                placeholder="Décrivez en détail le motif de consultation"
                value={form.motifDesc}
                onChangeText={(t) => setForm({ ...form, motifDesc: t })}
                multiline
              />
            )}


            <TouchableOpacity
              onPress={() => setShowObsDesc(!showObsDesc)}
              style={styles.expandableHeader}
            >
              <Text>Détails des traitements {showObsDesc ? "▼" : "►"}</Text>
            </TouchableOpacity>
            {showObsDesc && (
              <TextInput
                style={styles.textarea}
                placeholder="Listez les traitements précédents et leurs effets"
                value={form.DescPreTraitement}
                onChangeText={(t) => setForm({ ...form, DescPreTraitement: t })}
                multiline
              />
            )}


            <TouchableOpacity
              onPress={() => setShowAllergieDesc(!showAllergieDesc)}
              style={styles.expandableHeader}
            >
              <Text>Détails des allergies {showAllergieDesc ? "▼" : "►"}</Text>
            </TouchableOpacity>
            {showAllergieDesc && (
              <TextInput
                style={styles.textarea}
                placeholder="Indiquez les allergies connues et leurs manifestations"
                value={form.Descallergie}
                onChangeText={(t) => setForm({ ...form, Descallergie: t })}
                multiline
              />
            )}

            <Text style={styles.label}>Constantes</Text>
            <View style={{ height: 300 }}>
              <ScrollView
                style={styles.internalScroll}
                nestedScrollEnabled={true}
              >
                {constantes.map((c) => (
                  <View style={{ width: '100%', marginBottom: 5 }} key={c}>
                    <ConstanteSelector
                      label={c}
                      value={form[`constante_${c.replace(/\s/g, "_")}` as keyof FormType] as ConstanteType}
                      onChange={(val) =>
                        setForm((prev) => ({ ...prev, [`constante_${c.replace(/\s/g, "_")}`]: val }))
                      }
                    />
                  </View>
                ))}
              </ScrollView>
            </View>
          </ScrollView>

          <View style={styles.modalFooter}>
            <TouchableOpacity style={styles.modalButton} onPress={onClose}>
              <Text style={styles.modalButtonText}>Fermer</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

interface RespiratoireModalProps {
  visible: boolean;
  onClose: () => void;
  form: FormType;
  setForm: React.Dispatch<React.SetStateAction<FormType>>;
  voieAerienneBrevetee: boolean | null;
  setVoieAerienneBrevetee: (value: boolean | null) => void;
  selectRespOption: (option: RespOption) => void;
}

const RespiratoireModal = ({
  visible,
  onClose,
  form,
  setForm,
  voieAerienneBrevetee,
  setVoieAerienneBrevetee,
  selectRespOption
}: RespiratoireModalProps) => {
  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={[styles.personalInfoModal, { height: '90%' }]}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Examen Respiratoire</Text>
            <TouchableOpacity onPress={onClose}>
              <Icon name="close" size={24} color="#fff" />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.modalContent}>
            <Text style={styles.label}>Voie aérienne perméable ?</Text>
            <View style={styles.pickerBox}>
              <Picker
                selectedValue={voieAerienneBrevetee === null ? "" : voieAerienneBrevetee ? "oui" : "non"}
                onValueChange={(value) => {
                  if (value === "oui") {
                    setVoieAerienneBrevetee(true);
                    setForm(prev => ({ ...prev, examenResp: [] }));
                  } else if (value === "non") {
                    setVoieAerienneBrevetee(false);
                  } else {
                    setVoieAerienneBrevetee(null);
                  }
                }}
              >
                <Picker.Item label="Sélectionner une option" value="" />
                <Picker.Item label="Oui" value="oui" />
                <Picker.Item label="Non" value="non" />
              </Picker>
            </View>

            {voieAerienneBrevetee === false && (
              <View>
                {["Obstruction de la langue", "Corps étranger", "Œdème de glotte", "Brûlure des voies respiratoires", "Traumatisme maxillo-facial", "Traumatisme laryngo-trachéal"].map((option) => (
                  <TouchableOpacity
                    key={option}
                    style={styles.radioRow}
                    onPress={() => selectRespOption(option as RespOption)}
                  >
                    <View style={styles.radioContainer}>
                      <View style={[
                        styles.radio,
                        form.examenResp.includes(option as RespOption) && styles.radioSelected
                      ]}>
                        {form.examenResp.includes(option as RespOption) &&
                          <View style={styles.radioInner} />
                        }
                      </View>
                    </View>
                    <Text style={styles.radioLabel}>{option}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            )}

            {["Ventilation spontanée", "Dyspnée", "Cyanose", "Stridor", "Tirage"].map((label) => {
              const key = `constante_${label.replace(/\s/g, "_")}` as keyof FormType;
              return (
                <OuiNonSelector
                  key={label}
                  label={label}
                  value={form[key] as OuiNonType}
                  onChange={(val) => setForm({ ...form, [key]: val })}
                />
              );
            })}

            <View style={{ marginVertical: 5 }}>
              <Text style={styles.label}>Mobilité thoracique</Text>
              <View style={styles.pickerBox}>
                <Picker
                  selectedValue={form.constante_Mobilité_thoracique}
                  onValueChange={(value) =>
                    setForm({ ...form, constante_Mobilité_thoracique: value as MobiliteType })
                  }
                >
                  <Picker.Item label="Sélectionner un état" value={null} />
                  <Picker.Item label="Normale" value="Normale" />
                  <Picker.Item label="Asymétrique" value="Asymétrique" />
                  <Picker.Item label="Paradoxale" value="Paradoxal" />
                </Picker>
              </View>
            </View>

          </ScrollView>

          <View style={styles.modalFooter}>
            <TouchableOpacity style={styles.modalButton} onPress={onClose}>
              <Text style={styles.modalButtonText}>Fermer</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

interface CirculatoireModalProps {
  visible: boolean;
  onClose: () => void;
  form: FormType;
  setForm: React.Dispatch<React.SetStateAction<FormType>>;
}

const CirculatoireModal = ({
  visible,
  onClose,
  form,
  setForm
}: CirculatoireModalProps) => {
  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={[styles.personalInfoModal, { height: '90%' }]}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Examen Circulatoire</Text>
            <TouchableOpacity onPress={onClose}>
              <Icon name="close" size={24} color="#fff" />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.modalContent}>
            <Text style={styles.label}>État général de la peau</Text>
            <View style={styles.pickerBox}>
              <Picker
                selectedValue={form.etatPeau || ""}
                onValueChange={(val) => setForm({ ...form, etatPeau: val as EtatPeauType })}
              >
                <Picker.Item label="Sélectionner" value="" />
                <Picker.Item label="Normal" value="Normal" />
                <Picker.Item label="Anormal" value="Anormal" />
              </Picker>
            </View>

            <Text style={styles.label}>Température de la peau</Text>
            <View style={styles.pickerBox}>
              <Picker
                selectedValue={form.temperaturePeau || ""}
                onValueChange={(val) => setForm({ ...form, temperaturePeau: val as TemperaturePeauType })}
              >
                <Picker.Item label="Sélectionner" value="" />
                <Picker.Item label="Normal" value="Normal" />
                <Picker.Item label="Froide" value="Froide" />
                <Picker.Item label="Chaude" value="Chaude" />
              </Picker>
            </View>

            <Text style={styles.label}>Hydratation de la peau</Text>
            <View style={styles.pickerBox}>
              <Picker
                selectedValue={form.hydratationPeau || ""}
                onValueChange={(val) => setForm({ ...form, hydratationPeau: val as HydratationPeauType })}
              >
                <Picker.Item label="Sélectionner" value="" />
                <Picker.Item label="Normal" value="Normal" />
                <Picker.Item label="Sèche" value="Sèche" />
                <Picker.Item label="Mouillée" value="Mouillée" />
              </Picker>
            </View>

            <Text style={styles.label}>Couleur de la peau</Text>
            <View style={styles.pickerBox}>
              <Picker
                selectedValue={form.couleurPeau || ""}
                onValueChange={(val) => setForm({ ...form, couleurPeau: val as CouleurPeauType })}
              >
                <Picker.Item label="Sélectionner la couleur" value="" />
                <Picker.Item label="Normal" value="Normal" />
                <Picker.Item label="Pâle" value="Pâle" />
                <Picker.Item label="Cyanotique" value="Cyanotique" />
                <Picker.Item label="Érythémateux" value="Érythémateux" />
                <Picker.Item label="Ictérique" value="Ictérique" />
              </Picker>
            </View>

            <Text style={styles.label}>Battement de cœur (rythme)</Text>
            <View style={styles.pickerBox}>
              <Picker
                selectedValue={form.rythmeCardiaque || ""}
                onValueChange={(val) => setForm({ ...form, rythmeCardiaque: val as RythmeCardiaqueType })}
              >
                <Picker.Item label="Sélectionner" value="" />
                <Picker.Item label="Rythmique" value="Rythmique" />
                <Picker.Item label="Arythmique" value="Arythmique" />
              </Picker>
            </View>

            <Text style={styles.label}>Remplissage capillaire</Text>
            <View style={styles.pickerBox}>
              <Picker
                selectedValue={form.remplissageCapillaire || ""}
                onValueChange={(val) => setForm({ ...form, remplissageCapillaire: val as RemplissageCapillaireType })}
              >
                <Picker.Item label="Sélectionner" value="" />
                <Picker.Item label="≤ 2 secondes" value="≤2s" />
                <Picker.Item label="> 2 secondes" value=">2s" />
              </Picker>
            </View>

            <Text style={[styles.label, { marginTop: 10 }]}>Pouls</Text>

            <View style={{ marginBottom: 8 }}>
              <Text style={styles.labelSmall}>Radial</Text>
              <View style={styles.pickerBox}>
                <Picker
                  selectedValue={form.pouls_radial || ""}
                  onValueChange={(val) => setForm({ ...form, pouls_radial: val as PoulsStatus })}
                >
                  <Picker.Item label="Sélectionner" value="" />
                  <Picker.Item label="Normal" value="Normal" />
                  <Picker.Item label="Faible" value="Faible" />
                  <Picker.Item label="Absent" value="Absent" />
                </Picker>
              </View>
            </View>

            <View style={{ marginBottom: 8 }}>
              <Text style={styles.labelSmall}>Fémoral</Text>
              <View style={styles.pickerBox}>
                <Picker
                  selectedValue={form.pouls_femoral || ""}
                  onValueChange={(val) => setForm({ ...form, pouls_femoral: val as PoulsStatus })}
                >
                  <Picker.Item label="Sélectionner" value="" />
                  <Picker.Item label="Normal" value="Normal" />
                  <Picker.Item label="Faible" value="Faible" />
                  <Picker.Item label="Absent" value="Absent" />
                </Picker>
              </View>
            </View>

            <View style={{ marginBottom: 8 }}>
              <Text style={styles.labelSmall}>Carotide</Text>
              <View style={styles.pickerBox}>
                <Picker
                  selectedValue={form.pouls_carotide || ""}
                  onValueChange={(val) => setForm({ ...form, pouls_carotide: val as PoulsStatus })}
                >
                  <Picker.Item label="Sélectionner" value="" />
                  <Picker.Item label="Normal" value="Normal" />
                  <Picker.Item label="Faible" value="Faible" />
                  <Picker.Item label="Absent" value="Absent" />
                </Picker>
              </View>
            </View>
          </ScrollView>

          <View style={styles.modalFooter}>
            <TouchableOpacity style={styles.modalButton} onPress={onClose}>
              <Text style={styles.modalButtonText}>Fermer</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default function addScreen() {
  const [openSections, setOpenSections] = useState({
    perso: false,
    consult: false,
    examen: false,
    respiratoire: false,
    circulaire: false
  });

  const [showPersonalInfoModal, setShowPersonalInfoModal] = useState(false);
  const [showConsultationModal, setShowConsultationModal] = useState(false);
  const [showRespiratoireModal, setShowRespiratoireModal] = useState(false);
  const [showCirculatoireModal, setShowCirculatoireModal] = useState(false);

  const [showMotifDesc, setShowMotifDesc] = useState(false);
  const [showObsDesc, setShowObsDesc] = useState(false);
  const [showAllergieDesc, setShowAllergieDesc] = useState(false);

  const [voieAerienneBrevetee, setVoieAerienneBrevetee] = useState<boolean | null>(null);

  const [form, setForm] = useState<FormType>({
    nom: "",
    age: "",
    sexe: "",
    motif: "",
    motifDesc: "",
    traitementPrecedent: "",
    DescPreTraitement: "",
    allergie: "",
    Descallergie: "",
    constante_Fréquence_respiratoire: null,
    constante_Saturation_en_oxygène_périphérique: null,
    constante_Fréquence_cardiaque: null,
    constante_Pression_sanguine: null,
    constante_Température_du_corps: null,
    constante_Glycémie: null,
    constante_Échelle_de_Glasgow: null,
    constante_Ventilation_spontanee: null,
    constante_Dyspnee: null,
    constante_Cyanose: null,
    constante_Stridor: null,
    constante_Tirage: null,
    constante_Mobilité_thoracique: null,
    examenResp: [],
    DescResp: "",
    examenCirc: [],
    DescCirc: "",
    pouls: "",
    pressionArterielle: "",

    // champs circulatoires
    couleurPeau: null,
    rythmeCardiaque: null,
    remplissageCapillaire: null,
    pouls_radial: null,
    pouls_femoral: null,
    pouls_carotide: null,
    temperaturePeau: null,
    hydratationPeau: null,
    etatPeau: null,
  });

  // Fonction pour vérifier si au moins un champ d'info personnelle est rempli
  const isPersonalInfoFilled = () => {
    return form.nom.trim() !== "" || form.age.trim() !== "" || form.sexe.trim() !== "";
  };

  // Fonction pour vérifier si au moins un champ de consultation est rempli
  const isConsultationFilled = () => {
    return (
      form.motif.trim() !== "" ||
      form.motifDesc.trim() !== "" ||
      form.traitementPrecedent.trim() !== "" ||
      form.DescPreTraitement.trim() !== "" ||
      form.allergie.trim() !== "" ||
      form.Descallergie.trim() !== "" ||
      form.constante_Fréquence_respiratoire !== null ||
      form.constante_Saturation_en_oxygène_périphérique !== null ||
      form.constante_Fréquence_cardiaque !== null ||
      form.constante_Pression_sanguine !== null ||
      form.constante_Température_du_corps !== null ||
      form.constante_Glycémie !== null ||
      form.constante_Échelle_de_Glasgow !== null ||
      form.constante_Ventilation_spontanee !== null ||
      form.constante_Dyspnee !== null ||
      form.constante_Cyanose !== null ||
      form.constante_Stridor !== null ||
      form.constante_Tirage !== null ||
      form.constante_Mobilité_thoracique !== null
    );
  };

  const toggleSection = (section: keyof typeof openSections) => {
    if (section === 'perso') {
      setShowPersonalInfoModal(true);
    } else if (section === 'consult') {
      // Vérifier si au moins une info personnelle est remplie avant d'ouvrir la consultation
      if (isPersonalInfoFilled()) {
        setShowConsultationModal(true);
      } else {
        Alert.alert(
          "Information requise", 
          "Veuillez d'abord remplir au moins un champ dans les informations personnelles",
          [
            { text: "OK", onPress: () => setShowPersonalInfoModal(true) }
          ]
        );
      }
    } else if (section === 'examen') {
      // Vérifier si au moins un champ de consultation est rempli avant d'ouvrir l'examen
      if (isConsultationFilled()) {
        setOpenSections(prev => ({ ...prev, [section]: !prev[section] }));
      } else {
        Alert.alert(
          "Information requise", 
          "Veuillez d'abord remplir au moins un champ dans la consultation",
          [
            { text: "OK", onPress: () => setShowConsultationModal(true) }
          ]
        );
      }
    } else if (section === 'respiratoire') {
      // Vérifier si au moins un champ de consultation est rempli avant d'ouvrir l'examen respiratoire
      if (isConsultationFilled()) {
        setShowRespiratoireModal(true);
      } else {
        Alert.alert(
          "Information requise", 
          "Veuillez d'abord remplir au moins un champ dans la consultation",
          [
            { text: "OK", onPress: () => setShowConsultationModal(true) }
          ]
        );
      }
    } else if (section === 'circulaire') {
      // Vérifier si au moins un champ de consultation est rempli avant d'ouvrir l'examen circulatoire
      if (isConsultationFilled()) {
        setShowCirculatoireModal(true);
      } else {
        Alert.alert(
          "Information requise", 
          "Veuillez d'abord remplir au moins un champ dans la consultation",
          [
            { text: "OK", onPress: () => setShowConsultationModal(true) }
          ]
        );
      }
    } else {
      setOpenSections(prev => ({ ...prev, [section]: !prev[section] }));
    }
  };

  const selectRespOption = (option: RespOption) => {
    setForm((prev) => {
      return {
        ...prev,
        examenResp: [option],
      };
    });
  };

  const toggleCircOption = (option: CircOption) => {
    setForm((prev) => {
      const alreadySelected = prev.examenCirc.includes(option);
      return {
        ...prev,
        examenCirc: alreadySelected
          ? prev.examenCirc.filter((o) => o !== option)
          : [...prev.examenCirc, option],
      };
    });
  };

  const handleSubmit = () => {
    if (!form.nom || !form.age || !form.sexe) {
      alert("Veuillez remplir les informations personnelles obligatoires");
      return;
    }

    console.log("Formulaire envoyé ✅", form);
    alert("Formulaire envoyé avec succès !");
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#ffffff' }}>
      {/* En-tête logos */}
      <View style={styles.header1}>
        <Image
          source={require('@/assets/images/OIP.webp')}
          style={styles.logoLeft}
          resizeMode="contain"
        />
        <Image
          source={require('@/assets/images/101.webp')}
          style={styles.logoRight}
          resizeMode="contain"
        />
      </View>

      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
      >
        <ScrollView contentContainerStyle={styles.container}>
          <Text style={styles.introText}>Enregistrement des informations clinique</Text>

          {/* Infos personnelles + Consultation */}
          <View style={styles.row}>
            <View style={styles.accordionBox}>
              <TouchableOpacity style={styles.header} onPress={() => toggleSection('perso')}>
                <Text style={styles.headerText}>Infos personnelles</Text>
                <Icon
                  name={openSections.perso ? "keyboard-arrow-up" : "keyboard-arrow-down"}
                  size={20}
                  color="#fff"
                />
              </TouchableOpacity>
              <Collapsible collapsed={!openSections.perso}>
                <View style={styles.content}>
                  <Text style={styles.label}>Cliquez sur "Infos personnelles" pour ouvrir le formulaire complet</Text>
                  {/* Afficher un indicateur si les infos sont remplies */}
                  {isPersonalInfoFilled() && (
                    <Text style={{color: 'green', marginTop: 5}}>
                      ✓ Informations personnelles partiellement remplies
                    </Text>
                  )}
                </View>
              </Collapsible>
            </View>

            <View style={styles.accordionBox}>
              <TouchableOpacity 
                style={[
                  styles.header, 
                  !isPersonalInfoFilled() && {backgroundColor: '#95a5a6'} // Griser si non rempli
                ]} 
                onPress={() => toggleSection('consult')}
              >
                <Text style={styles.headerText}>Consultation</Text>
                <Icon
                  name={openSections.consult ? "keyboard-arrow-up" : "keyboard-arrow-down"}
                  size={20}
                  color="#fff"
                />
              </TouchableOpacity>
              <Collapsible collapsed={!openSections.consult}>
                <View style={styles.content}>
                  <Text style={styles.label}>Cliquez sur "Consultation" pour ouvrir le formulaire complet</Text>
                  {/* Afficher un indicateur si les infos sont remplies */}
                  {isConsultationFilled() && (
                    <Text style={{color: 'green', marginTop: 5}}>
                      ✓ Consultation partiellement remplie
                    </Text>
                  )}
                </View>
              </Collapsible>
            </View>
          </View>

          {/* Examen */}
          <View style={styles.fullWidthAccordion}>
            <TouchableOpacity 
              style={[
                styles.header, 
                !isConsultationFilled() && {backgroundColor: '#95a5a6'} // Griser si consultation non remplie
              ]} 
              onPress={() => toggleSection('examen')}
            >
              <Text style={styles.headerText}>Examen Clinique</Text>
              <Icon
                name={openSections.examen ? "keyboard-arrow-up" : "keyboard-arrow-down"}
                size={20}
                color="#fff"
              />
            </TouchableOpacity>

            <Collapsible collapsed={!openSections.examen}>
              <View style={styles.content}>
                {/* Sous-sections Respiratoire et Circulatoire sur la même ligne */}
                <View style={styles.subRow}>
                  {/* Sous-accordion Respiratoire */}
                  <View style={styles.subAccordionBox}>
                    <TouchableOpacity 
                      style={[
                        styles.subHeader, 
                        !isConsultationFilled() && {backgroundColor: '#7f8c8d'} // Griser si consultation non remplie
                      ]} 
                      onPress={() => toggleSection('respiratoire')}
                    >
                      <Text style={styles.subHeaderText}>Respiratoire</Text>
                      <Icon
                        name={openSections.respiratoire ? "keyboard-arrow-up" : "keyboard-arrow-down"}
                        size={18}
                        color="#fff"
                      />
                    </TouchableOpacity>
                  </View>

                  {/* Sous-accordion Circulatoire */}
                  <View style={styles.subAccordionBox}>
                    <TouchableOpacity 
                      style={[
                        styles.subHeader, 
                        !isConsultationFilled() && {backgroundColor: '#7f8c8d'} // Griser si consultation non remplie
                      ]} 
                      onPress={() => toggleSection('circulaire')}
                    >
                      <Text style={styles.subHeaderText}>Circulatoire</Text>
                      <Icon
                        name={openSections.circulaire ? "keyboard-arrow-up" : "keyboard-arrow-down"}
                        size={18}
                        color="#fff"
                      />
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            </Collapsible>
          </View>

          <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.button} onPress={handleSubmit}>
              <Text style={styles.buttonText}>Valider l'évaluation</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.secondaryButton} onPress={() => { }}>
              <Text style={styles.secondaryButtonText}>Sauvegarder comme brouillon</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>

      {/* Modals */}
      <PersonalInfoModal
        visible={showPersonalInfoModal}
        onClose={() => setShowPersonalInfoModal(false)}
        form={form}
        setForm={setForm}
      />

      <ConsultationModal
        visible={showConsultationModal}
        onClose={() => setShowConsultationModal(false)}
        form={form}
        setForm={setForm}
        showMotifDesc={showMotifDesc}
        setShowMotifDesc={setShowMotifDesc}
        showObsDesc={showObsDesc}
        setShowObsDesc={setShowObsDesc}
        showAllergieDesc={showAllergieDesc}
        setShowAllergieDesc={setShowAllergieDesc}
      />

      <RespiratoireModal
        visible={showRespiratoireModal}
        onClose={() => setShowRespiratoireModal(false)}
        form={form}
        setForm={setForm}
        voieAerienneBrevetee={voieAerienneBrevetee}
        setVoieAerienneBrevetee={setVoieAerienneBrevetee}
        selectRespOption={selectRespOption}
      />

      <CirculatoireModal
        visible={showCirculatoireModal}
        onClose={() => setShowCirculatoireModal(false)}
        form={form}
        setForm={setForm}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  background: { flex: 1 },
  container: {
    flexGrow: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 16,
    paddingBottom: 600,
  },
    introText: {
    fontSize: 20,
    color: "#2c3e50",
    marginBottom: 12,
    fontWeight: "600",
  },
  header1: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: "#fff",
  },
  logoLeft: {
    width: 80,
    height: 50,
  },
  logoRight: {
    width: 80,
    height: 50,
  },
  containerInner: {
    width: "100%",
    maxWidth: 960,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    marginBottom: 12,
  },
  accordionBox: {
    flex: 1,
    marginHorizontal: 6,
  },
  fullWidthAccordion: {
    width: "100%",
    marginVertical: 8,
    paddingHorizontal: 6,
  },
  header: {
    backgroundColor: "#2980b9",
    padding: 12,
    borderRadius: 8,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  headerText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 16,
  },
  content: {
    padding: 12,
    backgroundColor: "#fff",
    borderRadius: 8,
    marginTop: 8,
    borderWidth: 1,
    borderColor: "#ecf0f1",
  },
  subRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
  },
  subAccordionBox: {
    flex: 1,
    marginHorizontal: 6,
  },
  subHeader: {
    backgroundColor: "#16a085",
    padding: 10,
    borderRadius: 8,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  subHeaderText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 14,
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 6,
    color: "#2c3e50",
  },
  labelSmall: {
    fontSize: 13,
    fontWeight: "500",
    marginBottom: 4,
    color: "#34495e",
  },
  input: {
    borderWidth: 1,
    borderColor: "#dfe6e9",
    borderRadius: 8,
    padding: 10,
    marginBottom: 12,
    backgroundColor: "#fff",
  },
  textarea: {
    borderWidth: 1,
    borderColor: "#dfe6e9",
    borderRadius: 8,
    padding: 10,
    minHeight: 80,
    textAlignVertical: "top",
    backgroundColor: "#fff",
    marginBottom: 12,
  },
  pickerBox: {
    borderWidth: 1,
    borderColor: "#dfe6e9",
    borderRadius: 8,
    overflow: "hidden",
    marginBottom: 12,
    backgroundColor: "#fff",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
    padding: 16,
  },
  personalInfoModal: {
    width: "100%",
    maxWidth: 760,
    backgroundColor: "#f8f9fa",
    borderRadius: 12,
    overflow: "hidden",
  },
  modalHeader: {
    backgroundColor: "#2c3e50",
    paddingHorizontal: 12,
    paddingVertical: 10,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  modalTitle: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "700",
  },
  modalContent: {
    padding: 12,
    maxHeight: "75%",
  },
  modalFooter: {
    padding: 12,
    flexDirection: "row",
    justifyContent: "flex-end",
    backgroundColor: "#fff",
  },
  modalButton: {
    backgroundColor: "#2980b9",
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 8,
  },
  modalButtonText: {
    color: "#fff",
    fontWeight: "600",
  },
  modalOption: {
    paddingVertical: 12,
    paddingHorizontal: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#ecf0f1",
  },
  modalOptionText: {
    fontWeight: "600",
    fontSize: 14,
  },
  modalCancel: {
    marginTop: 10,
    paddingVertical: 10,
    alignItems: "center",
  },
  modalCancelText: {
    color: "#e74c3c",
    fontWeight: "700",
  },
  radioRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 8,
  },
  radioContainer: {
    width: 36,
    justifyContent: "center",
    alignItems: "center",
  },
  radio: {
    width: 18,
    height: 18,
    borderRadius: 9,
    borderWidth: 2,
    borderColor: "#7f8c8d",
    justifyContent: "center",
    alignItems: "center",
  },
  radioSelected: {
    borderColor: "#2980b9",
  },
  radioInner: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: "#2980b9",
  },
  radioLabel: {
    marginLeft: 8,
    fontSize: 14,
    color: "#2c3e50",
  },
  buttonContainer: {
    width: "100%",
    paddingHorizontal: 6,
    marginTop: 12,
    marginBottom: 40,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  button: {
    flex: 1,
    backgroundColor: "#27ae60",
    paddingVertical: 12,
    borderRadius: 8,
    marginRight: 8,
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 16,
  },
  secondaryButton: {
    flex: 1,
    backgroundColor: "#ecf0f1",
    paddingVertical: 12,
    borderRadius: 8,
    marginLeft: 8,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#bdc3c7",
  },
  secondaryButtonText: {
    color: "#2c3e50",
    fontWeight: "700",
    fontSize: 14,
  },
  expandableHeader: {
    paddingVertical: 10,
    paddingHorizontal: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#e0e6ea",
    marginBottom: 8,
    backgroundColor: "#fff",
  },
  internalScroll: {
    paddingHorizontal: 4,
    paddingVertical: 2,
  },
});
