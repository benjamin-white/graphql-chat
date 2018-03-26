import React from 'react';
import './Chatbox.css';

const Chatbox = ({ message }) => (
  <div className="ChatBox">
    <h5>{message.from}</h5>
    <p>{message.content}</p>
  </div>
);

export default Chatbox;
