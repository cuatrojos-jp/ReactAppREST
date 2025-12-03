//import { useState } from "react";
//import { useNavigate } from "react-router-dom";

//const DrawerMenu = () => {
//    const [isOpen, setIsOpen] = useState(false);
//    const navigate = useNavigate();

//    const toggleDrawer = () => {
//        setIsOpen(!isOpen);
//    };

//    const handleNavigation = (path: string) => {
//        navigate(path);
//        setIsOpen(false);
//    };

//    return (
//        <>
//            {/* Hamburger Button */}
//            <button
//                className="btn btn-outline-light border-0 d-flex flex-column justify-content-center gap-1 p-2"
//                style={{ width: "30px", height: "30px" }}
//                onClick={toggleDrawer}
//                aria-label="Toggle menu"
//            >
//                <span className="bg-white rounded" style={{ height: "2px", width: "100%" }}></span>
//                <span className="bg-white rounded" style={{ height: "2px", width: "100%" }}></span>
//                <span className="bg-white rounded" style={{ height: "2px", width: "100%" }}></span>
//            </button>

//            {/* Bootstrap Offcanvas */}
//            <div className={`offcanvas offcanvas-start ${isOpen ? 'show' : ''}`}
//                style={{ visibility: isOpen ? 'visible' : 'hidden' }}
//                tabIndex={-1}
//                id="offcanvasMenu"
//                aria-labelledby="offcanvasMenuLabel">
//                <div className="offcanvas-header">
//                    <h5 className="offcanvas-title" id="offcanvasMenuLabel">
//                        Navigation
//                    </h5>
//                    <button
//                        type="button"
//                        className="btn-close"
//                        onClick={toggleDrawer}
//                        aria-label="Close"
//                    ></button>
//                </div>
//                <div className="offcanvas-body">
//                    <div className="d-grid gap-2">
//                        <button
//                            className="btn btn-outline-primary text-start"
//                            onClick={() => handleNavigation("/")}
//                        >
//                            <i className="bi bi-house me-2"></i>
//                            Inicio
//                        </button>
//                        <button
//                            className="btn btn-outline-primary text-start"
//                            onClick={() => handleNavigation("/alumnos")}
//                        >
//                            <i className="bi bi-people me-2"></i>
//                            Alumnos
//                        </button>
//                        <button
//                            className="btn btn-outline-success text-start"
//                            onClick={() => handleNavigation("/grados")}
//                        >
//                            <i className="bi bi-book me-2"></i>
//                            Grados
//                        </button>
//                    </div>
//                </div>
//            </div>

//            {/* Backdrop */}
//            {isOpen && <div className="offcanvas-backdrop fade show" onClick={toggleDrawer}></div>}
//        </>
//    );
//};

//export default DrawerMenu;

import { useState } from "react";
import { useNavigate } from "react-router-dom";

interface DrawerMenuProps {
    onLogout: () => void;
}

const DrawerMenu: React.FC<DrawerMenuProps> = ({ onLogout }) => {
    const [isOpen, setIsOpen] = useState(false);
    const navigate = useNavigate();

    const toggleDrawer = () => {
        setIsOpen(!isOpen);
    };

    const handleNavigation = (path: string) => {
        navigate(path);
        setIsOpen(false);
    };

    const handleLogout = () => {
        onLogout();
        navigate('/');
        setIsOpen(false);
    };

    return (
        <>
            {/* Hamburger Button */}
            <button
                type="button"
                className="hamburger-btn"
                onClick={toggleDrawer}
                aria-label="Toggle menu"
                aria-expanded={isOpen}
            >
                <span></span>
                <span></span>
                <span></span>
            </button>

            {/* Offcanvas (controlled manually so Bootstrap JS is not required) */}
            <div
                className={`offcanvas offcanvas-start ${isOpen ? 'show' : ''}`}
                style={{ visibility: isOpen ? 'visible' : 'hidden' }}
                tabIndex={-1}
                id="offcanvasMenu"
                aria-labelledby="offcanvasMenuLabel"
            >
                <div className="offcanvas-header">
                    <h5 className="offcanvas-title" id="offcanvasMenuLabel">
                        Navigation
                    </h5>
                    <button
                        type="button"
                        className="btn-close"
                        onClick={toggleDrawer}
                        aria-label="Close"
                    ></button>
                </div>
                <div className="offcanvas-body">
                    <div className="d-grid gap-2">
                        <button
                            className="btn btn-outline-primary text-start"
                            onClick={() => handleNavigation("/")}
                        >
                            <i className="bi bi-house me-2"></i>
                            Inicio
                        </button>
                        <button
                            className="btn btn-outline-primary text-start"
                            onClick={() => handleNavigation("/alumnos")}
                        >
                            <i className="bi bi-people me-2"></i>
                            Alumnos
                        </button>
                        <button
                            className="btn btn-outline-success text-start"
                            onClick={() => handleNavigation("/grados")}
                        >
                            <i className="bi bi-book me-2"></i>
                            Grados
                        </button>

                        <button
                            className="btn btn-outline-danger text-start mt-4"
                            onClick={handleLogout}
                        >
                            <i className="bi bi-box-arrow-right me-2"></i>
                            Cerrar Sesi&oacute;n
                        </button>
                    </div>
                </div>
            </div>

            {/* Backdrop */}
            {isOpen && <div className="offcanvas-backdrop fade show" onClick={toggleDrawer}></div>}
        </>
    );
};

export default DrawerMenu;