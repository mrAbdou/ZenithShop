import { PAGINATION_MIN_LIMIT } from "@/lib/constants";
import { createContext, useCallback, useContext, useMemo, useState } from "react";

const CategoryContext = createContext();
export function CategoryProvider({ children }) {
    const [filters, setFilters] = useState({
        //filtering props
        searchQuery: '',
        //Sorting props
        sortBy: '',
        sortDirection: '',
        //Pagination props
        limit: PAGINATION_MIN_LIMIT,
        currentPage: 1,
    });

    const setFilteringProps = useCallback((filteringProps) => {
        setFilters((prevFilters) => ({
            ...prevFilters,
            searchQuery: filteringProps.searchQuery ?? undefined,
            currentPage: 1 // Reset to first page when filters change
        }));
    }, []);

    const setSortingFilters = useCallback((sortingFilters) => {
        setFilters((prevFilters) => ({
            ...prevFilters,
            sortBy: sortingFilters.sortBy,
            sortDirection: sortingFilters.sortDirection,
            currentPage: 1 // Reset to first page when sorting changes
        }));
    }, []);

    const setPaginationLimit = useCallback((limit) => {
        setFilters((prevFilters) => ({
            ...prevFilters,
            limit: limit,
            currentPage: 1, // Reset to first page when limit changes
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
        <CategoryContext.Provider value={value}>
            {children}
        </CategoryContext.Provider>
    );
}

export const useCategoryContext = () => useContext(CategoryContext);