import gql from 'graphql-tag'
import { graphql } from 'react-apollo'

const GetInvoice = gql`
query GetInvoice($id:ID!) {
  invoice(id:$id) {
    id, date
  }
}`

export default {
  GetInvoice: graphql(GetInvoice, {
    options: props => {
      return {
        fetchPolicy: 'network-only',
        variables: { id: '123' },
      }
    },
    props: ({ data }) => {
      return data
    }
  }),
}
