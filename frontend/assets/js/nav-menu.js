// nav-menu.js

document.addEventListener('DOMContentLoaded', () => {
    const subMenuItems = document.querySelectorAll('.menu ul li');

    subMenuItems.forEach(item => {
        const arrow = item.querySelector('.arrow');
        const subMenu = item.querySelector('.sub-menu');

        if (arrow && subMenu) {
            item.addEventListener('click', (e) => {
                e.preventDefault(); // Evita el salto del enlace

                // Toggle del submenú
                const isVisible = subMenu.style.display === 'block';
                
                // Cierra todos los submenús primero
                document.querySelectorAll('.menu .sub-menu').forEach(menu => {
                    menu.style.display = 'none';
                });

                // Si estaba oculto, lo muestra
                subMenu.style.display = isVisible ? 'none' : 'block';
            });
        }
    });
});
