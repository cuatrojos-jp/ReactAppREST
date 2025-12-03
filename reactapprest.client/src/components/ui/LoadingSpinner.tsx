import React from 'react';

export const LoadingSpinner: React.FC = () => {
    return (
        <div className="text-center">
            <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Cargando...</span>
            </div>
        </div>
    );
};