import React, { useState } from 'react';
import { Route, Routes, BrowserRouter, Navigate } from 'react-router-dom';
import Home from './Home';
import Layout from './Layout';
import CreateQuiz from './CreateQuiz';
import PasscodePage from './PasscodePage';
import InstructionsPage from './InstructionsPage';


function App() {
  const [authorized, setAuthorized] = useState(false);

  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<Home />} />
          <Route path="/instructions" element={<InstructionsPage />} />

          <Route
            path="/create-quiz"
            element={authorized ? <CreateQuiz /> : <Navigate to="/passcode" />}
          />
          <Route path="/passcode" element={<PasscodePage setAuthorized={setAuthorized} />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
