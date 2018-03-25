import React, { Component } from 'react';
import { graphql, compose } from 'react-apollo';
import gql from 'graphql-tag';

import Chatbox from './chatbox/Chatbox';
import Header from './header/Header';

import logo from '../img/logo.svg';
import './App.css';

class App extends Component {
  state = {
    from: 'anonymous',
    content: ''
  };

  _createChat = async e => {
    if (e.key === 'Enter') {
      // how xBrowser is this?
      const { content, from } = this.state;
      await this.props.createChatMutation({
        variables: { content, from }
      });
      this.setState({ content: '' });
    }
  };

  _subscribeToNewChats = _ => {
    this.props.allChatsQuery.subscribeToMore({
      document: gql`
        subscription {
          Chat(filter: { mutation_in: [CREATED] }) {
            node {
              id
              from
              content
              createdAt
            }
          }
        }
      `,
      updateQuery: (previous, { subscriptionData }) => {
        const newChatLinks = [
          ...previous.allChats,
          subscriptionData.data.Chat.node
        ];
        const result = {
          ...previous,
          allChats: newChatLinks
        };
        return result;
      }
    });
  };

  componentDidMount() {
    const from = window.prompt('username');
    from && this.setState({ from });
    this._subscribeToNewChats();
  }

  render() {
    const allChats = this.props.allChatsQuery.allChats || [];

    return (
      <div className="page-wrapper">
        <div className="container">
          <Header imgSrc={logo} title="Graph Chats" />

          <main className="ChatFeed">
            {allChats.map(message => (
              <Chatbox key={message.id} message={message} />
            ))}
          </main>

          {/* Message input */}
          <input
            value={this.state.content}
            onChange={e => this.setState({ content: e.target.value })}
            type="text"
            placeholder="Hit enter to submit"
            onKeyPress={this._createChat}
          />
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

const CREATE_CHAT_MUTATION = gql`
  mutation CreateChatMutation($content: String!, $from: String!) {
    createChat(content: $content, from: $from) {
      id
      createdAt
      from
      content
    }
  }
`;

export default compose(
  graphql(ALL_CHATS_QUERY, { name: 'allChatsQuery' }),
  graphql(CREATE_CHAT_MUTATION, { name: 'createChatMutation' })
)(App);
