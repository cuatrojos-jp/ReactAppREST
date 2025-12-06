import { useState, useEffect } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Alumnos from "./components/alumnos/Alumnos";
import Grados from "./components/grados/Grados";
import Login from "./components/Login";
import DrawerMenu from "./components/DrawerMenu";
import { AlumnoUploadWizard } from "./components/alumnos/AlumnoUploadWizard";
import Usuarios from "./components/usuarios/Usuarios";
import Perfiles from "./components/perfiles/Perfiles";
import PerfilUsuarios from './components/perfiles/PerfilUsuarios';

const App = () => {
    const [isLoggedIn, setIsLoggedIn] = useState(() => {
        return !!localStorage.getItem('isLoggedIn');
    });

    useEffect(() => {
        const syncLogout = (event: StorageEvent) => {
            if (event.key === 'isLoggedIn' && event.newValue === null) {
                setIsLoggedIn(false);
            }
        };
        window.addEventListener('storage', syncLogout);
        return () => {
            window.removeEventListener('storage', syncLogout);
        };
    }, []);

    const handleLogin = () => {
        localStorage.setItem('isLoggedIn', 'true');
        setIsLoggedIn(true);
    };

    const handleLogout = () => {
        localStorage.removeItem('isLoggedIn');
        setIsLoggedIn(false);
    };

    if (!isLoggedIn) {
        return <Login onLogin={handleLogin} />;
    }

    return (
        <div style={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
            <header className="bg-primary text-white py-3 shadow-sm">
                <div className="container-fluid">
                    <div className="d-flex align-items-center justify-content-between">
                        <div className="d-flex align-items-center">
                            <DrawerMenu onLogout={handleLogout} />
                            <h4 className="m-0 ms-3">React App</h4>
                        </div>
                        <button
                            className="btn btn-outline-light btn-sm"
                            onClick={handleLogout}
                        >
                            Cerrar Sesi&oacute;n
                        </button>
                    </div>
                </div>
            </header>
            <div style={{ display: 'flex', flexGrow: 1 }}>
                <main style={{ flexGrow: 1, padding: "20px", overflowY: 'auto' }}>
                    <Routes>
                        <Route
                            path="/"
                            element={
                                <div
                                    className="d-flex flex-column justify-content-center align-items-center"
                                    style={{ height: "80vh" }}
                                >
                                    <h3>Bienvenido al Sistema</h3>
                                </div>
                            }
                        />
                        <Route path="/alumnos" element={<Alumnos />} />
                        <Route path="/grados" element={<Grados />} />
                        <Route path="/usuarios" element={<Usuarios />} />
                        <Route path="/perfiles" element={<Perfiles />} />
                        <Route path="/perfiles/:id/usuarios" element={<PerfilUsuarios />} />
                        <Route path="/upload-wizard" element={<AlumnoUploadWizard />} />
                        <Route path="*" element={<Navigate to="/" replace />} />
                    </Routes>
                </main>
            </div>
        </div>
    );
};

export default App;