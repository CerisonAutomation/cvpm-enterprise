import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<div><h1>CVPM Enterprise</h1><p>World-class Property Management Platform</p></div>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;