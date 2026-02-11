import mongoose from 'mongoose';

const MONGODB_URI = 'mongodb+srv://modat_db_user:esuaBfNJfnwalp22@cluster0.pxizqba.mongodb.net/inventory-tracker?retryWrites=true&w=majority';

async function checkItems() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB');
    
    const items = await mongoose.connection.db.collection('items')
      .find()
      .sort({ createdAt: -1 })
      .limit(3)
      .toArray();
    
    console.log('\n=== Last 3 items in database ===\n');
    items.forEach((item, index) => {
      console.log(`Item ${index + 1}:`);
      console.log('  Name:', item.name);
      console.log('  Image field:', item.image);
      console.log('  Created:', item.createdAt);
      console.log('---');
    });
    
    await mongoose.disconnect();
  } catch (error) {
    console.error('Error:', error);
  }
}

checkItems();
