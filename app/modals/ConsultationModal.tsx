import { constantes, ConstanteSelectorProps, ConsultationModalProps } from "@/lib/context";
import { Modal, ScrollView, Text, TextInput, TouchableOpacity, View } from "react-native";
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import {styles} from './style'
import { ConstanteType, FormType } from "@/lib/types";
import { useState } from "react";


const ConstanteSelector = ({
  label,
  value,
  onChange, 
}: ConstanteSelectorProps) => {
  const [modalVisible, setModalVisible] = useState(false);
  const options: ConstanteType[] = ["initial", "transfert", "final"];

  const getColor = (val: ConstanteType) => {
    switch (val) {
      case "initial": return "#E1F2FE";
      case "transfert": return "#D5F5E9";
      case "final": return "#FDEBD0";
      default: return "#F8F9FA";
    }
  };

  const getIcon = (val: ConstanteType) => {
    switch (val) {
      case "initial": return "clipboard-list";
      case "transfert": return "exchange-alt";
      case "final": return "check-circle";
      default: return "clipboard";
    }
  };

  return (
    <View style={{ flex: 1, marginBottom: 8, marginHorizontal: 4 }}>
      <TouchableOpacity
        style={{
          padding: 12,
          borderWidth: 1,
          borderColor: "#E9ECEF",
          borderRadius: 12,
          backgroundColor: getColor(value),
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          shadowColor: "#000",
          shadowOffset: { width: 0, height: 1 },
          shadowOpacity: 0.1,
          shadowRadius: 2,
          elevation: 2,
        }}
        onPress={() => setModalVisible(true)}
      >
        <View style={{ flexDirection: 'row', alignItems: 'center', flex: 1 }}>
          <FontAwesome5 
            name={getIcon(value)} 
            size={14} 
            color="#495057" 
            style={{ marginRight: 8 }}
          />
          <Text style={{ fontSize: 13, fontWeight: '500', color: '#495057' }} numberOfLines={1}>
            {label}
          </Text>
        </View>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <Text style={{ 
            fontSize: 12, 
            marginRight: 6, 
            fontWeight: '600',
            color: value ? '#2C3E50' : '#ADB5BD' 
          }}>
            {value ? value.charAt(0).toUpperCase() + value.slice(1) : "Sélectionner"}
          </Text>
          <MaterialIcons name="keyboard-arrow-down" size={18} color="#6C757D" />
        </View>
      </TouchableOpacity>

      <Modal
        visible={modalVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { borderRadius: 16, padding: 0, overflow: 'hidden' }]}>
            <View style={{ 
              padding: 16, 
              borderBottomWidth: 1, 
              borderBottomColor: '#E9ECEF',
              backgroundColor: '#F8F9FA'
            }}>
              <Text style={{ 
                fontSize: 16, 
                fontWeight: '600', 
                color: '#2C3E50',
                textAlign: 'center'
              }}>
                Sélection pour {label}
              </Text>
            </View>
            
            <View style={{ padding: 8 }}>
              {options.map((opt:any) => (
                <TouchableOpacity
                  key={opt}
                  style={[
                    styles.modalOption, 
                    { 
                      backgroundColor: value === opt ? getColor(opt) : '#FFF',
                      borderWidth: 1,
                      borderColor: value === opt ? '#4A90E2' : '#E9ECEF',
                      borderRadius: 10,
                      marginBottom: 8,
                      paddingVertical: 14,
                      flexDirection: 'row',
                      alignItems: 'center'
                    }
                  ]}
                  onPress={() => {
                    onChange(opt);
                    setModalVisible(false);
                  }}
                >
                  <FontAwesome5 
                    name={getIcon(opt)} 
                    size={14} 
                    color="#495057" 
                    style={{ marginRight: 10 }}
                  />
                  <Text style={[styles.modalOptionText, { 
                    color: '#2C3E50',
                    fontWeight: value === opt ? '600' : '400'
                  }]}>
                    {opt.charAt(0).toUpperCase() + opt.slice(1)}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
            
            <TouchableOpacity
              style={[styles.modalCancel, {
                borderTopWidth: 1,
                borderTopColor: '#E9ECEF',
                padding: 16,
                alignItems: 'center'
              }]}
              onPress={() => setModalVisible(false)}
            >
              <Text style={[styles.modalCancelText, { color: '#6C757D', fontWeight: '500' }]}>
                Annuler
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export const ConsultationModal = ({
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
        <View style={[styles.personalInfoModal, { 
          height: '90%', 
          borderRadius: 20, 
          overflow: 'hidden',
          backgroundColor: '#FFF'
        }]}>
          <View style={[styles.modalHeader, {
            backgroundColor: '#4dbffcff',
            paddingVertical: 18,
            paddingHorizontal: 20,
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center'
          }]}>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <FontAwesome5 
                name="stethoscope" 
                size={18} 
                color="#FFF" 
                style={{ marginRight: 12 }}
              />
              <Text style={[styles.modalTitle, { 
                fontSize: 20, 
                fontWeight: '700',
                color: '#FFF'
              }]}>
                Consultation Médicale
              </Text>
            </View>
            <TouchableOpacity 
              onPress={onClose}
              style={{
                width: 32,
                height: 32,
                borderRadius: 16,
                backgroundColor: 'rgba(255, 255, 255, 0.2)',
                justifyContent: 'center',
                alignItems: 'center'
              }}
            >
              <MaterialIcons name="close" size={22} color="#fff" />
            </TouchableOpacity>
          </View>

          <ScrollView style={[styles.modalContent, { padding: 20 }]} showsVerticalScrollIndicator={false}>

            {/* Motif de consultation */}
            <TouchableOpacity
              onPress={() => setShowMotifDesc(!showMotifDesc)}
              style={[styles.expandableHeader, {
                backgroundColor: '#F8F9FA',
                padding: 16,
                borderRadius: 12,
                borderWidth: 1,
                borderColor: '#E9ECEF',
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: 12
              }]}
            >
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <FontAwesome5 
                  name="notes-medical" 
                  size={16} 
                  color="#4A90E2" 
                  style={{ marginRight: 10 }}
                />
                <Text style={{ fontWeight: '600', color: '#2C3E50' }}>
                  Description du motif
                </Text>
              </View>
              <MaterialIcons 
                name={showMotifDesc ? "keyboard-arrow-up" : "keyboard-arrow-down"} 
                size={22} 
                color="#6C757D" 
              />
            </TouchableOpacity>
            {showMotifDesc && (
              <View style={{ marginBottom: 20, paddingHorizontal: 4 }}>
                <TextInput
                  style={[styles.textarea, {
                    backgroundColor: '#F8F9FA',
                    borderWidth: 1,
                    borderColor: '#DEE2E6',
                    borderRadius: 12,
                    padding: 16,
                    minHeight: 100,
                    textAlignVertical: 'top',
                    fontSize: 15
                  }]}
                  placeholder="Décrivez en détail le motif de consultation..."
                  placeholderTextColor="#ADB5BD"
                  value={form.motifDesc}
                  onChangeText={(t) => setForm({ ...form, motifDesc: t })}
                  multiline
                />
              </View>
            )}

            {/* Traitements précédents */}
            <TouchableOpacity
              onPress={() => setShowObsDesc(!showObsDesc)}
              style={[styles.expandableHeader, {
                backgroundColor: '#F8F9FA',
                padding: 16,
                borderRadius: 12,
                borderWidth: 1,
                borderColor: '#E9ECEF',
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: 12
              }]}
            >
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <FontAwesome5 
                  name="pills" 
                  size={16} 
                  color="#4A90E2" 
                  style={{ marginRight: 10 }}
                />
                <Text style={{ fontWeight: '600', color: '#2C3E50' }}>
                  Détails des traitements
                </Text>
              </View>
              <MaterialIcons 
                name={showObsDesc ? "keyboard-arrow-up" : "keyboard-arrow-down"} 
                size={22} 
                color="#6C757D" 
              />
            </TouchableOpacity>
            {showObsDesc && (
              <View style={{ marginBottom: 20, paddingHorizontal: 4 }}>
                <TextInput
                  style={[styles.textarea, {
                    backgroundColor: '#F8F9FA',
                    borderWidth: 1,
                    borderColor: '#DEE2E6',
                    borderRadius: 12,
                    padding: 16,
                    minHeight: 100,
                    textAlignVertical: 'top',
                    fontSize: 15
                  }]}
                  placeholder="Listez les traitements précédents et leurs effets..."
                  placeholderTextColor="#ADB5BD"
                  value={form.DescPreTraitement}
                  onChangeText={(t) => setForm({ ...form, DescPreTraitement: t })}
                  multiline
                />
              </View>
            )}

            {/* Allergies */}
            <TouchableOpacity
              onPress={() => setShowAllergieDesc(!showAllergieDesc)}
              style={[styles.expandableHeader, {
                backgroundColor: '#F8F9FA',
                padding: 16,
                borderRadius: 12,
                borderWidth: 1,
                borderColor: '#E9ECEF',
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: 12
              }]}
            >
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <FontAwesome5 
                  name="allergies" 
                  size={16} 
                  color="#4A90E2" 
                  style={{ marginRight: 10 }}
                />
                <Text style={{ fontWeight: '600', color: '#2C3E50' }}>
                  Détails des allergies
                </Text>
              </View>
              <MaterialIcons 
                name={showAllergieDesc ? "keyboard-arrow-up" : "keyboard-arrow-down"} 
                size={22} 
                color="#6C757D" 
              />
            </TouchableOpacity>
            {showAllergieDesc && (
              <View style={{ marginBottom: 20, paddingHorizontal: 4 }}>
                <TextInput
                  style={[styles.textarea, {
                    backgroundColor: '#F8F9FA',
                    borderWidth: 1,
                    borderColor: '#DEE2E6',
                    borderRadius: 12,
                    padding: 16,
                    minHeight: 100,
                    textAlignVertical: 'top',
                    fontSize: 15
                  }]}
                  placeholder="Indiquez les allergies connues et leurs manifestations..."
                  placeholderTextColor="#ADB5BD"
                  value={form.Descallergie}
                  onChangeText={(t) => setForm({ ...form, Descallergie: t })}
                  multiline
                />
              </View>
            )}

            {/* Constantes */}
            <View style={{ 
              backgroundColor: '#F8F9FA', 
              padding: 10, 
              borderRadius: 12,
              borderWidth: 1,
              borderColor: '#E9ECEF',
              marginBottom: 20
            }}>
              <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 1 }}>
                <FontAwesome5 
                  name="heartbeat" 
                  size={18} 
                  color="#4A90E2" 
                  style={{ marginRight: 12 }}
                />
                <Text style={{ fontSize: 18, fontWeight: '600', color: '#2C3E50' }}>
                  Constantes Médicales
                </Text>
              </View>
              
              <View style={{ height: 280 }}>
                <ScrollView
                  style={styles.internalScroll}
                  nestedScrollEnabled={true}
                  showsVerticalScrollIndicator={false}
                >
                  <View style={{ flexDirection: 'column', flexWrap: 'wrap', justifyContent: 'space-between' }}>
                    {constantes.map((c) => (
                      <View style={{ width: '100%', marginBottom: 0 }} key={c}>
                        <ConstanteSelector
                          label={c}
                          value={form[`constante_${c.replace(/\s/g, "_")}` as keyof FormType] as ConstanteType}
                          onChange={(val) =>
                            setForm((prev) => ({ ...prev, [`constante_${c.replace(/\s/g, "_")}`]: val }))
                          }
                        />
                      </View>
                    ))}
                  </View>
                </ScrollView>
              </View>
            </View>
          </ScrollView>

          <View style={[styles.modalFooter, {
            padding: 20,
            borderTopWidth: 1,
            borderTopColor: '#E9ECEF',
            flexDirection: 'row',
            justifyContent: 'flex-end'
          }]}>
            <TouchableOpacity 
              style={[styles.modalButton, {
                backgroundColor: '#3ac2fcff',
                paddingVertical: 12,
                paddingHorizontal: 24,
                borderRadius: 10,
                shadowColor: "#000",
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.1,
                shadowRadius: 4,
                elevation: 3,
              }]} 
              onPress={onClose}
            >
              <Text style={[styles.modalButtonText, {
                color: '#FFF',
                fontWeight: '600',
                fontSize: 16
              }]}>
                Enregistrer 
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};
export default ConsultationModal