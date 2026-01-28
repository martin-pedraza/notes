# 📝 Notes API

A minimalist API for generating personalized daily notes per device, with intelligent caching that reuses the same note throughout the day.

The application will be available at `https://notes-caki.onrender.com/`

## 📚 Endpoints

### [GET `/`](https://notes-caki.onrender.com/)
Home endpoint that displays this documentation rendered as HTML.

### [GET `/notes`](https://notes-caki.onrender.com/notes)
Gets the daily note for your device.

### [Swagger UI](https://notes-caki.onrender.com/docs)
Interactive interface to explore and test all endpoints.

### [Swagger JSON](https://notes-caki.onrender.com/api-json)
OpenAPI specification in JSON format.

## 🛠️ Technologies

| Technology | Usage |
|-----------|-------|
| **NestJS** | Robust and scalable backend framework |
| **Groq API** | AI-powered note generation (model: openai/gpt-oss-20b) |
| **TypeScript** | Static typing and improved DX |
| **Cookies** | Device identification (no database) |
| **Swagger/OpenAPI** | Automatic API documentation |