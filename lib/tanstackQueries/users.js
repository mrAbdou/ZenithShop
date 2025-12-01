// get the informations of all users registered
const useUsers = async () => {
    try {
        const usersData = await fetch(process.env.NEXT_PUBLIC_GQL_URL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json"
            },
            body: JSON.stringify({
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
            })
        });
        if (!usersData.ok) throw new Error("Failed to fetch users", {
            cause: usersData.error
        });
        const json = await usersData.json();
        return json?.data?.users || [];
    } catch (error) {
        console.log(error);
        return [];
    }
}

//get the informations of a user by id
const useUser = async (id) => {
    try {
        const userData = await fetch(process.env.NEXT_PUBLIC_GQL_URL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json"
            },
            body: JSON.stringify({
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
            })
        });
        if (!userData.ok) throw new Error("Failed to fetch user", {
            cause: userData.error
        });
        const json = await userData.json();
        return json?.data?.user || null;
    } catch (error) {
        console.log(error);
        return null;
    }
}

//count the number of all users that has role customer
const useCustomersCount = async () => {
    try {
        const customersCountData = await fetch(process.env.NEXT_PUBLIC_GQL_URL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json"
            },
            body: JSON.stringify({
                query: `
                query GetCustomersCount {
                    customersCount
                }
            `
            })
        });
        if (!customersCountData.ok) throw new Error("Failed to fetch customers count", {
            cause: customersCountData.error
        });
        const json = await customersCountData.json();
        return json?.data?.customersCount || 0;
    } catch (error) {
        console.log(error);
        return 0;
    }
}

//count the number of all users including the customers and the sellers
const useUsersCount = async () => {
    try {
        const usersCountData = await fetch(process.env.NEXT_PUBLIC_GQL_URL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json"
            },
            body: JSON.stringify({
                query: `
                query GetUsersCount {
                    usersCount
                }
            `
            })
        });
        if (!usersCountData.ok) throw new Error("Failed to fetch users count", {
            cause: usersCountData.error
        });
        const json = await usersCountData.json();
        return json?.data?.usersCount || 0;
    } catch (error) {
        console.log(error);
        return 0;
    }
}

export { useUsers, useUser, useCustomersCount, useUsersCount }