import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import reportWebVitals from './reportWebVitals';
import { BrowserRouter as Router } from 'react-router-dom';
import ThemeProvider from '../src/ThemeProvider';
import Typography from '@mui/material/Typography';
import Header from './Header';
import Routes from './routes';
import QueryClientProvider from './QueryClientProvider';


function Copyright(props: any) {
  return (
    <Typography variant="body2" color="text.secondary" align="center" {...props}>
      {'Copyright © Sound Migration Tool. Kharkiv '}
      {new Date().getFullYear()}
      {'.'}
    </Typography>
  );
}

ReactDOM.render(
  <React.StrictMode>
    <QueryClientProvider>
      <Router>
        <ThemeProvider>
          <Header />
          <Routes />
          <Copyright sx={{ mt: 8, mb: 4 }} />
        </ThemeProvider>
      </Router>
    </QueryClientProvider>
  </React.StrictMode>,
  document.getElementById('root') as HTMLElement,
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
