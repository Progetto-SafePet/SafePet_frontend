import * as React from 'react';
import { useContext, useEffect, useState } from 'react'
import './DoubleBanner.scss'
import { Link } from 'react-router-dom';
import "../Banner/Banner.scss"

type BannerProps = {
  text: string;
  buttonText: string;
  link: string;
  text2: string;
  buttonText2: string;
  link2: string;
};

function DoubleBanner({ text, buttonText, link, text2, buttonText2, link2 }: BannerProps) {

  
  return (
    <>
        <div className='horiziontal-align'>
          <div className="banner-container">
              <h2>{text}</h2>
              <Link to = { link } className='button-primary'>{ buttonText }</Link>
          </div>
          <div className="banner-container">
              <h2>{text2}</h2>
              <Link to = { link2 } className='button-primary'>{ buttonText2 }</Link>
          </div>
        </div>
    </>
  );
}

export default DoubleBanner;
