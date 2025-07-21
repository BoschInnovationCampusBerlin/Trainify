import "./App.css";
import Header from "./shared/components/Header";
import AppMessageContainer from "./components/AppMessageContainer";
import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import EvaluationPage from "./components/EvaluationPage";
import { useState } from "react";

const App = () => {
  const [language, setLanguage] = useState("en-US");

  const handleSetLanguage = (lang) => {
    setLanguage(lang);
  }

  return (
    <Router>
      <div className="app">
        <Header language={language} onSetLangage={handleSetLanguage}/>
        <div className="app-container">
          <Routes>
            <Route path="/" element={<AppMessageContainer selectedLanguage={language} />} />
            <Route path="/evaluation" element={<EvaluationPage />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
};

export default App;
