import React from 'react';
import { View, Text } from "react-native";
import { compose } from 'react-apollo';
import operations from '../api/operations';

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
    <View>
      {!props.loading && props.invoice && invoice}
      {props.loading && loading}
    </View>
  )
}

const connectedScreen = compose(
  operations.GetInvoice,
)(screen);

export default connectedScreen;
