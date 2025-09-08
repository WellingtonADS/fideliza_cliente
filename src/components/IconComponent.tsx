import React from 'react';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { View, Text, StyleSheet } from 'react-native';

const IconComponent = () => {
  return (
    <View style={styles.container}>
      <Icon name="home" size={30} color="#000" />
      <Text style={styles.text}>Início</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  text: {
    marginLeft: 10,
    fontSize: 16,
  },
});

export default IconComponent;
