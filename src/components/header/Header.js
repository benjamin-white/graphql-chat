import React from 'react';
import './Header.css';

const Header = ({ imgSrc, title }) => (
  <header>
    <img src={imgSrc} className="Logo" />
    <h2>{title}</h2>
  </header>
);

export default Header;
