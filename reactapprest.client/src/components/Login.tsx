import React, { useState } from 'react';

interface LoginProps {
    onLogin: () => void;
}

const API_URL = "https://localhost:7231/api/Usuarios";

const Login: React.FC<LoginProps> = ({ onLogin }) => {
    const [usuarioNombre, setUsuarioNombre] = useState('');
    const [usuarioPw, setUsuarioPw] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [isRegistering, setIsRegistering] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        setSuccess('');

        try {
            if (isRegistering) {
                // Create new user (POST: api/Usuarios)
                const response = await fetch(`${API_URL}`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        UsuarioNombre: usuarioNombre,
                        UsuarioPw: usuarioPw
                    }),
                });

                if (response.status === 201 || response.ok) {
                    setSuccess('Registro exitoso. Por favor inicie sesi\u00F3n.');
                    setIsRegistering(false);
                    setUsuarioPw('');
                    // keep usuarioNombre so user can login easily
                } else {
                    const data = await response.json().catch(() => null);
                    setError(data?.mensaje ?? 'Error al registrar usuario');
                }
            } else {
                // Login (POST: api/Usuarios/login)
                const response = await fetch(`${API_URL}/login`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        UsuarioNombre: usuarioNombre,
                        UsuarioPw: usuarioPw
                    }),
                });

                if (response.ok) {
                    // Set a flag in localStorage to indicate the user is logged in.
                    localStorage.setItem('isLoggedIn', 'true');
                    onLogin();
                } else if (response.status === 401) {
                    setError('Credenciales inv\u00E1lidas');
                } else {
                    const data = await response.json().catch(() => null);
                    setError(data?.mensaje ?? 'Error en el servidor');
                }
            }
        } catch {
            setError('Error de conexi\u00F3n');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container mt-4">
            <div className="row justify-content-center">
                <div className="col-md-6">
                    <div className="border rounded p-4 mb-5 shadow-sm">
                        <h2 className="text-center mb-4">{isRegistering ? 'Registrar Usuario' : 'Iniciar Sesi\u00F3n'}</h2>

                        {error && (
                            <div className="alert alert-danger alert-dismissible fade show" role="alert">
                                {error}
                                <button
                                    type="button"
                                    className="btn-close"
                                    onClick={() => setError('')}
                                ></button>
                            </div>
                        )}

                        {success && (
                            <div className="alert alert-success alert-dismissible fade show" role="alert">
                                {success}
                                <button
                                    type="button"
                                    className="btn-close"
                                    onClick={() => setSuccess('')}
                                ></button>
                            </div>
                        )}

                        {loading && (
                            <div className="text-center">
                                <div className="spinner-border text-primary" role="status">
                                    <span className="visually-hidden">Cargando...</span>
                                </div>
                            </div>
                        )}

                        <form onSubmit={handleSubmit}>
                            <div className="row g-3">
                                <div className="col-12">
                                    <input
                                        type="text"
                                        className="form-control"
                                        placeholder="Usuario"
                                        value={usuarioNombre}
                                        onChange={(e) => setUsuarioNombre(e.target.value)}
                                        required
                                        disabled={loading}
                                    />
                                </div>
                                <div className="col-12">
                                    <input
                                        type="password"
                                        className="form-control"
                                        placeholder="Contrase&ntilde;a"
                                        value={usuarioPw}
                                        onChange={(e) => setUsuarioPw(e.target.value)}
                                        required
                                        disabled={loading}
                                    />
                                </div>
                            </div>

                            <div className="mt-3 text-end">
                                {isRegistering ? (
                                    <>
                                        <button
                                            type="button"
                                            className="btn btn-secondary me-2"
                                            onClick={() => { setIsRegistering(false); setError(''); setSuccess(''); }}
                                            disabled={loading}
                                        >
                                            Cancelar
                                        </button>
                                        <button
                                            type="submit"
                                            className="btn btn-primary"
                                            disabled={loading}
                                        >
                                            {loading ? "Procesando..." : "Registrar"}
                                        </button>
                                    </>
                                ) : (
                                    <>
                                        <button
                                            type="button"
                                            className="btn btn-secondary me-2"
                                            onClick={() => { setIsRegistering(true); setError(''); setSuccess(''); }}
                                            disabled={loading}
                                        >
                                            Registrarse
                                        </button>
                                        <button
                                            type="submit"
                                            className="btn btn-primary"
                                            disabled={loading}
                                        >
                                            {loading ? "Iniciando sesi\u00F3n..." : "Iniciar Sesi\u00F3n"}
                                        </button>
                                    </>
                                )}
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;