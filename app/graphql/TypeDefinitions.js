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
    fullName: String!
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
type Mutation {
    # Auth ###################################
    registerUser(newUser: UserInput!): User!
    #loginUser(loginUser: LoginInput!): User! # better-auth package handles it
    #logoutUser: Boolean! # better-auth package handles it

    # User Profile ###########################
    updateUserProfile(updatedUser: UpdateUserInput!): User!
    deleteUserProfile(userId: ID!): Boolean!
    
    # Product Management (Admin) #############
    addNewProduct(newProduct: ProductInput!): Product!
    updateProduct(id: ID!, updatedProduct: UpdateProductInput!): Product!
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
    description: String!
    price: Float!
    qteInStock: Int!
}

input UpdateUserInput {
    fullName: String
    email: String
    password: String
    address: String
    phoneNumber: String
}

input UserInput {
    fullName: String!
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

#################################################
#                     Query                     #
#################################################
type Query {
    users: [User!]!
    user(id: ID!): User
    orders: [Order!]!
    myOrders: [Order!]!
    order(id: ID!): Order
    products: [Product]
    product(id: ID!): Product
    orderItems: [OrderItem!]!
    orderItem(id: ID!): OrderItem
}

`;

export default typeDefs;
