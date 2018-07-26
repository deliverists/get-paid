import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { compose } from 'react-apollo';
import * as GraphQL from '../graphql';

const screen = props => {
  const thingy = JSON.stringify(props);
  const thingyLog = <Text>{thingy}</Text>
  let invoice
  if (props.invoice) {
     invoice = (
      <View>
        <Text>invoice:</Text>
        <Text>{props.invoice.id}</Text>
        <Text>date:</Text>
        <Text>{props.invoice.date}</Text>
      </View>
    )
  }

  const loading = <Text>loading...</Text>
      // <Text>{thingy}</Text>
  // {!props.loading && invoice}
  return (
    <View style={styles.container}>
      {props.loading && loading}
      {!props.loading && invoice}
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

const connectedScreen = compose(
  GraphQL.operations.GetInvoice,
)(screen);

export default connectedScreen;
