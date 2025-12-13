'use client';
import OrdersFiltersProvider from "@/context/OrdersFiltersContext";
import OrdersFilters from "@/components/OrdersFilters";
import OrdersTable from "@/components/OrdersTable";
export default function OrdersManagement({ orders }) {
    return (
        <OrdersFiltersProvider>
            <OrdersFilters />
            <OrdersTable initialData={orders} />
        </OrdersFiltersProvider>
    );
}
