import React, { Suspense } from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import './i18n';
// import { Provider } from 'react-redux';
// import store from './redux/store';

ReactDOM.render(
  // <Provider store={store}> // uncomment when redux store is ready
    <React.StrictMode>
      <Suspense fallback={
      <div className="loading-screen">
        <div>
          <h1>MYTENNIS</h1>
        </div>
      </div>}>
        <App />
      </Suspense>
    </React.StrictMode>,
  // </Provider>,
  document.getElementById('root')
);

reportWebVitals();
