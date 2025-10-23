// Test script to show the updated create review payload with userId
const testPayload = {
  productId: "68ebb269e060e86d61eb67c7",
  rating: 4,
  title: "rohit upadhyay",
  comment: "test test test test",
  cons: [],
  images: [],
  pros: [],
  userId: "extracted-from-jwt-token" // This will be added automatically by the Redux slice
};

console.log('🧪 Updated Create Review Payload:');
console.log(JSON.stringify(testPayload, null, 2));

console.log('\n📡 API Endpoint:');
console.log('POST http://localhost:8083/api/product-reviews/product/68ebb269e060e86d61eb67c7/review');

console.log('\n🔐 Headers:');
console.log('Content-Type: application/json');
console.log('Authorization: Bearer <jwt-token>');

console.log('\n✅ What happens now:');
console.log('1. Frontend extracts userId from JWT token');
console.log('2. Frontend includes userId in request payload');
console.log('3. Backend validates userId matches authenticated user');
console.log('4. Backend creates review with proper user association');
console.log('5. Backend logs all user ID information for debugging');
