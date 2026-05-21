const mongoose = require('mongoose');
const { faker } = require('@faker-js/faker');
const config = require('../config');

// Import models
const User = require('../models/user.model');
const Product = require('../models/product.model');
const Supplier = require('../models/supplier.model');
const Order = require('../models/order.model');

// Password hashing utility (using the one already defined)
const { hashPassword } = require('../utils/password.utils');

const seedDB = async () => {
    try {
        await config.connectToDatabase();
        console.log('Connected to MongoDB for seeding.');

        // Clear existing data
        console.log('Clearing existing data...');
        await Promise.all([
            User.deleteMany({}),
            Product.deleteMany({}),
            Supplier.deleteMany({}),
            Order.deleteMany({}),
        ]);
        console.log('Existing data cleared.');

        // --- Create Users ---
        const users = [];
        const hashedPassword = await hashPassword('password123'); // Common password for all seeded users

        // Admin User
        users.push(new User({
            firstName: 'Admin',
            lastName: 'User',
            email: 'admin@example.com',
            password: hashedPassword,
            role: 'admin',
        }));

        // Supplier Users (for 10 suppliers)
        for (let i = 0; i < 10; i++) {
            users.push(new User({
                firstName: faker.person.firstName(),
                lastName: faker.person.lastName(),
                email: faker.internet.email().toLowerCase(),
                password: hashedPassword,
                role: 'supplier',
            }));
        }

        // Regular Users (remaining for 20 total users)
        for (let i = 0; i < 9; i++) { // 1 admin + 10 suppliers + 9 regular = 20 users
            users.push(new User({
                firstName: faker.person.firstName(),
                lastName: faker.person.lastName(),
                email: faker.internet.email().toLowerCase(),
                password: hashedPassword,
                role: 'user',
            }));
        }
        await User.insertMany(users);
        console.log(`Seeded ${users.length} users.`);

        // --- Create Suppliers ---
        const suppliers = [];
        // Link suppliers to supplier users
        const supplierUsers = users.filter(u => u.role === 'supplier');
        for (let i = 0; i < 10; i++) { // 10 suppliers
            suppliers.push(new Supplier({
                name: faker.company.name() + ' Pharma',
                contactPerson: supplierUsers[i].firstName + ' ' + supplierUsers[i].lastName,
                contactEmail: faker.internet.email().toLowerCase(), // Added contactEmail
                phone: faker.phone.number(),
                address: { // Structured address
                    street: faker.location.streetAddress(),
                    city: faker.location.city(),
                    state: faker.location.state(),
                    zipCode: faker.location.zipCode(),
                },
                licenseNumber: faker.string.alphanumeric(10).toUpperCase(),
                owner: supplierUsers[i]._id, // Link to a supplier user
            }));
        }
        await Supplier.insertMany(suppliers);
        console.log(`Seeded ${suppliers.length} suppliers.`);

        // --- Create Products ---
        const products = [];
        for (let i = 0; i < 20; i++) { // 20 products
            const randomSupplier = faker.helpers.arrayElement(suppliers);
            products.push(new Product({
                name: faker.commerce.productName(),
                description: faker.commerce.productDescription(),
                manufacturer: faker.company.name(),
                supplier: randomSupplier._id,
                category: faker.commerce.department(),
                unitPrice: faker.commerce.price({ min: 10, max: 200, dec: 2 }),
                quantityInStock: faker.number.int({ min: 50, max: 1000 }),
                dosageForm: faker.helpers.arrayElement(['Tablet', 'Capsule', 'Syrup', 'Injection']),
                strength: faker.number.int({ min: 1, max: 500 }) + 'mg',
                pharmaceuticalCode: faker.string.alphanumeric(12).toUpperCase(),
                image: faker.helpers.arrayElement([
                    'https://images.unsplash.com/photo-1587854692152-cbe660dbbb88?q=80&w=1000&auto=format&fit=crop', // Pills close up, warm
                    'https://images.unsplash.com/photo-1576091160550-2173dba999ef?q=80&w=1000&auto=format&fit=crop', // Lab equipment, cinematic
                    'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?q=80&w=1000&auto=format&fit=crop', // Medicine bottle, moody
                    'https://images.unsplash.com/photo-1631549916768-4119b2e5f926?q=80&w=1000&auto=format&fit=crop', // Modern pharmacy, high contrast
                    'https://images.unsplash.com/photo-1512069772995-ec65ed45afd6?q=80&w=1000&auto=format&fit=crop', // Scientific research
                ]),
            }));
        }
        await Product.insertMany(products);
        console.log(`Seeded ${products.length} products.`);

        // --- Create Orders ---
        const orders = [];
        const regularUsers = users.filter(u => u.role === 'user');
        const orderStatusOptions = ['pending', 'processing', 'shipped', 'delivered', 'cancelled']; // Lowercase enum values

        for (let i = 0; i < 20; i++) { // 20 orders
            const randomUser = faker.helpers.arrayElement(regularUsers);
            const randomSupplier = faker.helpers.arrayElement(suppliers); // Select a supplier for the order
            const randomProducts = faker.helpers.arrayElements(products, { min: 1, max: 5 }).map(p => ({
                product: p._id,
                quantity: faker.number.int({ min: 1, max: 10 }),
                // unitPrice from product model will be used by default if not specified here for subdocument
            }));
            const totalAmount = randomProducts.reduce((sum, item) => {
                const productInList = products.find(p => p._id.equals(item.product));
                return sum + item.quantity * productInList.unitPrice;
            }, 0);

            orders.push(new Order({
                user: randomUser._id,
                supplier: randomSupplier._id, // Added supplier ID
                items: randomProducts,
                totalAmount: totalAmount, // Changed from totalPrice
                shippingAddress: { // Structured address
                    street: faker.location.streetAddress(),
                    city: faker.location.city(),
                    state: faker.location.state(),
                    zipCode: faker.location.zipCode(),
                },
                status: faker.helpers.arrayElement(orderStatusOptions), // Lowercase status
            }));
        }
        await Order.insertMany(orders);
        console.log(`Seeded ${orders.length} orders.`);

        console.log('Database seeding complete!');
    } catch (error) {
        console.error('Database seeding failed:', error);
        process.exit(1);
    } finally {
        await mongoose.disconnect();
        console.log('Disconnected from MongoDB.');
    }
};

seedDB();