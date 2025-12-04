import { useState, useEffect, createContext } from 'react';
const CartContext = createContext();
export default function ContextProvider({ children }) {
    const [cart, setCart] = useState([]); // this is the only state shared between the children components
    const addToCart = (product) => {
        const foundIndex = cart.findIndex(item => item.id === product.id);
        const newCart = [...cart];
        if (foundIndex !== -1) {
            newCart[foundIndex].qte += 1;
        } else {
            newCart.push({ ...product, qte: 1 });
        }
        setCart(newCart);
        localStorage.setItem('cart', JSON.stringify(newCart));
    }
    const removeFromCart = (product) => {
        const foundIndex = cart.findIndex(item => item.id === product.id);
        if (foundIndex !== -1) {
            const newCart = [...cart];
            if (newCart[foundIndex].qte > 1) {
                newCart[foundIndex].qte -= 1;
            } else {
                newCart.splice(foundIndex, 1);
            }
            setCart(newCart);
            localStorage.setItem('cart', JSON.stringify(newCart));
        }
    }
    useEffect(() => {
        const currentCart = localStorage.getItem('cart');
        if (currentCart) {
            setCart(JSON.parse(currentCart));
        } else {
            localStorage.setItem('cart', JSON.stringify(cart));
        }
    }, []);
    return (
        <CartContext.Provider value={{ cart, addToCart, removeFromCart }}>
            {children}
        </CartContext.Provider>
    )
}