import { NestExpressApplication } from "@nestjs/platform-express";
import { rateLimit } from "express-rate-limit";
import  morgan from "morgan";
import  cookieParser from "cookie-parser";
import { EnvironmentService } from "@Package/config";
export const nestConfig = (app: NestExpressApplication) => {
    const configService = app.get(EnvironmentService);
    app.enableCors({
        origin: ['http://localhost:3000', 'http://localhost:3001'],
        methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE', 'OPTIONS'],
        credentials: true,
        allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Cache-Control', 'Pragma'],
    });
    // Global rate limiting
    app.use(rateLimit({
        windowMs: 15 * 60 * 1000, // 15 minutes
        limit: 100, // 100 requests per window
        message: {
            error: 'Too many requests from this IP, please try again later.',
            retryAfter: '15 minutes'
        }
    }));

    // Specific rate limiting for auth endpoints
    app.use('/api/v1/website/auth/register', rateLimit({
        windowMs: 15 * 60 * 1000, // 15 minutes (reduced for testing)
        limit: 20, // 20 registration attempts per 15 minutes (increased for testing)
        message: {
            error: 'Too many registration attempts from this IP, please try again later.',
            retryAfter: '15 minutes'
        }
    }));

    app.use('/api/v1/website/auth/verify-registration-otp', rateLimit({
        windowMs: 15 * 60 * 1000, // 15 minutes
        limit: 10, // 10 OTP verification attempts per 15 minutes
        message: {
            error: 'Too many OTP verification attempts from this IP, please try again later.',
            retryAfter: '15 minutes'
        }
    }));

    app.use('/api/v1/website/auth/complete-registration', rateLimit({
        windowMs: 15 * 60 * 1000, // 15 minutes (reduced for testing)
        limit: 20, // 20 registration completion attempts per 15 minutes (increased for testing)
        message: {
            error: 'Too many registration completion attempts from this IP, please try again later.',
            retryAfter: '15 minutes'
        }
    }));
    // Disable ETags to prevent 304 responses for dynamic data
    app.set('etag', false);

    // Add global middleware to prevent caching of API responses
    app.use('/api', (req, res, next) => {
        // Set cache control headers for all API routes
        res.set({
            'Cache-Control': 'no-cache, no-store, must-revalidate, private',
            'Pragma': 'no-cache',
            'Expires': '0',
            'Last-Modified': new Date().toUTCString()
        });
        next();
    });

    app.use(morgan("dev"))
    app.use(cookieParser())
    app.setGlobalPrefix(`api/${configService.get("app.version")}`)
}