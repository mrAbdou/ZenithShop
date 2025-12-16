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
        limit: 5,
        currentPage: 1,
    });
    const getFilters = () => filters;
    const updateFilters = (newFilters) => setFilters(prev => ({ ...prev, searchQuery: newFilters.searchQuery, status: newFilters.status, startDate: newFilters.startDate, endDate: newFilters.endDate }));
    const updateSortingProps = (newSortingProps) => setFilters(prev => ({ ...prev, sortBy: newSortingProps.sortBy, sortDirection: newSortingProps.sortDirection }));
    const setPaginationLimit = (limit) => setFilters(prev => ({ ...prev, limit, currentPage: 1 }));
    const setPaginationCurrentPage = (page) => setFilters(prev => ({ ...prev, currentPage: page }));
    return (
        <OrderFiltersContext.Provider value={{ getFilters, updateFilters, updateSortingProps, setPaginationLimit, setPaginationCurrentPage }}>
            {children}
        </OrderFiltersContext.Provider>
    );
}

export function useOrderFiltersContext() {
    return useContext(OrderFiltersContext);
}
