import React from 'react';
import { QueryRenderer } from 'react-relay';
import { Link } from 'react-router-dom';
import environment from './environment';
import graphql from 'babel-plugin-relay/macro';
import CreateContactMutation from './CreateContactMutation';
import ContactList from '../components/ContactList';
import Form from '../components/Form';

const GET_CONTACTS = graphql`
  query MainQuery {
    viewer {
      id
      allContacts(first: 1000) @connection(key: "Main_allContacts") {
        edges {
          node {
            id
            name
            email
          }
        }
      }
    }
  }
`;

const Main = () => {
  return (
    <div className="Main">
      <Link to="/apollo" className="switch">Switch to Apollo</Link>

      <QueryRenderer
        environment={environment}
        query={GET_CONTACTS}
        variables={{}}
        render={({ error, props }) => {
          if (error) {
            return <div>Error!</div>;
          }
          if (!props) {
            return <div>Loading...</div>;
          }

          return (
            <div className="container">
              <ContactList edges={props.viewer.allContacts.edges} />
              <Form
                onSubmit={(name, email) => {
                  CreateContactMutation.commit(
                    environment,
                    name,
                    email,
                    props.viewer
                  );
                }}
              />
            </div>
          );
        }}
      />
    </div>
  );
};

export default Main;