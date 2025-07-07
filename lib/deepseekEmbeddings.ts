export class DeepSeekEmbeddings {
  private apiKey: string;
  private baseUrl: string;
  private model: string;

  constructor(apiKey: string, options?: { baseUrl?: string; model?: string }) {
    this.apiKey = apiKey;
    this.baseUrl = options?.baseUrl || 'https://api.deepseek.com/v1';
    this.model = options?.model || 'deepseek-embed';
  }

  async embedQuery(text: string): Promise<number[]> {
    try {
      const response = await fetch(`${this.baseUrl}/embeddings`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.apiKey}`
        },
        body: JSON.stringify({
          input: text,
          model: this.model
        })
      });

      if (!response.ok) {
        throw new Error(`DeepSeek API error: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      
      if (!data.data || !data.data[0] || !data.data[0].embedding) {
        throw new Error('Invalid response format from DeepSeek API');
      }

      return data.data[0].embedding;
    } catch (error) {
      console.error('Error in DeepSeek embedQuery:', error);
      throw error;
    }
  }

  async embedDocuments(texts: string[]): Promise<number[][]> {
    try {
      // Batch process to avoid rate limits
      const batchSize = 10;
      const embeddings: number[][] = [];
      
      for (let i = 0; i < texts.length; i += batchSize) {
        const batch = texts.slice(i, i + batchSize);
        console.log(`Processing embedding batch ${Math.floor(i / batchSize) + 1}/${Math.ceil(texts.length / batchSize)}`);
        
        const batchEmbeddings = await Promise.all(
          batch.map(text => this.embedQuery(text))
        );
        
        embeddings.push(...batchEmbeddings);
        
        // Add a small delay to respect rate limits
        if (i + batchSize < texts.length) {
          await new Promise(resolve => setTimeout(resolve, 100));
        }
      }
      
      return embeddings;
    } catch (error) {
      console.error('Error in DeepSeek embedDocuments:', error);
      throw error;
    }
  }
}
