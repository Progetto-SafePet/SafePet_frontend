import * as React from 'react';
import { useContext, useEffect, useState } from 'react'
import './Banner.scss'
import { Link } from 'react-router-dom';

type BannerProps = {
  text: string;
  buttonText: string;
  link: string;
};

function Banner({ text, buttonText, link }: BannerProps) {

  
  return (
    <>
        <div className="banner-container">
            <h2>{text}</h2>
            <Link to = { link } className='button-primary'>{ buttonText }</Link>
        </div>
    </>
  );
}

export default Banner;
