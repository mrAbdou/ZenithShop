import userQueries from "@/app/graphql/queries/users";
import ordersQueries from "@/app/graphql/queries/orders";
import productsQueries from '@/app/graphql/queries/products';
import orderItemsQueries from '@/app/graphql/queries/orderItems';
import categoriesQueries from '@/app/graphql/queries/categories';
import usersMutations from '@/app/graphql/mutations/users';
import ordersMutations from '@/app/graphql/mutations/orders';
import productsMutations from '@/app/graphql/mutations/products';
const resolvers = {
    Query: {
        ...userQueries,
        ...ordersQueries,
        ...productsQueries,
        ...orderItemsQueries,
        ...categoriesQueries,
    },

    Mutation: {
        ...ordersMutations,
        ...productsMutations,
        ...usersMutations,
    },
}

export default resolvers;
