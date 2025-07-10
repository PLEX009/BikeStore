import { useState, useEffect } from 'react';

// Hook personalizado para manejar la autenticacion y el rol del usuario
export const useAuth = () => {
  // Estado para saber si el usuario esta autenticado
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  // Estado para saber si el usuario es admin
  const [isAdmin, setIsAdmin] = useState(false);
  // Estado con la informacion del usuario
  const [userInfo, setUserInfo] = useState(null);
  // Estado para saber si esta cargando la verificacion
  const [isLoading, setIsLoading] = useState(true);

  // Efecto para verificar la autenticacion al montar y cuando cambian eventos
  useEffect(() => {
    checkAuth(); // Verifica la autenticacion al montar
    
    // Funcion para manejar cambios en localStorage o eventos personalizados
    const handleStorageChange = () => {
      checkAuth();
    };

    // Escucha cambios en localStorage (login/logout en otra pestaña)
    window.addEventListener('storage', handleStorageChange);
    // Escucha eventos personalizados de autenticacion
    window.addEventListener('authChange', handleStorageChange);

    // Limpia los listeners al desmontar
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('authChange', handleStorageChange);
    };
  }, []);

  // Funcion para verificar la autenticacion y el rol
  const checkAuth = () => {
    // Obtiene los datos del usuario desde localStorage
    const numIdent = localStorage.getItem('num_ident');
    const userName = localStorage.getItem('user_name');
    const userId = localStorage.getItem('user_id');
    const id_usuario = localStorage.getItem('id_usuario');
    const userRol = localStorage.getItem('user_rol');

    // Si hay identificacion y nombre, el usuario esta autenticado
    if (numIdent && userName) {
      setIsAuthenticated(true);
      setUserInfo({
        numIdent,
        userName,
        userId,
        id_usuario,
        userRol: parseInt(userRol)
      });
      
      // Verifica si el usuario es admin (rol 2 o 3)
      setIsAdmin(userRol === '2' || userRol === '3');
    } else {
      // Si no hay datos, limpia el estado
      setIsAuthenticated(false);
      setIsAdmin(false);
      setUserInfo(null);
    }
    
    setIsLoading(false);
  };

  // Funcion para cerrar sesion
  const logout = () => {
    // Elimina la informacion del usuario del localStorage
    localStorage.removeItem('num_ident');
    localStorage.removeItem('user_name');
    localStorage.removeItem('user_id');
    localStorage.removeItem('user_rol');
    
    // Limpia el estado
    setIsAuthenticated(false);
    setIsAdmin(false);
    setUserInfo(null);
    
    // Dispara evento personalizado para actualizar otros componentes
    window.dispatchEvent(new CustomEvent('authChange'));
    
    // Redirige al login
      window.location.href = '/LoginRegister';
  };

  // Devuelve el estado y las funciones del hook
  return {
    isAuthenticated,
    isAdmin,
    userInfo,
    isLoading,
    logout,
    checkAuth
  };
}; 

export default useAuth;