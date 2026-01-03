'use client';
import { PAGINATION_MIN_LIMIT } from "@/lib/constants";
import { OrderStatus } from "@prisma/client";
import { createContext, useState, useContext, useCallback, useMemo } from "react";

//this is the context that i will use to share the filter values between the OrdersFilters and OrdersTable components
const OrderFiltersContext = createContext();
export { OrderFiltersContext };

//and this is the provider of this context
// it provides the filter values to the OrdersFilters and OrdersTable components
export default function OrderFiltersProvider({ children }) {
    const [filters, setFilters] = useState({
        searchQuery: undefined,
        status: undefined,
        startDate: undefined,
        endDate: undefined,
        //sorting props .....
        sortBy: undefined,
        sortDirection: undefined,
        //pagination props .....
        limit: PAGINATION_MIN_LIMIT,
        currentPage: 1,
    });
    const updateFilters = useCallback((newFilters) => {
        setFilters(prev => ({
            ...prev,
            searchQuery: newFilters.searchQuery,
            status: newFilters.status,
            startDate: newFilters.startDate,
            endDate: newFilters.endDate
        }));
    }, []);

    const updateSortingProps = useCallback((newSortingProps) => {
        setFilters(prev => ({
            ...prev,
            sortBy: newSortingProps.sortBy,
            sortDirection: newSortingProps.sortDirection
        }));
    }, []);

    const setPaginationLimit = useCallback((limit) => {
        setFilters(prev => ({
            ...prev,
            limit,
            currentPage: 1
        }));
    }, []);

    const setPaginationCurrentPage = useCallback((page) => {
        setFilters(prev => ({
            ...prev,
            currentPage: page
        }));
    }, []);

    const value = useMemo(() => ({
        filters,
        updateFilters,
        updateSortingProps,
        setPaginationLimit,
        setPaginationCurrentPage
    }), [filters, updateFilters, updateSortingProps, setPaginationLimit, setPaginationCurrentPage]);

    return (
        <OrderFiltersContext.Provider value={value}>
            {children}
        </OrderFiltersContext.Provider>
    );
}

export function useOrderFiltersContext() {
    return useContext(OrderFiltersContext);
}
