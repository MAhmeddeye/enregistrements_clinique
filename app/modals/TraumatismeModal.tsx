import { FormType } from '@/lib/types';
import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Dimensions,
  Animated,
  Easing,
  LayoutAnimation,
  Platform,
  UIManager,
} from 'react-native';

// Enable LayoutAnimation for Android
if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

const { width, height } = Dimensions.get('window');

export interface Props {
  visible: boolean;
  onClose: () => void;
  form: FormType;
  setForm: React.Dispatch<React.SetStateAction<FormType>>;
}

type TraumaType = 'Contusion' | 'Entorse' | 'Dislocation' | 'Fracture fermée' | 
                 'Fracture ouverte' | 'Amputation' | 'Blessure' | 'Brûlure';

type BodyLocation = 'Crâne' | 'Facile' | 'Cou' | 'Membre supérieur droit' | 
                   'Membre supérieur gauche' | 'Gaine d\'écoule' | 'Thorax' | 'Retour' | 
                   'Abdomen' | 'Pelvis' | 'Membre inférieur droit' | 'Membre inférieur gauche';

// Custom Checkbox Component with modern design
const CustomCheckbox = ({ 
  value, 
  onValueChange,
  label
}: { 
  value: boolean; 
  onValueChange: (newValue: boolean) => void;
  label: string;
}) => (
  <TouchableOpacity
    style={[customStyles.checkboxContainer, value && customStyles.checkboxContainerSelected]}
    onPress={() => onValueChange(!value)}
    activeOpacity={0.7}
  >
    <View style={[customStyles.checkbox, value && customStyles.checkboxSelected]}>
      {value && <Text style={customStyles.checkmark}>✓</Text>}
    </View>
    <Text style={[customStyles.checkboxLabel, value && customStyles.checkboxLabelSelected]}>
      {label}
    </Text>
  </TouchableOpacity>
);

export const TraumatizedModal: React.FC<Props> = ({ visible, onClose, form, setForm }) => {
  const [fadeAnim] = useState(new Animated.Value(0));
  const [scaleAnim] = useState(new Animated.Value(0.9));
  const [modalVisible, setModalVisible] = useState(visible);
  const [expandedSections, setExpandedSections] = useState<Record<TraumaType, boolean>>({
    'Contusion': true,
    'Entorse': false,
    'Dislocation': false,
    'Fracture fermée': false,
    'Fracture ouverte': false,
    'Amputation': false,
    'Blessure': false,
    'Brûlure': false
  });
  const [selectedTraumas, setSelectedTraumas] = useState<Record<TraumaType, BodyLocation[]>>({
    'Contusion': [],
    'Entorse': [],
    'Dislocation': [],
    'Fracture fermée': [],
    'Fracture ouverte': [],
    'Amputation': [],
    'Blessure': [],
    'Brûlure': []
  });

  useEffect(() => {
    if (visible) {
      setModalVisible(true);
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 300,
          easing: Easing.out(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(scaleAnim, {
          toValue: 1,
          duration: 300,
          easing: Easing.out(Easing.ease),
          useNativeDriver: true,
        })
      ]).start();
    } else {
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 200,
          easing: Easing.out(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(scaleAnim, {
          toValue: 0.9,
          duration: 200,
          easing: Easing.out(Easing.ease),
          useNativeDriver: true,
        })
      ]).start(() => setModalVisible(false));
    }
  }, [visible]);

  const toggleSection = (trauma: TraumaType) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setExpandedSections(prev => ({
      ...prev,
      [trauma]: !prev[trauma]
    }));
  };

  const toggleLocation = (trauma: TraumaType, location: BodyLocation) => {
    setSelectedTraumas(prev => {
      const currentLocations = prev[trauma];
      const newLocations = currentLocations.includes(location)
        ? currentLocations.filter(l => l !== location)
        : [...currentLocations, location];
      
      return {
        ...prev,
        [trauma]: newLocations
      };
    });
  };

  const saveTraumas = () => {
    setForm(prev => ({
      ...prev,
      traumatismes: selectedTraumas
    }));
    onClose();
  };

  const bodyLocations: BodyLocation[] = [
    'Crâne', 'Facile', 'Cou', 'Membre supérieur droit', 
    'Membre supérieur gauche', 'Gaine d\'écoule', 'Thorax', 'Retour', 
    'Abdomen', 'Pelvis', 'Membre inférieur droit', 'Membre inférieur gauche'
  ];

  const traumaTypes: TraumaType[] = [
    'Contusion', 'Entorse', 'Dislocation', 'Fracture fermée', 
    'Fracture ouverte', 'Amputation', 'Blessure', 'Brûlure'
  ];

  const getTraumaColor = (trauma: TraumaType): string => {
    const colors = {
      'Contusion': '#FF6B6B',
      'Entorse': '#4ECDC4',
      'Dislocation': '#45B7D1',
      'Fracture fermée': '#F9A826',
      'Fracture ouverte': '#E05757',
      'Amputation': '#6A0572',
      'Blessure': '#5C6BC0',
      'Brûlure': '#FF8A65'
    };
    return colors[trauma];
  };

  return (
    <Modal
      animationType="none"
      transparent
      visible={modalVisible}
      onRequestClose={onClose}
    >
      <View style={styles.centeredView}>
        <Animated.View style={[
          styles.modalView, 
          { 
            opacity: fadeAnim,
            transform: [{ scale: scaleAnim }]
          }
        ]}>
          <View style={styles.header}>
            <Text style={styles.title}>Évaluation des Traumatismes</Text>
            <Text style={styles.subtitle}>Sélectionnez les zones affectées pour chaque type de blessure</Text>
          </View>

          <ScrollView 
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
          >
            {traumaTypes.map(trauma => {
              const color = getTraumaColor(trauma);
              const isExpanded = expandedSections[trauma];
              
              return (
                <View key={trauma} style={[styles.traumaSection, { borderLeftColor: color }]}>
                  <TouchableOpacity 
                    style={styles.traumaHeader}
                    onPress={() => toggleSection(trauma)}
                    activeOpacity={0.8}
                  >
                    <View style={styles.traumaTitleContainer}>
                      <View style={[styles.traumaIcon, { backgroundColor: color }]} />
                      <Text style={styles.traumaTitle}>{trauma}</Text>
                    </View>
                    <Text style={[styles.expandIcon, { color }]}>
                      {isExpanded ? '▲' : '▼'}
                    </Text>
                  </TouchableOpacity>

                  {isExpanded && (
                    <Animated.View style={styles.locationsContainer}>
                      {bodyLocations.map(location => (
                        <CustomCheckbox
                          key={location}
                          value={selectedTraumas[trauma].includes(location)}
                          onValueChange={() => toggleLocation(trauma, location)}
                          label={location}
                        />
                      ))}
                    </Animated.View>
                  )}
                </View>
              );
            })}
          </ScrollView>

          <View style={styles.footer}>
            <TouchableOpacity
              style={[styles.button, styles.cancelButton]}
              onPress={onClose}
              activeOpacity={0.8}
            >
              <Text style={styles.buttonText}>Annuler</Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={[styles.button, styles.saveButton]}
              onPress={saveTraumas}
              activeOpacity={0.8}
            >
              <Text style={styles.buttonText}>Enregistrer</Text>
            </TouchableOpacity>
          </View>
        </Animated.View>
      </View>
    </Modal>
  );
};

const customStyles = StyleSheet.create({
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    marginBottom: 8,
    borderRadius: 12,
    backgroundColor: '#F8FAFC',
  },
  checkboxContainerSelected: {
    backgroundColor: '#E1F5FE',
  },
  checkbox: {
    width: 24,
    height: 24,
    borderWidth: 2,
    borderColor: '#CBD5E1',
    borderRadius: 6,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
    marginRight: 12,
  },
  checkboxSelected: {
    backgroundColor: '#0EA5E9',
    borderColor: '#0EA5E9',
  },
  checkmark: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 14,
  },
  checkboxLabel: {
    fontSize: 14,
    color: '#64748B',
    fontWeight: '500',
  },
  checkboxLabelSelected: {
    color: '#0F172A',
    fontWeight: '600',
  },
});

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    padding: 16,
  },
  modalView: {
    width: '100%',
    maxWidth: 500,
    maxHeight: '90%',
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 10,
    },
    shadowOpacity: 0.25,
    shadowRadius: 20,
    elevation: 10,
  },
  header: {
    padding: 24,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
    backgroundColor: '#F8FAFC',
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 8,
    textAlign: 'center',
    color: '#0F172A',
  },
  subtitle: {
    fontSize: 14,
    textAlign: 'center',
    color: '#64748B',
    lineHeight: 20,
  },
  scrollContent: {
    padding: 20,
  },
  traumaSection: {
    marginBottom: 16,
    borderRadius: 16,
    backgroundColor: '#FFFFFF',
    borderLeftWidth: 4,
    borderLeftColor: '#0EA5E9',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
    overflow: 'hidden',
  },
  traumaHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#F8FAFC',
  },
  traumaTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  traumaIcon: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 12,
  },
  traumaTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#0F172A',
  },
  expandIcon: {
    fontSize: 12,
    fontWeight: 'bold',
  },
  locationsContainer: {
    padding: 16,
    paddingTop: 8,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
    backgroundColor: '#F8FAFC',
  },
  button: {
    flex: 1,
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 12,
    alignItems: 'center',
    marginHorizontal: 8,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cancelButton: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  saveButton: {
    backgroundColor: '#0EA5E9',
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '600',
  },
});

// Add specific text styles for buttons
const buttonTextStyles = StyleSheet.create({
  cancel: {
    color: '#64748B',
  },
  save: {
    color: '#FFFFFF',
  },
});

// Update the button text components
// In the JSX, replace button Text components with:
// <Text style={[styles.buttonText, buttonTextStyles.cancel]}>Annuler</Text>
// <Text style={[styles.buttonText, buttonTextStyles.save]}>Enregistrer</Text>

export default TraumatizedModal;