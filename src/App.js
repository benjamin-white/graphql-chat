import React, { Component } from 'react';
import { graphql } from 'react-apollo';
import gql from 'graphql-tag';

import Chatbox from './components/Chatbox';

import logo from './logo.svg';
import './App.css';

class App extends Component {

  state = {
    from: 'anonymous',
    content: ''
  }

  componentDidMount() {
    const from = window.prompt('username');
    from && this.setState({ from });
  }

  render() {

    const allChats = this.props.allChatsQuery.allChats || [];

    return (
      <div className="">
        <div className="container">
          <h2>Chats</h2>
          {allChats.map(message => (
            <Chatbox key={message.id} message={message} />
          ))}
        </div>
      </div>
    );

  }
  
}

const ALL_CHATS_QUERY = gql`
  query AllChatsQuery {
    allChats {
      id
      createdAt
      from
      content
    }
  }
`;

export default graphql(ALL_CHATS_QUERY, { name: 'allChatsQuery' })(App);
