import { useState } from "react";
import Login from "./pages/Login";
import Posts from "./pages/Posts";

function App() {
    const [loggedIn, setLoggedIn] = useState(
        !!localStorage.getItem("access")
    );

    if (!loggedIn) {
        return <Login onLogin={() => setLoggedIn(true)} />;
    }

    return <Posts />;
}

export default App;