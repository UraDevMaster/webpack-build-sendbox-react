import React from 'react';
import ReactDOM from 'react-dom';
import './main.scss';
import img from './alex.jpg'

const App = () => <p> <img src={img}/> </p>;

ReactDOM.render(<App/>, document.getElementById('root'));