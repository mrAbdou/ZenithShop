'use server';
import { headers } from "next/headers";
import { LIMIT } from "./constants";
const fetchData = async (body) => {
    try {
        const response = await fetch(process.env.NEXT_PUBLIC_GQL_URL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json",
                "Cookie": (await headers()).get("cookie")
            },
            cache: "no-store",
            body: JSON.stringify(body)
        });
        if (!response.ok) throw new Error("Failed to fetch data", {
            cause: response.errors
        });
        const json = await response.json();
        return json?.data || null;
    } catch (error) {
        console.log(error);
        return null;
    }
}

const useAddProduct = async (data) => {
    const response = await fetch(process.env.NEXT_PUBLIC_GQL_URL, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Accept": "application/json",
            "Cookie": (await headers()).get("cookie")
        },
        cache: "no-store",
        body: JSON.stringify({
            query: `mutation addProduct($newProduct: ProductInput!){
                addNewProduct(product: $newProduct){
                    id
                    name
                    description
                    price
                    qteInStock
                }
            }`,
            variables: {
                newProduct: data,
            },
        })
    });
    if (!response.ok) throw new Error("Failed to add product", {
        cause: response.error
    });
    const json = await response.json();
    return json?.data?.addNewProduct || null;
}

const useProducts = async (limit = LIMIT, offset = 0) => {
    const { products } = await fetchData({
        query: `
                query GetProducts($limit: Int!, $offset: Int!) {
                    products(limit: $limit, offset: $offset) {
                        id
                        name
                        description
                        qteInStock
                        price
                    }
                }
            `,
        variables: {
            limit,
            offset
        }
    })
    return products || [];
}

//get the details of a product by id
const useProduct = async (id) => {
    const { product } = await fetchData({
        query: `
                query GetProduct($id: ID!) {
                    product(id: $id) {
                        id
                        name
                        description
                        price
                        qteInStock
                    }
                }
            `,
        variables: {
            id
        }
    })
    return product || null;
}

//count all products registered in the market even ones that are out of stock.
const useProductsCount = async () => {
    const { productsCount } = await fetchData({
        query: `
                query GetProductsCount {
                    productsCount
                }
            `
    })
    return productsCount || 0;
}

//count only products that are available in stock
const useAvailableProductsCount = async () => {
    const { availableProductsCount } = await fetchData({
        query: `
                query GetAvailableProductsCount {
                    availableProductsCount
                }
            `
    });
    return availableProductsCount || 0;
}

const useProductsInCart = async (cart) => {
    const { productsInCart } = await fetchData({
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
    return productsInCart || [];
}

export { useProducts, useProductsCount, useAvailableProductsCount, useProduct, useProductsInCart, useAddProduct, }
