import fs from 'fs';
import path from 'path';
import { Document } from 'langchain/document';
import { RecursiveCharacterTextSplitter } from 'langchain/text_splitter';
import { HNSWLib } from '@langchain/community/vectorstores/hnswlib';
import { DeepSeekEmbeddings } from './deepseekEmbeddings';

export interface ProcessingOptions {
  chunkSize?: number;
  chunkOverlap?: number;
  vectorStorePath?: string;
  embedModel?: string;
}

export async function processKnowledgeBase(
  filePath: string, 
  options: ProcessingOptions = {}
): Promise<{ success: boolean; chunkCount: number; error?: string }> {
  try {
    const {
      chunkSize = 1000,
      chunkOverlap = 200,
      vectorStorePath = 'vectorstore',
      embedModel = 'deepseek-embed'
    } = options;

    // Validate file exists
    if (!fs.existsSync(filePath)) {
      throw new Error(`Knowledge base file not found: ${filePath}`);
    }

    // Validate API key
    if (!process.env.DEEPSEEK_API_KEY) {
      throw new Error('DEEPSEEK_API_KEY environment variable is required');
    }

    console.log(`📖 Reading knowledge base from: ${filePath}`);
    
    // Read the markdown file
    const text = fs.readFileSync(filePath, 'utf8');
    
    if (!text.trim()) {
      throw new Error('Knowledge base file is empty');
    }

    console.log(`📄 File size: ${text.length} characters`);
    
    // Split the text into chunks
    const textSplitter = new RecursiveCharacterTextSplitter({
      chunkSize,
      chunkOverlap,
    });
    
    const chunks = await textSplitter.splitText(text);
    console.log(`✂️  Split into ${chunks.length} chunks`);
    
    // Create documents with metadata
    const docs = chunks.map((chunk, index) => {
      return new Document({
        pageContent: chunk,
        metadata: { 
          source: filePath,
          chunkIndex: index,
          totalChunks: chunks.length,
          fileName: path.basename(filePath)
        }
      });
    });
    
    // Initialize the DeepSeek embeddings
    console.log('🔗 Initializing DeepSeek embeddings...');
    const embeddings = new DeepSeekEmbeddings(process.env.DEEPSEEK_API_KEY, {
      model: embedModel
    });
    
    // Create and save the vector store
    console.log('🗄️  Creating vector store...');
    const vectorStore = await HNSWLib.fromDocuments(docs, embeddings);
    
    // Ensure the data directory exists
    const fullVectorStorePath = path.join(process.cwd(), 'data', vectorStorePath);
    const vectorStoreDir = path.dirname(fullVectorStorePath);
    if (!fs.existsSync(vectorStoreDir)) {
      fs.mkdirSync(vectorStoreDir, { recursive: true });
    }
    
    await vectorStore.save(fullVectorStorePath);
    
    console.log(`✅ Successfully processed ${chunks.length} chunks from knowledge base`);
    console.log(`💾 Vector store saved to: ${fullVectorStorePath}`);
    
    return { success: true, chunkCount: chunks.length };
    
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    console.error('❌ Error processing knowledge base:', errorMessage);
    return { success: false, chunkCount: 0, error: errorMessage };
  }
}

export async function loadVectorStore(
  vectorStorePath: string = 'vectorstore'
): Promise<HNSWLib | null> {
  try {
    if (!process.env.DEEPSEEK_API_KEY) {
      throw new Error('DEEPSEEK_API_KEY environment variable is required');
    }

    const embeddings = new DeepSeekEmbeddings(process.env.DEEPSEEK_API_KEY);
    const fullVectorStorePath = path.join(process.cwd(), 'data', vectorStorePath);
    
    if (!fs.existsSync(`${fullVectorStorePath}.index`)) {
      console.warn(`Vector store not found at: ${fullVectorStorePath}`);
      return null;
    }
    
    const vectorStore = await HNSWLib.load(fullVectorStorePath, embeddings);
    console.log('✅ Vector store loaded successfully');
    return vectorStore;
    
  } catch (error) {
    console.error('❌ Error loading vector store:', error);
    return null;
  }
}

export async function searchKnowledgeBase(
  query: string, 
  k: number = 5,
  vectorStorePath: string = 'vectorstore'
): Promise<Document[]> {
  try {
    const vectorStore = await loadVectorStore(vectorStorePath);
    
    if (!vectorStore) {
      throw new Error('Vector store not available. Please process the knowledge base first.');
    }
    
    const results = await vectorStore.similaritySearch(query, k);
    console.log(`🔍 Found ${results.length} relevant documents for query: "${query}"`);
    
    return results;
    
  } catch (error) {
    console.error('❌ Error searching knowledge base:', error);
    return [];
  }
}
