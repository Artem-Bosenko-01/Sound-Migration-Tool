import React from 'react';
import './App.css';
import YouTubeAuth from './YouTubeAuth';
import { loadAuth2 } from 'gapi-script';


function App() {
  loadAuth2(
    'client:auth2',
    '75898408331-4prql5eq7jgha86b82rdtlj4vptrcg2v.apps.googleusercontent.com',
    'https://www.googleapis.com/auth/youtube.force-ssl',
  );

  return (
    <>
        <YouTubeAuth />
    </>
  );
}

export default App;
