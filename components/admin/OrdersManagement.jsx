'use client';
import OrdersFilters from "@/components/admin/OrdersFilters";
import OrdersTable from "@/components/admin/OrdersTable";
import OrderFiltersProvider from "@/context/OrdersFiltersContext";
import { I18nProvider } from "@/lib/i18n/context";

export default function OrdersManagement({ orders, dictionary, locale }) {
    console.log('OrdersManagement dictionary:', dictionary);
    console.log('OrdersManagement locale:', locale);
    return (
        <I18nProvider dictionary={dictionary} locale={locale}>
            <OrderFiltersProvider>
                <OrdersFilters />
                <OrdersTable initialData={orders} />
            </OrderFiltersProvider>
        </I18nProvider>
    );
}
