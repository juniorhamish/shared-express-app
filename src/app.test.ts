import request from 'supertest';
import { describe, expect, it } from 'vitest';
import createApp from '../src/index.js';

describe('Express Shared Library (TypeScript)', () => {
  it('responds to GET / with 200', async () => {
    const app = createApp();

    app.get('/', (_req, res) => res.send('Hello TypeScript'));

    const response = await request(app).get('/');
    expect(response.status).toBe(200);
    expect(response.text).toBe('Hello TypeScript');
  });

  it('parses JSON body correctly', async () => {
    const app = createApp();

    app.post('/echo', (req, res) => res.json(req.body));

    const response = await request(app)
      .post('/echo')
      .send({ message: 'Hello JSON' })
      .set('Content-Type', 'application/json');

    expect(response.status).toBe(200);
    expect(response.body).toEqual({ message: 'Hello JSON' });
  });

  it('should enable CORS', async () => {
    const app = createApp();

    const response = await request(app).options('/cors-test');
    expect(response.headers['access-control-allow-methods']).toBe('GET,HEAD,PUT,PATCH,POST,DELETE');
  });
  it('should enable helmet', async () => {
    const app = createApp();

    app.get('/helmet-test', (_req, res) => res.send('Helmet enabled'));

    const response = await request(app).get('/helmet-test');
    expect(response.headers['cross-origin-opener-policy']).toBe('same-origin');
  });
});
