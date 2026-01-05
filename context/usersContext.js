import { minLimit } from '@/lib/constants';
import { createContext, useCallback, useContext, useState, useMemo } from 'react';

const UserContext = createContext();

export default function UserProvider({ children }) {
    const [filters, setFilters] = useState({
        // filtering props ....
        searchQuery: undefined,
        role: undefined,
        startDate: undefined,
        endDate: undefined,
        // sorting props ...
        sortBy: undefined,
        sortDirection: undefined,
        // pagination props ...
        limit: minLimit,
        currentPage: 1
    });

    const setFilteringProps = useCallback((filteringProps) => {
        setFilters((prevFilters) => ({
            ...prevFilters,
            searchQuery: filteringProps.searchQuery,
            role: filteringProps.role,
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
        <UserContext.Provider value={value}>
            {children}
        </UserContext.Provider>
    )
}

export const useUserContext = () => useContext(UserContext);