import React, { useState } from 'react';
import '../styles/ProductCard.module.css';
import { formatCurrency } from '../utils/FormatColombia';



/* Ventana Modal cuando se hace click a las cards del home */
function ProductCard({ name, price, image, description }) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = () => setIsModalOpen(true);
  const closeModal = (e) => {
    if (e.target.className === 'modal-overlay') {
      setIsModalOpen(false);
    }
  };

  return (
    <>
      <div className="product-card" onClick={openModal}>
        <img src={image} alt={name} />
        <h3>{name}</h3>
        <p>{formatCurrency(price)}</p>
      </div>

      {isModalOpen && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal">
            <button className="close-btn" onClick={() => setIsModalOpen(false)}>×</button>
            <img src={image} alt={name} />
            <h2>{name}</h2>
            <p className="modal-price">{formatCurrency(price)}</p>
            <p className="modal-description">{description}</p>
          </div>
        </div>
      )}
    </>
  );
}

export default ProductCard;
