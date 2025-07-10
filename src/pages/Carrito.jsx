/**
 * Componente Carrito - Pagina del carrito de compras
 * 
 * Este componente renderiza la pagina del carrito de compras mostrando todos los
 * productos agregados, sus precios individuales y el total. Incluye funcionalidad
 * para vaciar el carrito y proceder con la compra.
 * 
 * @returns {JSX.Element} La pagina del carrito con lista de productos y total
 */
import { useCarrito } from '../context/CarritoContext';
import { formatCurrency } from '../utils/FormatColombia';

const Carrito = () => {
  // Hook del contexto del carrito para obtener estado y funciones
  const { carrito, total, limpiarCarrito } = useCarrito();

  return (
    // Contenedor principal del carrito
    <div className="carrito">
      {/* Titulo de la pagina */}
      <h3>Carrito de compras</h3>
      
      {/* Lista de productos en el carrito */}
      {carrito.map((item, i) => (
        // Contenedor individual para cada producto
        <div key={i}>
          {/* Informacion del producto: nombre y precio */}
          <p>{item.nombre} - {formatCurrency(item.precio)}</p>
        </div>
      ))}
      
      {/* Total de la compra */}
      <h4>Total: {formatCurrency(total)}</h4>
      
      {/* Boton para vaciar completamente el carrito */}
      <button onClick={limpiarCarrito}>Vaciar carrito</button>
      
      {/* Boton para proceder con la compra */}
      <button>Comprar</button>
    </div>
  );
};

export default Carrito;

