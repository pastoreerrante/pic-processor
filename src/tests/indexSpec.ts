import supertest from 'supertest';
import app from '../index';

const request = supertest(app);

describe('Test endpoint responses', () => {
  it('gets the api endpoint', async () => {
    const response = await request.get(
      '/api/images?filename=shells&width=200&height=600'
    );
    expect(response.status).toBe(200);
  });

  it('api should return 404 not found given a not existing filename', async () => {
    const response = await request.get(
      '/api/images?filename=notExisting&width=200&height=600'
    );
    expect(response.status).toBe(404);
  });
});
