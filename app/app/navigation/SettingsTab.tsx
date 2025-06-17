import React from 'react';
import { View, Text } from 'react-native';
import { Colors } from '../../constants/Colors';

const SettingsTab = () => {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: Colors.lightBackground }}>
      <Text style={{ fontSize: 18, color: Colors.darkText }}>Settings & Profile - Coming Soon</Text>
    </View>
  );
};

export default SettingsTab;