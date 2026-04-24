import { useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "./firebase";

import Homepage from "./Homepage";
import LoginPage from "./LoginPage";

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
  );
}

export default App;