import { FormType, RespOption } from '@/lib/types';
import React, { useState } from 'react';
import { Alert, Dimensions, Image, KeyboardAvoidingView, Platform,  ScrollView, Text, TouchableOpacity, View } from 'react-native';
import Collapsible from 'react-native-collapsible';
import { SafeAreaView } from "react-native-safe-area-context";
import Feather from 'react-native-vector-icons/Feather';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Fontisto from 'react-native-vector-icons/Fontisto';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import { CirculatoireModal } from './modals/CirculatoireModal';
import { ConsultationModal } from './modals/ConsultationModal';
import NeurologiqueModal from './modals/NeurologiqueModal';
import { PersonalInfoModal } from './modals/PersonalInfoModal';
import { RespiratoireModal } from './modals/RespiratoireModal';

import { ModalTraitementAdminstre } from './modals/Traitement';
import TraumatizedModal from './modals/TraumatismeModal';
import { stylesModern } from "./styladd";
import MobilisationModal from './modals/TechniqueModal';
import AirwayManagementModal from './modals/GestionVoies';
import VentilationModal from './modals/ventilation';
import OxygenationModal from './modals/oxygenation';
import InhalationTherapyModal from './modals/therapie';
import VeinousLineCannulationModal from './modals/VeinousLineCannulationModal';
import HemorrhageControlModal from './modals/Hemorragie';
import PansementModal from './modals/pansement';
import CatheterModal from './modals/catheterisme';
import DiagnosticModal from './modals/Diagnostic';
import ResolutionCodeModal from './modals/CodeResolution';
import HospitalModal from './modals/hospital';
import CodeAlerteModal from './modals/codealert';
import TherapieElectriqueModal from './modals/therapielectrique';

import AsyncStorage from '@react-native-async-storage/async-storage';
import NetInfo from '@react-native-community/netinfo';


//import { LayoutAnimation,  UIManager } from 'react-native';

//const { width } = Dimensions.get('window');
// if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
//   UIManager.setLayoutAnimationEnabledExperimental(true);
// }

export default function addScreen() {
  const [message, setMessage] = useState('');
  const [erreur, setErreur] = useState('');
  const [openSections, setOpenSections] = useState({
    perso: false,
    diagnostic: false,
    consult: false,
    examen: false,
    respiratoire: false,
    circulaire: false,
    traumatisme: false,
    neurologique: false,
    Traitement: false,
    techniquee: false,
    immobilisation: false,
    voies: false,
    ventilation: false,
    oxygene: false,
    therapie: false,
    canulation: false,
    hemorragie: false,
    pansement: false,
    catheterisme: false,
    code_resolution: false,
    hospital: false,
    alert:false,
    electrique:false
  });
  

// Sauvegarder formulaire localement
const saveFormOffline = async (form: FormType) => {
  try {
    const stored = await AsyncStorage.getItem('forms');
    const forms = stored ? JSON.parse(stored) : [];
    // Ajouter un champ pour savoir si le formulaire a été synchronisé
    forms.push({ ...form, synced: false });
    await AsyncStorage.setItem('forms', JSON.stringify(forms));
    console.log('✅ Formulaire sauvegardé offline');
     Alert.alert("les donnes sont enregistrer localement  ");
  } catch (error) {
    console.error('Erreur sauvegarde offline', error);
  }
};

// Envoyer formulaire au serveur
const sendFormToServer = async (form: FormType) => {
  try {
    // Exemple avec fetch
    const response = await fetch('https://ton-api.com/forms', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    });
    if (!response.ok) throw new Error('Erreur serveur');
    return true;
  } catch (error) {
    console.log('Impossible d’envoyer le formulaire, sauvegardé offline.');
     Alert.alert("les donnes sont enregistrer localement . ");
    return false;
  }
};

// Synchroniser tous les formulaires non synchronisés
const syncForms = async () => {
  const state = await NetInfo.fetch();
  if (!state.isConnected) return; // Pas de connexion, on attend

  try {
    const stored = await AsyncStorage.getItem('forms');
    const forms = stored ? JSON.parse(stored) : [];
    let updatedForms = [...forms];

    for (let i = 0; i < forms.length; i++) {
      if (!forms[i].synced) {
        const success = await sendFormToServer(forms[i]);
        if (success) {
          updatedForms[i].synced = true;
        }
      }
    }

    await AsyncStorage.setItem('forms', JSON.stringify(updatedForms));
    console.log('✅ Synchronisation terminée');
  } catch (error) {
    console.error('Erreur synchronisation', error);
  }
};

// Appel à handleSubmit


const handleSubmit = async () => {
  console.log(form.fractureFermee)
   console.log(form.constante_Saturation_en_oxygène_périphérique)
  console.log("📝 Début de l'enregistrement...");
await saveFormOffline(form); // Toujours sauvegarder localement
  await syncForms();    
  try {
    // Validation des champs obligatoires
    if (!form.nom || !form.age || !form.sexe) {
      Alert.alert("Erreur", "Veuillez remplir les informations personnelles obligatoires (Nom, Âge, Sexe)");
      return;
    }

    // Préparer les données pour l'API
    const clinicalData = {
      // Informations personnelles (OBLIGATOIRES)
      nom: form.nom,
      age: form.age,
      sexe: form.sexe,
      
      // Consultation
      motifDesc: form.motifDesc || "",
      DescPreTraitement: form.DescPreTraitement || "",
      Descallergie: form.Descallergie || "",
      
      // Constantes vitales
      constante_Fréquence_respiratoire: form.constante_Fréquence_respiratoire || "",
      constante_Saturation_en_oxygène_périphérique: form.constante_Saturation_en_oxygène_périphérique || "",
      constante_Fréquence_cardiaque: form.constante_Fréquence_cardiaque || "",
      constante_Pression_sanguine: form.constante_Pression_sanguine || "",
      constante_Température_du_corps: form.constante_Température_du_corps || "",
      constante_Glycémie: form.constante_Glycémie || "",
      constante_Échelle_de_Glasgow: form.constante_Échelle_de_Glasgow || "",
      
      // Respiratoire
      constante_Ventilation_spontanee: form.constante_Ventilation_spontanee || "",
      constante_Dyspnee: form.constante_Dyspnee || "",
      constante_Cyanose: form.constante_Cyanose || "",
      constante_Stridor: form.constante_Stridor || "",
      constante_Tirage: form.constante_Tirage || "",
      constante_Mobilité_thoracique: form.constante_Mobilité_thoracique || "",
      examenResp: form.examenResp || "",
      DescResp: form.DescResp || "",
      
      // Circulatoire
      examenCirc: form.examenCirc || "",
      DescCirc: form.DescCirc || "",
      pouls: form.pouls || "",
      pressionArterielle: form.pressionArterielle || "",
      couleurPeau: form.couleurPeau || "",
      rythmeCardiaque: form.rythmeCardiaque || "",
      remplissageCapillaire: form.remplissageCapillaire || "",
      pouls_radial: form.pouls_radial || "",
      pouls_femoral: form.pouls_femoral || "",
      pouls_carotide: form.pouls_carotide || "",
      temperaturePeau: form.temperaturePeau || "",
      hydratationPeau: form.hydratationPeau || "",
      etatPeau: form.etatPeau || "",
      
      // Neurologique
      etatConscience: form.etatConscience || "",
      orientation: form.orientation || "",
      perteConscience: form.perteConscience || false,
      pupilleDroite: form.pupilleDroite || "",
      pupilleGauche: form.pupilleGauche || "",
      reactiviteDroite: form.reactiviteDroite || "",
      reactiviteGauche: form.reactiviteGauche || "",
      deficitNeurologique: form.deficitNeurologique || false,
      
      // Traitements
      medicamentsAdministres: form.medicamentsAdministres || "",
      voieAdministration: form.voieAdministration || "",
      doseAdministree: form.doseAdministree || "",
      
      // Techniques
      technique_immobilisation: form.technique_immobilisation || "",
      gestionVoiesAeriennes: form.gestionVoiesAeriennes || "",
      ventilation: form.ventilation || "",
      oxygenation: form.oxygenation || "",
      therapie: form.therapie || false,
      cannulationVeineuse: form.cannulationVeineuse || "",
      controleHemorragie: form.controleHemorragie || "",
      therapieElectrique: form.therapieElectrique || false,
      pansement: form.pansement || false,
      catheterisme: form.catheterisme || "",
      
      // Diagnostic et résolution
      diagnostic: form.diagnostic || "",
      codeResolution: form.codeResolution || "",
      hospitalDestination: form.hospitalDestination || "",
      codePreAlerte: form.codePreAlerte || "",
      
      // Voie aérienne
      voieAerienneBrevetee: form.voieAerienneBrevetee || false,
      causeObstruction: form.causeObstruction || "",
      
      // Traumatismes
      contusion: form.contusion || "",
      entorse: form.entorse || "",
      dislocation: form.dislocation || "",
      fractureFermee: form.fractureFermee || "",
      fractureOuverte: form.fractureOuverte || "",
      amputation: form.amputation || "",
      blessure: form.blessure || "",
      brulure: form.brulure || ""
    };

    console.log("📤 Données à envoyer:", clinicalData);

    // Envoi à l'API
    const response = await fetch('http://192.168.1.101:3000/enregistrement', {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(clinicalData)
    });

    console.log("📥 Statut de la réponse:", response.status);

    const data = await response.json();
    console.log("📊 Réponse du serveur:", data);

    if (data.success) {
      Alert.alert('✅ Succès', `Enregistrement #${data.id} créé avec succès !`);
      
      // Réinitialiser le formulaire après succès
      // resetForm(); // Décommentez si vous avez une fonction resetForm
      
    } else {
      Alert.alert('❌ Erreur', data.error || 'Erreur lors de l\'enregistrement');
    }

  } catch (error) {
    console.error('💥 Erreur complète:', error);
    Alert.alert('❌ Erreur réseau', 'Impossible de se connecter au serveur. Vérifiez que le serveur est démarré.');
  }
};
  const [showPersonalInfoModal, setShowPersonalInfoModal] = useState(false);
  const [showConsultationModal, setShowConsultationModal] = useState(false);
  const [showRespiratoireModal, setShowRespiratoireModal] = useState(false);
  const [showCirculatoireModal, setShowCirculatoireModal] = useState(false);
  const [showGestionVoies, setShowGestionVoies] = useState(false);
  const [showHospitalModal, setShowHospitalModal] = useState(false);
  const [showPansementModal, setShowPansementModal] = useState(false);
  const [showOxygenationModal, setshowOxygenationModal] = useState(false);
  const [showTraumaModal, setShowTraumaModal] = useState(false);
  const [showNeurologiqueModal, setShowNeurologiqueModal] = useState(false);
  const [showMotifDesc, setShowMotifDesc] = useState(false);
  const [showObsDesc, setShowObsDesc] = useState(false);
  const [showVentilationModal, setshowVentilationModal] = useState(false);
  const [showAllergieDesc, setShowAllergieDesc] = useState(false);
  const [ShowTraitementModal, setShowTraitementModal] = useState(false);
  const [showModalImobilisation, setshowModalImobilisation] = useState(false);
  const [showInhalationModal, setShowInhalationModal] = useState(false);
  const [showDiagnosticModal, setShowDiagnosticModal] = useState(false);
  const [showCatheterModal, setShowCatheterModal] = useState(false);
  const [showTherapieElectriqueModal, setShowTherapieElectriqueModal] = useState(false);
  const [showCodeAlerteModal, setShowCodeAlerteModal] = useState(false);
  const [showResolutionCodeScreen, setShowResolutionCodeScreen] = useState(false);
  const [showVeinousCannulationModal, setShowVeinousCannulationModal] = useState(false);
  const [showHemorrhageControlModal, setShowHemorrhageControlModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
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
    couleurPeau: null,
    rythmeCardiaque: null,
    remplissageCapillaire: null,
    pouls_radial: null,
    pouls_femoral: null,
    pouls_carotide: null,
    temperaturePeau: null,
    hydratationPeau: null,
    etatPeau: null,
    codeResolution: null,
    hospitalDestination: null
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
const isRespiratoireFilled = () => {
  return (
    form.examenResp.length > 0 ||
    (form.DescResp && form.DescResp.trim() !== "") ||
    form.constante_Fréquence_respiratoire !== null ||
    form.constante_Saturation_en_oxygène_périphérique !== null ||
    form.constante_Ventilation_spontanee !== null ||
    form.constante_Dyspnee !== null ||
    form.constante_Cyanose !== null ||
    form.constante_Stridor !== null ||
    form.constante_Tirage !== null ||
    form.constante_Mobilité_thoracique !== null
  );
};
const isCirculatoireFilled = (): boolean => {
  return (
    form.examenCirc.length > 0 ||                     // si des options circulatoires sont cochées
    (form.DescCirc && form.DescCirc.trim() !== "") || // si la description n'est pas vide
    form.pouls.trim() !== "" ||
    form.pressionArterielle.trim() !== "" ||
    form.couleurPeau != null ||
    form.rythmeCardiaque != null ||
    form.remplissageCapillaire != null ||
    form.pouls_radial != null ||
    form.pouls_femoral != null ||
    form.pouls_carotide != null ||
    form.temperaturePeau != null ||
    form.hydratationPeau != null ||
    form.etatPeau != null
  );
};
const isNeurologiqueFilled = (): boolean => {
  return !!(
    form.etatConscience ||
    form.orientation ||
    form.perteConscience ||
    form.pupilleGauche ||
    form.pupilleDroite ||
    form.reactiviteGauche ||
    form.reactiviteDroite
  );
};   
const isTraumatismeFilled = () => {
  return (
    (form.technique_immobilisation && form.technique_immobilisation.length > 0) ||
    form.technique_colier_cervical === true ||
    form.technique_brancard_pagaie === true ||
    form.technique_corset_spinal === true ||
    form.technique_planche_dorsale === true ||
    form.technique_attelle_membre === true ||
    form.technique_aspirateur_metalas === true ||
    form.technique_immobilisateur_tetracameral === true ||
    form.technique_retrait_casque === true ||
    (form.technique_autres && form.technique_autres.trim() !== "")
  );
};
  const toggleSection = (section: keyof typeof openSections) => {
    if (section === 'perso') {
      setShowPersonalInfoModal(true);
    } else if (section === 'consult') {
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
    } else if (section === 'techniquee') {
      if (isConsultationFilled()) {
        setOpenSections(prev => ({ ...prev, [section]: !prev[section] }));
      } else {
        Alert.alert(
          "Information requise",
          "Veuillez d'abord remplir au moins un champ dans la consultation",
          [
            { text: "OK", onPress: () => setShowRespiratoireModal(true) }
          ]
        );
      }
    } else if (section === 'immobilisation') {
      if (isConsultationFilled()) {
        setshowModalImobilisation(true);
      } else {
        Alert.alert(
          "Information requise",
          "Veuillez d'abord remplir au moins un champ dans la consultation",
          [
            { text: "OK", onPress: () => setShowConsultationModal(true) }
          ]
        );
      }
    } else if (section === 'voies') {
      if (isConsultationFilled()) {
        setShowGestionVoies(true);
      } else {
        Alert.alert(
          "Information requise",
          "Veuillez d'abord remplir au moins un champ dans la consultation",
          [
            { text: "OK", onPress: () => setShowConsultationModal(true) }
          ]
        );
      }
    } else if (section === 'ventilation') {
      if (isConsultationFilled()) {
        setshowVentilationModal(true);
      } else {
        Alert.alert(
          "Information requise",
          "Veuillez d'abord remplir au moins un champ dans la consultation",
          [
            { text: "OK", onPress: () => setShowConsultationModal(true) }
          ]
        );
      }
    } else if (section === 'oxygene') {
      if (isConsultationFilled()) {
        setshowOxygenationModal(true);
      } else {
        Alert.alert(
          "Information requise",
          "Veuillez d'abord remplir au moins un champ dans la consultation",
          [
            { text: "OK", onPress: () => setShowConsultationModal(true) }
          ]
        );
      }
    }
    else if (section === 'therapie') {
      if (isConsultationFilled()) {
        setShowInhalationModal(true);
      } else {
        Alert.alert(
          "Information requise",
          "Veuillez d'abord remplir au moins un champ dans la consultation",
          [
            { text: "OK", onPress: () => setShowConsultationModal(true) }
          ]
        );
      }
    }
    else if (section === 'canulation') {
      if (isConsultationFilled()) {
        setShowVeinousCannulationModal(true);
      } else {
        Alert.alert(
          "Information requise",
          "Veuillez d'abord remplir au moins un champ dans la consultation",
          [
            { text: "OK", onPress: () => setShowConsultationModal(true) }
          ]
        );
      }
    }
    else if (section === 'hemorragie') {
      if (isConsultationFilled()) {
        setShowHemorrhageControlModal(true);
      } else {
        Alert.alert(
          "Information requise",
          "Veuillez d'abord remplir au moins un champ dans la consultation",
          [
            { text: "OK", onPress: () => setShowConsultationModal(true) }
          ]
        );
      }
    }
    else if (section === 'pansement') {
      if (isConsultationFilled()) {
        setShowPansementModal(true);
      } else {
        Alert.alert(
          "Information requise",
          "Veuillez d'abord remplir au moins un champ dans la consultation",
          [
            { text: "OK", onPress: () => setShowConsultationModal(true) }
          ]
        );
      }
    }
    else if (section === 'catheterisme') {
      if (isConsultationFilled()) {
        setShowCatheterModal(true);
      } else {
        Alert.alert(
          "Information requise",
          "Veuillez d'abord remplir au moins un champ dans la consultation",
          [
            { text: "OK", onPress: () => setShowConsultationModal(true) }
          ]
        );
      }
    }
    else if (section === 'diagnostic') {
      if (isConsultationFilled()) {
        setShowDiagnosticModal(true);
      } else {
        Alert.alert(
          "Information requise",
          "Veuillez d'abord remplir au moins un champ dans la consultation",
          [
            { text: "OK", onPress: () => setShowConsultationModal(true) }
          ]
        );
      }
    }
    else if (section === 'code_resolution') {
      if (isConsultationFilled()) {
        setShowResolutionCodeScreen(true);
      } else {
        Alert.alert(
          "Information requise",
          "Veuillez d'abord remplir au moins un champ dans la consultation",
          [
            { text: "OK", onPress: () => setShowConsultationModal(true) }
          ]
        );
      }
    }
    else if (section === 'hospital') {
      if (isConsultationFilled()) {
        setShowHospitalModal(true);
      } else {
        Alert.alert(
          "Information requise",
          "Veuillez d'abord remplir au moins un champ dans la consultation",
          [
            { text: "OK", onPress: () => setShowConsultationModal(true) }
          ]
        );
      }
    }
     else if (section === 'alert') {
      if (isConsultationFilled()) {
        setShowCodeAlerteModal(true);
      } else {
        Alert.alert(
          "Information requise",
          "Veuillez d'abord remplir au moins un champ dans la consultation",
          [
            { text: "OK", onPress: () => setShowConsultationModal(true) }
          ]
        );
      }
    }
     else if (section === 'electrique') {
      if (isConsultationFilled()) {
        setShowTherapieElectriqueModal(true);
      } else {
        Alert.alert(
          "Information requise",
          "Veuillez d'abord remplir au moins un champ dans la consultation",
          [
            { text: "OK", onPress: () => setShowConsultationModal(true) }
          ]
        );
      }
    }
    else if (section === 'respiratoire') {
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
      if (isConsultationFilled()&&  isRespiratoireFilled() ) {
        setShowCirculatoireModal(true);
      } else {
        Alert.alert(
          "Information requise",
          "Veuillez d'abord remplir au moins un champ dans la Respiratoire",
          [
            { text: "OK", onPress: () => setShowRespiratoireModal(true) }
          ]
        );
      }
    } else if (section === 'traumatisme') {
      if (isConsultationFilled() ) {
        setShowTraumaModal(true);
      } else {
        Alert.alert(
          "Information requise",
          "Veuillez d'abord remplir au moins un champ dans la circulatoire",
          [
            { text: "OK", onPress: () => setShowCirculatoireModal(true) }
          ]
        );
      }
    } else if (section === 'neurologique') {
      if (isConsultationFilled()) {
        setShowNeurologiqueModal(true);
      } else {
        Alert.alert(
          "Information requise",
          "Veuillez d'abord remplir au moins un champ dans traumatisme",
          [
            { text: "OK", onPress: () => setShowTraumaModal(true) }
          ]
        );
      }
    } else if (section === 'Traitement') {
      if (isConsultationFilled() ) {
        setShowTraitementModal(true);
      } else {
        Alert.alert(
          "Information requise",
          "Veuillez d'abord remplir au moins un champ dans la c",
          [
            { text: "OK", onPress: () => setShowNeurologiqueModal(true) }
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

  
  

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#f2f5f8ff' }}>
      {/* En-tête avec dégradé de couleur */}
      <View style={stylesModern.header}>
        <View style={stylesModern.headerContent}>
          <Image
            source={require('@/assets/images/OIP.webp')}
            style={stylesModern.logoLeft}
            resizeMode="contain"
          />
          <Text style={stylesModern.headerTitle}>Enregistrement Clinique</Text>
          <Image
            source={require('@/assets/images/101.webp')}
            style={stylesModern.logoRight}
            resizeMode="contain"
          />
        </View>
      </View>

      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
      >
        <ScrollView contentContainerStyle={stylesModern.container}>
          {/* Infos personnelles + Consultation */}
          <View style={stylesModern.row}>
            {/* Carte Infos personnelles */}
            <TouchableOpacity
              style={[
                stylesModern.card,
                isPersonalInfoFilled() && stylesModern.cardCompleted
              ]}
              onPress={() => toggleSection('perso')}
            >

              <View style={[stylesModern.cardIconContainer, { backgroundColor: '#e0f2fe' }]}>
                <FontAwesome name="user-md" size={24} color="#0284c7" />
              </View>
              <Text style={stylesModern.cardTitle}>Infos personnelles</Text>
              <Text style={stylesModern.cardSubtitle}>
                {isPersonalInfoFilled() ? 'Complété' : 'À compléter'}
              </Text>
              <View style={stylesModern.cardArrow}>
                <MaterialIcons
                  name="keyboard-arrow-right"
                  size={24}
                  color="#64748b"
                />
              </View>
              {isPersonalInfoFilled() && (
                <View style={stylesModern.checkmark}>
                  <Feather name="check" size={16} color="#16a34a" />
                </View>
              )}
            </TouchableOpacity>

            {/* Carte Consultation */}
            <TouchableOpacity
              style={[
                stylesModern.card,
                isConsultationFilled() && stylesModern.cardCompleted,
                !isPersonalInfoFilled() && stylesModern.cardDisabled
              ]}
              onPress={() => toggleSection('consult')}
              disabled={!isPersonalInfoFilled()}
            >
              <View style={[stylesModern.cardIconContainer, { backgroundColor: '#f0f9ff' }]}>
                <Ionicons name="document-text" size={24} color="#0369a1" />
              </View>
              <Text style={stylesModern.cardTitle}>Consultation</Text>
              <Text style={stylesModern.cardSubtitle}>
                {isConsultationFilled() ? 'Complété' : 'À compléter'}
              </Text>
              <View style={stylesModern.cardArrow}>
                <MaterialIcons
                  name="keyboard-arrow-right"
                  size={24}
                  color="#64748b"
                />
              </View>
              {isConsultationFilled() && (
                <View style={stylesModern.checkmark}>
                  <Feather name="check" size={16} color="#16a34a" />
                </View>
              )}
            </TouchableOpacity>
          </View>

          {/* Carte Examen Clinique */}
          <TouchableOpacity
            style={[
              stylesModern.fullWidthCard,
              !isConsultationFilled() && stylesModern.cardDisabled
            ]}
            onPress={() => toggleSection('examen')}
            disabled={!isConsultationFilled()}
          >
            <View style={[stylesModern.cardIconContainer, { backgroundColor: '#f0fdf4' }]}>
              <Feather name="activity" size={24} color="#16a34a" />
            </View>
            <View style={stylesModern.cardContent}>
              <Text style={stylesModern.cardTitle}>Examen Clinique</Text>
              <Text style={stylesModern.cardSubtitle}>
                Examens spécialisés du patient
              </Text>
            </View>
            <MaterialIcons
              name={openSections.examen ? "keyboard-arrow-up" : "keyboard-arrow-down"}
              size={24}
              color="#64748b"
            />
          </TouchableOpacity>

          <Collapsible collapsed={!openSections.examen}>
            <View style={stylesModern.examenContent}>
              {/* Grille des examens spécialisés */}
              <View style={stylesModern.gridContainer}>
                {/* Respiratoire */}
                <TouchableOpacity
                  style={stylesModern.gridItem}
                  onPress={() => toggleSection('respiratoire')}
                >
                  <View style={[stylesModern.gridIconContainer, { backgroundColor: '#e0f2fe' }]}>
                    <MaterialCommunityIcons name="lungs" size={32} color="black" />
                  </View>
                  <Text style={stylesModern.gridText}>Respiratoire</Text>
                </TouchableOpacity>

                {/* Circulatoire */}
                <TouchableOpacity
                  style={stylesModern.gridItem}
                  onPress={() => toggleSection('circulaire')}
                >
                  <View style={[stylesModern.gridIconContainer, { backgroundColor: '#fee2e2' }]}>
                    <FontAwesome name="heartbeat" size={24} color="#dc2626" />
                  </View>
                  <Text style={stylesModern.gridText}>Circulatoire</Text>
                </TouchableOpacity>

                {/* Traumatisme */}
                <TouchableOpacity
                  style={stylesModern.gridItem}
                  onPress={() => toggleSection('traumatisme')}
                >
                  <View style={[stylesModern.gridIconContainer, { backgroundColor: '#fef3c7' }]}>
                    <Fontisto name="injection-syringe" size={24} color="#d97706" />
                  </View>
                  <Text style={stylesModern.gridText}>Traumatisme</Text>
                </TouchableOpacity>

                {/* Neurologique */}
                <TouchableOpacity
                  style={stylesModern.gridItem}
                  onPress={() => toggleSection('neurologique')}
                >
                  <View style={[stylesModern.gridIconContainer, { backgroundColor: '#ede9fe' }]}>
                    <MaterialCommunityIcons name="brain" size={32} color="black" />
                  </View>
                  <Text style={stylesModern.gridText}>Neurologique</Text>
                </TouchableOpacity>

                {/* Traitement */}
                <TouchableOpacity
                  style={stylesModern.gridItem}
                  onPress={() => toggleSection('Traitement')}
                >
                  <View style={[stylesModern.gridIconContainer, { backgroundColor: '#dcfce7' }]}>
                    <MaterialIcons name="medication" size={24} color="#16a34a" />
                  </View>
                  <Text style={stylesModern.gridText}>Traitement</Text>
                </TouchableOpacity>
              </View>
            </View>
          </Collapsible>

          {/* Carte Techniques Réalisées */}
          <TouchableOpacity
            style={[
              stylesModern.fullWidthCard,
              !isConsultationFilled() && stylesModern.cardDisabled
            ]}
            onPress={() => toggleSection('techniquee')}
            disabled={!isConsultationFilled()}
          >
            <View style={[stylesModern.cardIconContainer, { backgroundColor: '#f0f9ff' }]}>
              <MaterialCommunityIcons name="medical-bag" size={24} color="#0369a1" />
            </View>
            <View style={stylesModern.cardContent}>
              <Text style={stylesModern.cardTitle}>Techniques Réalisées</Text>
              <Text style={stylesModern.cardSubtitle}>
                Procédures médicales appliquées
              </Text>
            </View>
            <MaterialIcons
              name={openSections.techniquee ? "keyboard-arrow-up" : "keyboard-arrow-down"}
              size={24}
              color="#64748b"
            />
          </TouchableOpacity>

          <Collapsible collapsed={!openSections.techniquee}>
            <View style={stylesModern.examenContent}>
              <View style={stylesModern.gridContainer}>
                {/* Immobilisation */}
                <TouchableOpacity
                  style={stylesModern.gridItem}
                  onPress={() => toggleSection('immobilisation')}
                >
                  <View style={[stylesModern.gridIconContainer, { backgroundColor: '#ffedd5' }]}>
                    <MaterialCommunityIcons name="human-wheelchair" size={24} color="#ea580c" />
                  </View>
                  <Text style={stylesModern.gridText}>Immobilisation</Text>
                </TouchableOpacity>

                {/* Gestion Des Voies Aeriennes */}
                <TouchableOpacity
                  style={stylesModern.gridItem}
                  onPress={() => toggleSection('voies')}
                >
                  <View style={[stylesModern.gridIconContainer, { backgroundColor: '#e0f2fe' }]}>
                    <MaterialCommunityIcons name="airballoon" size={24} color="#0284c7" />
                  </View>
                  <Text style={stylesModern.gridText}>Voies Aériennes</Text>
                </TouchableOpacity>

                {/* Ventilation */}
                <TouchableOpacity
                  style={stylesModern.gridItem}
                  onPress={() => toggleSection('ventilation')}
                >
                  <View style={[stylesModern.gridIconContainer, { backgroundColor: '#f0fdf4' }]}>
                    <MaterialCommunityIcons name="lungs" size={24} color="#16a34a" />
                  </View>
                  <Text style={stylesModern.gridText}>Ventilation</Text>
                </TouchableOpacity>

                {/* Oxygenation */}
                <TouchableOpacity
                  style={stylesModern.gridItem}
                  onPress={() => toggleSection('oxygene')}
                >
                  <View style={[stylesModern.gridIconContainer, { backgroundColor: '#fae8ff' }]}>
                    <FontAwesome5 name="lungs" size={24} color="#c026d3" />
                  </View>
                  <Text style={stylesModern.gridText}>Oxygénation</Text>
                </TouchableOpacity>
                
                {/* Therapie */}
                <TouchableOpacity
                  style={stylesModern.gridItem}
                  onPress={() => toggleSection('therapie')}
                >
                  <View style={[stylesModern.gridIconContainer, { backgroundColor: '#e0e7ff' }]}>
                    <MaterialCommunityIcons name="lungs" size={24} color="#000" />
                  </View>
                  <Text style={stylesModern.gridText}>Thérapie</Text>
                </TouchableOpacity>
                
                {/* Canulation de la ligne veineuse */}
                <TouchableOpacity
                  style={stylesModern.gridItem}
                  onPress={() => toggleSection('canulation')}
                >
                  <View style={[stylesModern.gridIconContainer, { backgroundColor: '#fce7f3' }]}>
                    <MaterialCommunityIcons name="needle" size={24} color="#db2777" />
                  </View>
                  <Text style={stylesModern.gridText}>Canulation veineuse</Text>
                </TouchableOpacity>
                
                {/* Contrôle de l'hémorragie */}
                <TouchableOpacity
                  style={stylesModern.gridItem}
                  onPress={() => toggleSection('hemorragie')}
                >
                  <View style={[stylesModern.gridIconContainer, { backgroundColor: '#fee2e2' }]}>
                    <MaterialCommunityIcons name="blood-bag" size={24} color="#dc2626" />
                  </View>
                  <Text style={stylesModern.gridText}>Contrôle Hémorragie</Text>
                </TouchableOpacity>
                 <TouchableOpacity
                  style={stylesModern.gridItem}
                  onPress={() => toggleSection('electrique')}
                >
                  <View style={[stylesModern.gridIconContainer, { backgroundColor: '#fee2e2' }]}>
                    <MaterialCommunityIcons name="blood-bag" size={24} color="#dc2626" />
                  </View>
                  <Text style={stylesModern.gridText}>therapie electrique</Text>
                </TouchableOpacity>
                
                {/* Pansement */}
                <TouchableOpacity
                  style={stylesModern.gridItem}
                  onPress={() => toggleSection('pansement')}
                >
                  <View style={[stylesModern.gridIconContainer, { backgroundColor: '#dcfce7' }]}>
                    <MaterialCommunityIcons name="bandage" size={24} color="#16a34a" />
                  </View>
                  <Text style={stylesModern.gridText}>Pansement</Text>
                </TouchableOpacity>
                
                {/* Cathétérisme */}
                <TouchableOpacity
                  style={stylesModern.gridItem}
                  onPress={() => toggleSection('catheterisme')}
                >
                  <View style={[stylesModern.gridIconContainer, { backgroundColor: '#fef3c7' }]}>
                    <MaterialCommunityIcons name="test-tube" size={24} color="black" />
                  </View>
                  <Text style={stylesModern.gridText}>Cathétérisme</Text>
                </TouchableOpacity>
                
                {/* Diagnostic */}
                <TouchableOpacity
                  style={stylesModern.gridItem}
                  onPress={() => toggleSection('diagnostic')}
                >
                  <View style={[stylesModern.gridIconContainer, { backgroundColor: '#ede9fe' }]}>
                    <MaterialCommunityIcons name="stethoscope" size={24} color="#7c3aed" />
                  </View>
                  <Text style={stylesModern.gridText}>Diagnostic</Text>
                </TouchableOpacity>
                
                {/* Code de Resolution */}
                <TouchableOpacity
                  style={stylesModern.gridItem}
                  onPress={() => toggleSection('code_resolution')}
                >
                  <View style={[stylesModern.gridIconContainer, { backgroundColor: '#e0f2fe' }]}>
                    <MaterialCommunityIcons name="barcode-scan" size={24} color="#0284c7" />
                  </View>
                  <Text style={stylesModern.gridText}>Code de Résolution</Text>
                </TouchableOpacity>
                
                {/* Les Hôpitaux */}
                <TouchableOpacity
                  style={stylesModern.gridItem}
                  onPress={() => toggleSection('hospital')}
                >
                  <View style={[stylesModern.gridIconContainer, { backgroundColor: '#dcfce7' }]}>
                    <MaterialCommunityIcons name="hospital-building" size={24} color="#16a34a" />
                  </View>
                  <Text style={stylesModern.gridText}>Hôpitaux</Text>
                </TouchableOpacity>
                 <TouchableOpacity
                  style={stylesModern.gridItem}
                  onPress={() => toggleSection('alert')}
                >
                  <View style={[stylesModern.gridIconContainer, { backgroundColor: '#dcfce7' }]}>
                    <MaterialCommunityIcons name="hospital-building" size={24} color="#16a34a" />
                  </View>
                  <Text style={stylesModern.gridText}>Code pre-alert</Text>
                </TouchableOpacity>
                
              </View>
            </View>
          </Collapsible>

          {/* Boutons d'action */}
          <View style={stylesModern.buttonContainer}>
              <TouchableOpacity 
              style={[
                stylesModern.primaryButton, 
                isSubmitting && stylesModern.disabledButton
              ]} 
              onPress={handleSubmit}
              disabled={isSubmitting}
            >
              <Text style={stylesModern.primaryButtonText}>
                {isSubmitting ? 'Enregistrement...' : 'Soumettre'}
              </Text>
              {!isSubmitting && <Feather name="check-circle" size={20} color="#fff" />}
            </TouchableOpacity>

            <TouchableOpacity style={stylesModern.secondaryButton} onPress={() => { }}>
              <Text style={stylesModern.secondaryButtonText}>Sauvegarder brouillon</Text>
              <Feather name="save" size={20} color="#3b82f6" />
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

      <ModalTraitementAdminstre
        visible={ShowTraitementModal}
        onClose={() => setShowTraitementModal(false)}
        form={form}
        setForm={setForm}
      />

      <MobilisationModal
        visible={showModalImobilisation}
        onClose={() => setshowModalImobilisation(false)}
        form={form}
        setForm={setForm}
      />
      
      <AirwayManagementModal
        visible={showGestionVoies}
        onClose={() => setShowGestionVoies(false)}
        form={form}
        setForm={setForm}
      />
      
      <VentilationModal
        visible={showVentilationModal}
        onClose={() => setshowVentilationModal(false)}
        form={form}
        setForm={setForm}
      />
      
      <OxygenationModal
        visible={showOxygenationModal}
        onClose={() => setshowOxygenationModal(false)}
        form={form}
        setForm={setForm}
      />
      
      <InhalationTherapyModal
        visible={showInhalationModal}
        onClose={() => setShowInhalationModal(false)}
        form={form}
        setForm={setForm}
      />
      
      <VeinousLineCannulationModal
        visible={showVeinousCannulationModal}
        onClose={() => setShowVeinousCannulationModal(false)}
        form={form}
        setForm={setForm}
      />

      <HemorrhageControlModal
        visible={showHemorrhageControlModal}
        onClose={() => setShowVeinousCannulationModal(false)}
        form={form}
        setForm={setForm}
      />
      
      <PansementModal
        visible={showPansementModal}
        onClose={() => setShowPansementModal(false)}
        form={form}
        setForm={setForm}
      />
      
      <CatheterModal
        visible={showCatheterModal}
        onClose={() => setShowCatheterModal(false)}
        form={form}
        setForm={setForm}
      />
      
      <DiagnosticModal
        visible={showDiagnosticModal}
        onClose={() => setShowDiagnosticModal(false)}
        form={form}
        setForm={setForm}
      />
      
      <ResolutionCodeModal
        visible={showResolutionCodeScreen}
        onClose={() => setShowResolutionCodeScreen(false)}
        form={form}
        setForm={setForm}
      />
      
      <HospitalModal
        visible={showHospitalModal}
        onClose={() => setShowHospitalModal(false)}
        form={form}
        setForm={setForm}
      />
      <CodeAlerteModal
        visible={showCodeAlerteModal}
        onClose={() => setShowCodeAlerteModal(false)}
        form={form}
        setForm={setForm}
      />
      <TherapieElectriqueModal
        visible={showTherapieElectriqueModal}
        onClose={() => setShowTherapieElectriqueModal(false)}
        form={form}
        setForm={setForm}
      />
    </SafeAreaView>
  );
}