const pool = require('../config/database');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { v4: uuidv4 } = require('uuid');
const {
  register,
  login,
  refreshToken,
  logout,
  activateLicense,
} = require('./auth.controller');

jest.mock('../config/database', () => ({
  query: jest.fn(),
}));

jest.mock('bcryptjs', () => ({
  hash: jest.fn(),
  compare: jest.fn(),
}));

jest.mock('jsonwebtoken', () => ({
  sign: jest.fn(),
  verify: jest.fn(),
}));

jest.mock('uuid', () => ({
  v4: jest.fn(),
}));

const createRes = () => {
  const res = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
};

describe('auth controller', () => {
  let consoleErrorSpy;

  beforeEach(() => {
    jest.clearAllMocks();
    process.env.BCRYPT_ROUNDS = '10';
    process.env.JWT_SECRET = 'secret';
    process.env.JWT_EXPIRY = '1h';
    consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    consoleErrorSpy.mockRestore();
  });

  describe('register', () => {
    it('returns 400 when required fields are missing', async () => {
      const req = { body: { email: '', password: '', name: '' } };
      const res = createRes();

      await register(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ success: false, message: 'Missing required fields' });
      expect(pool.query).not.toHaveBeenCalled();
    });

    it('returns 400 when user already exists', async () => {
      pool.query.mockResolvedValueOnce({ rows: [{ id: 'u1' }] });
      const req = { body: { email: 'a@b.com', password: 'pass', name: 'User', shop_name: 'Shop' } };
      const res = createRes();

      await register(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ success: false, message: 'User already exists' });
    });

    it('creates user and returns success', async () => {
      pool.query.mockResolvedValueOnce({ rows: [] }).mockResolvedValueOnce({});
      bcrypt.hash.mockResolvedValue('hashed-pass');
      uuidv4.mockReturnValue('user-1');
      const req = { body: { email: 'a@b.com', password: 'pass', name: 'User', shop_name: 'Shop' } };
      const res = createRes();

      await register(req, res);

      expect(bcrypt.hash).toHaveBeenCalledWith('pass', 10);
      expect(pool.query).toHaveBeenNthCalledWith(
        2,
        'INSERT INTO users (id, email, password_hash, name, shop_name, role, status) VALUES ($1, $2, $3, $4, $5, $6, $7)',
        ['user-1', 'a@b.com', 'hashed-pass', 'User', 'Shop', 'super_admin', 'active']
      );
      expect(res.json).toHaveBeenCalledWith({ success: true, message: 'User registered successfully' });
    });
  });

  describe('login', () => {
    it('returns 400 when email/password are missing', async () => {
      const req = { body: { email: '', password: '' } };
      const res = createRes();

      await login(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ success: false, message: 'Email and password required' });
    });

    it('returns 401 when user does not exist', async () => {
      pool.query.mockResolvedValueOnce({ rows: [] });
      const req = { body: { email: 'missing@x.com', password: 'pass' } };
      const res = createRes();

      await login(req, res);

      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({ success: false, message: 'Invalid credentials' });
    });

    it('returns 401 when password is invalid', async () => {
      pool.query.mockResolvedValueOnce({
        rows: [{ id: 'u1', email: 'a@b.com', password_hash: 'hash', name: 'User', role: 'admin' }],
      });
      bcrypt.compare.mockResolvedValue(false);
      const req = { body: { email: 'a@b.com', password: 'bad' } };
      const res = createRes();

      await login(req, res);

      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({ success: false, message: 'Invalid credentials' });
    });

    it('returns jwt token and user details on success', async () => {
      const user = { id: 'u1', email: 'a@b.com', password_hash: 'hash', name: 'User', role: 'admin' };
      pool.query.mockResolvedValueOnce({ rows: [user] });
      bcrypt.compare.mockResolvedValue(true);
      jwt.sign.mockReturnValue('jwt-token');
      const req = { body: { email: 'a@b.com', password: 'good' } };
      const res = createRes();

      await login(req, res);

      expect(jwt.sign).toHaveBeenCalledWith(
        { id: 'u1', email: 'a@b.com', role: 'admin' },
        'secret',
        { expiresIn: '1h' }
      );
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        token: 'jwt-token',
        user: {
          id: 'u1',
          email: 'a@b.com',
          name: 'User',
          role: 'admin',
        },
      });
    });
  });

  describe('refreshToken', () => {
    it('returns a refreshed token on valid input token', async () => {
      jwt.verify.mockReturnValue({ id: 'u1', email: 'a@b.com', role: 'admin' });
      jwt.sign.mockReturnValue('new-token');
      const req = { body: { token: 'old-token' } };
      const res = createRes();

      await refreshToken(req, res);

      expect(res.json).toHaveBeenCalledWith({ success: true, token: 'new-token' });
    });

    it('returns 401 when token refresh fails', async () => {
      jwt.verify.mockImplementation(() => {
        throw new Error('bad token');
      });
      const req = { body: { token: 'bad-token' } };
      const res = createRes();

      await refreshToken(req, res);

      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({ success: false, message: 'Token refresh failed' });
    });
  });

  describe('other auth handlers', () => {
    it('logout returns success response', async () => {
      const req = {};
      const res = createRes();

      await logout(req, res);

      expect(res.json).toHaveBeenCalledWith({ success: true, message: 'Logged out successfully' });
    });

    it('activateLicense returns success response', async () => {
      const req = { body: { licenseKey: 'ABC-123', deviceId: 'device-1' } };
      const res = createRes();

      await activateLicense(req, res);

      expect(res.json).toHaveBeenCalledWith({ success: true, message: 'License activated' });
    });
  });
});
