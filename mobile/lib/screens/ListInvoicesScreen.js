import React from 'react';
import { StyleSheet, Button, View } from 'react-native';

const screen = props => {
  const clicked = () => {
    const { navigate } = props.navigation;
    navigate('invoice', { id: '123' });
  }
  return (
    <View style={styles.container}>
      <Button title="clickit2" onPress={clicked} />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default screen;
