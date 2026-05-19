const jwt = require('jsonwebtoken');
const { authenticate, authorize } = require('./auth.middleware');

jest.mock('jsonwebtoken');

const createRes = () => {
  const res = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
};

describe('auth middleware', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    process.env.JWT_SECRET = 'test-secret';
  });

  describe('authenticate', () => {
    it('returns 401 when token is missing', () => {
      const req = { headers: {} };
      const res = createRes();
      const next = jest.fn();

      authenticate(req, res, next);

      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({ success: false, message: 'No token provided' });
      expect(next).not.toHaveBeenCalled();
    });

    it('attaches decoded user and calls next on valid token', () => {
      const req = { headers: { authorization: 'Bearer valid-token' } };
      const res = createRes();
      const next = jest.fn();
      const decoded = { id: 'u1', role: 'admin' };
      jwt.verify.mockReturnValue(decoded);

      authenticate(req, res, next);

      expect(jwt.verify).toHaveBeenCalledWith('valid-token', 'test-secret');
      expect(req.user).toEqual(decoded);
      expect(next).toHaveBeenCalledTimes(1);
    });

    it('returns 401 when jwt verification fails', () => {
      const req = { headers: { authorization: 'Bearer bad-token' } };
      const res = createRes();
      const next = jest.fn();
      jwt.verify.mockImplementation(() => {
        throw new Error('invalid');
      });

      authenticate(req, res, next);

      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({ success: false, message: 'Invalid token' });
      expect(next).not.toHaveBeenCalled();
    });
  });

  describe('authorize', () => {
    it('returns 403 when role is not allowed', () => {
      const req = { user: { role: 'cashier' } };
      const res = createRes();
      const next = jest.fn();

      authorize('admin', 'super_admin')(req, res, next);

      expect(res.status).toHaveBeenCalledWith(403);
      expect(res.json).toHaveBeenCalledWith({ success: false, message: 'Access denied' });
      expect(next).not.toHaveBeenCalled();
    });

    it('calls next when role is allowed', () => {
      const req = { user: { role: 'admin' } };
      const res = createRes();
      const next = jest.fn();

      authorize('admin', 'super_admin')(req, res, next);

      expect(next).toHaveBeenCalledTimes(1);
    });
  });
});
