const articulos = document.getElementById('articulos');
const carrito = document.getElementById('carrito');
const cantidadCarrito = document.getElementById('cantidad-carrito');
const botonEliminar = document.getElementById('eliminar');
const botonOrdenar = document.getElementById('ordenar');

// Productos sin stock y sin botón de agregar
const productos = {
    frutas: [
        { nombre: 'Manzanas', cantidad: 0 },
        { nombre: 'Bananas', cantidad: 0 },
        { nombre: 'Naranjas', cantidad: 0 }
    ],
    panaderia: [
        { nombre: 'Pan', cantidad: 0 },
        { nombre: 'Croissants', cantidad: 0 },
        { nombre: 'Galletas', cantidad: 0 }
    ],
    lacteos: [
        { nombre: 'Leche', cantidad: 0 },
        { nombre: 'Queso', cantidad: 0 },
        { nombre: 'Yogur', cantidad: 0 }
    ]
};

function cargarArticulos(categoria) {
    articulos.innerHTML = '';
    productos[categoria].forEach((producto, indice) => {
        const item = document.createElement('div');
        item.classList.add('item');
        item.setAttribute('draggable', 'true');
        item.setAttribute('id', `item${indice}`);
        item.textContent = producto.nombre;

        articulos.appendChild(item);

        item.addEventListener('dragstart', (e) => {
            e.dataTransfer.setData('text/plain', e.target.id);
        });

        // Restaurar posición original si no se suelta en el carrito
        item.addEventListener('dragend', () => {
            item.classList.remove('invisible'); // asegura que el elemento sea visible después del drag
        });
    });
}

document.querySelectorAll('.navbar a').forEach(enlace => {
    enlace.addEventListener('click', (e) => {
        e.preventDefault();
        const categoria = e.target.id;
        cargarArticulos(categoria);
    });
});

carrito.addEventListener('dragover', (e) => {
    e.preventDefault();
    carrito.classList.add('over');
});

carrito.addEventListener('dragleave', () => {
    carrito.classList.remove('over');
});

carrito.addEventListener('drop', (e) => {
    e.preventDefault();
    const data = e.dataTransfer.getData('text/plain');
    const elemento = document.getElementById(data);
    if (elemento) {
        const id = elemento.id.replace('item', '');
        const producto = productos[getCategoriaActual()][id];
        producto.cantidad++;
        elemento.textContent = producto.nombre;
        carrito.appendChild(elemento);
        actualizarCantidadCarrito();
        carrito.classList.remove('over');
    }
});

carrito.addEventListener('dragend', () => {
    const items = carrito.querySelectorAll('.item');
    items.forEach(item => {
        item.classList.remove('invisible'); // asegura que los elementos sean visibles después del drag
    });
});

function actualizarCantidadCarrito() {
    const cantidad = carrito.querySelectorAll('.item').length;
    cantidadCarrito.textContent = cantidad;
}

botonEliminar.addEventListener('click', () => {
    if (confirm('¿Quieres eliminar todos los elementos del carrito?')) {
        // Mover elementos de vuelta a la lista de artículos
        const itemsCarrito = carrito.querySelectorAll('.item');
        itemsCarrito.forEach(item => {
            item.remove();
        });
        actualizarCantidadCarrito();
    }
});

botonOrdenar.addEventListener('click', () => {
    const items = Array.from(carrito.querySelectorAll('.item'));
    items.sort((a, b) => {
        return a.textContent.localeCompare(b.textContent);
    });
    items.forEach(item => carrito.appendChild(item));
});

function getCategoriaActual() {
    const activeCategory = document.querySelector('.navbar a.active');
    return activeCategory ? activeCategory.id : 'frutas'; // categoría por defecto
}

// Cargar categoría por defecto al inicio
cargarArticulos(getCategoriaActual());
