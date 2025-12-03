import { useState } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Alumnos from "./components/alumnos/Alumnos.tsx";
import Grados from "./pages/Grados";
import Login from "./components/Login.tsx";
import DrawerMenu from "./components/DrawerMenu";
import { AlumnoUploadWizard } from "./components/alumnos/AlumnoUploadWizard";

const App = () => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    const handleLogin = () => {
        setIsLoggedIn(true);
    };

    const handleLogout = () => {
        setIsLoggedIn(false);
    };

    // If not logged in, show login page
    if (!isLoggedIn) {
        return (
            <>
                <header className="bg-primary text-white py-3">
                    <div className="container">
                        <div className="d-flex align-items-center justify-content-center">
                            <h1 className="m-0">React App</h1>
                        </div>
                    </div>
                </header>
                <Login onLogin={handleLogin} />
            </>
        );
    }

    // If logged in, show the main app
    return (
        <>
            <header className="bg-primary text-white py-3 position-relative">
                <div className="container">
                    <div className="d-flex align-items-center justify-content-center">
                        <div className="position-absolute start-0 ms-3">
                            <DrawerMenu onLogout={handleLogout} />
                        </div>
                        <h1 className="m-0">React App</h1>
                        <div className="position-absolute end-0 me-3">
                            <button
                                className="btn btn-outline-light btn-sm"
                                onClick={handleLogout}
                            >
                                Cerrar Sesi&oacute;n
                            </button>
                        </div>
                    </div>
                </div>
            </header>

            <Routes>
                <Route path="/" element={
                    <div className="d-flex flex-column justify-content-center align-items-center" style={{ height: "80vh" }}>
                        <h3>Bienvenido al Sistema</h3>
                    </div>
                } />
                <Route path="/alumnos" element={<Alumnos />} />
                <Route path="/grados" element={<Grados />} />

                {/* Standalone route for the upload wizard (used by popup) */}
                <Route path="/upload-wizard" element={<AlumnoUploadWizard />} />

                <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
        </>
    );
};

export default App;