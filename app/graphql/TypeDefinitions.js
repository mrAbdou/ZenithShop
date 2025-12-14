const typeDefs = `
#################################################
#            Defining Scalars                  #
#################################################
scalar DateTime
scalar Decimal

#################################################
#                     User Type                 #
#################################################
type User {
    id: String!
    name: String!
    email: String!
    # password removed for security reasons
    address: String!
    phoneNumber: String!
    role: Role!
    orders: [Order!]!
    createdAt: DateTime!
    updatedAt: DateTime
}

enum Role {
    CUSTOMER
    ADMIN
}

#################################################
#                     Order Type                #
#################################################
type Order {
    id: String!
    userId: String!
    user: User!
    status: OrderStatus!
    total: Decimal!
    createdAt: DateTime!
    updatedAt: DateTime
    items: [OrderItem!]!
}

enum OrderStatus {
    PENDING
    CONFIRMED
    SHIPPED
    DELIVERED
    CANCELLED
    RETURNED
}

#################################################
#                     Product Type              #
#################################################
type Product {
    id: String!
    name: String!
    description: String
    price: Decimal!
    qteInStock: Int!
    createdAt: DateTime!
    updatedAt: DateTime
    orderItems: [OrderItem!]!
}

#################################################
#                     OrderItem Type            #
#################################################
type OrderItem {
    id: String!
    orderId: String!
    order: Order!
    productId: String!
    product: Product!
    qte: Int!
    createdAt: DateTime!
    updatedAt: DateTime
}

#################################################
#                     Mutation                  #
#################################################

type Mutation {
    # User Profile ###########################
    deleteCustomerProfile(userId: String!): Boolean!
    completeSignUp(phoneNumber: String!, address: String!, role: Role!): User!

    # Product Management (Admin) #############
    addNewProduct(product: ProductInput!): Product!
    updateProduct(id: String!, product: ProductInput!): Product!
    deleteProduct(productId: String!): Boolean!

    # Order & Cart Management ################
    addOrder(items: [OrderItemInput!]!, total: Decimal!): Order!
    }

#################################################
#                     Inputs                    #
#################################################
input LoginInput {
    email: String!
    password: String!
}

input UpdateProductInput {
    name: String
    description: String
    price: Decimal
    qteInStock: Int
}

input ProductInput {
    name: String!
    description: String
    price: Decimal!
    qteInStock: Int!
}


input UserInput {
    name: String!
    email: String!
    password: String!
    address: String!
    phoneNumber: String!
}

input OrderInput {
    total: Decimal!
    items: [OrderItemInput!]!
}

input OrderItemInput {
    productId: String!
    qte: Int!
}

input CartItemInput {
    id: String!      # product String
    price: Decimal!  # price at checkout (client‑side copy)
    qte: Int!        # quantity
    name: String     # optional product name (client‑side only)
    description: String   # optional description
    qteInStock: Int  # optional stock info (was incomplete)
}

#################################################
#                     Query                     #
#################################################
type Query {
    users: [User!]!
    user(id: String): User
    customersCount: Int!
    usersCount: Int!
    orders(searchQuery: String, status: OrderStatus, startDate: DateTime, endDate: DateTime, sortBy: String, sortDirection: String): [Order!]!
    myOrders: [Order!]!
    order(id: String): Order
    activeOrdersCount: Int!
    
    products(limit: Int!, offset: Int!): [Product!]!
    product(id: String): Product
    productsCount: Int!
    availableProductsCount: Int!
    productsInCart(cart: [String!]!): [Product!]!
    
    orderItems: [OrderItem!]!
    orderItem(id: String!): OrderItem
}

`;

export default typeDefs;
