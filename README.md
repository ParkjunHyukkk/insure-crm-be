# Insure CRM Backend

NestJS-based CRM API using Supabase as the data store with JWT authentication.

## Features

- 🔐 **JWT Authentication** - Supabase Auth integration
- 👥 **User Management** - Registration, login, profile management
- 🏢 **Customer Management** - CRUD operations for insurance customers
- 📄 **Contract Management** - Insurance contract handling
- ⚙️ **User Settings** - Notification preferences and channel settings
- 🔒 **Protected Routes** - All business APIs require authentication
- 📝 **Input Validation** - Request validation with class-validator
- 🚨 **Error Handling** - Global exception filters
- 📊 **Structured Responses** - Consistent API response format

## API Endpoints

### Authentication

- `POST /auth/register` - User registration
- `POST /auth/login` - User login
- `POST /auth/logout` - User logout
- `GET /auth/profile` - Get user profile
- `PUT /auth/profile` - Update user profile
- `POST /auth/reset-password` - Password reset request

### User Settings

- `GET /user-settings` - Get user notification settings
- `PUT /user-settings` - Update user settings

### Customers (Protected)

- `GET /customers` - List customers
- `POST /customers` - Create customer
- `GET /customers/:id` - Get customer
- `PUT /customers/:id` - Update customer
- `DELETE /customers/:id` - Delete customer

### Contracts (Protected)

- `GET /contracts` - List contracts
- `POST /contracts` - Create contract
- `GET /contracts/:id` - Get contract
- `PATCH /contracts/:id` - Update contract
- `DELETE /contracts/:id` - Delete contract

## Development

### Local Development

Install dependencies and start the dev server:

```bash
npm install
npm run start:dev
```

### Docker Development

For frontend testing with Docker:

```bash
# Build and run with Docker Compose
docker-compose up -d

# Check logs
docker-compose logs -f insure-crm-api

# Stop services
docker-compose down
```

See `DOCKER_GUIDE.md` for detailed Docker setup instructions.

## Environment Variables

⚠️ **보안 주의**: 실제 API 키는 절대 Git 저장소에 올리지 마세요!

1. **환경변수 파일 설정**:

   ```bash
   # 프로젝트 루트에 .env 파일 생성
   touch .env
   ```

2. **`.env` 파일을 열어서 실제 값들로 수정**:

   ```env
   # Supabase Configuration
   SUPABASE_URL=https://your-actual-project.supabase.co
   SUPABASE_KEY=your_actual_supabase_anon_key_here

   # Optional: Frontend URL for CORS and redirects
   FRONTEND_URL=http://localhost:3000

   # Optional: Server Port
   PORT=3000
   ```

## Authentication Setup

1. **Supabase Setup**: Make sure your Supabase project has authentication enabled
2. **Database Tables**: The following tables should exist:

   - `auth.users` (automatically created by Supabase)
   - `public.customers`
   - `public.contracts`
   - `public.notifications`
   - `public.user_settings`

3. **User Settings**: When a user registers, default settings are automatically created in `user_settings` table

## Usage

1. **Register a new user**:

   ```bash
   curl -X POST http://localhost:3000/auth/register \
     -H "Content-Type: application/json" \
     -d '{"email": "user@example.com", "password": "password123", "name": "John Doe"}'
   ```

2. **Login**:

   ```bash
   curl -X POST http://localhost:3000/auth/login \
     -H "Content-Type: application/json" \
     -d '{"email": "user@example.com", "password": "password123"}'
   ```

3. **Use the access token** for protected endpoints:
   ```bash
   curl -X GET http://localhost:3000/customers \
     -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
   ```

## Security Features

- 🛡️ **JWT Token Validation** - All protected routes verify JWT tokens
- 🔐 **Password Encryption** - Supabase handles secure password storage
- 🚫 **Request Validation** - Input validation prevents malformed requests
- 🔒 **CORS Protection** - Configurable CORS for frontend integration
- 📝 **Audit Trail** - Comprehensive logging for security monitoring

## Database Schema

The application uses the following database structure:

- **auth.users** - Supabase managed user authentication
- **public.customers** - Insurance customers data
- **public.contracts** - Insurance contracts
- **public.notifications** - Customer notifications
- **public.user_settings** - User preferences and settings

See `api-documentation.txt` for detailed API specifications.
