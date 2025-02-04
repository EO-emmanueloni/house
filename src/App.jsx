import "./App.css";
import HouseLists from "./components/HouseLists";
import SignUp from "./pages/SignUp";
import SignIn from "./pages/SignIn";
import Header from "./components/Header";
import {
  BrowserRouter, Routes,
  Route,
  
} from "react-router-dom";
import PrivateRoute from "./components/PrivateRoute";
import Profile from "./pages/Profile";

function App() {
  return (
    <BrowserRouter>
      <Header />
      <Routes>
        <Route path="/" element={<HouseLists />} />
        <Route path="/sign-up" element={<SignUp />} />
        <Route path="/sign-in" element={<SignIn />} />
        <Route element={<PrivateRoute />}>
            <Route path="/profile" element={<Profile />} />
        </Route>
      </Routes>
      
      
    </BrowserRouter>
  );
}

export default App;
