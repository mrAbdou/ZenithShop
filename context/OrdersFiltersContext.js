'use client';
import { OrderStatus } from "@prisma/client";
import { createContext, useState } from "react";

//this is the context that i will use to share the filter values between the OrdersFilters and OrdersTable components
const OrdersFiltersContext = createContext();
export { OrdersFiltersContext };

//and this is the provider of this context
// it provides the filter values to the OrdersFilters and OrdersTable components
export default function ContextProvider({ children }) {
    const [filters, setFilters] = useState({
        searchQuery: '',
        status: OrderStatus.PENDING,
        startDate: null,
        endDate: null,
        sortBy: null,
        sortDirection: null
    });
    return (
        <OrdersFiltersContext.Provider value={{ filters, setFilters }}>
            {children}
        </OrdersFiltersContext.Provider>
    );
}