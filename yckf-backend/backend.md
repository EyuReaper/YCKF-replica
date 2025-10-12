yckf-backend/
├── src/
│   ├── config/          # New: App settings
│   │   ├── database.ts
│   │   └── cors.ts
│   ├── controllers/     # New: Route logic
│   │   ├── paymentController.ts
│   │   └── enrollmentController.ts
│   ├── lib/             # libraries
│   │   ├── auth.ts
│   │   ├── sanity.ts
│   │   └── audit.ts
│   ├── middleware/      # New: Guards
│   │   ├── authMiddleware.ts
│   │   └── validationMiddleware.ts
│   ├── models/          # New: Schemas
│   │   ├── Enrollment.ts
│   │   ├── CourseProgress.ts
│   │   └── PaymentLog.ts
│   ├── routes/          # routing
│   │   ├── auth.ts
│   │   ├── courses.ts
│   │   ├── payments.ts
│   │   ├── enrollments.ts  # New route
│   │   └── progress.ts     # New route
│   └── services/        # New: Utils
│       ├── exchangeRateService.ts
│       └── paymentGatewayService.ts
├── tests/               # New: Tests
│   └── payments.test.ts
├── scripts/             # Existing
│   └── backup.ts
├── server.ts               # Entry 
├── .env                 # Secrets
└── package.json