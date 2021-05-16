import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import Container from './components/Container';
import reportWebVitals from './reportWebVitals';

function doRender(){
  ReactDOM.render(
    <React.StrictMode>
      <Container />
    </React.StrictMode>,
    document.getElementById('root')
  );
  setTimeout(doRender, 1000)
}

doRender();

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
