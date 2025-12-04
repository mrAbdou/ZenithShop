"use server";
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
const useUsers = async () => {
    const { users } = await fetchData({
        query: `
                query GetUsers {
                    users {
                        id
                        name
                        email
                        role
                    }
                }
            `
    });
    return users || [];

}

//get the informations of a user by id
const useUser = async (id) => {
    const { user } = await fetchData({
        query: `
                query GetUser($id: ID!) {
                    user(id: $id) {
                        id
                        name
                        email
                        role
                    }
                }`,
        variables: {
            id
        }
    });
    return user || null;
}

//count the number of all users that has role customer
const useCustomersCount = async () => {
    const { customersCount } = await fetchData({
        query: `
                query GetCustomersCount {
                    customersCount
                }
            `
    });
    return customersCount || 0;
}

//count the number of all users including the customers and the sellers
const useUsersCount = async () => {
    const { usersCount } = await fetchData({
        query: `
                query GetUsersCount {
                    usersCount
                }
            `
    });
    return usersCount || 0;
}

export { useUsers, useUser, useCustomersCount, useUsersCount }