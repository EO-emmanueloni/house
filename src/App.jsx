import "./App.css";
import HouseLists from "./components/HouseLists";
import SignUp from "./pages/SignUp";
import SignIn from "./pages/SignIn";
import {
  BrowserRouter, Routes,
  Route,
  
} from "react-router-dom";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HouseLists />} />
        <Route path="/sign-up" element={<SignUp />} />
        <Route path="/sign-in" element={<SignIn />} />
      </Routes>
      
      
    </BrowserRouter>
  );
}

export default App;
