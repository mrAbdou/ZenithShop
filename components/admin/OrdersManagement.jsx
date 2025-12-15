'use client';
import OrdersFilters from "@/components/admin/OrdersFilters";
import OrdersTable from "@/components/OrdersTable";
import OrdersFiltersProvider from "@/context/OrdersFiltersContext";
export default function OrdersManagement({ orders }) {
    return (
        <OrdersFiltersProvider>
            <OrdersFilters />
            <OrdersTable initialData={orders} />
        </OrdersFiltersProvider>
    );
}
