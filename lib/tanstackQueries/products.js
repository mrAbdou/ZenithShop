// get informations of all products registered in the market
const useProducts = async () => {
    try {
        const productsData = await fetch(process.env.NEXT_PUBLIC_GQL_URL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json"
            },
            body: JSON.stringify({
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
        });
        if (!productsData.ok) throw new Error("Failed to fetch products", {
            cause: productsData.error
        });
        const json = await productsData.json();
        return json?.data?.products || [];
    } catch (error) {
        console.log(error);
        return [];
    }
}

//get the details of a product by id
const useProduct = async (id) => {
    try {
        const productData = await fetch(process.env.NEXT_PUBLIC_GQL_URL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json"
            },
            body: JSON.stringify({
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
        });
        if (!productData.ok) throw new Error("Failed to fetch product", {
            cause: productData.error
        });
        const json = await productData.json();
        return json?.data?.product || null;
    } catch (error) {
        console.log(error);
        return null;
    }
}

//count all products registered in the market even ones that are out of stock.
const useProductsCount = async () => {
    try {
        const productsCountData = await fetch(process.env.NEXT_PUBLIC_GQL_URL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json",
                //make sure that the cookie is sent to the server
            },
            body: JSON.stringify({
                query: `
                query GetProductsCount {
                    productsCount
                }
            `
            })
        });
        if (!productsCountData.ok) throw new Error("Failed to fetch products count", {
            cause: productsCountData.error
        });
        const json = await productsCountData.json();
        return json?.data?.productsCount || 0;
    } catch (error) {
        console.log(error);
        return 0;
    }
}


//count only products that are available in stock
const useAvailableProductsCount = async () => {
    try {
        // Get cookie header from the incoming request
        const cookieHeader = (await headers()).get("cookie");
        const response = await fetch(process.env.NEXT_PUBLIC_GQL_URL, {
            method: "POST",
            credentials: "include",
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json",
                ...(cookieHeader ? { Cookie: cookieHeader } : {}),
            },
            cache: "no-store",
            body: JSON.stringify({ query }),
        });

        if (!response.ok) {
            console.error(`GraphQL fetch failed with status ${response.status}`);
            return null;
        }
        const json = await response.json();
        if (json.errors) {
            console.error("GraphQL errors:", json.errors);
            return null;
        }
        return json.data;
    } catch (error) {
        console.error("GraphQL fetch error:", error);
        return null;
    }
}
export { useProducts, useProductsCount, useAvailableProductsCount, useProduct }
