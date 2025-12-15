'use client';
import { OrderStatus } from "@/lib/constants";
import { createContext, useState, useContext } from "react";

//this is the context that i will use to share the filter values between the OrdersFilters and OrdersTable components
const OrderFiltersContext = createContext();
export { OrderFiltersContext };

//and this is the provider of this context
// it provides the filter values to the OrdersFilters and OrdersTable components
export default function OrderFiltersProvider({ children }) {
    const [filters, setFilters] = useState({
        searchQuery: '',
        status: OrderStatus.PENDING,
        startDate: null,
        endDate: null,
        //sorting props .....
        sortBy: null,
        sortDirection: null,
        //pagination props .....
        limit: 1,
        currentPage: 1,
        totalPages: 1,
    });
    const getFilters = () => filters;
    const updateFilters = (newFilters) => setFilters(newFilters);
    const setPaginationLimit = (limit) => setFilters({ ...filters, limit, currentPage: 1 });
    const setTotalPages = (dataCount) => setFilters({ ...filters, totalPages: Math.ceil(dataCount / filters.limit) });
    const setPaginationCurrentPage = (page) => setFilters({ ...filters, currentPage: page });
    return (
        <OrderFiltersContext.Provider value={{ getFilters, updateFilters, setPaginationLimit, setTotalPages, setPaginationCurrentPage }}>
            {children}
        </OrderFiltersContext.Provider>
    );
}

export function useOrderFiltersContext() {
    return useContext(OrderFiltersContext);
}