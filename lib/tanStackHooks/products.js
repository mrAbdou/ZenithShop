// get informations of all products registered in the market
const fetchData = async (body) => {
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
}
const useProducts = async () => {
    try {
        const data = await fetchData({
            query: `
                query GetProducts {
                    products {
                        id
                        name
                        price
                    }
                }
            `
        })
        return data?.products || [];

    } catch (error) {
        console.log(error);
        return [];
    }
}

//get the details of a product by id
const useProduct = async (id) => {
    try {
        const data = await fetchData({
            query: `
                query GetProduct($id: ID!) {
                    product(id: $id) {
                        id
                        name
                        description
                        price
                    }
                }
            `,
            variables: {
                id
            }
        })
        return data?.product || null;
    } catch (error) {
        console.log(error);
        return null;
    }
}

//count all products registered in the market even ones that are out of stock.
const useProductsCount = async () => {
    try {
        const data = await fetchData({
            query: `
                query GetProductsCount {
                    productsCount
                }
            `
        })
        return data?.productsCount || 0;
    } catch (error) {
        console.log(error);
        return 0;
    }
}

//count only products that are available in stock
const useAvailableProductsCount = async () => {
    try {
        const data = await fetchData({
            query: `
                query GetAvailableProductsCount {
                    productsCount
                }
            `
        });
        return data?.productsCount || 0;
    } catch (error) {
        console.log(error);
        return 0;
    }
}

const useProductsInCart = async (cart) => {
    try {
        const data = await fetchData({
            query: `
                query GetProductsInCart($cart: [ID!]!) {
                    productsInCart(cart: $cart) {
                        id
                        name
                        price
                    }
                }
            `,
            variables: {
                cart
            }
        })
        return data?.productsInCart || [];
    } catch (error) {
        console.log(error);
        return [];
    }
}

export { useProducts, useProductsCount, useAvailableProductsCount, useProduct, useProductsInCart }
