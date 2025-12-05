const typeDefs = `
#################################################
#            Defining DateTime Scalar           #
#################################################
scalar DateTime

#################################################
#                     User Type                 #
#################################################
type User {
    id: ID!
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
    id: ID!
    userId: ID!
    user: User!
    status: OrderStatus!
    total: Float!
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
    id: ID!
    name: String!
    description: String
    price: Float!
    qteInStock: Int!
    createdAt: DateTime!
    updatedAt: DateTime
    orderItems: [OrderItem!]!
}

#################################################
#                     OrderItem Type            #
#################################################
type OrderItem {
    id: ID!
    orderId: ID!
    order: Order!
    productId: ID!
    product: Product!
    qte: Int!
    createdAt: DateTime!
    updatedAt: DateTime
}

#################################################
#                     Mutation                  #
#################################################
type CompleteSignupResult {
    success: Boolean!
    user: User!
    order: Order!
}

type Mutation {
    # User Profile ###########################
    completeSignUp(phoneNumber: String!, address: String!, cart: [CartItemInput!]!): CompleteSignupResult!
    updateUserProfile(updatedUser: UpdateUserInput!): User!
    deleteUserProfile(userId: ID!): Boolean!
    
    # Product Management (Admin) #############
    addNewProduct(product: ProductInput!): Product!
    updateProduct(id: ID!, product: ProductInput!): Product!
    deleteProduct(productId: ID!): Boolean!
    
    # Order & Cart Management ################
    makeAnOrder(order: OrderInput!): Order!
    addProductToCart(productId: ID!, qte: Int!): OrderItem! # needs to me removed from the implementation in here, it's client side functionality
    removeProductFromCart(orderItemId: ID!): Boolean! # needs to me removed from the implementation in here, it's client side functionality
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
    price: Float
    qteInStock: Int
}

input ProductInput {
    name: String!
    description: String
    price: Float!
    qteInStock: Int!
}

input UpdateUserInput {
    name: String
    email: String
    password: String
    address: String
    phoneNumber: String
}

input UserInput {
    name: String!
    email: String!
    password: String!
    address: String!
    phoneNumber: String!
}

input OrderInput {
    items: [OrderItemInput!]!
}

input OrderItemInput {
    productId: ID!
    qte: Int!
}

# New input type for the cart items sent during signup
input CartItemInput {
    id: ID!          # product ID
    price: Float!    # price at checkout (client‑side copy)
    qte: Int!        # quantity
    name: String     # optional product name (client‑side only)
    description: String   # optional description
    qteInStock: Int   # optional stock info
}

#################################################
#                     Query                     #
#################################################
type Query {
    users: [User!]!
    user(id: ID!): User
    customersCount: Int!
    usersCount: Int!

    orders: [Order!]!
    myOrders: [Order!]!
    order(id: ID!): Order
    activeOrdersCount: Int!
    
    products(limit: Int!, offset: Int!): [Product!]!
    product(id: ID!): Product
    productsCount: Int!
    availableProductsCount: Int!
    productsInCart(cart: [ID!]!): [Product!]!
    
    orderItems: [OrderItem!]!
    orderItem(id: ID!): OrderItem
}

`;

export default typeDefs;
