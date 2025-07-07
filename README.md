# Real Estate Chatbot

A RAG (Retrieval-Augmented Generation) chatbot powered by Next.js and DeepSeek AI, designed to answer real estate questions using a comprehensive knowledge base.

## Features

- 🏠 **Real Estate Knowledge Base**: Comprehensive information about buying, selling, and investing in real estate
- 🤖 **AI-Powered Responses**: Uses DeepSeek AI for intelligent, contextual answers
- 🔍 **Vector Search**: Efficient similarity search using HNSWLib for relevant document retrieval
- 📱 **Modern UI**: Built with Next.js, React, and Tailwind CSS
- ⚡ **Fast Performance**: Optimized with Next.js 15 and Turbopack

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn
- DeepSeek API key

### Installation

1. Clone the repository and install dependencies:

```bash
npm install
```

2. Set up environment variables:

```bash
cp .env.example .env.local
```

Edit `.env.local` and add your DeepSeek API key:

```env
DEEPSEEK_API_KEY=your_deepseek_api_key_here
```

3. Process the knowledge base to create vector embeddings:

```bash
npm run process-kb
```

This will:
- Read the markdown knowledge base from `data/real-estate-knowledge.md`
- Split it into chunks
- Generate embeddings using DeepSeek
- Save the vector store for fast retrieval

4. Start the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the chatbot in action.

## Knowledge Base

The chatbot uses a markdown file (`data/real-estate-knowledge.md`) as its knowledge source. This file contains comprehensive information about:

- Property types (residential, commercial)
- Market trends and conditions
- Buying and selling processes
- Investment strategies
- Financing options
- Legal considerations
- Technology tools

### Updating the Knowledge Base

To update the knowledge base:

1. Edit `data/real-estate-knowledge.md`
2. Run the processing script again:

```bash
npm run process-kb
```

### Custom Knowledge Base

To use a custom knowledge base file:

```bash
npm run process-kb -- --file="your-custom-knowledge.md"
```

## Project Structure

```
realestate-chatbot/
├── app/                    # Next.js app directory
├── lib/                    # Utility functions
│   ├── deepseekEmbeddings.ts   # DeepSeek embeddings implementation
│   └── knowledgeBase.ts        # Knowledge base processing
├── data/                   # Knowledge base and vector store
│   ├── real-estate-knowledge.md
│   └── vectorstore/        # Generated vector embeddings
├── scripts/                # Utility scripts
│   └── process-knowledge-base.ts
└── README.md
```

## API Integration

### DeepSeek Configuration

The chatbot uses DeepSeek for:
- **Embeddings**: Converting text to vector representations
- **Chat Completion**: Generating responses based on retrieved context

Configure the DeepSeek integration in your environment:

```env
DEEPSEEK_API_KEY=your_api_key
DEEPSEEK_API_BASE_URL=https://api.deepseek.com/v1  # Optional
DEEPSEEK_EMBED_MODEL=deepseek-embed                # Optional
```

## Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Connect your repository to Vercel
3. Add environment variables in Vercel dashboard
4. Deploy

### Other Platforms

For other platforms, ensure you:
1. Install dependencies
2. Process the knowledge base
3. Set environment variables
4. Build the application: `npm run build`
5. Start the server: `npm start`

## Development

### Adding New Features

1. **Chat Interface**: Implement in `app/page.tsx`
2. **API Routes**: Add in `app/api/` directory
3. **Vector Search**: Extend `lib/knowledgeBase.ts`
4. **UI Components**: Create in `components/` directory

### Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run process-kb` - Process knowledge base
- `npm run lint` - Run ESLint

## Learn More

- [Next.js Documentation](https://nextjs.org/docs)
- [LangChain Documentation](https://docs.langchain.com/)
- [DeepSeek API](https://platform.deepseek.com/)
- [Tailwind CSS](https://tailwindcss.com/)

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

MIT License - see LICENSE file for details.
