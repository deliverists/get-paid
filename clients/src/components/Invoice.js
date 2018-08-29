import React from 'react';
import { compose } from 'react-apollo';
import operations from '../api/operations';

const screen = props => {
  const loading = <span>loading...</span>
  let invoice
  if (props.invoice) {
    invoice = (
      <div>
        <span>id:</span>
        <span>{props.invoice.id}</span>
        <span>date:</span>
        <span>{props.invoice.date}</span>
      </div>
    )
  }
  return (
    <div>
      {!props.loading && props.invoice && invoice}
      {props.loading && loading}
    </div>
  )
}

const connectedScreen = compose(
  operations.GetInvoice,
)(screen);

export default connectedScreen;
