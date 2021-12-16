import supertest from 'supertest';
import app from '../index';

const request = supertest(app);

describe('Test api endpoint responses', () => {
  it('gets the app homepage - returns 200 OK', async () => {
    const response = await request.get('/');
    expect(response.status).toBe(200);
  });

  it('gets the /api endpoint - returns 200 OK', async () => {
    const response = await request.get('/api');
    expect(response.status).toBe(200);
  });

  it('gets the /api/images api endpoint - 200 OK', async () => {
    const response = await request.get(
      '/api/images?filename=shells&width=200&height=600'
    );
    expect(response.status).toBe(200);
  });

  it('api should return 404 NOT FOUND given a not existing filename', async () => {
    const response = await request.get(
      '/api/images?filename=notExisting&width=200&height=600'
    );
    expect(response.status).toBe(404);
  });

  it('api should return 500 INTERNAL SERVER ERROR given an existing filename but a missing parameter (width/height)', async () => {
    const response = await request.get(
      '/api/images?filename=shells&width=200&height='
    );
    expect(response.status).toBe(500);
  });
});
