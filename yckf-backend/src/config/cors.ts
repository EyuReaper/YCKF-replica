import cors from 'cors';

const allowedOrigins = [
    'http://localhost:3000', //  dev frontend server
    'https://yckf-frontend.vercel.app', // Prod frontend];
];

export const corsOptions = {
    origiin: (origin: string | undefined, callback: (err: Error | null, allow?: boolean) => void) => {
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    Credentials: true, // Allow cookies /JWT
    optionssSuccessStatus: 200,
};
//middleware export for easy use
export const corsMiddleware = cors(corsOptions);