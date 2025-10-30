// components/LoginModal.tsx
import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Modal,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  Alert,
  Dimensions,
} from 'react-native';

const { width, height } = Dimensions.get('window');

interface User {
  user_id: number;
  username: string;
  email: string;
  display_name: string;
  state: number;
}

interface LoginResponse {
  success: boolean;
  message: string;
  data?: {
    token: string;
    user: User;
  };
}

interface LoginModalProps {
  visible: boolean;
  onClose: () => void;
  onLoginSuccess: (user: User, token: string) => void;
}

const API_URL = 'http://192.168.1.103:3000/login'; // IP de ton serveur

const LoginModal: React.FC<LoginModalProps> = ({
  visible,
  onClose,
  onLoginSuccess,
}) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const resetForm = () => {
    setUsername('');
    setPassword('');
    setShowPassword(false);
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const handleLogin = async () => {
    if (!username.trim() || !password.trim()) {
      Alert.alert('Erreur', 'Veuillez remplir tous les champs');
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: username.trim(), password: password.trim() }),
      });

      const text = await response.text();
      let data: LoginResponse;

      try {
        data = JSON.parse(text);
      } catch {
        console.error('Réponse serveur non JSON:', text);
        throw new Error('Réponse serveur invalide');
      }

      if (!response.ok) {
        const msg = data?.message || `Erreur serveur (${response.status})`;
        Alert.alert('Erreur', msg);
        return;
      }

      if (data.success && data.data) {
        onLoginSuccess(data.data.user, data.data.token);
        resetForm();
        Alert.alert('Succès', `Bienvenue ${data.data.user.display_name} !`);
      } else {
        Alert.alert('Erreur', data.message || 'Identifiants incorrects');
      }
    } catch (error: any) {
      console.error('Erreur connexion:', error);
      Alert.alert(
        'Erreur de connexion',
        error.message || 'Impossible de se connecter au serveur. Vérifiez votre connexion.'
      );
    } finally {
      setLoading(false);
    }
  };

  const fillDemoCredentials = (account: { username: string; password: string }) => {
    setUsername(account.username);
    setPassword(account.password);
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={handleClose}
    >
      <View style={styles.overlay}>
        <KeyboardAvoidingView 
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.container}
        >
          <View style={styles.modal}>
            <View style={styles.header}>
              <Text style={styles.title}>Connexion</Text>
              <TouchableOpacity style={styles.closeButton} onPress={handleClose} disabled={loading}>
                <Text style={styles.closeButtonText}>×</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.form}>
              <TextInput
                style={styles.input}
                placeholder="Nom d'utilisateur ou email"
                placeholderTextColor="#999"
                value={username}
                onChangeText={setUsername}
                autoCapitalize="none"
                autoCorrect={false}
                editable={!loading}
              />

              <View style={styles.passwordContainer}>
                <TextInput
                  style={styles.passwordInput}
                  placeholder="Mot de passe"
                  placeholderTextColor="#999"
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry={!showPassword}
                  editable={!loading}
                  onSubmitEditing={handleLogin}
                />
                <TouchableOpacity
                  style={styles.eyeButton}
                  onPress={() => setShowPassword(!showPassword)}
                  disabled={loading}
                >
                  <Text style={styles.eyeText}>{showPassword ? '👁️' : '👁️'}</Text>
                </TouchableOpacity>
              </View>

              <TouchableOpacity
                style={[styles.loginButton, (loading || !username || !password) && styles.loginButtonDisabled]}
                onPress={handleLogin}
                disabled={loading || !username || !password}
              >
                {loading ? <ActivityIndicator color="#fff" size="small" /> : <Text style={styles.loginButtonText}>Se connecter</Text>}
              </TouchableOpacity>
            </View>

            <View style={styles.separator}>
              <View style={styles.separatorLine} />
              <Text style={styles.separatorText}>ou utilisez</Text>
              <View style={styles.separatorLine} />
            </View>

            <View style={styles.demoSection}>
              <Text style={styles.demoTitle}>Comptes de test</Text>
              <Text style={styles.demoNote}>💡 Utilisez n'importe quel mot de passe pour ces comptes</Text>
            </View>
          </View>
        </KeyboardAvoidingView>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.6)', justifyContent: 'center', alignItems: 'center', padding: 20 },
  container: { width: '100%', maxWidth: 400, maxHeight: height * 0.8 },
  modal: { backgroundColor: 'white', borderRadius: 16, padding: 24, shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 12, elevation: 8 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 },
  title: { fontSize: 22, fontWeight: 'bold', color: '#1a1a1a', flex: 1 },
  closeButton: { padding: 4, marginLeft: 10 },
  closeButtonText: { fontSize: 28, color: '#666', fontWeight: '300' },
  form: { gap: 16, marginBottom: 20 },
  input: { borderWidth: 1, borderColor: '#e1e5e9', borderRadius: 12, padding: 16, fontSize: 16, backgroundColor: '#f8f9fa', color: '#1a1a1a' },
  passwordContainer: { position: 'relative' },
  passwordInput: { borderWidth: 1, borderColor: '#e1e5e9', borderRadius: 12, padding: 16, fontSize: 16, backgroundColor: '#f8f9fa', color: '#1a1a1a', paddingRight: 50 },
  eyeButton: { position: 'absolute', right: 12, top: 14, padding: 4 },
  eyeText: { fontSize: 20 },
  loginButton: { backgroundColor: '#007AFF', borderRadius: 12, padding: 18, alignItems: 'center', marginTop: 8, shadowColor: '#007AFF', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 8, elevation: 4 },
  loginButtonDisabled: { backgroundColor: '#ccc', shadowOpacity: 0 },
  loginButtonText: { color: 'white', fontSize: 16, fontWeight: 'bold' },
  separator: { flexDirection: 'row', alignItems: 'center', marginVertical: 20 },
  separatorLine: { flex: 1, height: 1, backgroundColor: '#e1e5e9' },
  separatorText: { marginHorizontal: 12, color: '#666', fontSize: 14, fontWeight: '500' },
  demoSection: { marginTop: 8 },
  demoTitle: { fontSize: 16, fontWeight: 'bold', color: '#333', marginBottom: 12, textAlign: 'center' },
  demoNote: { fontSize: 12, color: '#666', textAlign: 'center', fontStyle: 'italic', marginTop: 8 },
});

export default LoginModal;
