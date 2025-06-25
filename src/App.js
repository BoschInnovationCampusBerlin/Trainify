import "./App.css";
import Header from "./shared/components/Header";
import AppMessageContainer from "./components/AppMessageContainer";
import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import EvaluationPage from "./components/EvaluationPage";

const App = () => {
  return (
    <Router>
      <div className="app">
        <Header />
        <div className="app-container">
          <Routes>
            <Route path="/" element={<AppMessageContainer />} />
            <Route path="/evaluation" element={<EvaluationPage />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
};

export default App;
