import { Tabs } from 'expo-router';
import React from 'react';
import { View, TouchableOpacity, Platform } from 'react-native';
import { Ionicons, Feather } from '@expo/vector-icons';
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
          bottom: Platform.OS === 'ios' ? 85 : 95,
          left: '50%',
          marginLeft: 26,
          marginVertical:-90,
          width: 40,
          height: 40,
          borderRadius: 26,
          backgroundColor: '#007AFF',
          justifyContent: 'center',
          alignItems: 'center',
          elevation: 8,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.3,
          shadowRadius: 4,
          zIndex: 1000,
        }}
        onPress={() => router.push('/Enregtrement')}
      >
        <Ionicons name="add" size={28} color="white" />
      </TouchableOpacity>

      {/* Nouveau bouton de synchronisation */}
      <TouchableOpacity
        style={{
          position: 'absolute',
          bottom: Platform.OS === 'ios' ? 25 : 35,
          left: '50%',
          marginLeft: -60,
          width: 40,
          height: 40,
          marginVertical:-30,
          borderRadius: 26,
          backgroundColor: '#10B981',
          justifyContent: 'center',
          alignItems: 'center',
          elevation: 8,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.3,
          shadowRadius: 4,
          zIndex: 1000,
        }}
        onPress={() => router.push('/sychronisation')} // Remplacez '/sync' par votre écran de synchronisation
      >
        <Feather name="refresh-cw" size={24} color="white" />
      </TouchableOpacity>
    </View>
  );
}