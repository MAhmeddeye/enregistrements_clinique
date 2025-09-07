import { Text, StyleSheet, TextInput, View, TouchableOpacity, ScrollView, ImageBackground, SafeAreaView, KeyboardAvoidingView, Platform, Modal, Image } from 'react-native';
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
          {options.map((opt:any) => (
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
               

                {[
                  "Obstruction de la langue",
                  "Corps étranger",
                  "Œdème de glotte",
                  "Brûlure des voies respiratoires",
                  "Traumatisme maxillo-facial",
                  "Traumatisme laryngo-trachéal",
                ].map((option) => (
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

  const toggleSection = (section: keyof typeof openSections) => {
    if (section === 'perso') {
      setShowPersonalInfoModal(true);
    } else if (section === 'consult') {
      setShowConsultationModal(true);
    } else if (section === 'respiratoire') {
      setShowRespiratoireModal(true);
    } else {
      setOpenSections(prev => ({ ...prev, [section]: !prev[section] }));
    }
  };

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
  });

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
    <SafeAreaView style={{ flex: 1, backgroundColor:'#ffffff'}}>
      backgroundColor:
      {/* Ajout des logos dans l'en-tête */}
      <View style={styles.header1}>
        <Image 
          
        source={require('@/assets/images/OIP.webp')} //agauche
          style={styles.logoLeft}
          resizeMode="contain"
        />
        <Image 
          
        source={require('@/assets/images/101.webp')}//logo droit
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
                </View>
              </Collapsible>
            </View>

            <View style={styles.accordionBox}>
              <TouchableOpacity style={styles.header} onPress={() => toggleSection('consult')}>
                <Text style={styles.headerText}>Consultation</Text>
                <Icon
                  name={openSections.consult ? "keyboard-arrow-up" : "keyboard-arrow-down"}
                  size={20}
                  color="#fff"
                />
              </TouchableOpacity>
             
            </View>
          </View>

          {/* Examen */}
          <View style={styles.fullWidthAccordion}>
            <TouchableOpacity style={styles.header} onPress={() => toggleSection('examen')}>
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
                    <TouchableOpacity style={styles.subHeader} onPress={() => toggleSection('respiratoire')}>
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
                    <TouchableOpacity style={styles.subHeader} onPress={() => toggleSection('circulaire')}>
                      <Text style={styles.subHeaderText}>Circulatoire</Text>
                      <Icon
                        name={openSections.circulaire ? "keyboard-arrow-up" : "keyboard-arrow-down"}
                        size={18}
                        color="#fff"
                      />
                    </TouchableOpacity>

                    <Collapsible collapsed={!openSections.circulaire}>
                      <ScrollView
                        style={styles.scrollContent}
                        nestedScrollEnabled={true}
                      >
                        <View style={styles.contentSub}>
                          <Text style={[styles.label, { marginTop: 10 }]}>Examen circulatoire (sélection multiple)</Text>

                          {[
                            "La peau",
                            "Température de la peau",
                            "Hydratation de la peau",
                            "Couleur de la peau",
                            "Battement de coeur descendant",
                            "Remplissage capillaire"
                          ].map((option) => (
                            <TouchableOpacity
                              key={option}
                              style={styles.checkboxRow}
                              onPress={() => toggleCircOption(option as CircOption)}
                            >
                              <View style={styles.checkboxContainer}>
                                <View style={[
                                  styles.checkbox,
                                  form.examenCirc.includes(option as CircOption) && styles.checkboxSelected
                                ]}>
                                  {form.examenCirc.includes(option as CircOption) &&
                                    <Icon name="check" size={16} color="#fff" />
                                  }
                                </View>
                              </View>
                              <Text style={styles.checkboxLabel}>{option}</Text>
                            </TouchableOpacity>
                          ))}

                          <Text style={styles.label}>Pouls</Text>
                          <TextInput
                            style={styles.input}
                            placeholder="Fréquence cardiaque (bpm)"
                            value={form.pouls}
                            onChangeText={(t) => setForm({ ...form, pouls: t })}
                            keyboardType="numeric"
                          />

                          <Text style={styles.label}>Pression artérielle</Text>
                          <TextInput
                            style={styles.input}
                            placeholder="Ex: 120/80 mmHg"
                            value={form.pressionArterielle}
                            onChangeText={(t) => setForm({ ...form, pressionArterielle: t })}
                          />

                          <Text style={styles.label}>Notes supplémentaires</Text>
                          <TextInput
                            style={styles.textarea}
                            placeholder="Notes sur l'examen circulatoire"
                            value={form.DescCirc}
                            onChangeText={(t) => setForm({ ...form, DescCirc: t })}
                            multiline
                          />
                        </View>
                      </ScrollView>
                    </Collapsible>
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

      {/* Boîte de dialogue pour les informations personnelles */}
      <PersonalInfoModal
        visible={showPersonalInfoModal}
        onClose={() => setShowPersonalInfoModal(false)}
        form={form}
        setForm={setForm}
      />

      {/* Boîte de dialogue pour la consultation */}
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

      {/* Boîte de dialogue pour l'examen respiratoire */}
      <RespiratoireModal
        visible={showRespiratoireModal}
        onClose={() => setShowRespiratoireModal(false)}
        form={form}
        setForm={setForm}
        voieAerienneBrevetee={voieAerienneBrevetee}
        setVoieAerienneBrevetee={setVoieAerienneBrevetee}
        selectRespOption={selectRespOption}
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
    textAlign: "center",
    marginBottom: 20,
    fontWeight: 'bold'
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 15,
    width: "100%"
  },
  fullWidthAccordion: {
    width: "100%",
    marginBottom: 15,
  },
  subRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
    width: "100%"
  },
  accordionBox: {
    flex: 1,
    marginHorizontal: 5
  },
  subAccordionBox: {
    flex: 1,
    marginHorizontal: 5,
  },
  header: {
    backgroundColor: "#3498db",
    padding: 15,
    borderRadius: 8,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 2,
  },
  subHeader: {
    backgroundColor: "#2980b9",
    padding: 12,
    borderRadius: 6,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginVertical: 5,
  },
  headerText: { color: "#fff", fontSize: 16, fontWeight: "bold" },
  subHeaderText: { color: "#fff", fontSize: 14, fontWeight: "bold" },
  content: {
    backgroundColor: "rgba(255,255,255,0.95)",
    padding: 15,
    borderBottomLeftRadius: 8,
    borderBottomRightRadius: 8,
    marginBottom: 10,
  },
  contentSub: {
    backgroundColor: "rgba(255,255,255,0.95)",
    padding: 12,
    borderBottomLeftRadius: 8,
    borderBottomRightRadius: 8,
  },
  scrollContent: {
    maxHeight: 400,
  },
  internalScroll: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#dce0e4",
    borderRadius: 9,
    padding: 2,
    backgroundColor: "#fff",
    width:'100%',
    
  },
  input: {
    borderWidth: 1,
    borderColor: "#dce0e4",
    padding: 12,
    borderRadius: 8,
    marginBottom: 12,
    backgroundColor: "#fff",
    fontSize: 16,
  },
  textarea: {
    borderWidth: 1,
    borderColor: "#dce0e4",
    padding: 12,
    borderRadius: 8,
    marginBottom: 12,
    backgroundColor: "#fff",
    minHeight: 100,
    textAlignVertical: "top",
    fontSize: 16,
  },
  pickerBox: {
    borderWidth: 1,
    borderColor: "#dce0e4",
    borderRadius: 8,
    marginBottom: 12,
    backgroundColor: "#fff",
    overflow: 'hidden',
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 6,
    color: '#2c3e50'
  },
  expandableHeader: {
    padding: 10,
    backgroundColor: '#ecf0f1',
    borderRadius: 6,
    marginBottom: 8,
  },
  checkboxRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  radioRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
    paddingVertical: 4,
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  radioContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  checkbox: {
    width: 22,
    height: 22,
    borderWidth: 1,
    borderColor: "#95a5a6",
    borderRadius: 4,
    marginRight: 10,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  radio: {
    width: 22,
    height: 22,
    borderWidth: 2,
    borderColor: "#95a5a6",
    borderRadius: 11,
    marginRight: 12,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  checkboxSelected: {
    backgroundColor: "#3498db",
    borderColor: "#3498db",
  },
  radioSelected: {
    borderColor: "#3498db",
  },
  radioInner: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#3498db',
  },
  checkboxLabel: {
    fontSize: 14,
    color: '#2c3e50',
    flex: 1,
  },
  radioLabel: {
    fontSize: 14,
    color: '#2c3e50',
    flex: 1,
  },
  buttonContainer: {
    width: '100%',
    alignItems: 'center',
    marginTop: 20,
  },
  button: {
    backgroundColor: "#27ae60",
    padding: 16,
    borderRadius: 8,
    alignItems: "center",
    marginBottom: 12,
    width: "100%",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.23,
    shadowRadius: 2.62,
    elevation: 4,
  },
  secondaryButton: {
    backgroundColor: "transparent",
    padding: 16,
    borderRadius: 8,
    alignItems: "center",
    width: "100%",
    borderWidth: 1,
    borderColor: "#7f8c8d",
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold"
  },
  secondaryButtonText: {
    color: "#7f8c8d",
    fontSize: 16,
    fontWeight: "600"
  },
  // Styles pour le modal
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',

  },
  modalContent: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
    width: '100%',
    maxWidth: 300,
  },
  modalTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 15,
    textAlign: 'center',
  },
  modalOption: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  modalOptionText: {
    fontSize: 16,
    textAlign: 'center',
  },
  modalCancel: {
    marginTop: 10,
    padding: 15,
    backgroundColor: '#e74c3c',
    borderRadius: 5,
  },
  modalCancelText: {
    color: 'white',
    textAlign: 'center',
    fontWeight: 'bold',
  },
  // Styles pour la boîte de dialogue des informations personnelles
  personalInfoModal: {
    backgroundColor: 'white',
    borderRadius: 10,
    width: '90%',
    maxHeight: '80%',
    overflow: 'hidden',
  },
  modalHeader: {
    backgroundColor: "#3498db",
    padding: 15,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    
  },
  modalFooter: {
    padding: 15,
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  modalButton: {
    backgroundColor: "#3498db",
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  modalButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  // Styles pour l'en-tête avec logos
  header1: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10 ,
    backgroundColor: '#ebf0f4ff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  logoLeft: {
    width: 100,
    height: 70,
    
  },
  logoRight: {
    width: 100,
    height: 70,

    
  },
});