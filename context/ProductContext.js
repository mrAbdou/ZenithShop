import { createContext, useContext, useState } from "react";
import React from 'react';
const ProductContext = createContext();

export default function ProductProvider({ children }) {
    const [filters, setFilters] = useState({
        // filtering props .... 
        searchQuery: '',
        stock: null,
        startDate: '',
        endDate: '',
        // sorting props ...
        sortBy: null,
        sortDirection: null,
        // pagination props ...
        limit: 5,
        currentPage: 1
    });
    const getFilters = React.useCallback(() => filters, [filters]);
    const setFilteringProps = React.useCallback((filteringProps) => {
        setFilters((prevFilters) => ({
            ...prevFilters,
            searchQuery: filteringProps.searchQuery,
            stock: filteringProps.stock,
            startDate: filteringProps.startDate,
            endDate: filteringProps.endDate
        }));
    }, []);
    const setSortingFilters = React.useCallback((sortingFilters) => {
        setFilters((prevFilters) => ({
            ...prevFilters,
            sortBy: sortingFilters.sortBy,
            sortDirection: sortingFilters.sortDirection
        }));
    }, []);
    const setPaginationLimit = React.useCallback((limit) => {
        setFilters((prevFilters) => ({
            ...prevFilters,
            limit: limit
        }));
    }, []);
    const setPaginationCurrentPage = React.useCallback((currentPage) => {
        setFilters((prevFilters) => ({
            ...prevFilters,
            currentPage: currentPage
        }));
    }, []);
    return (
        <ProductContext.Provider value={{ getFilters, setFilteringProps, setSortingFilters, setPaginationLimit, setPaginationCurrentPage }}>
            {children}
        </ProductContext.Provider>
    )
}

export const useProductContext = () => useContext(ProductContext);