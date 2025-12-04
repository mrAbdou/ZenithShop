'use server';
import { headers } from "next/headers";
const fetchData = async (body) => {
    try {
        const response = await fetch(process.env.NEXT_PUBLIC_GQL_URL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json",
                "Cookie": (await headers()).get("cookie")
            },
            body: JSON.stringify(body)
        });
        if (!response.ok) throw new Error("Failed to fetch data", {
            cause: response.error
        });
        const json = await response.json();
        return json?.data || null;
    } catch (error) {
        console.log(error);
        return null;
    }
}
const useOrders = async () => {
    const { orders } = await fetchData({
        query: `query {
                orders: {
                    id
                    status
                    createdAt
                    updatedAt
                }
                }`
    })
    return orders || [];
}

const useOrder = async (id) => {
    const { order } = await fetchData({
        query: `query {
                orders(id: "${id}") {
                    id
                    status
                    createdAt
                    updatedAt
                }
                }`,
        variables: {
            id
        }
    })
    return order || null;
}

const useOrdersCount = async () => {
    const { ordersCount } = await fetchData({
        query: `query {
                ordersCount
                }`
    })
    return ordersCount || 0;
}

const useActiveOrdersCount = async () => {
    const { activeOrdersCount } = await fetchData({
        query: `query {
                activeOrdersCount
                }`
    })
    return activeOrdersCount || 0;
}

export { useOrders, useOrder, useOrdersCount, useActiveOrdersCount };