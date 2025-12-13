'use client';
import { createContext, useState } from "react";

const OrdersFiltersContext = createContext();
export { OrdersFiltersContext };
export default function ContextProvider({ children }) {
    const [filters, setFilters] = useState({
        searchQuery: '',
        status: 'all',
        startDate: null,
        endDate: null,
    });
    return (
        <OrdersFiltersContext.Provider value={{ filters, setFilters }}>
            {children}
        </OrdersFiltersContext.Provider>
    );
}