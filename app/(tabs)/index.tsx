import { Text, StyleSheet, TextInput, View, TouchableOpacity, ScrollView, ImageBackground, SafeAreaView, KeyboardAvoidingView, Platform, Modal } from 'react-native';
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

const constantes = [
  "Fréquence respiratoire",
  "Saturation en oxygène périphérique",
  "Fréquence cardiaque",
  "Pression sanguine",
  "Température du corps",
  "Glycémie",
  "Échelle de Glasgow",
];

// Nouveau composant pour les sélecteurs Oui/Non
const OuiNonSelector = ({
  label,
  value,
  onChange,
}: {
  label: string;
  value: "oui" | "non" | null;
  onChange: (val: "oui" | "non") => void;
}) => {
  const [openMenu, setOpenMenu] = useState(false);
  const options: ("oui" | "non")[] = ["oui", "non"];

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
          {options.map((opt) => (
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

const ConstanteSelector = ({
  label,
  value,
  onChange,
}: {
  label: string;
  value: "initial" | "transfert" | "final" | null;
  onChange: (val: "initial" | "transfert" | "final") => void;
}) => {
  const [modalVisible, setModalVisible] = useState(false);
  const options: ("initial" | "transfert" | "final")[] = ["initial", "transfert", "final"];

  const getColor = (val: string | null) => {
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
                <Text style={styles.modalOptionText}>{opt.toUpperCase()}</Text>
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

export default function HomeScreen() {
  const [openSections, setOpenSections] = useState({
    perso: false,
    consult: false,
    examen: false,
    respiratoire: false,
    circulaire: false
  });

  const toggleSection = (section: keyof typeof openSections) => {
    setOpenSections(prev => ({ ...prev, [section]: !prev[section] }));
  };

  const [showMotifDesc, setShowMotifDesc] = useState(false);
  const [showObsDesc, setShowObsDesc] = useState(false);
  const [showAllergieDesc, setShowAllergieDesc] = useState(false);

  const [voieAerienneBrevetee, setVoieAerienneBrevetee] = useState<boolean | null>(null);

  const [form, setForm] = useState({
    nom: "",
    age: "",
    sexe: "",
    motif: "",
    motifDesc: "",
    traitementPrecedent: "",
    DescPreTraitement: "",
    allergie: "",
    Descallergie: "",
    constante_Fréquence_respiratoire: null as "initial" | "transfert" | "final" | null,
    constante_Saturation_en_oxygène_périphérique: null as "initial" | "transfert" | "final" | null,
    constante_Fréquence_cardiaque: null as "initial" | "transfert" | "final" | null,
    constante_Pression_sanguine: null as "initial" | "transfert" | "final" | null,
    constante_Température_du_corps: null as "initial" | "transfert" | "final" | null,
    constante_Glycémie: null as "initial" | "transfert" | "final" | null,
    constante_Échelle_de_Glasgow: null as "initial" | "transfert" | "final" | null,
    constante_Ventilation_spontanee: null as "oui" | "non" | null,
    constante_Dyspnee: null as "oui" | "non" | null,
    constante_Cyanose: null as "oui" | "non" | null,
    constante_Stridor: null as "oui" | "non" | null,
    constante_Tirage: null as "oui" | "non" | null,
    constante_Mobilité_thoracique: null as "Normale" | "Asymétrique" | "Paradoxal" | null,
    examenResp: [] as RespOption[],
    DescResp: "",
    examenCirc: [] as CircOption[],
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
    <SafeAreaView style={{ flex: 1 }}>
      <ImageBackground
        source={require('@/assets/images/cc.webp')}
        style={styles.background}
        resizeMode="cover"
      >
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={{ flex: 1 }}
        >
          <ScrollView contentContainerStyle={styles.container}>
            <Text style={styles.introText}>Formulaire d'évaluation médicale</Text>

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
                <Collapsible collapsed={!openSections.consult}>
                  <View style={styles.content}>
                    <Text style={styles.label}>Motif de consultation</Text>
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

                    <Text style={styles.label}>Traitements précédents</Text>
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

                    <Text style={styles.label}>Allergies</Text>
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
                    <View style={{ height: 200 }}>
                      <ScrollView
                        style={styles.internalScroll}
                        nestedScrollEnabled={true}
                      >
                        {constantes.map((c) => (
                          <View style={{ width: '100%', marginBottom: 5 }} key={c}>
                            <ConstanteSelector
                              label={c}
                              value={(form as any)[`constante_${c.replace(/\s/g, "_")}`]}
                              onChange={(val) =>
                                setForm((prev) => ({ ...prev, [`constante_${c.replace(/\s/g, "_")}`]: val }))
                              }
                            />
                          </View>
                        ))}
                      </ScrollView>
                    </View>
                  </View>
                </Collapsible>
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

                      <Collapsible collapsed={!openSections.respiratoire}>
                        <ScrollView
                          style={styles.scrollContent}
                          nestedScrollEnabled={true}
                        >
                          <View style={styles.contentSub}>
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
                                <Text style={[styles.label, { marginTop: 10 }]}>Cause de l'obstruction (sélection unique)</Text>

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
                              const key = `constante_${label.replace(/\s/g, "_")}`;
                              return (
                                <OuiNonSelector
                                  key={label}
                                  label={label}
                                  value={(form as any)[key]}
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
                                    setForm({ ...form, constante_Mobilité_thoracique: value as "Normale" | "Asymétrique" | "Paradoxal" })
                                  }
                                >
                                  <Picker.Item label="Sélectionner un état" value={null} />
                                  <Picker.Item label="Normale" value="Normale" />
                                  <Picker.Item label="Asymétrique" value="Asymétrique" />
                                  <Picker.Item label="Paradoxale" value="Paradoxal" />
                                </Picker>
                              </View>
                            </View>

                            <Text style={styles.label}>Notes supplémentaires</Text>

                          </View>
                        </ScrollView>
                      </Collapsible>
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
      </ImageBackground>
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
    paddingBottom: 40,
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
    borderRadius: 8,
    padding: 5,
    backgroundColor: "#fff",
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
    width: '80%',
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
});