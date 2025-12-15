'use client';
import { createContext, useState } from "react";

//this is the context that i will use to share the filter values between the OrdersFilters and OrdersTable components
const OrdersFiltersContext = createContext();
export { OrdersFiltersContext };

//and this is the provider of this context
// it provides the filter values to the OrdersFilters and OrdersTable components
export default function OrdersFiltersProvider({ children }) {
    const [filters, setFilters] = useState({
        searchQuery: '',
        status: null,
        startDate: null,
        endDate: null,
        sortBy: null,
        sortDirection: null
    });
    const getFilters = () => filters;
    return (
        <OrdersFiltersContext.Provider value={{ getFilters, setFilters }}>
            {children}
        </OrdersFiltersContext.Provider>
    );
}