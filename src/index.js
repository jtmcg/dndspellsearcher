import React from 'react';
import ReactDOM from 'react-dom';
import SpellSearcher from './spellsearcherapp'
//import SpellCard from './spellcard';
import * as serviceWorker from './serviceWorker';

//ReactDOM.render(<SpellList />, document.getElementById('root'));
ReactDOM.render(<SpellSearcher />, document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
