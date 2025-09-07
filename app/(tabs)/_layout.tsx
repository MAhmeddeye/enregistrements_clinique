import { Tabs } from 'expo-router';
import React from 'react';
import { View, TouchableOpacity, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

export default function TabLayout() {
  const router = useRouter();

  return (
    <View style={{ flex: 1 }}>
      <Tabs
        screenOptions={{
          tabBarActiveTintColor: '#007AFF',
          headerShown: false,
          tabBarStyle: {
            position: 'relative',
            backgroundColor: '#fff',
            borderTopWidth: 1,
            borderTopColor: '#eee',
            elevation: 8,
            shadowColor: '#000',
            shadowOffset: { width: 0, height: -2 },
            shadowOpacity: 0.1,
            shadowRadius: 3,
          },
        }}
      >
        <Tabs.Screen
          name="index"
          options={{
            title: 'Accueil',
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="home" size={size} color={color} />
            ),
          }}
        />
        
        {/* Écran factice pour l'icône du milieu */}
        <Tabs.Screen
          name="add-placeholder"
          options={{
            title: '',
            tabBarIcon: () => null, // Icône invisible
          }}
          listeners={{
            tabPress: (e) => {
              e.preventDefault(); // Empêche la navigation
              router.push('/add');
            },
          }}
        />
        
        <Tabs.Screen
          name="explore"
          options={{
            title: 'Compte',
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="person" size={size} color={color} />
            ),
          }}
        />
      </Tabs>

      {/* Bouton flottant add au MILIEU */}
      <TouchableOpacity
        style={{
          position: 'absolute',
          bottom: Platform.OS === 'ios' ? 25 : 35,
          left: '50%',
          marginLeft: -26, // Moitié de la largeur pour centrer
          width: 60,
          height: 60,
          borderRadius: 30,
          backgroundColor: '#007AFF',
          justifyContent: 'center',
          alignItems: 'center',
          elevation: 80,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.3,
          shadowRadius: 4,
          zIndex: 1000,
        }}
        onPress={() => router.push('/add')}
      >
        <Ionicons name="add" size={30} color="white" />
      </TouchableOpacity>
    </View>
  );
}