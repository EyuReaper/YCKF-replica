# YCKF Backend

The backend API for the Young Cyber Knights Foundation (YCKF) platform, built with Express.js, TypeScript, MongoDB, and Sanity CMS integration. This API powers authentication, course management, donation-based enrollments, progress tracking, and payments.

## 📁 Project Structure

yckf-backend/
├── src/
│   ├── config/          # App settings – Centralizes DB/CORS config for startup
│   │   ├── database.ts  # MongoDB connection with error handling
│   │   └── cors.ts      # CORS middleware for frontend origins
│   ├── controllers/     # Route logic – Separates business logic from routes
│   │   ├── paymentController.ts  # Processes donations via gateways (Stripe/Paystack)
│   │   └── enrollmentController.ts  # Manages enrollment creation/checks post-payment
│   ├── lib/             # Libraries – Reusable utils for auth, Sanity, audit
│   │   ├── auth.ts      # JWT/bcrypt hashing and role middleware
│   │   ├── sanity.client.ts    # Sanity CMS client for content queries
│   │   ├── audit.ts     # Logs actions to Sanity auditLog type
│   │   └── exchangeRate.ts  # Fetches/caches USD-GHS rates for conversions
│   ├── middleware/      # Guards – Auth/validation for routes
│   │   ├── authMiddleware.ts  # JWT verification and role checks
│   │   ├── validationMiddleware.ts  # Joi schemas for request body/query
│   │   └── rateLimit.js # Express rate limiting (IP-based, e.g., 100 reqs/15min)
│   ├── models/          # Schemas – Mongoose models for MongoDB persistence
│   │   ├── Enrollment.ts  # Tracks user-course enrollments (amount, status)
│   │   ├── CourseProgress.ts  # Stores module/lesson progress and time spent
│   │   ├── PaymentLog.ts  # Audits payments (transactionId, gateway response)
│   │   └── auditLog.ts  # Extended audit logs (now includes bot fields: channel, query, response, matchedFAQId)
│   ├── routes/          # Routing – Express routers for API endpoints
│   │   ├── auth.ts      # User registration/login/reset (Zod validation)
│   │   ├── admin.ts     # Admin analytics (role-protected; now includes /bot-stats for queries/FAQs)
│   │   ├── certificates.ts  # Generate/verify certificates (PDF via pdfkit)
│   │   ├── courses.ts   # CRUD for premium courses (Sanity sync)
│   │   ├── payments.ts  # Donate/webhook handling (gateway integration)
│   │   ├── enrollments.ts  # Create/check enrollments (post-payment)
│   │   ├── progress.ts  # Update/query course progress (user-scoped)
│   │   └── bots.ts      # Webhooks for WhatsApp/Telegram bots (FAQ matching, rate limiting)
│   └── services/        # Utils – Business logic for external integrations
│       ├── exchangeRateService.ts  # API caching for currency rates
│       ├── paymentGatewayService.ts  # Abstracts Stripe/Paystack/Flutterwave calls
│       └── botService.ts # Bot logic: GROQ FAQ matching, interaction logging, rate limiting (5/hour/user)
├── tests/               # Tests – Unit/integration for key features
│   └── payments.test.ts  # Mocks donate/webhook flows
├── scripts/             # Utilities – Maintenance tasks
│   └── backup.ts        # Backs up Sanity types to JSON (modular)
├── server.ts            # Entry – Express app setup, middleware, route mounting
├── .env                 # Secrets – DB_URI, JWT_SECRET, STRIPE_KEY, etc.
└── package.json         # Deps & scripts – Express, Mongoose, gateways, etc.

## 🛠️ Setup Instructions
1. `npm install`
2. Update .env with secrets (DB_URI, JWT_SECRET, etc.). New for bots:
    `textTWILIO_ACCOUNT_SID=your_twilio_sid`
    `TWILIO_AUTH_TOKEN=your_twilio_token`
    `TELEGRAM_BOT_TOKEN=your_telegram_token`
    `WHATSAPP_PHONE=whatsapp:+14155238886  # Sandbox number`

3.`npm run dev` (tsx watch for hot reload; verify env logs on startup).
 

This structure supports the frontend (e.g., /payments/donate with currency/phone, enrollment checks in learn page, floating chat button linking to bots) while being scalable.