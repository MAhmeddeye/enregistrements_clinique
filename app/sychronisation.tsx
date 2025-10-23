import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import NetInfo from "@react-native-community/netinfo";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Animated,
  Dimensions,
  FlatList,
  KeyboardAvoidingView,
  Modal,
  Platform,
  RefreshControl,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { styles } from "./stylSychronisation";

const { width } = Dimensions.get("window");

const SERVER_URL = "http://192.168.1.103:3000/synchronisation";

type FormType = {
  id?: string;
  nom_patient: string;
  age_patient: string;
  sexe: string;
  allergies: string;
  traitement_precedents: string;
  examans_respiratoire: string | object;
  examans_neuralogique: string | object;
  examans_traumatisme: string | object;
  examans_circulatoire: string | object;
  medicaments_administrer: string | object;
  created_at?: string;
  synced?: boolean;
  rythmeCardiaque?: string;
  etatPeau?: string;
  hydratationPeau?: string;
  couleurPeau?: string;
  remplissageCapillaire?: string;
  pouls_radial?: string;
  pouls_femoral?: string;
  pouls_carotide?: string;
};

// Fonction pour envoyer un formulaire individuel avec TOUTES les données
export const sendFormToServer = async (form: FormType): Promise<boolean> => {
  try {
    console.log('📤 Envoi du formulaire complet:', form);
    
    const response = await fetch(SERVER_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    if (!response.ok) {
      throw new Error(`Erreur serveur: ${response.status} ${response.statusText}`);
    }

    console.log('✅ Formulaire envoyé avec succès');
    return true;
  } catch (error: any) {
    console.error("❌ Erreur lors de l'envoi du formulaire:", error.message);
    let message = "Les données sont enregistrées localement.";
    if (error.message.includes("Network request failed")) {
      message = "Aucune connexion réseau. Les données sont enregistrées localement.";
    }
    Alert.alert("Info", message);
    return false;
  }
};

// Fonction pour synchroniser un formulaire individuel avec TOUTES les données
export const syncSingleForm = async (form: FormType): Promise<boolean> => {
  const state = await NetInfo.fetch();
  if (!state.isConnected) {
    Alert.alert("❌ Pas de connexion", "Veuillez vérifier votre connexion Internet.");
    return false;
  }

  try {
    console.log('🔄 Synchronisation du formulaire:', form.id);
    
    // Envoyer TOUTES les données du formulaire
    const success = await sendFormToServer(form);
    
    if (success) {
      // Mettre à jour le statut de synchronisation dans AsyncStorage
      const stored = await AsyncStorage.getItem("forms");
      const forms: FormType[] = stored ? JSON.parse(stored) : [];
      
      const updatedForms = forms.map(f => 
        f.id === form.id ? { ...f, synced: true } : f
      );
      
      await AsyncStorage.setItem("forms", JSON.stringify(updatedForms));
      console.log('✅ Statut de synchronisation mis à jour pour:', form.id);
      return true;
    }
    
    return false;
  } catch (error: any) {
    console.error("Erreur lors de la synchronisation individuelle:", error);
    Alert.alert("❌ Erreur", "Une erreur est survenue lors de la synchronisation.");
    return false;
  }
};

// Fonction pour synchroniser tous les formulaires avec vidage automatique
// 
export const syncAllForms = async (): Promise<void> => {
  const state = await NetInfo.fetch();
  if (!state.isConnected) {
    Alert.alert("❌ Pas de connexion", "Veuillez vérifier votre connexion Internet.");
    return;
  }

  try {
    const stored = await AsyncStorage.getItem("forms");
    const forms: FormType[] = stored ? JSON.parse(stored) : [];

    if (forms.length === 0) {
      Alert.alert("ℹ️ Information", "Aucun formulaire à synchroniser.");
      return;
    }

    const unsyncedForms = forms.filter((form) => !form.synced);

    if (unsyncedForms.length === 0) {
      Alert.alert("ℹ️ Information", "Tous les formulaires sont déjà synchronisés.");
      return;
    }

    console.log('🔄 Synchronisation de', unsyncedForms.length, 'formulaires');

    const syncPromises = unsyncedForms.map(async (form) => {
      console.log('📤 Envoi du formulaire:', form.id);
      const success = await sendFormToServer(form);
      return success ? form : null;
    });

    const results = await Promise.all(syncPromises);
    const syncedForms = results.filter((form): form is FormType => form !== null);
    const syncedCount = syncedForms.length;

    if (syncedCount > 0) {
      // VIDAGE AUTOMATIQUE : ne garder que les formulaires non synchronisés
      const remainingForms = forms.filter(form => !form.synced && !syncedForms.some(sf => sf.id === form.id));
      await AsyncStorage.setItem("forms", JSON.stringify(remainingForms));
      
      console.log('✅ Synchronisation réussie:', syncedCount, 'formulaires');
      
      Alert.alert("✅ Synchronisation réussie", 
        `${syncedCount} formulaire(s) synchronisé(s) et supprimé(s) de la liste.\n${remainingForms.length} formulaire(s) restant(s).`);
    } else {
      Alert.alert("⚠️ Attention", "Aucun formulaire n'a pu être synchronisé.");
    }
  } catch (error: any) {
    console.error("Erreur lors de la synchronisation:", error);
    Alert.alert("❌ Erreur", "Une erreur est survenue lors de la synchronisation.");
  }
};

const OfflineFormsScreen = () => {
  const [forms, setForms] = useState<FormType[]>([]);
  const [selectedForm, setSelectedForm] = useState<FormType | null>(null);
  const [editingForm, setEditingForm] = useState<FormType | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [syncing, setSyncing] = useState(false);
  const [syncingFormId, setSyncingFormId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const fadeAnim = useState(new Animated.Value(0))[0];
  const slideAnim = useState(new Animated.Value(50))[0];

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 800,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const loadForms = async () => {
    try {
      const stored = await AsyncStorage.getItem("forms");
      const parsed = stored ? JSON.parse(stored) : [];
      console.log('📥 Formulaires chargés:', parsed.length);
      setForms(parsed);
    } catch (error) {
      console.error("Erreur de chargement des formulaires", error);
      Alert.alert("❌ Erreur", "Impossible de charger les formulaires");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadForms();
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    loadForms();
  };

  // Synchronisation individuelle avec TOUTES les données
  const syncIndividualForm = async (form: FormType) => {
    if (!form.id) return;
    
    setSyncingFormId(form.id);
    try {
      console.log('🔄 Synchronisation individuelle du formulaire:', form.id);
      console.log('📋 Données à synchroniser:', form);
      
      const success = await syncSingleForm(form);
      if (success) {
        // VIDAGE AUTOMATIQUE : supprimer le formulaire synchronisé de la liste
        const updatedForms = forms.filter(f => f.id !== form.id);
        setForms(updatedForms);
        
        if (selectedForm && selectedForm.id === form.id) {
          setSelectedForm(null);
        }
        
        console.log('✅ Formulaire synchronisé et supprimé:', form.id);
        Alert.alert("✅ Succès", "Formulaire synchronisé et supprimé de la liste");
      } else {
        Alert.alert("❌ Erreur", "Échec de la synchronisation du formulaire");
      }
    } catch (error) {
      console.error("Erreur synchronisation individuelle:", error);
      Alert.alert("❌ Erreur", "Une erreur est survenue lors de la synchronisation");
    } finally {
      setSyncingFormId(null);
    }
  };

  // Synchronisation de tous les formulaires
  const syncAllFormsHandler = async () => {
    setSyncing(true);
    await syncAllForms();
    await loadForms(); // Recharger pour voir les changements
    setSyncing(false);
  };

  const saveFormChanges = async () => {
    if (!editingForm) return;

    setSaving(true);
    try {
      console.log('💾 Sauvegarde des modifications:', editingForm.id);
      
      const updatedForms = forms.map((form) =>
        form.id === editingForm.id ? { ...editingForm, synced: false } : form
      );

      await AsyncStorage.setItem("forms", JSON.stringify(updatedForms));
      setForms(updatedForms);
      setSelectedForm(editingForm);
      setEditingForm(null);

      console.log('✅ Modifications sauvegardées:', editingForm.id);
      Alert.alert("✅ Succès", "Modifications enregistrées avec succès");
    } catch (error) {
      console.error("Erreur de sauvegarde", error);
      Alert.alert("❌ Erreur", "Impossible de sauvegarder les modifications");
    } finally {
      setSaving(false);
    }
  };

  const cancelEditing = () => {
    Alert.alert(
      "Annuler les modifications",
      "Voulez-vous vraiment annuler les modifications ?",
      [
        { text: "Continuer l'édition", style: "cancel" },
        {
          text: "Annuler",
          style: "destructive",
          onPress: () => setEditingForm(null),
        },
      ]
    );
  };

  const clearSyncedForms = async () => {
    try {
      setShowMenu(false);

      const unsyncedForms = forms.filter((form: FormType) => !form.synced);
      const syncedCount = forms.length - unsyncedForms.length;
      
      if (syncedCount === 0) {
        Alert.alert("ℹ️ Information", "Aucun formulaire synchronisé à supprimer.");
        return;
      }

      Alert.alert(
        "🧹 Nettoyer la liste",
        `Voulez-vous supprimer ${syncedCount} formulaire(s) synchronisé(s) ?`,
        [
          {
            text: "Annuler",
            style: "cancel",
          },
          {
            text: "Nettoyer",
            style: "destructive",
            onPress: async () => {
              try {
                await AsyncStorage.setItem("forms", JSON.stringify(unsyncedForms));
                setForms(unsyncedForms);

                Alert.alert(
                  "✅ Succès",
                  `${syncedCount} formulaire(s) synchronisé(s) supprimé(s)\n${unsyncedForms.length} formulaire(s) restant(s)`
                );
              } catch (error) {
                console.error("Erreur lors du nettoyage:", error);
                Alert.alert("❌ Erreur", "Impossible de nettoyer la liste");
              }
            },
          },
        ]
      );
    } catch (error) {
      console.error("Erreur confirmation:", error);
    }
  };

  const clearAllForms = async () => {
    setShowMenu(false);

    if (forms.length === 0) {
      Alert.alert("ℹ️ Information", "Aucun formulaire à supprimer.");
      return;
    }

    const unsyncedCount = forms.filter((f) => !f.synced).length;

    Alert.alert(
      "🗑️ Tout supprimer",
      `Voulez-vous supprimer TOUS les formulaires ?\n\n• ${forms.length} formulaire(s) au total\n• ${unsyncedCount} formulaire(s) non synchronisé(s)\n\n⚠️ Les formulaires non synchronisés seront perdus !`,
      [
        {
          text: "Annuler",
          style: "cancel",
        },
        {
          text: "Tout supprimer",
          style: "destructive",
          onPress: async () => {
            try {
              await AsyncStorage.removeItem("forms");
              setForms([]);
              Alert.alert("✅ Succès", "Tous les formulaires ont été supprimés");
            } catch (error) {
              console.error("Erreur suppression totale:", error);
              Alert.alert("❌ Erreur", "Impossible de supprimer les formulaires");
            }
          },
        },
      ]
    );
  };

  const formatKey = (key: string): string => {
    const map: any = {
      nom_patient: "👤 Nom du patient",
      age_patient: "🎂 Âge",
      sexe: "⚧️ Sexe",
      allergies: "⚠️ Allergies",
      traitement_precedents: "💊 Traitements précédents",
      examans_respiratoire: "🫁 Examen respiratoire",
      examans_neuralogique: "🧠 Examen neurologique",
      examans_traumatisme: "🩹 Examen traumatisme",
      examans_circulatoire: "❤️ Examen circulatoire",
      medicaments_administrer: "💉 Médicaments administrés",
      created_at: "📅 Date de création",
      rythmeCardiaque: "💓 Rythme cardiaque",
      etatPeau: "🩺 État de la peau",
      hydratationPeau: "💧 Hydratation peau",
      couleurPeau: "🎨 Couleur peau",
      remplissageCapillaire: "⏱️ Remplissage capillaire",
      pouls_radial: "📋 Pouls radial",
      pouls_femoral: "📋 Pouls femoral",
      pouls_carotide: "📋 Pouls carotide",
    };
    return map[key] || key.replace(/_/g, " ");
  };

  const renderValueText = (value: any) => {
    if (value === null || value === undefined) return "Non renseigné";
    if (typeof value === "object") {
      return Object.entries(value)
        .map(([k, v]) => `${formatKey(k)}: ${v ?? "Non renseigné"}`)
        .join("\n");
    }
    return String(value);
  };

  const getFieldIcon = (key: string) => {
    const icons: any = {
      nom_patient: "person",
      age_patient: "calendar",
      sexe: "male-female",
      allergies: "warning",
      traitement_precedents: "medical",
      examans_respiratoire: "lungs",
      examans_neuralogique: "brain",
      examans_traumatisme: "bandage",
      examans_circulatoire: "heart",
      medicaments_administrer: "flask",
      rythmeCardiaque: "heart",
      etatPeau: "body",
      hydratationPeau: "water",
      couleurPeau: "color-palette",
      remplissageCapillaire: "timer",
      pouls_radial: "pulse",
      pouls_femoral: "pulse",
      pouls_carotide: "pulse",
    };
    return icons[key] || "document-text";
  };

  const renderObjectField = (key: string, value: object) => (
    <View style={styles.subFieldContainer}>
      {Object.entries(value).map(([subKey, subValue]) => (
        <View key={subKey} style={styles.subField}>
          <View style={styles.fieldHeader}>
            <Ionicons name={getFieldIcon(subKey)} size={16} color="#6366F1" />
            <Text style={styles.subFieldLabel}>{formatKey(subKey)}</Text>
          </View>
          <TextInput
            style={styles.textInput}
            value={String(subValue || "")}
            onChangeText={(text) =>
              setEditingForm({
                ...editingForm!,
                [key]: {
                  ...(editingForm![key as keyof FormType] as object),
                  [subKey]: text,
                },
              })
            }
            placeholder={`Saisir ${formatKey(subKey).toLowerCase()}...`}
            placeholderTextColor="#9CA3AF"
          />
        </View>
      ))}
    </View>
  );

  const renderFormEditor = (form: FormType) => (
    <KeyboardAvoidingView
      style={styles.detailsContainer}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <View style={styles.detailsHeader}>
        <TouchableOpacity style={styles.backButton} onPress={cancelEditing}>
          <Ionicons name="close" size={24} color="#EF4444" />
          <Text style={[styles.backText, { color: "#EF4444" }]}>Annuler</Text>
        </TouchableOpacity>

        <View style={styles.headerActions}>
          <TouchableOpacity
            style={[styles.saveButton, saving && styles.saveButtonDisabled]}
            onPress={saveFormChanges}
            disabled={saving}
          >
            {saving ? (
              <ActivityIndicator size="small" color="#fff" />
            ) : (
              <>
                <Ionicons name="checkmark" size={20} color="#fff" />
                <Text style={styles.saveText}>Enregistrer</Text>
              </>
            )}
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView style={styles.detailsContent} showsVerticalScrollIndicator={false}>
        <View style={styles.editorHeader}>
          <View style={styles.editorIcon}>
            <Ionicons name="document-text" size={32} color="#6366F1" />
          </View>
          <View>
            <Text style={styles.editorTitle}>Modifier le formulaire</Text>
            <Text style={styles.editorSubtitle}>
              Toutes les données seront synchronisées vers la base de données
            </Text>
          </View>
        </View>

        {/* Informations personnelles */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>👤 Informations personnelles</Text>
          {["nom_patient", "age_patient", "sexe"].map((key) => (
            <View key={key} style={styles.editableField}>
              <View style={styles.fieldHeader}>
                <Ionicons name={getFieldIcon(key)} size={18} color="#6366F1" />
                <Text style={styles.label}>{formatKey(key)}</Text>
              </View>
              <TextInput
                style={styles.textInput}
                value={String(form[key as keyof FormType] || "")}
                onChangeText={(text) => setEditingForm({ ...form, [key]: text })}
                placeholder={`Saisir ${formatKey(key).toLowerCase()}...`}
                placeholderTextColor="#9CA3AF"
              />
            </View>
          ))}
        </View>

        {/* Informations médicales */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>📋 Informations médicales</Text>
          {["allergies", "traitement_precedents"].map((key) => (
            <View key={key} style={styles.editableField}>
              <View style={styles.fieldHeader}>
                <Ionicons name={getFieldIcon(key)} size={18} color="#6366F1" />
                <Text style={styles.label}>{formatKey(key)}</Text>
              </View>
              <TextInput
                style={[styles.textInput, styles.textArea]}
                value={String(form[key as keyof FormType] || "")}
                onChangeText={(text) => setEditingForm({ ...form, [key]: text })}
                multiline={true}
                placeholder={`Saisir ${formatKey(key).toLowerCase()}...`}
                placeholderTextColor="#9CA3AF"
              />
            </View>
          ))}
        </View>

        {/* Examens détaillés */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>🔍 Examens détaillés</Text>
          {Object.entries(form).map(([key, value]) => {
            if ([
              "id", "created_at", "synced", 
              "nom_patient", "age_patient", "sexe",
              "allergies", "traitement_precedents", "medicaments_administrer"
            ].includes(key)) return null;

            if (typeof value === "object" && value !== null) {
              return (
                <View key={key}>
                  <Text style={styles.subSectionTitle}>{formatKey(key)}</Text>
                  {renderObjectField(key, value)}
                </View>
              );
            }

            return (
              <View key={key} style={styles.editableField}>
                <View style={styles.fieldHeader}>
                  <Ionicons name={getFieldIcon(key)} size={18} color="#6366F1" />
                  <Text style={styles.label}>{formatKey(key)}</Text>
                </View>
                <TextInput
                  style={styles.textInput}
                  value={String(value || "")}
                  onChangeText={(text) => setEditingForm({ ...form, [key]: text })}
                  placeholder={`Saisir ${formatKey(key).toLowerCase()}...`}
                  placeholderTextColor="#9CA3AF"
                />
              </View>
            );
          })}
        </View>

        {/* Médicaments administrés */}
        {form.medicaments_administrer && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>💉 Médicaments administrés</Text>
            {renderObjectField("medicaments_administrer", form.medicaments_administrer as object)}
          </View>
        )}

        <View style={styles.editorFooter}>
          <Ionicons name="information-circle" size={16} color="#6366F1" />
          <Text style={styles.editorFooterText}>
            Toutes les données modifiées seront synchronisées vers le serveur
          </Text>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );

  const renderFormDetails = (form: FormType) => (
    <Animated.View
      style={[styles.detailsContainer, { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }]}
    >
      <View style={styles.detailsHeader}>
        <TouchableOpacity style={styles.backButton} onPress={() => setSelectedForm(null)}>
          <Ionicons name="chevron-back" size={24} color="#6366F1" />
          <Text style={styles.backText}>Retour</Text>
        </TouchableOpacity>

        <View style={styles.headerActions}>
          <View style={[styles.statusBadge, form.synced ? styles.syncedBadge : styles.unsyncedBadge]}>
            <Ionicons
              name={form.synced ? "checkmark-circle" : "time-outline"}
              size={16}
              color="#fff"
            />
            <Text style={styles.statusBadgeText}>{form.synced ? "Synchronisé" : "En attente"}</Text>
          </View>

          {!form.synced && (
            <View style={styles.detailsActions}>
              <TouchableOpacity style={styles.editButton} onPress={() => setEditingForm(form)}>
                <Ionicons name="pencil" size={18} color="#6366F1" />
                <Text style={styles.editText}>Modifier</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={styles.syncIndividualButton}
                onPress={() => syncIndividualForm(form)}
                disabled={syncingFormId === form.id}
              >
                {syncingFormId === form.id ? (
                  <ActivityIndicator size="small" color="#fff" />
                ) : (
                  <Ionicons name="cloud-upload" size={18} color="#fff" />
                )}
                <Text style={styles.syncIndividualText}>
                  {syncingFormId === form.id ? "Sync..." : "Sync"}
                </Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </View>

      <ScrollView style={styles.detailsContent} showsVerticalScrollIndicator={false}>
        <View style={styles.patientCard}>
          <View style={styles.avatarLarge}>
            <Ionicons name="person" size={32} color="#6366F1" />
          </View>
          <View style={styles.patientInfo}>
            <Text style={styles.patientName}>{form.nom_patient}</Text>
            <Text style={styles.patientDetails}>
              {form.age_patient} ans • {form.sexe}
            </Text>
            <View style={styles.syncInfo}>
              <Ionicons
                name={form.synced ? "cloud-done" : "cloud-offline"}
                size={14}
                color={form.synced ? "#10B981" : "#F59E0B"}
              />
              <Text style={[styles.syncInfoText, { color: form.synced ? "#10B981" : "#F59E0B" }]}>
                {form.synced ? "Synchronisé - sera supprimé" : "En attente de synchronisation"}
              </Text>
            </View>
          </View>
        </View>

        {/* Afficher TOUTES les données dans les détails */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>📋 Informations médicales</Text>
          {["allergies", "traitement_precedents", "medicaments_administrer"].map((key) => (
            <View key={key} style={styles.field}>
              <View style={styles.fieldHeader}>
                <Ionicons name={getFieldIcon(key)} size={18} color="#8B5CF6" />
                <Text style={styles.label}>{formatKey(key)}</Text>
              </View>
              <View style={styles.valueContainer}>
                <Text style={styles.value}>{renderValueText(form[key as keyof FormType])}</Text>
              </View>
            </View>
          ))}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>🔍 Examens réalisés</Text>
          {[
            "examans_respiratoire",
            "examans_neuralogique",
            "examans_traumatisme",
            "examans_circulatoire",
            "rythmeCardiaque",
            "etatPeau",
            "hydratationPeau",
            "couleurPeau",
            "remplissageCapillaire",
            "pouls_radial",
            "pouls_femoral",
            "pouls_carotide",
          ].map((key) =>
            form[key as keyof FormType] ? (
              <View key={key} style={styles.field}>
                <View style={styles.fieldHeader}>
                  <Ionicons name={getFieldIcon(key)} size={18} color="#8B5CF6" />
                  <Text style={styles.label}>{formatKey(key)}</Text>
                </View>
                <View style={styles.valueContainer}>
                  <Text style={styles.value}>{renderValueText(form[key as keyof FormType])}</Text>
                </View>
              </View>
            ) : null
          )}
        </View>
      </ScrollView>
    </Animated.View>
  );

  const renderFormItem = ({ item, index }: { item: FormType; index: number }) => (
    <Animated.View
      style={[
        styles.formCard,
        {
          opacity: fadeAnim,
          transform: [
            {
              translateY: fadeAnim.interpolate({
                inputRange: [0, 1],
                outputRange: [50 * (index + 1), 0],
              }),
            },
          ],
        },
      ]}
    >
      <TouchableOpacity
        style={[styles.cardContent, item.synced ? styles.syncedCard : styles.unsyncedCard]}
        onPress={() => setSelectedForm(item)}
      >
        <View style={styles.cardMain}>
          <View style={[styles.cardAvatar, item.synced ? styles.avatarSynced : styles.avatarUnsynced]}>
            <Ionicons name="person" size={20} color={item.synced ? "#10B981" : "#6366F1"} />
          </View>
          <View style={styles.cardTextContainer}>
            <Text style={styles.cardTitle}>{item.nom_patient}</Text>
            <Text style={styles.cardSubtitle}>
              {item.age_patient} ans • {item.sexe}
            </Text>
            <View style={styles.cardMeta}>
              <Ionicons name="calendar" size={12} color="#6B7280" />
              <Text style={styles.cardMetaText}>
                {item.created_at ? new Date(item.created_at).toLocaleDateString("fr-FR") : "Date inconnue"}
              </Text>
            </View>
          </View>
        </View>
        <View style={styles.cardStatus}>
          {!item.synced && (
            <TouchableOpacity 
              style={styles.syncIconButton}
              onPress={() => syncIndividualForm(item)}
              disabled={syncingFormId === item.id}
            >
              {syncingFormId === item.id ? (
                <ActivityIndicator size="small" color="#6366F1" />
              ) : (
                <Ionicons name="cloud-upload" size={20} color="#6366F1" />
              )}
            </TouchableOpacity>
          )}
          <View style={[styles.statusIndicator, item.synced ? styles.syncedStatus : styles.unsyncedStatus]}>
            <Ionicons
              name={item.synced ? "checkmark-circle" : "time-outline"}
              size={16}
              color="#fff"
            />
          </View>
          <Text style={[styles.statusText, { color: item.synced ? "#10B981" : "#F59E0B" }]}>
            {item.synced ? "Sync" : "En attente"}
          </Text>
        </View>
      </TouchableOpacity>
    </Animated.View>
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#6366F1" />
        <Text style={styles.loadingText}>Chargement des formulaires...</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <Modal
        visible={showMenu}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowMenu(false)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setShowMenu(false)}
        >
          <View style={styles.dropdownMenu}>
            <TouchableOpacity
              style={styles.menuItem}
              onPress={clearSyncedForms}
              disabled={!forms.some((f) => f.synced)}
            >
              <Ionicons name="trash-outline" size={20} color="#EF4444" />
              <Text
                style={[styles.menuItemText, !forms.some((f) => f.synced) && styles.menuItemDisabled]}
              >
                Nettoyer les synchronisés
              </Text>
            </TouchableOpacity>

            <View style={styles.menuDivider} />

            <TouchableOpacity style={styles.menuItem} onPress={clearAllForms}>
              <Ionicons name="nuclear-outline" size={20} color="#DC2626" />
              <Text style={[styles.menuItemText, styles.dangerText]}>Tout supprimer</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>

      {editingForm ? (
        renderFormEditor(editingForm)
      ) : selectedForm ? (
        renderFormDetails(selectedForm)
      ) : (
        <>
          <Animated.View
            style={[styles.header, { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }]}
          >
            <View style={styles.headerContent}>
              <View style={styles.headerIcon}>
                <Ionicons name="document-text" size={32} color="#6366F1" />
              </View>
              <View style={styles.headerTitleContainer}>
                <Text style={styles.title}>Formulaires hors ligne</Text>
                <Text style={styles.subtitle}>
                  {forms.length} formulaire(s) • {forms.filter((f) => !f.synced).length} à synchroniser
                </Text>
              </View>

              {forms.length > 0 && (
                <TouchableOpacity style={styles.menuButton} onPress={() => setShowMenu(true)}>
                  <Ionicons name="ellipsis-vertical" size={24} color="#64748B" />
                </TouchableOpacity>
              )}
            </View>
          </Animated.View>

          <FlatList
            data={forms}
            keyExtractor={(item, i) => item.id || i.toString()}
            renderItem={renderFormItem}
            contentContainerStyle={styles.listContent}
            refreshControl={
              <RefreshControl
                refreshing={refreshing}
                onRefresh={onRefresh}
                colors={["#6366F1"]}
                tintColor="#6366F1"
              />
            }
            ListEmptyComponent={
              <View style={styles.emptyState}>
                <Ionicons name="cloud-done" size={80} color="#10B981" />
                <Text style={styles.emptyStateTitle}>Aucun formulaire en attente</Text>
                <Text style={styles.emptyStateText}>
                  Tous les formulaires ont été synchronisés{"\n"}et supprimés de la liste locale
                </Text>
              </View>
            }
            showsVerticalScrollIndicator={false}
          />

          {forms.some((f) => !f.synced) && (
            <Animated.View
              style={[styles.syncContainer, { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }]}
            >
              <TouchableOpacity
                style={[styles.syncButton, syncing && styles.syncButtonDisabled]}
                onPress={syncAllFormsHandler}
                disabled={syncing}
              >
                {syncing ? (
                  <>
                    <ActivityIndicator size="small" color="#fff" />
                    <Text style={styles.syncText}>Synchronisation...</Text>
                  </>
                ) : (
                  <>
                    <Ionicons name="cloud-upload" size={22} color="#fff" />
                    <Text style={styles.syncText}>
                      Tout synchroniser ({forms.filter((f) => !f.synced).length})
                    </Text>
                  </>
                )}
              </TouchableOpacity>
            </Animated.View>
          )}
        </>
      )}
    </SafeAreaView>
  );
};

export default OfflineFormsScreen;