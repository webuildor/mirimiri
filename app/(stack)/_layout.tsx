import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React from 'react'
import { Stack, useRouter } from 'expo-router'
import { Ionicons } from '@expo/vector-icons'

export default function _layout() {
    const router = useRouter();
  return (
   <Stack screenOptions={{
    headerShadowVisible: false,
    headerLeft : () => 
    <TouchableOpacity>
        <Ionicons name='chevron-back' size={32} onPress={() => router.back()}/>
    </TouchableOpacity>
   }}>
    <Stack.Screen name='addEvent' options={{title: ''}}/>
   </Stack>
  )
}

const styles = StyleSheet.create({})