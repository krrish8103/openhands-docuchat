




# DocuChatPro

DocuChatPro is an AI-powered document assistant that allows users to upload files, interact with them through chat, and receive verifiable, contextual answers.

## Features

- **Document Upload**: Support for PDF, Word (.doc/.docx), TXT, Markdown, ePub, and scanned documents
- **Multi-Document Upload**: Upload entire folders for cross-document queries
- **URL Upload**: Paste whitelisted URLs (e.g., Wikipedia) and parse content
- **Chat Interface**: Conversational UI with natural language queries, threaded conversations, and AI response bubbles
- **AI Features**: Summarize, extract, analyze, and rewrite text with multiple AI model options
- **Advanced Reading**: Threaded conversations, citations & references, and multiple response modes
- **Website Chat**: Chat with website content by pasting URLs

## Technology Stack

- **Frontend**: React + TailwindCSS
- **Backend**: FastAPI (Python)
- **AI Models**: Integration with deepseek-r1, chatgpt-4o-mini, gemini-1.5-flash
- **Database**: PostgreSQL
- **File Processing**: pdfminer.six, python-docx, pytesseract, BeautifulSoup4

## Project Structure

```
frontend/          # React frontend
  ├── src/
  │   ├── components/  # React components
  │   ├── pages/       # Page components
  │   ├── App.jsx      # Main application component
  │   └── main.jsx     # Entry point
  ├── public/         # Static files
  └── package.json    # Frontend dependencies

backend/           # FastAPI backend
  ├── app/          # Application code
  │   ├── routers/   # API routers
  │   ├── services/  # Business logic
  │   ├── models.py  # Database models
  │   ├── schemas.py # Pydantic schemas
  │   ├── crud.py    # CRUD operations
  │   └── main.py    # FastAPI app
  ├── alembic/      # Database migrations
  ├── tests/        # Unit tests
  ├── Dockerfile    # Docker configuration
  ├── pyproject.toml # Backend dependencies
  └── .env           # Environment variables
```

## Setup and Installation

### Backend

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Install dependencies:
   ```bash
   poetry install
   ```

3. Set up environment variables in `.env` file:
   ```
   DATABASE_URL=postgresql://user:password@localhost/docuchatpro
   OPENAI_API_KEY=your_openai_api_key_here
   DEEPSEEK_API_KEY=your_deepseek_api_key_here
   GEMINI_API_KEY=your_gemini_api_key_here
   ```

4. Run the application:
   ```bash
   uvicorn app.main:app --reload
   ```

5. For Docker deployment:
   ```bash
   docker build -t docuchatpro-backend .
   docker run -p 8000:8000 -v $(pwd)/.env:/app/.env docuchatpro-backend
   ```

### Frontend

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Run the development server:
   ```bash
   npm run dev
   ```

4. Build for production:
   ```bash
   npm run build
   ```

## API Endpoints

### Authentication
- `POST /users/` - Create a new user
- `GET /users/me` - Get current user information

### Documents
- `POST /documents/` - Create a new document
- `POST /documents/upload` - Upload a document file
- `GET /documents/` - Get all documents for current user
- `GET /documents/{document_id}` - Get a specific document

### Chat
- `POST /chat/conversations` - Create a new conversation
- `GET /chat/conversations` - Get all conversations for current user
- `GET /chat/conversations/{conversation_id}` - Get a specific conversation
- `POST /chat/conversations/{conversation_id}/messages` - Create a new message in a conversation

## Contributing

1. Fork the repository
2. Create a new branch (`git checkout -b feature/your-feature`)
3. Commit your changes (`git commit -am 'Add your feature'`)
4. Push to the branch (`git push origin feature/your-feature`)
5. Create a new Pull Request

## License

This project is licensed under the MIT License.

