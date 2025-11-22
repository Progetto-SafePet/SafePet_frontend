import * as React from 'react';
import './Title.scss'


type TitleProps = {
    text: string;
};

function Title({ text }: TitleProps) {


    return (
        <>
            <div className = "title">
                { text }
            </div>
        </>
    );
}

export default Title;