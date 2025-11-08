import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Welcome from "./pages/welcome";
import SignUp from "./pages/signUp";
import SignIn from "./pages/signIn";
import MainPage from "./pages/mainPage";
import HistoryPage from "./pages/historyPage"
import "./App.css";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/welcome" element={<Welcome />} />
        <Route path="/sign_up" element={<SignUp />} />
        <Route path="/sign_in" element={<SignIn />} />
        <Route path="/main_page" element={<MainPage />} />
        <Route path="/history_page" element={<HistoryPage />} />
      </Routes>
    </Router>
  );
}

export default App;
