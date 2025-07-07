#!/usr/bin/env node

/**
 * Knowledge Base Processing Script
 * 
 * This script processes the markdown knowledge base file and creates
 * a vector store for the RAG chatbot.
 * 
 * Usage:
 *   npm run process-kb
 *   npm run process-kb -- --file="custom-knowledge.md"
 *   npm run process-kb -- --chunk-size=1500 --overlap=300
 */

import { processKnowledgeBase } from '../lib/knowledgeBase.js';
import path from 'path';

// Parse command line arguments
const args = process.argv.slice(2);
const getArg = (name: string, defaultValue: string | number = '') => {
  const arg = args.find(arg => arg.startsWith(`--${name}=`));
  if (arg) {
    const value = arg.split('=')[1];
    return typeof defaultValue === 'number' ? parseInt(value) : value;
  }
  return defaultValue;
};

async function main() {
  console.log('🚀 Starting knowledge base processing...\n');

  // Configuration
  const fileName = getArg('file', 'real-estate-knowledge.md') as string;
  const chunkSize = getArg('chunk-size', 1000) as number;
  const chunkOverlap = getArg('overlap', 200) as number;
  const vectorStorePath = getArg('output', 'vectorstore') as string;

  const filePath = path.join(process.cwd(), 'data', fileName);

  console.log('Configuration:');
  console.log(`📁 File: ${filePath}`);
  console.log(`📏 Chunk size: ${chunkSize}`);
  console.log(`🔗 Chunk overlap: ${chunkOverlap}`);
  console.log(`💾 Output: ${vectorStorePath}\n`);

  try {
    const result = await processKnowledgeBase(filePath, {
      chunkSize,
      chunkOverlap,
      vectorStorePath
    });

    if (result.success) {
      console.log(`\n✅ Knowledge base processing completed successfully!`);
      console.log(`📊 Processed ${result.chunkCount} chunks`);
      console.log(`\nYou can now use the chatbot with the processed knowledge base.`);
    } else {
      console.error(`\n❌ Knowledge base processing failed: ${result.error}`);
      process.exit(1);
    }
  } catch (error) {
    console.error('\n❌ Unexpected error:', error);
    process.exit(1);
  }
}

// Handle unhandled promise rejections
process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
  process.exit(1);
});

main();
