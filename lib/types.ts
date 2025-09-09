export type RespOption =
  | "Obstruction de la langue"
  | "Corps étranger"
  | "Œdème de glotte"
  | "Brûlure des voies respiratoires"
  | "Traumatisme maxillo-facial"
  | "Traumatisme laryngo-trachéal";

export type CircOption =
  | "La peau"
  | "Température de la peau"
  | "Hydratation de la peau"
  | "Couleur de la peau"
  | "Battement de coeur descendant"
  | "Remplissage capillaire";

export type ConstanteType = "initial" | "transfert" | "final" | null;
export type OuiNonType = "oui" | "non" | null;
export type MobiliteType = "Normale" | "Asymétrique" | "Paradoxal" | null;

export type CouleurPeauType = "Normal" | "Pâle" | "Cyanotique" | "Érythémateux" | "Ictérique" | null;
export type RythmeCardiaqueType = "Rythmique" | "Arythmique" | null;
export type RemplissageCapillaireType = "≤2s" | ">2s" | null;
export type PoulsStatus = "Normal" | "Faible" | "Absent" | null;
export type TemperaturePeauType = "Normal" | "Froide" | "Chaude" | null;
export type HydratationPeauType = "Normal" | "Sèche" | "Mouillée" | null;
export type EtatPeauType = "Normal" | "Anormal" | null;

export interface FormType {
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
