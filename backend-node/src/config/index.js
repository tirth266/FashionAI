import dotenv from 'dotenv';
dotenv.config();

const requiredEnvVars = [
    'PORT',
    'MONGO_URI',
    'JWT_SECRET',
    'AI_SERVICE_URL'
];

export const validateEnv = () => {
    const missing = requiredEnvVars.filter(varName => !process.env[varName]);
    
    if (missing.length > 0) {
        console.error('❌ Missing required environment variables:', missing.join(', '));
        if (process.env.NODE_ENV === 'production') {
            throw new Error(`Missing required environment variables: ${missing.join(', ')}`);
        }
    }
};

export const config = {
    port: process.env.PORT || 5000,
    mongoUri: process.env.MONGO_URI,
    jwtSecret: process.env.JWT_SECRET,
    aiServiceUrl: process.env.AI_SERVICE_URL,
    nodeEnv: process.env.NODE_ENV || 'development'
};
