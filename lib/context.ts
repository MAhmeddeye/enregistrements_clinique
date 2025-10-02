import { ConstanteType, FormType, OuiNonType, RespOption } from "./types";

export const constantes = [
  "Fréquence respiratoire",
  "Saturation en oxygène périphérique",
  "Fréquence cardiaque",
  "Pression sanguine",
  "Température du corps",
  "Glycémie",
  "Échelle de Glasgow",
];

export interface OuiNonSelectorProps {
  label: string;
  value: OuiNonType;
  onChange: (val: OuiNonType) => void;
}


export interface ConstanteSelectorProps {
  label: string;
  value: ConstanteType;
  onChange: (val: ConstanteType) => void;
}

export interface PersonalInfoModalProps {
  visible: boolean;
  onClose: () => void;
  form: FormType;
  setForm: React.Dispatch<React.SetStateAction<FormType>>;
}

export interface ConsultationModalProps {
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

export interface RespiratoireModalProps {
  visible: boolean;
  onClose: () => void;
  form: FormType;
  setForm: React.Dispatch<React.SetStateAction<FormType>>;
  voieAerienneBrevetee: boolean | null;
  setVoieAerienneBrevetee: (value: boolean | null) => void;
  selectRespOption: (option: RespOption) => void;
}
export interface Neurologique {
  visible: boolean;
  onClose: () => void;
  form: any;
  setForm: React.Dispatch<React.SetStateAction<any>>;
}
export interface CirculatoireModalProps {
  visible: boolean;
  onClose: () => void;
  form: FormType;
  setForm: React.Dispatch<React.SetStateAction<FormType>>;
}
export interface CodeAlerteModalProps {
  visible: boolean;
  onClose: () => void;
  form: FormType;
  setForm: React.Dispatch<React.SetStateAction<FormType>>;
}
export interface CodeAlerte {
  id: string;
  title: string;
  icon: string;
  color: string;
  bgColor: string;
  description: string;
}
export interface GestionVoies{
  visible: boolean;
  onClose: () => void;
  form: FormType;
  setForm: React.Dispatch<React.SetStateAction<FormType>>;
  canuleDeGuedel: boolean;
  masqueLarynge: boolean;
  aspirationDesSecrets: boolean;
}
export interface TraumatisModal {
  visible: boolean;
  onClose: () => void;
  form: FormType;
  setForm: React.Dispatch<React.SetStateAction<FormType>>;
}
export interface TraitementModal {
  visible: boolean;
  onClose: () => void;
  form: FormType;
  setForm: React.Dispatch<React.SetStateAction<FormType>>;
}

// types/icons.ts
export type FeatherIconName = 
  | 'ambulance'
  | 'heart'
  | 'activity'
  | 'x'
  | 'check'
  | 'save'
  | 'user-md'
  | 'document-text'
  | 'lungs'
  | 'heartbeat'
  | 'injection-syringe'
  | 'medication'
  | 'medical-bag'
  | 'human-wheelchair'
  | 'airballoon'
  | 'inhaler'
  | 'needle'
  | 'blood-bag'
  | 'bandage'
  | 'tube'
  | 'stethoscope'
  | 'barcode-scan'
  | 'hospital-building';

export type MaterialCommunityIconName =
  | 'brain'
  | 'ambulance'
  | 'heart'
  | 'hospital-building'
  | 'stethoscope'
  | 'needle'
  | 'bandage'
  | 'blood-bag'
  | 'inhaler'
  | 'human-wheelchair'
  | 'medical-bag'
  | 'medication'
  | 'barcode-scan'
  | 'airballoon';

export type IconSet = 'Feather' | 'MaterialCommunityIcons';
