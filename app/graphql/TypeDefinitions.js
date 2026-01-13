const typeDefs = `
#################################################
#            Defining Scalars                  #
#################################################
scalar DateTime
scalar Decimal
scalar Upload

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
    image: String
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
type Category {
    id: String!
    name: String!
    products: [Product!]!
    createdAt: DateTime!
    updatedAt: DateTime
}

type Product {
    id: String!
    name: String!
    description: String
    price: Float!
    images: [String!]!     # Array of product image URLs - first image is primary
    qteInStock: Int!
    categoryId: String!
    category: Category!
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
    updateCustomerProfile(id: String, name: String, address: String, phoneNumber: String): User!
    updateUserImage(imageUrl: String!): User!
    deleteCustomerProfile(userId: String!): User!

    # Product Management (Admin) #############
    addNewProduct(product: ProductInput!, images: [Upload!]!): Product!
    updateProduct(id: String!, product: UpdateProductInput!, existingImagesToKeep: [Upload!], newImagesToUpload: [Upload!]): Product!
    deleteProduct(id: String!): Product!

    # Order & Cart Management ################
    addOrder(items: [OrderItemInput!]!, total: Decimal!): Order!
    updateOrder(id: String!, status: OrderStatus!): Order!
    deleteOrder(id: String!): Order!
    cancelOrder(id: String!): Order!

    # Category Management (Admin) ############
    createCategory(name: String!): Category!
    updateCategory(id: String!, name: String!): Category!
    deleteCategory(id: String!): Category!
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
    categoryId: String
}

input ProductInput {
    name: String!
    description: String
    price: Float!
    qteInStock: Int!
    categoryId: String!
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

input OrderInput {
    status: OrderStatus!
}

#################################################
#                     Query                     #
#################################################
type Query {
    users(searchQuery: String, role: Role, startDate: DateTime, endDate: DateTime, sortBy: String, sortDirection: String, currentPage: Int!, limit: Int!): [User!]!
    user(id: String): User
    customersCount: Int!
    usersCount: Int!
    filteredUsersCount(searchQuery: String, role: Role, startDate: DateTime, endDate: DateTime): Int!
    
    orders(searchQuery: String, status: OrderStatus, startDate: DateTime, endDate: DateTime, sortBy: String, sortDirection: String, currentPage: Int, limit: Int): [Order!]!
    myOrders: [Order!]!
    order(id: String!): Order
    activeOrdersCount: Int!
    ordersCount: Int!
    filteredOrdersCount(searchQuery: String, status: OrderStatus, startDate: DateTime, endDate: DateTime): Int!

    paginatedProducts(searchQuery: String, stock: String, startDate: DateTime, endDate: DateTime,categoryId: String, sortBy: String, sortDirection: String, limit: Int!, currentPage: Int!): [Product!]!
    infiniteProducts(limit: Int!, offset: Int!, searchQuery: String, stock: String, minPrice: Float, maxPrice: Float, categoryId: String, sortBy: String, sortDirection: String): [Product!]!
    product(id: String!): Product
    productsCount: Int!
    availableProductsCount: Int!
    filteredProductsCount(searchQuery: String, stock: String, startDate: DateTime, endDate: DateTime, categoryId: String): Int!
    
    categories: [Category!]!
    category(id: String!): Category!
    featuredCategories(head: Int!): [Category!]!
    featuredProducts(head: Int!): [Product!]!
    countFilteredCategories(searchQuery: String!): Int!
    orderItems(orderId: String!): [OrderItem!]!
    orderItem(id: String!): OrderItem
}

`;

export default typeDefs;
