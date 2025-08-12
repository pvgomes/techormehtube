import request from 'supertest';
import express from 'express';
import apiRoutes from '../../../server/routes/api';

// Mock dependencies
jest.mock('../../../server/controllers/downloadController', () => ({
  DownloadController: {
    getVideoInfo: jest.fn((req, res) => res.json({ success: true })),
    downloadVideo: jest.fn((req, res) => res.json({ success: true })),
  },
}));

describe('API Routes', () => {
  let app: express.Application;

  beforeEach(() => {
    app = express();
    app.use(express.json());
    app.use('/api', apiRoutes);
  });

  describe('POST /api/video-info', () => {
    it('should handle video info requests', async () => {
      const response = await request(app)
        .post('/api/video-info')
        .send({ url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ' })
        .expect(200);

      expect(response.body).toEqual({ success: true });
    });
  });

  describe('POST /api/download', () => {
    it('should handle download requests', async () => {
      const response = await request(app)
        .post('/api/download')
        .send({
          url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
          format: 'mp4',
          quality: '720p'
        })
        .expect(200);

      expect(response.body).toEqual({ success: true });
    });
  });

  describe('GET /api/health', () => {
    it('should return health status', async () => {
      const response = await request(app)
        .get('/api/health')
        .expect(200);

      expect(response.body).toHaveProperty('status', 'ok');
      expect(response.body).toHaveProperty('timestamp');
    });
  });

  describe('GET /api/stats', () => {
    it('should return system stats', async () => {
      const response = await request(app)
        .get('/api/stats')
        .expect(200);

      expect(response.body).toHaveProperty('status', 'running');
      expect(response.body).toHaveProperty('timestamp');
      expect(response.body).toHaveProperty('uptime');
      expect(response.body).toHaveProperty('memory');
      expect(response.body).toHaveProperty('version');
    });
  });
});