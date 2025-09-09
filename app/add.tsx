import { Text, TextInput, View, TouchableOpacity, ScrollView, SafeAreaView, KeyboardAvoidingView, Platform, Modal, Image, Alert } from 'react-native';
import React, { useState } from 'react';
import Collapsible from 'react-native-collapsible';
import { styles } from "./modals/style"
import { FormType,RespOption } from '@/lib/types';
import { PersonalInfoModal } from './modals/PersonalInfoModal';
import { ConsultationModal } from './modals/ConsultationModal';
import { RespiratoireModal } from './modals/RespiratoireModal';
import { CirculatoireModal } from './modals/CirculatoireModal';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import TraumatizedModal from './modals/TraumatismeModal';
import NeurologiqueModal from './modals/NeurologiqueModal';


export default function addScreen() {
  const [openSections, setOpenSections] = useState({
    perso: false,
    consult: false,
    examen: false,
    respiratoire: false,
    circulaire: false,
    traumatisme: false,
    neurologique:false
  });

  const [showPersonalInfoModal, setShowPersonalInfoModal] = useState(false);
  const [showConsultationModal, setShowConsultationModal] = useState(false);
  const [showRespiratoireModal, setShowRespiratoireModal] = useState(false);
  const [showCirculatoireModal, setShowCirculatoireModal] = useState(false);
  
  const [showTraumaModal, setShowTraumaModal] = useState(false);
  const [showNeurologiqueModal, setShowNeurologiqueModal] = useState(false);
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
    } else if (section === 'traumatisme') {
      // Vérifier si au moins un champ de consultation est rempli avant d'ouvrir l'examen traumatisme
      if (isConsultationFilled()) {
        setShowTraumaModal(true);
      } else {
        Alert.alert(
          "Information requise", 
          "Veuillez d'abord remplir au moins un champ dans la consultation",
          [
            { text: "OK", onPress: () => setShowTraumaModal(true) }
          ]
        );
      }
    }
    else if (section === 'neurologique') {
      // Vérifier si au moins un champ de consultation est rempli avant d'ouvrir l'examen traumatisme
      if (isConsultationFilled()) {
        setShowNeurologiqueModal(true);
      } else {
        Alert.alert(
          "Information requise", 
          "Veuillez d'abord remplir au moins un champ dans la consultation",
          [
            { text: "OK", onPress: () => setShowNeurologiqueModal(true) }
          ]
        );
      }
    }
     else {
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
                <MaterialIcons
                  name={openSections.perso ? "keyboard-arrow-up" : "keyboard-arrow-down"}
                  size={20}
                  color="#fff"
                />
              </TouchableOpacity>
              
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
                <MaterialIcons
                  name={openSections.consult ? "keyboard-arrow-up" : "keyboard-arrow-down"}
                  size={20}
                  color="#fff"
                />
              </TouchableOpacity>
             
            </View>
          </View>

          {/* Examen */}
          <View style={styles.fullWidthAccordion}>
            <TouchableOpacity 
              style={[
                styles.header, 
                !isConsultationFilled() && {backgroundColor: '#95a5a6'} 
              ]} 
              onPress={() => toggleSection('examen')}
            >
              <Text style={styles.headerText}>Examen Clinique</Text>
              <MaterialIcons
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
                      <MaterialIcons
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
                      <MaterialIcons
                        name={openSections.circulaire ? "keyboard-arrow-up" : "keyboard-arrow-down"}
                        size={18}
                        color="#fff"
                      />
                    </TouchableOpacity>
                  </View>
                </View>
                
                {/* Nouvelle ligne pour Traumatisme */}
                <View style={styles.subRow}>
                  <View style={[styles.subAccordionBoxx, {width: '100%'}]}>
                    <TouchableOpacity 
                      style={[
                        styles.subHeader, 
                        !isConsultationFilled() && {backgroundColor: '#7f8c8d'} // Griser si consultation non remplie
                      ]} 
                      onPress={() => toggleSection('traumatisme')}
                    >
                      <Text style={styles.subHeaderText}>Traumatisme</Text>
                      <MaterialIcons
                        name={openSections.traumatisme ? "keyboard-arrow-up" : "keyboard-arrow-down"}
                        size={18}
                        color="#fff"
                      />
                    </TouchableOpacity>
                  </View>
                   <View style={[styles.subAccordionBoxx, {width: '100%'}]}>
                    <TouchableOpacity 
                      style={[
                        styles.subHeader, 
                        !isConsultationFilled() && {backgroundColor: '#7f8c8d'} // Griser si consultation non remplie
                      ]} 
                      onPress={() => toggleSection('neurologique')}
                    >
                      <Text style={styles.subHeaderText}>Neurologique</Text>
                      <MaterialIcons
                        name={openSections.neurologique ? "keyboard-arrow-up" : "keyboard-arrow-down"}
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

      <TraumatizedModal
        visible={showTraumaModal}
        onClose={() => setShowTraumaModal(false)}
        form={form}
        setForm={setForm}
      />

      <NeurologiqueModal 
        visible={showNeurologiqueModal}
        onClose={() => setShowNeurologiqueModal(false)}
        form={form}
        setForm={setForm}
      />

    </SafeAreaView>
  );
}