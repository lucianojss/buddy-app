import gql from 'graphql-tag';

const CONTACT_DETAILS = gql`
  query getContactDetails($newbieId: ID!) {
    newbie(newbieId: $newbieId) {
      name
      position
      startDate
      email
      phoneNumber
      photo
      notes
    }
  }
`;

export default CONTACT_DETAILS;
