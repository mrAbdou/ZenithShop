import { createContext, useContext, useState } from "react";

const ProductContext = createContext();

export default function ProductProvider({ children }) {
    const [filters, setFilters] = useState({
        // filtering props .... 
        searchQuery: '',
        stock: null,
        startDate: null,
        endDate: null,
        // sorting props ...
        sortBy: null,
        sortDirection: null,
        // pagination props ...
        limit: 5,
        currentPage: 1
    });
    const getFilters = () => filters;
    const setFilteringProps = (filteringProps) => {
        setFilters((prevFilters) => ({
            ...prevFilters,
            searchQuery: filteringProps.searchQuery,
            stock: filteringProps.stock,
            startDate: filteringProps.startDate,
            endDate: filteringProps.endDate
        }));
    }
    const setSortingFilters = (sortingFilters) => {
        setFilters((prevFilters) => ({
            ...prevFilters,
            sortBy: sortingFilters.sortBy,
            sortDirection: sortingFilters.sortDirection
        }));
    }
    const setPaginationLimit = (limit) => {
        setFilters((prevFilters) => ({
            ...prevFilters,
            limit: limit
        }));
    }
    const setPaginationCurrentPage = (currentPage) => {
        setFilters((prevFilters) => ({
            ...prevFilters,
            currentPage: currentPage
        }));
    }
    return (
        <ProductContext.Provider value={{ getFilters, setFilteringProps, setSortingFilters, setPaginationLimit, setPaginationCurrentPage }}>
            {children}
        </ProductContext.Provider>
    )
}

export const useProductContext = () => useContext(ProductContext);