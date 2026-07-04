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
        const productTemplates = [
            {
                name: 'Amoxicillin 500mg',
                description: 'Broad-spectrum penicillin antibiotic used to treat bacterial infections such as pneumonia, strep throat, and urinary tract infections.',
                manufacturer: 'GlaxoSmithKline Pharma',
                category: 'Antibiotics',
                dosageForm: 'Tablet',
                strength: '500mg',
                image: '/images/amoxicillin.png',
                unitPrice: 24.50,
                storageConditions: 'Store below 25°C in a dry place'
            },
            {
                name: 'Atorvastatin 20mg',
                description: 'Statin medication used to prevent cardiovascular disease in those at high risk and lower lipid levels.',
                manufacturer: 'Pfizer Inc.',
                category: 'Cardiovascular',
                dosageForm: 'Tablet',
                strength: '20mg',
                image: '/images/atorvastatin.png',
                unitPrice: 45.00,
                storageConditions: 'Store between 20°C and 25°C'
            },
            {
                name: 'Insulin Glargine 100 U/mL',
                description: 'Long-acting human insulin analog used to improve glycemic control in patients with type 1 and type 2 diabetes mellitus.',
                manufacturer: 'Sanofi Aventis',
                category: 'Endocrine',
                dosageForm: 'Injection',
                strength: '100 U/mL',
                image: '/images/insulin.png',
                unitPrice: 120.00,
                storageConditions: 'Store in refrigerator (2°C to 8°C). Do not freeze.'
            },
            {
                name: 'Metformin HCl 850mg',
                description: 'First-line medication for the treatment of type 2 diabetes, particularly in people who are overweight.',
                manufacturer: 'Bristol-Myers Squibb',
                category: 'Endocrine',
                dosageForm: 'Tablet',
                strength: '850mg',
                image: '/images/metformin.png',
                unitPrice: 15.80,
                storageConditions: 'Store below 30°C'
            },
            {
                name: 'Azithromycin 250mg',
                description: 'Macrolide antibiotic used for the treatment of a number of bacterial infections including middle ear infections, strep throat, and pneumonia.',
                manufacturer: 'Sandoz Pharma',
                category: 'Antibiotics',
                dosageForm: 'Tablet',
                strength: '250mg',
                image: '/images/azithromycin.png',
                unitPrice: 32.20,
                storageConditions: 'Store below 25°C'
            },
            {
                name: 'Ibuprofen 400mg',
                description: 'Nonsteroidal anti-inflammatory drug (NSAID) used for treating pain, fever, and inflammatory symptoms.',
                manufacturer: 'McNeil Consumer Healthcare',
                category: 'Analgesics',
                dosageForm: 'Capsule',
                strength: '400mg',
                image: '/images/ibuprofen.png',
                unitPrice: 8.50,
                storageConditions: 'Store in a dry place below 25°C'
            },
            {
                name: 'Loratadine 10mg',
                description: 'Second-generation antihistamine used to treat allergies, hay fever, and hives without causing drowsiness.',
                manufacturer: 'Bayer Healthcare',
                category: 'Antihistamines',
                dosageForm: 'Tablet',
                strength: '10mg',
                image: '/images/loratadine.png',
                unitPrice: 18.00,
                storageConditions: 'Store between 15°C and 25°C'
            },
            {
                name: 'Spikevax mRNA Vaccine',
                description: 'COVID-19 vaccine designed to provide protection against the SARS-CoV-2 virus.',
                manufacturer: 'Moderna Biotech',
                category: 'Vaccines',
                dosageForm: 'Injection',
                strength: '0.5 mL',
                image: '/images/vaccine.png',
                unitPrice: 95.00,
                storageConditions: 'Store frozen between -50°C and -15°C'
            }
        ];

        const products = [];
        for (let i = 0; i < 20; i++) { // 20 products
            const template = productTemplates[i % productTemplates.length];
            const randomSupplier = faker.helpers.arrayElement(suppliers);
            
            // Generate manufacturing date and future expiry date
            const manufacturingDate = faker.date.past({ years: 1 });
            const expiryDate = faker.date.future({ years: 2, refDate: manufacturingDate });

            products.push(new Product({
                name: template.name,
                description: template.description,
                manufacturer: template.manufacturer,
                supplier: randomSupplier._id,
                category: template.category,
                unitPrice: template.unitPrice,
                quantityInStock: faker.number.int({ min: 50, max: 1000 }),
                dosageForm: template.dosageForm,
                strength: template.strength,
                pharmaceuticalCode: faker.string.alphanumeric(12).toUpperCase(),
                image: template.image,
                batchNumber: 'LOT-' + faker.string.alphanumeric(8).toUpperCase(),
                manufacturingDate: manufacturingDate,
                expiryDate: expiryDate,
                storageConditions: template.storageConditions,
                requiresPrescription: template.category === 'Antibiotics' || template.category === 'Endocrine' || template.category === 'Vaccines'
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