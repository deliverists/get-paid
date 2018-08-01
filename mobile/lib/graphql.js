import gql from 'graphql-tag';
import { graphql } from 'react-apollo';

export const GetInvoice = gql`query GetInvoice($id:ID!) {
    invoice(id:$id) {
        id, date
    }
}`;

export const operations = {
     GetInvoice: graphql(GetInvoice, {
        options: props => {
            return {
                fetchPolicy: 'network-only',
                variables: { id: props.navigation.state.params.id }
            };
        },
        props: ({ data }) => {
            return {
                loading: data.loading,
                invoice: data.invoice
            }
        }
    }),
};
