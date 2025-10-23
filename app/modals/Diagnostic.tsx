import { FormType } from '@/lib/types';
import React, { Dispatch, SetStateAction, useState } from 'react';
import {
  View,
  Text,
  Modal,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { SafeAreaView } from "react-native-safe-area-context";

// Types pour TypeScript
interface DiagnosticModalProps {
  visible: boolean;
  onClose: () => void;
  form: FormType;  
  setForm: Dispatch<SetStateAction<FormType>>; 
}

interface Diagnostic {
  id: string;
  codeCIM: string;
  description: string;
  type: 'principal' | 'secondaire' | 'associé';
}

// Liste des diagnostics d'urgence fréquents avec codes CIM-10
const URGENCE_DIAGNOSTICS = [
  { code: 'I21.9', description: 'Infarctus aigu du myocarde, sans précision' },
  { code: 'I63.9', description: 'Accident vasculaire cérébral, sans précision' },
  { code: 'J18.9', description: 'Pneumonie, sans précision' },
  { code: 'K35.9', description: 'Appendicite aiguë, sans précision' },
  { code: 'R07.4', description: 'Douleur thoracique, sans précision' },
  { code: 'R55', description: 'Syncope et collapsus' },
  { code: 'R06.02', description: 'Dyspnée' },
  { code: 'R10.4', description: 'Douleur abdominale, sans précision' },
  { code: 'S06.9', description: 'Traumatisme crânien, sans précision' },
  { code: 'T14.90', description: 'Lésion traumatique, sans précision' },
  { code: 'N17.9', description: 'Insuffisance rénale aiguë, sans précision' },
  { code: 'J45.909', description: 'Asthme, sans précision' },
  { code: 'E86.9', description: 'Déshydratation, sans précision' },
  { code: 'I48.91', description: 'Fibrillation auriculaire, sans précision' },
  { code: 'R50.9', description: 'Fièvre, sans précision' }
];

const DiagnosticModal: React.FC<DiagnosticModalProps> = ({ visible, onClose, form, setForm }) => {
  // Initialiser avec les diagnostics existants du form
  const [diagnostics, setDiagnostics] = useState<Diagnostic[]>(
    form.diagnostic?.map((diag, index) => ({
      id: index.toString(),
      codeCIM: diag.split(' - ')[0] || '',
      description: diag.split(' - ').slice(1).join(' - ') || '',
      type: 'principal' // Par défaut, vous pouvez adapter cette logique si nécessaire
    })) || []
  );
  
  const [selectedDiagnostic, setSelectedDiagnostic] = useState(URGENCE_DIAGNOSTICS[0]);

  const addDiagnostic = (type: Diagnostic['type']) => {
    if (diagnostics.length >= 3) {
      Alert.alert(
        "Limite atteinte",
        "Vous ne pouvez ajouter que trois diagnostics maximum par patient.",
        [{ text: "OK" }]
      );
      return;
    }

    const newDiagnostic: Diagnostic = {
      id: Date.now().toString(),
      codeCIM: selectedDiagnostic.code,
      description: selectedDiagnostic.description,
      type
    };

    const updatedDiagnostics = [...diagnostics, newDiagnostic];
    setDiagnostics(updatedDiagnostics);
    
    // Mettre à jour le form parent avec le tableau de strings
    updateFormDiagnostics(updatedDiagnostics);
  };

  const removeDiagnostic = (id: string) => {
    const updatedDiagnostics = diagnostics.filter(d => d.id !== id);
    setDiagnostics(updatedDiagnostics);
    updateFormDiagnostics(updatedDiagnostics);
  };

  const updateFormDiagnostics = (diags: Diagnostic[]) => {
    // Convertir le tableau d'objets Diagnostic en tableau de strings
    const diagnosticStrings = diags.map(diag => 
      `${diag.codeCIM} - ${diag.description} (${getDiagnosticTypeText(diag.type)})`
    );

    setForm(prevForm => ({
      ...prevForm,
      diagnostic: diagnosticStrings
    }));
  };

  const handleValidate = () => {
    if (diagnostics.length === 0) {
      Alert.alert(
        "Aucun diagnostic",
        "Veuillez ajouter au moins un diagnostic avant de valider.",
        [{ text: "OK" }]
      );
      return;
    }

    const principalDiagnostics = diagnostics.filter(d => d.type === 'principal');
    if (principalDiagnostics.length === 0) {
      Alert.alert(
        "Diagnostic principal manquant",
        "Veuillez spécifier au moins un diagnostic principal.",
        [{ text: "OK" }]
      );
      return;
    }

    Alert.alert(
      "Diagnostics enregistrés",
      `Total: ${diagnostics.length} diagnostic(s) enregistrés avec succès dans le tableau "diagnostic".`,
      [{ text: "OK", onPress: onClose }]
    );
  };

  const resetDiagnostics = () => {
    setDiagnostics([]);
    // Reset aussi dans le form
    setForm(prevForm => ({
      ...prevForm,
      diagnostic: []
    }));
  };

  const getDiagnosticTypeText = (type: Diagnostic['type']): string => {
    switch (type) {
      case 'principal': return 'Principal';
      case 'secondaire': return 'Secondaire';
      case 'associé': return 'Associé';
      default: return type;
    }
  };

  const getDiagnosticTypeColor = (type: Diagnostic['type']): string => {
    switch (type) {
      case 'principal': return '#e74c3c';
      case 'secondaire': return '#3498db';
      case 'associé': return '#f39c12';
      default: return '#95a5a6';
    }
  };

  const DiagnosticItem = ({ diagnostic }: { diagnostic: Diagnostic }) => (
    <View style={[styles.diagnosticItem, { borderLeftColor: getDiagnosticTypeColor(diagnostic.type) }]}>
      <View style={styles.diagnosticHeader}>
        <View style={styles.diagnosticTypeBadge}>
          <Text style={[styles.diagnosticTypeText, { color: getDiagnosticTypeColor(diagnostic.type) }]}>
            {getDiagnosticTypeText(diagnostic.type)}
          </Text>
        </View>
        <TouchableOpacity onPress={() => removeDiagnostic(diagnostic.id)}>
          <Text style={styles.removeButton}>✕</Text>
        </TouchableOpacity>
      </View>
      <Text style={styles.diagnosticCode}>CIM-10: {diagnostic.codeCIM}</Text>
      <Text style={styles.diagnosticDescription}>{diagnostic.description}</Text>
    </View>
  );

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <SafeAreaView style={styles.centeredView}>
        <View style={styles.modalView}>
          <Text style={styles.modalTitle}>Diagnostic Médical</Text>
          <Text style={styles.modalSubtitle}>Sélectionnez jusqu'à 3 diagnostics</Text>
          
          <ScrollView style={styles.container}>
            {/* Sélection du diagnostic */}
            <View style={styles.selectionContainer}>
              <Text style={styles.sectionTitle}>Sélectionner un diagnostic</Text>
              
              <View style={styles.pickerContainer}>
                <Picker
                  selectedValue={selectedDiagnostic}
                  onValueChange={(itemValue: any) => setSelectedDiagnostic(itemValue)}
                  style={styles.picker}
                >
                  {URGENCE_DIAGNOSTICS.map((diag, index) => (
                    <Picker.Item 
                      key={index} 
                      label={`${diag.code} - ${diag.description}`} 
                      value={diag} 
                    />
                  ))}
                </Picker>
              </View>

              <Text style={styles.selectedDiagnosticText}>
                Sélectionné: <Text style={styles.bold}>{selectedDiagnostic.code}</Text> - {selectedDiagnostic.description}
              </Text>

              <View style={styles.addButtonsContainer}>
                <TouchableOpacity 
                  style={[styles.addButton, { backgroundColor: '#e74c3c' }]}
                  onPress={() => addDiagnostic('principal')}
                >
                  <Text style={styles.addButtonText}>+ Principal</Text>
                </TouchableOpacity>

                <TouchableOpacity 
                  style={[styles.addButton, { backgroundColor: '#3498db' }]}
                  onPress={() => addDiagnostic('secondaire')}
                >
                  <Text style={styles.addButtonText}>+ Secondaire</Text>
                </TouchableOpacity>

                <TouchableOpacity 
                  style={[styles.addButton, { backgroundColor: '#f39c12' }]}
                  onPress={() => addDiagnostic('associé')}
                >
                  <Text style={styles.addButtonText}>+ Associé</Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* Liste des diagnostics ajoutés */}
            <View style={styles.listContainer}>
              <Text style={styles.sectionTitle}>
                Diagnostics ajoutés ({diagnostics.length}/3)
              </Text>

              {diagnostics.length === 0 ? (
                <Text style={styles.emptyText}>Aucun diagnostic ajouté</Text>
              ) : (
                diagnostics.map(diagnostic => (
                  <DiagnosticItem key={diagnostic.id} diagnostic={diagnostic} />
                ))
              )}
            </View>

            {/* Légende */}
            <View style={styles.legendContainer}>
              <Text style={styles.legendTitle}>Légende:</Text>
              <View style={styles.legendItem}>
                <View style={[styles.legendColor, { backgroundColor: '#e74c3c' }]} />
                <Text style={styles.legendText}>Diagnostic Principal</Text>
              </View>
              <View style={styles.legendItem}>
                <View style={[styles.legendColor, { backgroundColor: '#3498db' }]} />
                <Text style={styles.legendText}>Diagnostic Secondaire</Text>
              </View>
              <View style={styles.legendItem}>
                <View style={[styles.legendColor, { backgroundColor: '#f39c12' }]} />
                <Text style={styles.legendText}>Diagnostic Associé</Text>
              </View>
            </View>
          </ScrollView>
          
          <View style={styles.buttonContainer}>
            <TouchableOpacity 
              style={[styles.button, styles.resetButton]}
              onPress={resetDiagnostics}
            >
              <Text style={styles.buttonText}>Tout effacer</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[styles.button, styles.validateButton]}
              onPress={handleValidate}
            >
              <Text style={styles.buttonText}>Valider</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[styles.button, styles.closeButton]}
              onPress={onClose}
            >
              <Text style={styles.buttonText}>Fermer</Text>
            </TouchableOpacity>
          </View>
        </View>
      </SafeAreaView>
    </Modal>
  );
};

export const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalView: {
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 25,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    width: '90%',
    maxHeight: '90%'
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 5,
    color: '#2c3e50',
    textAlign: 'center'
  },
  modalSubtitle: {
    fontSize: 16,
    marginBottom: 20,
    color: '#7f8c8d',
    textAlign: 'center'
  },
  container: {
    width: '100%',
    marginBottom: 20,
  },
  selectionContainer: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#2c3e50',
    marginBottom: 15,
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    marginBottom: 15,
    backgroundColor: '#f8f9fa'
  },
  picker: {
    height: 50,
    width: '100%',
  },
  selectedDiagnosticText: {
    fontSize: 14,
    color: '#7f8c8d',
    marginBottom: 15,
    textAlign: 'center'
  },
  bold: {
    fontWeight: 'bold'
  },
  addButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  addButton: {
    flex: 1,
    padding: 12,
    borderRadius: 8,
    marginHorizontal: 5,
    alignItems: 'center'
  },
  addButtonText: {
    color: 'white',
    fontWeight: '600',
    fontSize: 12,
    textAlign: 'center'
  },
  listContainer: {
    marginBottom: 20,
  },
  emptyText: {
    textAlign: 'center',
    color: '#7f8c8d',
    fontStyle: 'italic',
    padding: 20
  },
  diagnosticItem: {
    backgroundColor: '#f8f9fa',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    borderLeftWidth: 4,
  },
  diagnosticHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  diagnosticTypeBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    backgroundColor: '#f1f1f1'
  },
  diagnosticTypeText: {
    fontSize: 12,
    fontWeight: '600',
  },
  removeButton: {
    fontSize: 18,
    color: '#e74c3c',
    fontWeight: 'bold',
  },
  diagnosticCode: {
    fontSize: 14,
    color: '#e74c3c',
    fontWeight: '600',
    marginBottom: 5,
  },
  diagnosticDescription: {
    fontSize: 14,
    color: '#2c3e50',
  },
  legendContainer: {
    backgroundColor: '#f8f9fa',
    padding: 15,
    borderRadius: 10,
    marginBottom: 20,
  },
  legendTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#2c3e50',
    marginBottom: 10,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  legendColor: {
    width: 16,
    height: 16,
    borderRadius: 4,
    marginRight: 10,
  },
  legendText: {
    fontSize: 12,
    color: '#7f8c8d',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    width: '100%'
  },
  button: {
    borderRadius: 10,
    padding: 12,
    elevation: 2,
    minWidth: 100,
    margin: 5,
    alignItems: 'center'
  },
  resetButton: {
    backgroundColor: '#e74c3c',
  },
  validateButton: {
    backgroundColor: '#2ecc71',
  },
  closeButton: {
    backgroundColor: '#95a5a6',
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center'
  }
});

export default DiagnosticModal;