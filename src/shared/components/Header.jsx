import React from 'react';
import './Header.css'

const Header = () => {
  return (
      <div className="header-container">
          <div className="title">
              <img className="title-logo" src="assets/images/bosch-logo-only.png" alt="Bosch_Logo"/>
              <div className="title-text">Team 7 - Trainify</div>
          </div>
      </div>
  );
};

export default Header;