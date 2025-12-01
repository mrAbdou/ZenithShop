const useOrders = async () => {
    try {
        const response = await fetch(process.env.NEXT_PUBLIC_GQL_URL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json",
            },
            cache: "no-store",
            body: JSON.stringify({
                query: `query {
                orders: {
                    id
                    status
                    createdAt
                    updatedAt
                }
                }`
            })
        });
        if (!response.ok) {
            throw new Error("Failed to fetch orders");
        }
        const json = await response.json();
        return json?.data?.orders ?? [];
    } catch (error) {
        console.log(error);
        return [];
    }
}

const useOrder = async (id) => {
    try {
        const response = fetch(process.env.NEXT_PUBLIC_GQL_URL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json"
            },
            cache: "no-store",
            body: JSON.stringify({
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
        })
        if (!response.ok) {
            throw new Error("Failed to fetch order");
        }
        const json = await response.json();
        return json?.data?.order ?? null;
    } catch (error) {
        console.log(error);
        return null;
    }
}

const useOrdersCount = async () => {
    try {
        const response = await fetch(process.env.NEXT_PUBLIC_GQL_URL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json"
            },
            cache: "no-store",
            body: JSON.stringify({
                query: `query {
                ordersCount
                }`
            })
        })
        if (!response.ok) {
            throw new Error("Failed to fetch orders count");
        }
        const json = await response.json();
        return json?.data?.ordersCount ?? 0;
    } catch (error) {
        console.log(error);
        return 0;
    }
}

const useActiveOrdersCount = async () => {
    try {
        const response = await fetch(process.env.NEXT_PUBLIC_GQL_URL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json"
            },
            cache: "no-store",
            body: JSON.stringify({
                query: `query {
                activeOrdersCount
                }`
            })
        })
        if (!response.ok) {
            throw new Error("Failed to fetch active orders count");
        }
        const json = await response.json();
        return json?.data?.activeOrdersCount ?? 0;
    } catch (error) {
        console.log(error);
        return 0;
    }
}

export { useOrders, useOrder, useOrdersCount, useActiveOrdersCount };