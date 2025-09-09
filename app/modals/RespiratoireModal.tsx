import { OuiNonSelectorProps, RespiratoireModalProps } from "@/lib/context";
import { FormType, MobiliteType, OuiNonType, RespOption } from "@/lib/types";
import { Picker } from "@react-native-picker/picker";
import { Modal, ScrollView, Text, TouchableOpacity, View } from "react-native";
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {styles} from './style'
import { useState } from "react";

// Définition des types pour les icônes médicales
type MedicalIconKey = 
  | "Obstruction de la langue"
  | "Corps étranger"
  | "Œdème de glotte"
  | "Brûlure des voies respiratoires"
  | "Traumatisme maxillo-facial"
  | "Traumatisme laryngo-trachéal"
  | "Ventilation spontanée"
  | "Dyspnée"
  | "Cyanose"
  | "Stridor"
  | "Tirage"
  | "Mobilité thoracique";

// Icônes médicales pour chaque option
const medicalIcons: Record<MedicalIconKey, string> = {
  "Obstruction de la langue": "tongue",
  "Corps étranger": "alert-octagon",
  "Œdème de glotte": "swell",
  "Brûlure des voies respiratoires": "fire",
  "Traumatisme maxillo-facial": "face-man-profile",
  "Traumatisme laryngo-trachéal": "necklace",
  "Ventilation spontanée": "lungs",
  "Dyspnée": "run-fast",
  "Cyanose": "water",
  "Stridor": "voice",
  "Tirage": "draw",
  "Mobilité thoracique": "chest"
};

// Fonction helper pour obtenir une icône en toute sécurité
const getMedicalIcon = (key: string): string => {
  return medicalIcons[key as MedicalIconKey] || "help-circle";
};

const OuiNonSelector = ({
  label,
  value,
  onChange,
  iconName
}: OuiNonSelectorProps & { iconName?: string }) => {
  const [openMenu, setOpenMenu] = useState(false);
  const options: OuiNonType[] = ["oui", "non"];

  return (
    <View style={{ marginBottom: 16 }}>
      <TouchableOpacity
        style={{
          padding: 16,
          borderWidth: 1,
          borderColor: value ? "#2A7DE1" : "#E1E8ED",
          borderRadius: 12,
          backgroundColor: "#fff",
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          shadowColor: "#000",
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.1,
          shadowRadius: 4,
          elevation: 2,
        }}
        onPress={() => setOpenMenu(!openMenu)}
      >
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          {iconName && (
            <MaterialCommunityIcons 
              name={iconName} 
              size={20} 
              color="#2A7DE1" 
              style={{ marginRight: 12 }}
            />
          )}
          <Text style={{ fontWeight: '600', color: '#2C3E50' }}>{label}</Text>
        </View>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <Text style={{ 
            marginRight: 8, 
            color: value ? '#2A7DE1' : '#95A5A6',
            fontWeight: value ? '600' : '400'
          }}>
            {value ? value.toUpperCase() : "Sélectionner"}
          </Text>
          <MaterialIcons 
            name={openMenu ? "keyboard-arrow-up" : "keyboard-arrow-down"} 
            size={20} 
            color="#7F8C8D" 
          />
        </View>
      </TouchableOpacity>

      {openMenu && (
        <View style={{ 
          marginTop: 8, 
          borderWidth: 1, 
          borderColor: "#E1E8ED", 
          borderRadius: 8, 
          backgroundColor: "#fff",
          shadowColor: "#000",
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.1,
          shadowRadius: 4,
          elevation: 2,
          zIndex: 10,
        }}>
          {options.map((opt:any) => (
            <TouchableOpacity
              key={opt}
              style={{
                padding: 16,
                borderBottomWidth: 1,
                borderBottomColor: "#F1F2F6",
                backgroundColor: value === opt ? '#EBF5FF' : '#fff',
                flexDirection: 'row',
                alignItems: 'center'
              }}
              onPress={() => {
                onChange(opt);
                setOpenMenu(false);
              }}
            >
              <View style={{
                width: 20,
                height: 20,
                borderRadius: 10,
                borderWidth: 1,
                borderColor: value === opt ? '#2A7DE1' : '#BDC3C7',
                alignItems: 'center',
                justifyContent: 'center',
                marginRight: 12,
                backgroundColor: value === opt ? '#2A7DE1' : 'transparent'
              }}>
                {value === opt && (
                  <MaterialIcons name="check" size={14} color="#FFF" />
                )}
              </View>
              <Text style={{ 
                color: value === opt ? '#2A7DE1' : '#2C3E50', 
                fontWeight: value === opt ? '600' : 'normal' 
              }}>
                {opt.toUpperCase()}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      )}
    </View>
  );
};

export const RespiratoireModal = ({
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
      <View style={[styles.modalOverlay, { backgroundColor: 'rgba(0, 0, 0, 0.6)' }]}>
        <View style={[styles.personalInfoModal, { 
          height: '90%', 
          borderRadius: 16,
          overflow: 'hidden',
          backgroundColor: '#F8FAFC'
        }]}>
          <View style={[styles.modalHeader, { 
            backgroundColor: '#2A7DE1',
            paddingVertical: 18,
            paddingHorizontal: 20,
            borderTopLeftRadius: 16,
            borderTopRightRadius: 16,
          }]}>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <MaterialCommunityIcons name="lungs" size={24} color="#fff" style={{ marginRight: 12 }} />
              <Text style={[styles.modalTitle, { fontSize: 20 }]}>Examen Respiratoire</Text>
            </View>
            <TouchableOpacity 
              onPress={onClose}
              style={{
                width: 36,
                height: 36,
                borderRadius: 18,
                backgroundColor: 'rgba(255, 255, 255, 0.2)',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <MaterialIcons name="close" size={20} color="#fff" />
            </TouchableOpacity>
          </View>

          <ScrollView style={[styles.modalContent, { padding: 20 }]}>
            <View style={{
              backgroundColor: '#fff',
              borderRadius: 12,
              padding: 16,
              marginBottom: 20,
              shadowColor: "#000",
              shadowOffset: { width: 0, height: 1 },
              shadowOpacity: 0.05,
              shadowRadius: 3,
              elevation: 2,
            }}>
              <Text style={[styles.label, { 
                color: '#2C3E50', 
                fontSize: 16, 
                fontWeight: '600',
                marginBottom: 12 
              }]}>
                <MaterialCommunityIcons name="airballoon" size={18} color="#2A7DE1" /> Voie aérienne perméable ?
              </Text>
              <View style={[styles.pickerBox, { 
                borderWidth: 1, 
                borderColor: voieAerienneBrevetee !== null ? '#2A7DE1' : '#E1E8ED',
                borderRadius: 8,
                backgroundColor: '#fff'
              }]}>
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
                  style={{ color: '#2C3E50' }}
                >
                  <Picker.Item label="Sélectionner une option" value="" />
                  <Picker.Item label="Oui - Voie aérienne perméable" value="oui" />
                  <Picker.Item label="Non - Voie aérienne obstruée" value="non" />
                </Picker>
              </View>
            </View>

            {voieAerienneBrevetee === false && (
              <View style={{
                backgroundColor: '#fff',
                borderRadius: 12,
                padding: 16,
                marginBottom: 20,
                shadowColor: "#000",
                shadowOffset: { width: 0, height: 1 },
                shadowOpacity: 0.05,
                shadowRadius: 3,
                elevation: 2,
              }}>
                <Text style={[styles.label, { 
                  color: '#E74C3C', 
                  fontSize: 16, 
                  fontWeight: '600',
                  marginBottom: 16 
                }]}>
                  <MaterialCommunityIcons name="alert-circle" size={18} color="#E74C3C" /> Cause de l'obstruction
                </Text>
                {["Obstruction de la langue", "Corps étranger", "Œdème de glotte", "Brûlure des voies respiratoires", "Traumatisme maxillo-facial", "Traumatisme laryngo-trachéal"].map((option) => (
                  <TouchableOpacity
                    key={option}
                    style={[styles.radioRow, { 
                      paddingVertical: 12,
                      borderBottomWidth: 1,
                      borderBottomColor: '#F1F2F6'
                    }]}
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
                    <MaterialCommunityIcons 
                      name={getMedicalIcon(option)} 
                      size={20} 
                      color={form.examenResp.includes(option as RespOption) ? "#2A7DE1" : "#7F8C8D"} 
                      style={{ marginRight: 12 }}
                    />
                    <Text style={[styles.radioLabel, { 
                      color: form.examenResp.includes(option as RespOption) ? "#2C3E50" : "#7F8C8D",
                      fontWeight: form.examenResp.includes(option as RespOption) ? '600' : '400'
                    }]}>{option}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            )}

            <View style={{
              backgroundColor: '#fff',
              borderRadius: 12,
              padding: 16,
              marginBottom: 20,
              shadowColor: "#000",
              shadowOffset: { width: 0, height: 1 },
              shadowOpacity: 0.05,
              shadowRadius: 3,
              elevation: 2,
            }}>
              <Text style={[styles.label, { 
                color: '#2C3E50', 
                fontSize: 16, 
                fontWeight: '600',
                marginBottom: 16 
              }]}>
                <MaterialCommunityIcons name="clipboard-pulse" size={18} color="#2A7DE1" /> Constantes respiratoires
              </Text>
              
              {["Ventilation spontanée", "Dyspnée", "Cyanose", "Stridor", "Tirage"].map((label) => {
                const key = `constante_${label.replace(/\s/g, "_")}` as keyof FormType;
                return (
                  <OuiNonSelector
                    key={label}
                    label={label}
                    value={form[key] as OuiNonType}
                    onChange={(val) => setForm({ ...form, [key]: val })}
                    iconName={getMedicalIcon(label)}
                  />
                );
              })}
            </View>

            <View style={{
              backgroundColor: '#fff',
              borderRadius: 12,
              padding: 16,
              marginBottom: 20,
              shadowColor: "#000",
              shadowOffset: { width: 0, height: 1 },
              shadowOpacity: 0.05,
              shadowRadius: 3,
              elevation: 2,
            }}>
              <Text style={[styles.label, { 
                color: '#2C3E50', 
                fontSize: 16, 
                fontWeight: '600',
                marginBottom: 12 
              }]}>
                <MaterialCommunityIcons name={getMedicalIcon("Mobilité thoracique")} size={18} color="#2A7DE1" /> Mobilité thoracique
              </Text>
              <View style={[styles.pickerBox, { 
                borderWidth: 1, 
                borderColor: form.constante_Mobilité_thoracique ? '#2A7DE1' : '#E1E8ED',
                borderRadius: 8,
                backgroundColor: '#fff'
              }]}>
                <Picker
                  selectedValue={form.constante_Mobilité_thoracique}
                  onValueChange={(value) =>
                    setForm({ ...form, constante_Mobilité_thoracique: value as MobiliteType })
                  }
                  style={{ color: '#2C3E50' }}
                >
                  <Picker.Item label="Sélectionner un état" value={null} />
                  <Picker.Item label="Normale" value="Normale" />
                  <Picker.Item label="Asymétrique" value="Asymétrique" />
                  <Picker.Item label="Paradoxale" value="Paradoxal" />
                </Picker>
              </View>
            </View>

          </ScrollView>

          <View style={[styles.modalFooter, { 
            padding: 20, 
            borderTopWidth: 1, 
            borderTopColor: '#E1E8ED',
            backgroundColor: '#fff'
          }]}>
            <TouchableOpacity 
              style={[styles.modalButton, { 
                backgroundColor: '#2A7DE1',
                paddingVertical: 16,
                borderRadius: 12,
                alignItems: 'center'
              }]} 
              onPress={onClose}
            >
              <Text style={[styles.modalButtonText, { color: '#fff', fontWeight: '600' }]}>Enregistrer et Fermer</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};