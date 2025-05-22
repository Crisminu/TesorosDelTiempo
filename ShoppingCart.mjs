import { ShoppingCart } from './ShoppingCart.mjs';

const cart = new ShoppingCart();

// Añadir libro con id, nombre, precio
cart.addItem({ id: 1, title: 'Don Quijote', price: 250 });
