# 📝 Notes API

A minimalist API for generating personalized daily notes per device, with intelligent caching that reuses the same note throughout the day.

The application will be available at `http://localhost:3000`

## 📚 Endpoints

### [GET `/`](http://localhost:3000/)
Home endpoint that displays this documentation rendered as HTML.

### [GET `/notes`](http://localhost:3000/notes)
Gets the daily note for your device.

### [Swagger UI](http://localhost:3000/docs)
Interactive interface to explore and test all endpoints.

### [Swagger JSON](http://localhost:3000/api-json)
OpenAPI specification in JSON format.

## 🛠️ Technologies

| Technology | Usage |
|-----------|-------|
| **NestJS** | Robust and scalable backend framework |
| **Groq API** | AI-powered note generation (model: openai/gpt-oss-20b) |
| **TypeScript** | Static typing and improved DX |
| **Cookies** | Device identification (no database) |
| **Swagger/OpenAPI** | Automatic API documentation |