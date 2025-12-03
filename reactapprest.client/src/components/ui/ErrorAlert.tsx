import React from 'react';

interface ErrorAlertProps {
    message: string | null;
    onDismiss: () => void;
}

export const ErrorAlert: React.FC<ErrorAlertProps> = ({ message, onDismiss }) => {
    if (!message) return null;

    return (
        <div className="alert alert-danger alert-dismissible fade show" role="alert">
            {message}
            <button
                type="button"
                className="btn-close"
                onClick={onDismiss}
            ></button>
        </div>
    );
};