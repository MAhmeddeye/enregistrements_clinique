import React, { useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Modal,
  Animated,
  Easing,
  ActivityIndicator,
  StyleSheet,
  Dimensions,
  StatusBar,
  SafeAreaView,
  ScrollView,
} from "react-native";
import { MaterialIcons, Ionicons, FontAwesome5 } from "@expo/vector-icons";
import { useNavigation, NavigationProp } from "@react-navigation/native";

const { width, height } = Dimensions.get("window");

interface Societe {
  idDemande: number;
  numero: number;
  source: string;
  nom_titre: string;
  tel: string;
  moughataa: string;
  commune: string;
  last_update: string;
  Etat: string;
  date_appel: string;
  nom_plaignant: string | null;
  localite: string | null;
  wilaya: string | null;
  commentaire: string | null;
  type_demande1: string | null;
  type_demande2: string | null;
}

// Définir le type pour la navigation
type RootStackParamList = {
  SocieteList: undefined;
  Enregistrement: { societeData: Societe };
  // Ajoutez d'autres écrans si nécessaire
};

type DetailContentProps = {
  societe: Societe;
  onClose: () => void;
  navigation: NavigationProp<RootStackParamList>;
};

const DetailContent = ({ societe, onClose, navigation }: DetailContentProps) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Clôturée': return '#10B981';
      case 'En cours': return '#F59E0B';
      case 'En retard': return '#EF4444';
      default: return '#6B7280';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Clôturée': return 'check-circle';
      case 'En cours': return 'sync';
      case 'En retard': return 'warning';
      default: return 'schedule';
    }
  };

  const handleAddClick = () => {
    onClose(); // Fermer le modal d'abord
    // Naviguer vers la page d'enregistrement avec les données de la société
    navigation.navigate('Enregistrement', { 
      societeData: societe
    });
  };

  return (
    <View style={styles.modalContainer}>
      {/* Header avec bouton add */}
      <View style={styles.modalHeader}>
        <View style={styles.headerLeft}>
          <View style={[styles.statusBadge, { backgroundColor: getStatusColor(societe.Etat) }]}>
            <MaterialIcons name={getStatusIcon(societe.Etat)} size={16} color="white" />
            <Text style={styles.statusBadgeText}>{societe.Etat}</Text>
          </View>
          <Text style={styles.modalTitle}>Demande #{societe.idDemande}</Text>
        </View>
        <View style={styles.headerRight}>
          {/* Icône Add */}
          <TouchableOpacity onPress={handleAddClick} style={styles.addButton}>
            <Ionicons name="add-circle" size={28} color="#0A84FF" />
          </TouchableOpacity>
          <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
            <Ionicons name="close" size={24} color="#6B7280" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Content avec hauteur fixe */}
      <View style={styles.modalBody}>
        <ScrollView 
          style={styles.scrollView}
          contentContainerStyle={styles.scrollViewContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Informations Personnelles */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Informations Personnelles</Text>
            <View style={styles.infoGrid}>
              <View style={styles.infoItem}>
                <Ionicons name="person" size={20} color="#0A84FF" />
                <View style={styles.infoContent}>
                  <Text style={styles.infoLabel}>Plaignant</Text>
                  <Text style={styles.infoValue}>{societe.nom_plaignant || "Non renseigné"}</Text>
                </View>
              </View>
              
              <View style={styles.infoItem}>
                <Ionicons name="call" size={20} color="#0A84FF" />
                <View style={styles.infoContent}>
                  <Text style={styles.infoLabel}>Téléphone</Text>
                  <Text style={styles.infoValue}>{societe.tel}</Text>
                </View>
              </View>

              <View style={styles.infoItem}>
                <FontAwesome5 name="map-marker-alt" size={18} color="#0A84FF" />
                <View style={styles.infoContent}>
                  <Text style={styles.infoLabel}>Localisation</Text>
                  <Text style={styles.infoValue}>
                    {[societe.wilaya, societe.commune, societe.moughataa].filter(Boolean).join(' • ') || "Non renseigné"}
                  </Text>
                </View>
              </View>
            </View>
          </View>

          {/* Détails de la Demande */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Détails de la Demande</Text>
            <View style={styles.detailGrid}>
              <View style={styles.detailItem}>
                <MaterialIcons name="category" size={20} color="#8B5CF6" />
                <View style={styles.detailContent}>
                  <Text style={styles.detailLabel}>Type 1</Text>
                  <Text style={styles.detailValue}>{societe.type_demande1 || "Non spécifié"}</Text>
                </View>
              </View>

              <View style={styles.detailItem}>
                <MaterialIcons name="assignment" size={20} color="#8B5CF6" />
                <View style={styles.detailContent}>
                  <Text style={styles.detailLabel}>Type 2</Text>
                  <Text style={styles.detailValue}>{societe.type_demande2 || "Non spécifié"}</Text>
                </View>
              </View>

              <View style={styles.detailItem}>
                <Ionicons name="time" size={20} color="#8B5CF6" />
                <View style={styles.detailContent}>
                  <Text style={styles.detailLabel}>Date d'appel</Text>
                  <Text style={styles.detailValue}>
                    {societe.date_appel ? new Date(societe.date_appel).toLocaleString('fr-FR') : "Non renseigné"}
                  </Text>
                </View>
              </View>
            </View>
          </View>

          {/* Commentaires */}
          {societe.commentaire && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Commentaires</Text>
              <View style={styles.commentBox}>
                <Text style={styles.commentText}>{societe.commentaire}</Text>
              </View>
            </View>
          )}
        </ScrollView>
      </View>

      {/* Footer */}
      <View style={styles.modalFooter}>
        <TouchableOpacity onPress={onClose} style={styles.primaryButton}>
          <Text style={styles.primaryButtonText}>Fermer</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default function SocieteList() {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const [societes, setSocietes] = useState<Societe[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedSociete, setSelectedSociete] = useState<Societe | null>(null);
  const modalAnim = useRef(new Animated.Value(0)).current;

  const fetchData = async () => {
    try {
      console.log("Tentative de récupération des données...");
      const response = await fetch("http://192.168.1.103:3000/societe");
      if (!response.ok) throw new Error(`Erreur HTTP: ${response.status}`);
      const data = await response.json();
      setSocietes(data);
      setError(null);
    } catch (err: any) {
      console.error("Erreur détaillée:", err);
      setError(err.message);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    fetchData();
  };

  const openDetails = (societe: Societe) => {
    console.log("Ouverture des détails pour:", societe);
    setSelectedSociete(societe);
    setModalVisible(true);
    modalAnim.setValue(0);
    Animated.timing(modalAnim, {
      toValue: 1,
      duration: 400,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: true,
    }).start();
  };

  const closeDetails = () => {
    Animated.timing(modalAnim, {
      toValue: 0,
      duration: 300,
      easing: Easing.in(Easing.cubic),
      useNativeDriver: true,
    }).start(() => {
      setModalVisible(false);
      setSelectedSociete(null);
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Clôturée': return '#10B981';
      case 'En cours': return '#F59E0B';
      case 'En retard': return '#EF4444';
      default: return '#6B7280';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Clôturée': return 'check-circle';
      case 'En cours': return 'sync';
      case 'En retard': return 'warning';
      default: return 'schedule';
    }
  };

  const renderSociete = ({ item }: { item: Societe }) => (
    <TouchableOpacity onPress={() => openDetails(item)} style={styles.card}>
      <View style={styles.cardHeader}>
        <View style={styles.cardTitle}>
          <MaterialIcons name="assignment" size={20} color="#0A84FF" />
          <Text style={styles.demandeId}>#{item.idDemande}</Text>
        </View>
        <View style={[styles.statusIndicator, { backgroundColor: getStatusColor(item.Etat) }]}>
          <MaterialIcons name={getStatusIcon(item.Etat)} size={12} color="white" />
          <Text style={styles.statusText}>{item.Etat}</Text>
        </View>
      </View>

      <View style={styles.cardBody}>
        <View style={styles.plaignantInfo}>
          <Ionicons name="person" size={16} color="#6B7280" />
          <Text style={styles.plaignantName}>{item.nom_plaignant || "Non renseigné"}</Text>
        </View>
        
        <View style={styles.contactInfo}>
          <Ionicons name="call" size={14} color="#9CA3AF" />
          <Text style={styles.phoneText}>{item.tel}</Text>
        </View>
      </View>

      <View style={styles.cardFooter}>
        <View style={styles.location}>
          <FontAwesome5 name="map-marker-alt" size={12} color="#9CA3AF" />
          <Text style={styles.locationText}>
            {item.wilaya} • {item.commune}
          </Text>
        </View>
        <Text style={styles.timeText}>
          {item.date_appel ? new Date(item.date_appel).toLocaleDateString('fr-FR') : 'N/A'}
        </Text>
      </View>

      <View style={styles.cardArrow}>
        <MaterialIcons name="chevron-right" size={20} color="#D1D5DB" />
      </View>
    </TouchableOpacity>
  );

  const renderEmptyState = () => (
    <View style={styles.emptyState}>
      <MaterialIcons name="assignment" size={64} color="#D1D5DB" />
      <Text style={styles.emptyStateTitle}>Aucune demande</Text>
      <Text style={styles.emptyStateText}>
        Aucune demande n'a été trouvée pour le moment
      </Text>
    </View>
  );

  if (loading) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <StatusBar barStyle="dark-content" backgroundColor="#F8FAFC" />
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#0A84FF" />
          <Text style={styles.loadingText}>Chargement des demandes...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#F8FAFC" />
      
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>Demandes</Text>
          <Text style={styles.subtitle}>
            {societes.length} demande(s) trouvée(s)
          </Text>
        </View>
        <TouchableOpacity style={styles.filterBtn}>
          <Ionicons name="filter" size={24} color="#0A84FF" />
        </TouchableOpacity>
      </View>

      {/* Content */}
      <View style={styles.container}>
        {error ? (
          <View style={styles.errorContainer}>
            <MaterialIcons name="error-outline" size={48} color="#EF4444" />
            <Text style={styles.errorTitle}>Erreur de connexion</Text>
            <Text style={styles.errorText}>{error}</Text>
            <TouchableOpacity onPress={fetchData} style={styles.retryButton}>
              <Text style={styles.retryButtonText}>Réessayer</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <FlatList
            data={societes}
            keyExtractor={(item) => item.idDemande.toString()}
            renderItem={renderSociete}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.listContent}
            ListEmptyComponent={renderEmptyState}
            refreshing={refreshing}
            onRefresh={onRefresh}
          />
        )}
      </View>

      {/* Modal */}
      <Modal
        visible={modalVisible}
        transparent
        animationType="none"
        statusBarTranslucent
        onRequestClose={closeDetails}
      >
        <View style={styles.modalOverlay}>
          <Animated.View
            style={[
              styles.animatedModal,
              {
                opacity: modalAnim,
                transform: [
                  {
                    translateY: modalAnim.interpolate({
                      inputRange: [0, 1],
                      outputRange: [50, 0],
                    }),
                  },
                ],
              },
            ]}
          >
            {selectedSociete ? (
              <DetailContent 
                societe={selectedSociete} 
                onClose={closeDetails}
                navigation={navigation}
              />
            ) : (
              <View style={styles.modalContainer}>
                <ActivityIndicator size="large" color="#0A84FF" />
                <Text style={{ marginTop: 10 }}>Chargement...</Text>
              </View>
            )}
          </Animated.View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

// Les styles restent identiques...
const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#F8FAFC",
  },
  container: {
    flex: 1,
    backgroundColor: "#F8FAFC",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 24,
    paddingVertical: 16,
    backgroundColor: "#FFFFFF",
    borderBottomWidth: 1,
    borderBottomColor: "#F1F5F9",
  },
  title: {
    fontSize: 28,
    fontWeight: "800",
    color: "#0F172A",
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 14,
    color: "#64748B",
    marginTop: 2,
  },
  filterBtn: {
    padding: 8,
    borderRadius: 12,
    backgroundColor: "#F1F5F9",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: "#64748B",
  },
  listContent: {
    padding: 16,
    paddingBottom: 100,
  },
  card: {
    backgroundColor: "white",
    borderRadius: 20,
    padding: 20,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 5,
    borderWidth: 1,
    borderColor: "#F1F5F9",
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  cardTitle: {
    flexDirection: "row",
    alignItems: "center",
  },
  demandeId: {
    fontSize: 16,
    fontWeight: "700",
    color: "#0F172A",
    marginLeft: 8,
  },
  statusIndicator: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    gap: 4,
  },
  statusText: {
    fontSize: 12,
    fontWeight: "600",
    color: "white",
  },
  cardBody: {
    marginBottom: 12,
  },
  plaignantInfo: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 6,
  },
  plaignantName: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1E293B",
    marginLeft: 6,
  },
  contactInfo: {
    flexDirection: "row",
    alignItems: "center",
  },
  phoneText: {
    fontSize: 14,
    color: "#64748B",
    marginLeft: 4,
  },
  cardFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  location: {
    flexDirection: "row",
    alignItems: "center",
  },
  locationText: {
    fontSize: 12,
    color: "#64748B",
    marginLeft: 4,
  },
  timeText: {
    fontSize: 12,
    color: "#94A3B8",
    fontWeight: "500",
  },
  cardArrow: {
    position: "absolute",
    right: 16,
    top: "50%",
    marginTop: -10,
  },
  emptyState: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 80,
    paddingHorizontal: 40,
  },
  emptyStateTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#64748B",
    marginTop: 16,
    marginBottom: 8,
  },
  emptyStateText: {
    fontSize: 14,
    color: "#94A3B8",
    textAlign: "center",
    lineHeight: 20,
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 40,
  },
  errorTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#0F172A",
    marginTop: 16,
    marginBottom: 8,
  },
  errorText: {
    fontSize: 14,
    color: "#64748B",
    textAlign: "center",
    lineHeight: 20,
    marginBottom: 24,
  },
  retryButton: {
    backgroundColor: "#0A84FF",
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 12,
  },
  retryButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(15, 23, 42, 0.6)",
    justifyContent: "flex-end",
  },
  animatedModal: {
    width: '100%',
  },
  modalContainer: {
    backgroundColor: "white",
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    maxHeight: height * 0.85,
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 24,
    borderBottomWidth: 1,
    borderBottomColor: "#F1F5F9",
  },
  headerLeft: {
    flex: 1,
  },
  headerRight: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  addButton: {
    padding: 4,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#0F172A",
    marginTop: 8,
  },
  statusBadge: {
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "flex-start",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    gap: 4,
  },
  statusBadgeText: {
    fontSize: 12,
    fontWeight: "600",
    color: "white",
  },
  closeBtn: {
    padding: 4,
  },
  modalBody: {
    height: height * 0.6,
  },
  scrollView: {
    flex: 1,
  },
  scrollViewContent: {
    flexGrow: 1,
  },
  section: {
    padding: 24,
    borderBottomWidth: 1,
    borderBottomColor: "#F1F5F9",
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#0F172A",
    marginBottom: 16,
    letterSpacing: -0.5,
  },
  infoGrid: {
    gap: 16,
  },
  infoItem: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 12,
  },
  infoContent: {
    flex: 1,
  },
  infoLabel: {
    fontSize: 12,
    fontWeight: "600",
    color: "#64748B",
    marginBottom: 2,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  infoValue: {
    fontSize: 14,
    fontWeight: "500",
    color: "#0F172A",
    lineHeight: 20,
  },
  detailGrid: {
    gap: 16,
  },
  detailItem: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 12,
  },
  detailContent: {
    flex: 1,
  },
  detailLabel: {
    fontSize: 12,
    fontWeight: "600",
    color: "#64748B",
    marginBottom: 2,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  detailValue: {
    fontSize: 14,
    fontWeight: "500",
    color: "#0F172A",
    lineHeight: 20,
  },
  commentBox: {
    backgroundColor: "#F8FAFC",
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#F1F5F9",
  },
  commentText: {
    fontSize: 14,
    color: "#475569",
    lineHeight: 20,
  },
  modalFooter: {
    padding: 24,
    borderTopWidth: 1,
    borderTopColor: "#F1F5F9",
  },
  primaryButton: {
    backgroundColor: "#0A84FF",
    paddingVertical: 16,
    borderRadius: 16,
    alignItems: "center",
  },
  primaryButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },
});