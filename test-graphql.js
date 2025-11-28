// Comprehensive GraphQL Testing Script
import fetch from 'node-fetch';

const API_URL = 'http://localhost:3000/api/graphql';

// Test logger
function logTest(testName, success, details = '') {
    const status = success ? '✅ PASS' : '❌ FAIL';
    console.log(`\n${status}: ${testName}`);
    if (details) console.log(`   Details: ${details}`);
}

async function query(query, variables = {}, description) {
    try {
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ query, variables })
        });
        const result = await response.json();
        return result;
    } catch (error) {
        console.error(`Query failed: ${description}`, error.message);
        return { errors: [error.message] };
    }
}

async function runTests() {
    console.log('🚀 Starting Comprehensive GraphQL Tests\n');

    // 1. BASIC CONNECTIVITY TESTS
    console.log('='.repeat(50));
    console.log('📡 BASIC CONNECTIVITY');
    console.log('='.repeat(50));

    // Test 1: Introspection query (basic GraphQL connectivity)
    const introspectionResult = await query(`
        query {
            __schema {
                queryType { name }
            }
        }
    `, {}, 'GraphQL Introspection');

    logTest(
        'GraphQL Introspection Query',
        !introspectionResult.errors && introspectionResult.data?.__schema?.queryType?.name,
        introspectionResult.errors ? JSON.stringify(introspectionResult.errors) : 'Schema accessible'
    );

    // Test 2: Invalid query test
    const invalidQuery = await query(`
        query {
            nonexistentField
        }
    `, {}, 'Invalid query (should fail gracefully)');

    logTest(
        'Invalid Query Error Handling',
        !!invalidQuery.errors,
        'Should return GraphQL errors for invalid queries'
    );

    // 2. QUERY TESTS
    console.log('\n' + '='.repeat(50));
    console.log('🔍 QUERY TESTS');
    console.log('='.repeat(50));

    // Test 3: Products query (most important)
    const productsQuery = await query(`
        query {
            products {
                id
                name
                price
                description
            }
        }
    `, {}, 'Products query');

    logTest(
        'Products Query',
        Array.isArray(productsQuery.data?.products),
        productsQuery.errors ? `Errors: ${JSON.stringify(productsQuery.errors)}` : `Returned ${productsQuery.data?.products?.length || 0} products`
    );

    // Test 4: Individual product query with invalid ID
    const invalidProduct = await query(`
        query($id: ID!) {
            product(id: $id) {
                id
                name
            }
        }
    `, { id: 99999 }, 'Product query with invalid ID');

    logTest(
        'Product Query - Invalid ID',
        invalidProduct.data?.product === null,
        'Should return null for non-existent product'
    );

    // Test 5: Product query with string ID (should fail)
    const stringIdProduct = await query(`
        query($id: ID!) {
            product(id: $id) {
                id
                name
            }
        }
    `, { id: "invalid" }, 'Product query with string ID');

    logTest(
        'Product Query - String ID',
        !!stringIdProduct.errors,
        'Should fail with invalid ID type (ID should be Int)'
    );

    // Test 6: Users query
    const usersQuery = await query(`
        query {
            users {
                id
                fullName
                email
            }
        }
    `, {}, 'Users query');

    logTest(
        'Users Query',
        Array.isArray(usersQuery.data?.users),
        usersQuery.errors ? `Errors: ${JSON.stringify(usersQuery.errors)}` : `Returned ${usersQuery.data?.users?.length || 0} users`
    );

    // Test 7: Orders query
    const ordersQuery = await query(`
        query {
            orders {
                id
                status
                total
            }
        }
    `, {}, 'Orders query');

    logTest(
        'Orders Query',
        Array.isArray(ordersQuery.data?.orders),
        ordersQuery.errors ? `Errors: ${JSON.stringify(ordersQuery.errors)}` : `Returned ${ordersQuery.data?.orders?.length || 0} orders`
    );

    // 3. MUTATION SECURITY TESTS
    console.log('\n' + '='.repeat(50));
    console.log('🔒 MUTATION TESTS');
    console.log('='.repeat(50));

    // Test 8: Add product mutation with bad data
    const badProductMutation = await query(`
        mutation($product: ProductInput!) {
            addNewProduct(newProduct: $product) {
                id
                name
            }
        }
    `, {
        product: {
            name: "",
            description: null,
            price: -100,
            qteInStock: "invalid"
        }
    }, 'Add product with invalid data');

    logTest(
        'Add Product - Invalid Data',
        !!badProductMutation.errors,
        'Database should reject invalid data (negative price, empty name, etc.)'
    );

    // Test 9: Register user with missing required fields
    const userWithMissingData = await query(`
        mutation($user: UserInput!) {
            registerUser(newUser: $user) {
                id
                fullName
            }
        }
    `, {
        user: {
            fullName: "", // Empty required field
            password: "123"
        }
    }, 'Register user with missing required fields');

    logTest(
        'Register User - Missing Required Fields',
        !!userWithMissingData.errors,
        'Should reject users with missing required fields'
    );

    // Test 10: Register user with duplicate email
    const duplicateUser = await query(`
        mutation($user: UserInput!) {
            registerUser(newUser: $user) {
                id
                email
            }
        }
    `, {
        user: {
            fullName: "Test User",
            email: "test@example.com",
            password: "password123",
            address: "Test Address",
            phoneNumber: "1234567890"
        }
    }, 'Register user with valid data');

    let testUserId = null;
    if (duplicateUser.data?.registerUser?.id) {
        testUserId = duplicateUser.data.registerUser.id;

        logTest('Register User - Valid Data', true, `Created user ID: ${testUserId}`);

        // Test duplicate email
        const duplicateUser2 = await query(`
            mutation($user: UserInput!) {
                registerUser(newUser: $user) {
                    id
                    email
                }
            }
        `, {
            user: {
                fullName: "Different User",
                email: "test@example.com", // Same email
                password: "password456",
                address: "Different Address",
                phoneNumber: "0987654321"
            }
        }, 'Register user with duplicate email');

        logTest(
            'Register User - Duplicate Email',
            !!duplicateUser2.errors,
            'Should reject duplicate email addresses'
        );

    } else {
        logTest('Register User - Valid Data', false, duplicateUser.errors ? JSON.stringify(duplicateUser.errors) : 'Failed to create user');
    }

    // 4. RELATIONSHIP TESTS
    console.log('\n' + '='.repeat(50));
    console.log('🔗 RELATIONSHIP TESTS');
    console.log('='.repeat(50));

    // Test 11: Product with order items relationship
    if (productsQuery.data?.products && productsQuery.data.products.length > 0) {
        const productId = productsQuery.data.products[0].id;

        const relatedProduct = await query(`
            query($id: ID!) {
                product(id: $id) {
                    id
                    name
                    orderItems {
                        id
                        qte
                        order {
                            id
                            status
                            user {
                                fullName
                            }
                        }
                    }
                }
            }
        `, { id: productId }, 'Product with relationship data');

        logTest(
            'Product Relationships',
            typeof relatedProduct.data?.product?.orderItems === 'object',
            'Should include nested relationship data (orderItems.order.user)'
        );
    } else {
        logTest('Product Relationships', false, 'No products available to test relationships');
    }

    // 5. SCALAR TYPE TESTS
    console.log('\n' + '='.repeat(50));
    console.log('🕐 SCALAR TYPE TESTS');
    console.log('='.repeat(50));

    // Test 12: DateTime scalar (should be implemented)
    const dateTimeTest = await query(`
        query {
            products {
                createdAt
                updatedAt
            }
        }
    `, {}, 'DateTime scalar fields');

    logTest(
        'DateTime Scalar Implementation',
        !dateTimeTest.errors,
        'DateTime scalar should serialize dates properly'
    );

    // 6. COMPLEX QUERY TESTS
    console.log('\n' + '='.repeat(50));
    console.log('🔄 COMPLEX QUERY TESTS');
    console.log('='.repeat(50));

    // Test 13: Deeply nested query (users -> orders -> items -> products)
    const deepQuery = await query(`
        query {
            users {
                id
                fullName
                orders {
                    id
                    status
                    items {
                        id
                        qte
                        product {
                            id
                            name
                            price
                        }
                    }
                }
            }
        }
    `, {}, 'Deep nested relationship query');

    logTest(
        'Deep Nested Query',
        !deepQuery.errors,
        'Should handle complex nested relationships without infinite loops'
    );

    // CLEANUP - Delete test data if created
    if (testUserId) {
        console.log('\n' + '='.repeat(50));
        console.log('🧹 CLEANUP');
        console.log('='.repeat(50));

        const cleanupResult = await query(`
            mutation($userId: ID!) {
                deleteUserProfile(userId: $userId)
            }
        `, { userId: testUserId }, 'Delete test user');

        logTest('Cleanup Test User', cleanupResult.data?.deleteUserProfile === true);
    }

    console.log('\n' + '='.repeat(80));
    console.log('📊 TEST SUMMARY');
    console.log('='.repeat(80));
    console.log('✅ All tests completed. Review results above.');
    console.log('🔍 Key issues to address:');
    console.log('   • Input validation in mutations');
    console.log('   • Missing error handling for edge cases');
    console.log('   • ID parameter parsing may fail');
    console.log('   • No authentication/authorization checks');
    console.log('='.repeat(80));
}

runTests().catch(error => {
    console.error('\n💥 Test Suite Failed:', error.message);
    process.exit(1);
});
