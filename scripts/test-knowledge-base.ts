/**
 * Test utility to verify the knowledge base setup
 */

import { searchKnowledgeBase, loadVectorStore } from '../lib/knowledgeBase.js';

async function testKnowledgeBase() {
  console.log('🧪 Testing Knowledge Base Setup\n');

  try {
    // Test 1: Check if vector store loads
    console.log('1. Testing vector store loading...');
    const vectorStore = await loadVectorStore();
    
    if (!vectorStore) {
      console.log('❌ Vector store not found. Please run: npm run process-kb');
      return;
    }
    console.log('✅ Vector store loaded successfully\n');

    // Test 2: Test search functionality
    console.log('2. Testing search functionality...');
    const testQueries = [
      'What are the different types of properties?',
      'How do I buy a house?',
      'What are current market trends?',
      'How does the mortgage process work?'
    ];

    for (const query of testQueries) {
      console.log(`\n🔍 Query: "${query}"`);
      const results = await searchKnowledgeBase(query, 3);
      
      if (results.length > 0) {
        console.log(`✅ Found ${results.length} relevant documents`);
        console.log(`📄 Preview: ${results[0].pageContent.substring(0, 100)}...`);
      } else {
        console.log('❌ No results found');
      }
    }

    console.log('\n✅ Knowledge base test completed successfully!');
    console.log('\nNext steps:');
    console.log('- Implement the chat interface in your Next.js app');
    console.log('- Create API routes for handling chat requests');
    console.log('- Integrate with DeepSeek for response generation');

  } catch (error) {
    console.error('❌ Test failed:', error);
    console.log('\nTroubleshooting:');
    console.log('1. Ensure DEEPSEEK_API_KEY is set in your .env.local file');
    console.log('2. Run: npm run process-kb');
    console.log('3. Check that data/real-estate-knowledge.md exists');
  }
}

// Handle unhandled promise rejections
process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
  process.exit(1);
});

testKnowledgeBase();
