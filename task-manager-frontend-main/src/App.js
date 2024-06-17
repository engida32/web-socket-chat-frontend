import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./App.css";
import Chat from "./components/Chat";
import Login from "./components/Login";
import NavBar from "./components/NavBar";
import ProtectedRoute from "./components/ProtectedRoute";
import SignUp from "./components/RegisterComponents";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route index element={<Login />} />
        <Route path="/register" element={<SignUp />} />
        <Route
          path="/chat"
          element={
            <ProtectedRoute>
              <NavBar />
              <Chat />
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
