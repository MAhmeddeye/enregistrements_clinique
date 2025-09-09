import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  // --- Container principal ---
  container: {
    flexGrow: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 16,
    paddingBottom: 600,
    backgroundColor: '#fff'
  },
  header1: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: "#fff",
  },
  logoLeft: { width: 80, height: 50 },
  logoRight: { width: 80, height: 50 },
  introText: {
    fontSize: 20,
    color: "#2c3e50",
    marginBottom: 12,
    fontWeight: "600",
  },
  row: { flexDirection: "row", justifyContent: "space-between", width: "100%", marginBottom: 12 },
  accordionBox: { flex: 1, marginHorizontal: 6 },
  fullWidthAccordion: { width: "100%", marginVertical: 8, paddingHorizontal: 6 },

  // --- Accordion Header / Content ---
  header: {
    backgroundColor: "#2980b9",
    padding: 12,
    borderRadius: 8,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  headerText: { color: "#fff", fontWeight: "700", fontSize: 16 },
  content: {
    padding: 12,
    backgroundColor: "#fff",
    borderRadius: 8,
    marginTop: 8,
    borderWidth: 1,
    borderColor: "#ecf0f1",
  },
  subRow: { flexDirection: "row", justifyContent: "space-between", width: "100%" },
  subAccordionBox: { flex: 1, marginHorizontal: 6 },
  subHeader: {
    backgroundColor: "#16a085",
    padding: 10,
    borderRadius: 8,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  subHeaderText: { color: "#fff", fontWeight: "600", fontSize: 14 },

  // --- Form Inputs / Labels ---
  label: { fontSize: 14, fontWeight: "600", marginBottom: 6, color: "#2c3e50" },
  labelSmall: { fontSize: 13, fontWeight: "500", marginBottom: 4, color: "#34495e" },
  input: {
    borderWidth: 1,
    borderColor: "#dfe6e9",
    borderRadius: 8,
    padding: 10,
    marginBottom: 12,
    backgroundColor: "#fff",
  },
  textarea: {
    borderWidth: 1,
    borderColor: "#dfe6e9",
    borderRadius: 8,
    padding: 10,
    minHeight: 80,
    textAlignVertical: "top",
    backgroundColor: "#fff",
    marginBottom: 12,
  },
  pickerBox: {
    borderWidth: 1,
    borderColor: "#dfe6e9",
    borderRadius: 8,
    overflow: "hidden",
    marginBottom: 12,
    backgroundColor: "#fff",
  },

  // --- Modal Overlay ---
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
    padding: 16,
  },
  personalInfoModal: {
    width: "100%",
    maxWidth: 760,
    backgroundColor: "#f8f9fa",
    borderRadius: 12,
    overflow: "hidden",
  },
  modalHeader: {
    backgroundColor: "#2c3e50",
    paddingHorizontal: 12,
    paddingVertical: 10,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  modalTitle: { color: "#fff", fontSize: 16, fontWeight: "700" },
  modalContent: { padding: 12, maxHeight: "70%" },
  modalFooter: { padding: 12, flexDirection: "row", justifyContent: "flex-end", backgroundColor: "#fff" },
  modalButton: { backgroundColor: "#2980b9", paddingHorizontal: 14, paddingVertical: 10, borderRadius: 8 },
  modalButtonText: { color: "#fff", fontWeight: "600" },
  modalOption: { paddingVertical: 12, paddingHorizontal: 10, borderBottomWidth: 1, borderBottomColor: "#ecf0f1" },
  modalOptionText: { fontWeight: "600", fontSize: 14 },
  modalCancel: { marginTop: 10, paddingVertical: 10, alignItems: "center" },
  modalCancelText: { color: "#e74c3c", fontWeight: "700" },

  // --- Radio Buttons ---
  radioRow: { flexDirection: "row", alignItems: "center", paddingVertical: 8 },
  radioContainer: { width: 36, justifyContent: "center", alignItems: "center" },
  radio: { width: 18, height: 18, borderRadius: 9, borderWidth: 2, borderColor: "#7f8c8d", justifyContent: "center", alignItems: "center" },
  radioSelected: { borderColor: "#2980b9" },
  radioInner: { width: 10, height: 10, borderRadius: 5, backgroundColor: "#2980b9" },
  radioLabel: { marginLeft: 8, fontSize: 14, color: "#2c3e50" },

  // --- Boutons ---
  submitButton: {
    backgroundColor: "#27ae60",
    paddingVertical: 12,
    borderRadius: 8,
    marginTop: 20,
    width: "100%",
    alignItems: "center",
  },
  
  modalContainer: {
  flex: 1,
  backgroundColor: 'rgba(0,0,0,0.5)',
  justifyContent: 'center',
  alignItems: 'center',
  flexDirection: "row",
  padding: 16,
},

// modalContent: {
//   width: '100%',
//   maxWidth: 760,
//   backgroundColor: '#fff',
//   borderRadius: 12,
//   padding: 16,
//   maxHeight: '80%',
//   overflow: 'hidden',
// },

// modalHeader: {
//   fontSize: 18,
//   fontWeight: '700',
//   marginBottom: 12,
//   color: '#2c3e50',
// },

closeButton: {
  marginTop: 16,
  backgroundColor: '#e74c3c',
  paddingVertical: 10,
  paddingHorizontal: 16,
  borderRadius: 8,
  alignItems: 'center',
},

closeButtonText: {
  color: '#fff',
  fontWeight: '700',
  fontSize: 16,
},

  submitText: { color: "#fff", fontWeight: "700", fontSize: 16 },

  // --- Accordions internes ---
  expandableHeader: { paddingVertical: 10, paddingHorizontal: 8, borderRadius: 8, borderWidth: 1, borderColor: "#e0e6ea", marginBottom: 8, backgroundColor: "#fff" },
  internalScroll: { paddingHorizontal: 4, paddingVertical: 2 },
  // Styles pour le modal Neurologique
modalOverlayy: {
  flex: 1,
  backgroundColor: 'rgba(0, 0, 0, 0.6)',
  justifyContent: 'center',
  alignItems: 'center',
  padding: 20,
},
modalContainerNeuro: {
  width: '90%',
  maxHeight: '80%',
  backgroundColor: '#fff',
  borderRadius: 16,
  overflow: 'hidden',
  elevation: 10,
  shadowColor: '#000',
  shadowOffset: { width: 0, height: 4 },
  shadowOpacity: 0.3,
  shadowRadius: 6,
},
modalHeaderNeuro: {
  flexDirection: 'row',
  justifyContent: 'space-between',
  alignItems: 'center',
  padding: 20,
  backgroundColor: 'linear-gradient(135deg, #5E35B1 0%, #3949AB 100%)',
},
modalHeaderTextNeuro: {
  fontSize: 20,
  fontWeight: '700',
  color: '#fff',
},
closeIconNeuro: {
  padding: 4,
},
modalScrollViewNeuro: {
  padding: 20,
  maxHeight: '70%',
},
sectionNeuro: {
  marginBottom: 24,
},
sectionHeader: {
  flexDirection: 'row',
  alignItems: 'center',
  marginBottom: 12,
},
sectionTitleNeuro: {
  fontSize: 16,
  fontWeight: '600',
  color: '#333',
  marginLeft: 8,
},
dropdownButtonNeuro: {
  flexDirection: 'row',
  justifyContent: 'space-between',
  alignItems: 'center',
  borderWidth: 1.5,
  borderColor: '#E0E0E0',
  borderRadius: 12,
  padding: 14,
  backgroundColor: '#FAFAFA',
},
dropdownContent: {
  flexDirection: 'row',
  alignItems: 'center',
  flex: 1,
},
selectedOptionPreview: {
  flexDirection: 'row',
  alignItems: 'center',
},
dropdownButtonTextNeuro: {
  fontSize: 15,
  fontWeight: '500',
  color: '#333',
  marginLeft: 8,
},
placeholderText: {
  fontSize: 15,
  color: '#9E9E9E',
  fontStyle: 'italic',
},
optionsContainerNeuro: {
  marginTop: 8,
  borderWidth: 1.5,
  borderColor: '#E0E0E0',
  borderRadius: 12,
  overflow: 'hidden',
  backgroundColor: '#fff',
  elevation: 2,
  shadowColor: '#000',
  shadowOffset: { width: 0, height: 2 },
  shadowOpacity: 0.1,
  shadowRadius: 4,
},
optionButtonNeuro: {
  flexDirection: 'row',
  alignItems: 'center',
  padding: 14,
  borderBottomWidth: 1,
  borderBottomColor: '#F5F5F5',
},
selectedOptionNeuro: {
  backgroundColor: '#F3E5F5',
},
optionTextNeuro: {
  fontSize: 15,
  color: '#333',
  marginLeft: 12,
},
inputNeuro: {
  borderWidth: 1.5,
  borderColor: '#E0E0E0',
  borderRadius: 12,
  padding: 14,
  fontSize: 15,
  backgroundColor: '#FAFAFA',
  textAlignVertical: 'top',
  color: '#333',
},
modalFooterNeuro: {
  padding: 20,
  borderTopWidth: 1,
  borderTopColor: '#EEEEEE',
  backgroundColor: '#F9F9F9',
},
saveButtonNeuro: {
  backgroundColor: '#5E35B1',
  borderRadius: 12,
  padding: 16,
  alignItems: 'center',
  elevation: 3,
  shadowColor: '#5E35B1',
  shadowOffset: { width: 0, height: 2 },
  shadowOpacity: 0.3,
  shadowRadius: 4,
},
saveButtonTextNeuro: {
  color: '#fff',
  fontSize: 16,
  fontWeight: '600',
},
});

export default styles;
