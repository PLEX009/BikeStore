import { Routes, Route } from 'react-router-dom'
import AdminDashboard from './pages/admin/adminDashboard'
import Header from './components/Header'
import Footer from './components/Footer'
import CatalogoProductos from './pages/catalogoProductos'
import Home from './pages/home'
import LoginRegister from './pages/login'
import CrudProducts from './pages/admin/Crud/crudProducts'; // Ajusta el path si está en otro lugar
import CrudUser from './pages/admin/Crud/crudUser'; // Ajusta el path si está en otro lugar
import CrudProveedores from './pages/admin/Crud/crudProveedores'; // Ajusta el path si está en otro lugar
import CrudCompras from './pages/admin/Crud/crudCompras'; // Ajusta el path si está en otro lugar
import CarritoDrawer from './components/CarritoDrawer'
import QuienesSomos from './pages/quienesSomos';
import { useCarrito } from './context/CarritoContext'
import Contacto from './pages/contacto';
import ProtectedAdminRoute from './components/ProtectedAdminRoute';
import './App.css' 
import Toast from './components/Toast';


// Layout para páginas normales
function MainLayout({ children }) {
return (
    <div className="layout">
      <Header />
      <main className="content">{children}</main>
      <Footer />
    </div>
  )
}

function App() {
   const { drawerVisible, setDrawerVisible } = useCarrito();
  return (
  <>
    <Toast />
    <Routes>
      {/* Rutas con Header y Footer */}
      <Route
        path="/*"
        element={
          <MainLayout>
            <Routes>
              <Route path="/quienes-somos" element={<QuienesSomos />} />
              <Route path="/" element={<Home />} />
              <Route path="/catalogoProductos" element={<CatalogoProductos />} />
              <Route path="/contacto" element={<Contacto />} />
            
            </Routes>
          </MainLayout>
        }
      />
    
      <Route path="/LoginRegister" element={<LoginRegister />} />
    
      {/* Rutas protegidas del admin */}
      <Route path="/adminDashboard" element={
        <ProtectedAdminRoute>
          <AdminDashboard />
        </ProtectedAdminRoute>
      }>
        {/* Esto se carga dentro del <Outlet /> */}
        <Route path="crudProducts" element={<CrudProducts />} />
        <Route path="crudUser" element={<CrudUser />} />
        <Route path="crudProveedores" element={<CrudProveedores />} />
        <Route path="crudCompras" element={<CrudCompras />} />
      </Route>
    </Routes>

    {drawerVisible && (
      <div className="overlay" onClick={() => setDrawerVisible(false)}>
          <CarritoDrawer visible={drawerVisible} onClose={() => setDrawerVisible(false)} />
        </div>
    )}
   </>
   
  )
}

export default App