import React from 'react';
import { Routes, Route } from 'react-router-dom';
import CustomerView from './views/CustomerView';
import AdminView from './views/AdminView';
import ScrollToTop from './components/ScrollToTop'; // <-- 1. Import the new component

function App() {
  return (
    <>
      <ScrollToTop /> {/* <-- 2. Add the component here */}
      <Routes>
        <Route path="/" element={<CustomerView />} />
        <Route path="/admin" element={<AdminView />} />
      </Routes>
    </>
  );
}

export default App;