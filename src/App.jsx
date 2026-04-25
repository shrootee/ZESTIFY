import { BrowserRouter, Routes, Route } from "react-router-dom";
import Homepage from "./Homepage";
import LoginPage from "./LoginPage";
import ReelPage from "./ReelPage";
import { useState , useEffect } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "./firebase";

function App() {
  const [user, setUser] = useState(null);
  const [showLogin, setShowLogin] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  return (
    <BrowserRouter>

      {/* 🔥 ROUTES */}
      <Routes>
        <Route
          path="/"
          element={
            <>
              <Homepage
                user={user}
                openLogin={() => setShowLogin(true)}
              />

              {showLogin && (
                <LoginPage
                  onClose={() => setShowLogin(false)}
                  sunsetRed="#ff4d4d"
                />
              )}
            </>
          }
        />

        <Route path="/reels" element={<ReelPage />} />
        <Route path="/reels/:id" element={<ReelPage />} />

      </Routes>

    </BrowserRouter>
  );
}

export default App;