import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { compose } from 'react-apollo';
import * as GraphQL from '../graphql';

let log = null;

const screen = props => {
  const loading = <Text>loading...</Text>
  let invoice
  if (props.invoice) {
    invoice = (
      <View>
        <Text>id:</Text>
        <Text>{props.invoice.id}</Text>
        <Text>date:</Text>
        <Text>{props.invoice.date}</Text>
      </View>
    )
  }
  return (
    <View style={styles.container}>
      {!props.loading && props.invoice && invoice}
      {props.loading && loading}
    </View>
  )
}

const render = props => {
  const { error } = this.props;

  if (error) {
      console.log(error.networkError.response && JSON.parse(error.networkError.response._bodyText).message);
      return <Text>{error.message}</Text>
  }

  return screen(props)
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
