const mongoose = require('mongoose');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '..', '.env') });

const migrateUsers = async () => {
    try {
        const mongoUri = process.env.DB_URL;
        
        if (!mongoUri) {
            console.error('❌ DB_URL is not defined in .env file');
            process.exit(1);
        }

        console.log('Connecting to MongoDB...');
        await mongoose.connect(mongoUri);
        console.log('✅ Connected to MongoDB successfully!');

        // Get direct access to the collection to bypass Mongoose schema
        const db = mongoose.connection.db;
        const usersCollection = db.collection('users');

        console.log('Starting migration...');
        
        // Remove isPhoneVerified field using direct MongoDB operation
        const result = await usersCollection.updateMany(
            {},
            { 
                $unset: { isPhoneVerified: "" }
            }
        );

        console.log(`✅ Migration complete: ${result.modifiedCount} users updated`);
        
        // Verify the changes directly from collection
        const users = await usersCollection.find({}).limit(1).toArray();
        if (users.length > 0) {
            console.log('\n📄 Sample user after migration:');
            console.log(JSON.stringify(users[0], null, 2));
            
            // Check if isPhoneVerified still exists
            if (users[0].hasOwnProperty('isPhoneVerified')) {
                console.log('\n⚠️  WARNING: isPhoneVerified field still exists!');
            } else {
                console.log('\n✅ isPhoneVerified field successfully removed!');
            }
        } else {
            console.log('\nℹ️  No users found in database');
        }
        
        await mongoose.connection.close();
        console.log('\n✅ Database connection closed');
        process.exit(0);
    } catch (error) {
        console.error('❌ Migration error:', error);
        if (mongoose.connection.readyState !== 0) {
            await mongoose.connection.close();
        }
        process.exit(1);
    }
};

migrateUsers();
