// prisma/seed.cjs
const dotenv = require("dotenv");
const bcrypt = require("bcryptjs");

dotenv.config();

async function main() {
    const { default: prisma } = await import('../lib/prisma.js');

    const saltRounds = 12;

    // ----- Products -----
    const productData = [
        { name: "Gaming Laptop", description: "High-performance gaming laptop with RTX 3080", price: 1500.00, qteInStock: 12 },
        { name: "Smartphone", description: "Latest Android smartphone with 128GB storage", price: 699.99, qteInStock: 25 },
        { name: "Wireless Headphones", description: "Noise-cancelling wireless headphones", price: 199.99, qteInStock: 20 },
        { name: "Smartwatch", description: "Fitness tracking smartwatch", price: 299.99, qteInStock: 15 },
        { name: "4K Monitor", description: "27-inch 4K UHD monitor", price: 399.99, qteInStock: 10 },
        { name: "Mechanical Keyboard", description: "RGB backlit mechanical keyboard", price: 129.99, qteInStock: 30 },
        { name: "Gaming Mouse", description: "Ergonomic gaming mouse with DPI adjustment", price: 79.99, qteInStock: 40 },
        { name: "External SSD", description: "1TB portable external SSD", price: 149.99, qteInStock: 18 },
        { name: "Bluetooth Speaker", description: "Portable waterproof Bluetooth speaker", price: 59.99, qteInStock: 50 },
        { name: "Webcam", description: "1080p HD webcam for video calls", price: 89.99, qteInStock: 22 },
        { name: "Tablet", description: "10-inch tablet with stylus support", price: 399.99, qteInStock: 14 },
        { name: "Router", description: "Dual-band WiFi router", price: 99.99, qteInStock: 16 },
        { name: "Printer", description: "All-in-one wireless printer", price: 249.99, qteInStock: 8 },
        { name: "Drone", description: "4K camera drone with GPS", price: 799.99, qteInStock: 6 },
        { name: "Fitness Tracker", description: "Heart rate and sleep monitoring fitness band", price: 49.99, qteInStock: 35 },
        { name: "E-reader", description: "6-inch e-reader with adjustable lighting", price: 149.99, qteInStock: 20 },
        { name: "Power Bank", description: "20,000mAh portable power bank", price: 39.99, qteInStock: 60 },
        { name: "Digital Camera", description: "DSLR camera with 18-55mm lens", price: 599.99, qteInStock: 9 },
        { name: "Laptop Stand", description: "Adjustable ergonomic laptop stand", price: 29.99, qteInStock: 45 },
        { name: "USB Hub", description: "7-port USB-C hub", price: 49.99, qteInStock: 28 },
    ];

    const products = await Promise.all(productData.map(p => prisma.product.create({ data: p })));

    //----- Users -----
    const userData = [
        { fullName: "Alice Johnson", email: "alice@example.com", password: "password123", emailVerified: new Date(), address: "123 Main St, Cityville", phoneNumber: "1111111111", role: "CUSTOMER" },
        { fullName: "Bob Smith", email: "bob@example.com", password: "password123", emailVerified: new Date(), address: "456 Elm St, Townsville", phoneNumber: "2222222222", role: "CUSTOMER" },
        { fullName: "Charlie Brown", email: "charlie@example.com", password: "password123", emailVerified: new Date(), address: "789 Oak Ave, Villagetown", phoneNumber: "3333333333", role: "CUSTOMER" },
        { fullName: "Diana Prince", email: "diana@example.com", password: "password123", emailVerified: new Date(), address: "101 Pine Rd, Metropolis", phoneNumber: "4444444444", role: "CUSTOMER" },
        { fullName: "Edward Norton", email: "edward@example.com", password: "password123", emailVerified: new Date(), address: "202 Maple Ln, Gotham", phoneNumber: "5555555555", role: "CUSTOMER" },
        { fullName: "Fiona Green", email: "fiona@example.com", password: "password123", emailVerified: new Date(), address: "303 Birch Ct, Smallville", phoneNumber: "6666666666", role: "CUSTOMER" },
        { fullName: "George White", email: "george@example.com", password: "password123", address: "404 Cedar Dr, Springfield", phoneNumber: "7777777777", role: "CUSTOMER" },
        { fullName: "Hannah Black", email: "hannah@example.com", password: "password123", address: "505 Spruce St, Riverside", phoneNumber: "8888888888", role: "CUSTOMER" },
        { fullName: "Ian Gray", email: "ian@example.com", password: "password123", address: "606 Willow Way, Hilldale", phoneNumber: "9999999999", role: "CUSTOMER" },
        { fullName: "Julia Violet", email: "julia@example.com", password: "password123", address: "707 Aspen Pl, Brookside", phoneNumber: "0000000000", role: "CUSTOMER" },
        { fullName: "Kevin Orange", email: "kevin@example.com", password: "password123", address: "808 Redwood Rd, Valleytown", phoneNumber: "1112223333", role: "CUSTOMER" },
        { fullName: "Laura Blue", email: "laura@example.com", password: "password123", address: "909 Cypress Ln, Mountainview", phoneNumber: "2223334444", role: "CUSTOMER" },
        { fullName: "Michael Red", email: "michael@example.com", password: "password123", emailVerified: new Date(), address: "1001 Sycamore St, Lakeside", phoneNumber: "3334445555", role: "ADMIN" },
        { fullName: "Natalie Yellow", email: "natalie@example.com", password: "password123", emailVerified: new Date(), address: "1101 Palm Ave, Desertcity", phoneNumber: "4445556666", role: "ADMIN" },
        { fullName: "Oliver Purple", email: "oliver@example.com", password: "password123", address: "1201 Holly Dr, Forestville", phoneNumber: "5556667777", role: "CUSTOMER" },
    ];

    const hashedPasswords = await Promise.all(userData.map(u => bcrypt.hash(u.password, saltRounds)));

    const users = await Promise.all(userData.map((u, i) =>
        prisma.user.create({
            data: {
                fullName: u.fullName,
                email: u.email,
                emailVerified: u.emailVerified,
                hashedPassword: hashedPasswords[i],
                address: u.address,
                phoneNumber: u.phoneNumber,
                role: u.role,
            },
        })
    ));

    //----- Orders -----
    const orderData = [
        {
            userId: users[0].id,
            status: "PENDING",
            items: [
                { productId: products[0].id, qte: 1 },
                { productId: products[2].id, qte: 2 },
            ]
        },
        {
            userId: users[1].id,
            status: "CONFIRMED",
            items: [
                { productId: products[1].id, qte: 1 },
                { productId: products[3].id, qte: 1 },
                { productId: products[4].id, qte: 1 },
            ]
        },
        {
            userId: users[2].id,
            status: "SHIPPED",
            items: [
                { productId: products[5].id, qte: 3 },
                { productId: products[6].id, qte: 1 },
            ]
        },
        {
            userId: users[3].id,
            status: "DELIVERED",
            items: [
                { productId: products[7].id, qte: 1 },
            ]
        },
        {
            userId: users[4].id,
            status: "CANCELLED",
            items: [
                { productId: products[8].id, qte: 2 },
                { productId: products[9].id, qte: 1 },
            ]
        },
        {
            userId: users[5].id,
            status: "PENDING",
            items: [
                { productId: products[10].id, qte: 1 },
            ]
        },
        {
            userId: users[6].id,
            status: "CONFIRMED",
            items: [
                { productId: products[11].id, qte: 1 },
                { productId: products[12].id, qte: 1 },
            ]
        },
        {
            userId: users[7].id,
            status: "SHIPPED",
            items: [
                { productId: products[13].id, qte: 1 },
                { productId: products[14].id, qte: 1 },
                { productId: products[15].id, qte: 2 },
            ]
        },
        {
            userId: users[8].id,
            status: "DELIVERED",
            items: [
                { productId: products[16].id, qte: 5 },
                { productId: products[17].id, qte: 1 },
            ]
        },
        {
            userId: users[9].id,
            status: "PENDING",
            items: [
                { productId: products[18].id, qte: 1 },
                { productId: products[19].id, qte: 3 },
                { productId: products[1].id, qte: 1 },
            ]
        },
        {
            userId: users[10].id,
            status: "CONFIRMED",
            items: [
                { productId: products[0].id, qte: 1 },
                { productId: products[2].id, qte: 1 },
                { productId: products[3].id, qte: 1 },
            ]
        },
        {
            userId: users[11].id,
            status: "SHIPPED",
            items: [
                { productId: products[4].id, qte: 1 },
                { productId: products[5].id, qte: 2 },
            ]
        },
        {
            userId: users[12].id,
            status: "DELIVERED",
            items: [
                { productId: products[6].id, qte: 1 },
                { productId: products[7].id, qte: 1 },
                { productId: products[8].id, qte: 1 },
            ]
        },
        {
            userId: users[13].id,
            status: "PENDING",
            items: [
                { productId: products[9].id, qte: 1 },
            ]
        },
        {
            userId: users[14].id,
            status: "CONFIRMED",
            items: [
                { productId: products[10].id, qte: 1 },
                { productId: products[11].id, qte: 1 },
            ]
        },
        {
            userId: users[0].id,
            status: "SHIPPED",
            items: [
                { productId: products[12].id, qte: 1 },
                { productId: products[13].id, qte: 1 },
            ]
        },
        {
            userId: users[1].id,
            status: "DELIVERED",
            items: [
                { productId: products[14].id, qte: 1 },
                { productId: products[15].id, qte: 2 },
            ]
        },
        {
            userId: users[3].id,
            status: "PENDING",
            items: [
                { productId: products[16].id, qte: 10 },
            ]
        },
        {
            userId: users[5].id,
            status: "CONFIRMED",
            items: [
                { productId: products[17].id, qte: 1 },
                { productId: products[18].id, qte: 1 },
            ]
        },
        {
            userId: users[7].id,
            status: "SHIPPED",
            items: [
                { productId: products[19].id, qte: 4 },
                { productId: products[0].id, qte: 1 },
            ]
        },
    ];

    const orders = await Promise.all(orderData.map(order => {
        const total = order.items.reduce((sum, item) => {
            const product = products.find(p => p.id === item.productId);
            return sum + (product.price * item.qte);
        }, 0);

        return prisma.order.create({
            data: {
                userId: order.userId,
                status: order.status,
                total,
                items: {
                    create: order.items,
                },
            },
        });
    }));

    console.log("✅ Database seeded successfully!");
}

main()
    .catch(e => console.error(e))
    .finally(async () => { await prisma.$disconnect(); });
