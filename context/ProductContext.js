import { PAGINATION_MIN_LIMIT } from "@/lib/constants";
import { createContext, useContext, useState, useMemo, useCallback } from "react";

const ProductContext = createContext();

export default function ProductProvider({ children }) {
    const [filters, setFilters] = useState({
        // filtering props .... 
        searchQuery: '',
        stock: '',
        startDate: '',
        endDate: '',
        // sorting props ...
        sortBy: '',
        sortDirection: '',
        // pagination props ...
        limit: PAGINATION_MIN_LIMIT,
        currentPage: 1
    });

    const setFilteringProps = useCallback((filteringProps) => {
        setFilters((prevFilters) => ({
            ...prevFilters,
            searchQuery: filteringProps.searchQuery,
            stock: filteringProps.stock,
            startDate: filteringProps.startDate,
            endDate: filteringProps.endDate
        }));
    }, []);

    const setSortingFilters = useCallback((sortingFilters) => {
        setFilters((prevFilters) => ({
            ...prevFilters,
            sortBy: sortingFilters.sortBy,
            sortDirection: sortingFilters.sortDirection
        }));
    }, []);

    const setPaginationLimit = useCallback((limit) => {
        setFilters((prevFilters) => ({
            ...prevFilters,
            limit: limit,
            currentPage: 1,
        }));
    }, []);

    const setPaginationCurrentPage = useCallback((currentPage) => {
        setFilters((prevFilters) => ({
            ...prevFilters,
            currentPage: currentPage
        }));
    }, []);

    const value = useMemo(() => ({
        filters,
        setFilteringProps,
        setSortingFilters,
        setPaginationLimit,
        setPaginationCurrentPage
    }), [filters, setFilteringProps, setSortingFilters, setPaginationLimit, setPaginationCurrentPage]);

    return (
        <ProductContext.Provider value={value}>
            {children}
        </ProductContext.Provider>
    )
}

export const useProductContext = () => useContext(ProductContext);