'use client';
import OrdersFilters from "@/components/admin/OrdersFilters";
import OrdersTable from "@/components/admin/OrdersTable";
import OrderFiltersProvider from "@/context/OrdersFiltersContext";
export default function OrdersManagement({ orders }) {
    return (
        <OrderFiltersProvider>
            <OrdersFilters />
            <OrdersTable initialData={orders} />
        </OrderFiltersProvider>
    );
}
