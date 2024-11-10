import { useState } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useLocation,
} from "react-router-dom";
import Signup from "./pages/Signup";
import Login from "./pages/Login";
import ModeSelection from "./pages/ModeSelection";
import Home from "./pages/HomeClient";
import ServerDashboard from "./pages/ServerDashboard";
import MyDrive from "./components/clientMode/MyDrive";
import Starred from "./components/clientMode/Starred";
import StorageAnalytics from "./components/clientMode/StorageAnalytics";
import Trash from "./components/clientMode/Trash";
import Sidebar from "./components/clientMode/Sidebar";
import Navbar from "./components/Navbar";
import RamSharing from "./components/clientMode/Ramsharing";

function AppContent() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [selectedMode, setSelectedMode] = useState(null);
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const location = useLocation();

  const handleLoginSuccess = (name, userEmail) => {
    setIsAuthenticated(true);
    setUsername(name);
    setEmail(userEmail); 
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setSelectedMode(null);
    setUsername("");
    setEmail("");
  };

  const handleModeSelection = (mode) => setSelectedMode(mode);

  const getTitle = () => {
    switch (location.pathname) {
      case "/mydrive":
        return "My Drive";
      case "/starred":
        return "Starred";
      case "/storage":
        return "Storage Analytics";
      case "/server-dashboard":
        return "Server Dashboard";
      default:
        return `Welcome ${username || "User"}!`;
    }
  };

  return (
    <div className="flex h-screen">
      {isAuthenticated && selectedMode === "Client" && (
        <div className="fixed h-full w-64 bg-gray-800">
          <Sidebar />
        </div>
      )}

      <div
        className={`${
          isAuthenticated && selectedMode === "Client" ? "ml-64" : "w-full"
        } flex-grow flex flex-col`}
      >
        {isAuthenticated &&
          (selectedMode === "Server" || selectedMode === "Client") && (
            <Navbar
              onLogout={handleLogout}
              userName={username} 
              userEmail={email} 
              title={getTitle()}
            />
          )}
        <div className="flex-grow overflow-y-auto">
          <Routes>
            {!isAuthenticated ? (
              <>
                <Route
                  path="/signup"
                  element={<Signup onLoginSuccess={handleLoginSuccess} />}
                />
                <Route
                  path="/login"
                  element={<Login onLoginSuccess={handleLoginSuccess} />}
                />
                <Route path="*" element={<Navigate to="/login" replace />} />
              </>
            ) : (
              <>
                {selectedMode === null ? (
                  <Route
                    path="/mode-selection"
                    element={
                      <ModeSelection
                        onModeSelect={handleModeSelection}
                        onLogout={handleLogout}
                      />
                    }
                  />
                ) : selectedMode === "Client" ? (
                  <>
                    <Route
                      path="/home"
                      element={<Home onLogout={handleLogout} />}
                    />
                    <Route path="/mydrive" element={<MyDrive />} />
                    <Route path="/starred" element={<Starred />} />
                    <Route path="/storage" element={<StorageAnalytics />} />
                    <Route path="/trash" element={<Trash />} />
                    <Route path="/ramsharing" element={<RamSharing />} />

                    <Route path="*" element={<Navigate to="/home" replace />} />
                  </>
                ) : selectedMode === "Server" ? (
                  <>
                    <Route
                      path="/server-dashboard"
                      element={<ServerDashboard />}
                    />
                    <Route
                      path="*"
                      element={<Navigate to="/server-dashboard" replace />}
                    />
                  </>
                ) : (
                  <Route
                    path="*"
                    element={<Navigate to="/mode-selection" replace />}
                  />
                )}
              </>
            )}

            <Route path="*" element={<h1>404 Not Found</h1>} />
          </Routes>
        </div>
      </div>
    </div>
  );
}

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;