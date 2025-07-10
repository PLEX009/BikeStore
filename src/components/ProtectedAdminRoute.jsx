/**
 * Componente ProtectedAdminRoute - Protege rutas solo para administradores
 * 
 * Este componente actua como un wrapper que protege rutas que solo pueden
 * ser accedidas por usuarios autenticados con rol de administrador.
 * Incluye verificaciones de autenticacion, autorizacion y estados de carga.
 * 
 * @param {React.ReactNode} children - Los componentes hijos que se renderizan si el usuario es admin
 * @returns {JSX.Element} El contenido protegido o una redireccion
 */
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

// Componente para proteger rutas solo para administradores
const ProtectedAdminRoute = ({ children }) => {
  // Obtiene el estado de autenticacion y rol admin del hook useAuth
  const { isAuthenticated, isAdmin, isLoading } = useAuth();

  // Si esta cargando la verificacion de autenticacion, muestra mensaje de espera
  if (isLoading) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        fontSize: '18px',
        color: '#666'
      }}>
        Verificando autenticacion...
      </div>
    );
  }

  // Si no esta autenticado, redirige al login
  if (!isAuthenticated) {
    return <Navigate to="/LoginRegister" replace />;
  }

  // Si no es admin, redirige al home
  if (!isAdmin) {
    return <Navigate to="/" replace />;
  }

  // Si esta autenticado y es admin, muestra el contenido protegido
  return children;
};

export default ProtectedAdminRoute; 