import path from 'node:path';
import cors from 'cors';
import express, { type Express } from 'express';
import { auth } from 'express-oauth2-jwt-bearer';
import OpenApiValidator from 'express-openapi-validator';
import helmet from 'helmet';
import morgan from 'morgan';

export { generalErrorHandler, notFoundHandler } from './error-handler.js';

export type AppOptions = {
  additionalCorsOrigins?: string[];
  jwtAudience?: string;
  includeSpec?: boolean;
};

export default function createApp(options: AppOptions = {}): Express {
  const app = express();

  app.use(morgan('combined'));
  app.use(helmet());
  app.use(express.json());
  app.use(
    cors({
      origin: [
        'https://www.dajohnston.co.uk',
        'http://localhost:5173',
        'http://localhost:5174',
        'https://generator.swagger.io',
        /^https:\/\/.*\.vercel\.app$/,
        ...(options.additionalCorsOrigins ?? []),
      ],
    }),
  );
  if (options.includeSpec) {
    app.use('/spec', express.static(path.join(path.resolve(), 'api-spec')));
    app.use(
      OpenApiValidator.middleware({
        apiSpec: path.join(path.resolve(), 'api-spec/openapi.yml'),
        validateRequests: true,
        validateResponses: true,
      }),
    );
  }
  if (options.jwtAudience) {
    app.use(
      auth({
        audience: options.jwtAudience,
        issuerBaseURL: 'https://dajohnston.eu.auth0.com/',
        tokenSigningAlg: 'RS256',
      }),
    );
  }
  const port = process.env.PORT ?? '3000';
  app.listen(port, () => {
    console.log(`Listening on port ${port}`);
  });
  return app;
}
