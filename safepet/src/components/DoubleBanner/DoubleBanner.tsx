import * as React from 'react';
import './DoubleBanner.scss'
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

  const handleClick = (url: string) => () => {
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className='horiziontal-align'>
      <div className="banner-container">
        <h2>{text}</h2>
        <button onClick={handleClick(link)} className='button-primary'>
          {buttonText}
        </button>
      </div>
      <div className="banner-container">
        <h2>{text2}</h2>
        <button onClick={handleClick(link2)} className='button-primary'>
          {buttonText2}
        </button>
      </div>
    </div>
  );
}

export default DoubleBanner;