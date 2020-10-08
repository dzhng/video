import { createMocks, createResponse } from 'node-mocks-http';
import twilio from 'twilio';
import token from '~/pages/api/token';
//import admin from '~/utils/firebase-admin';

jest.mock('twilio', () => {
  const MockAccessToken = jest.fn(() => ({
    addGrant: jest.fn(),
    toJwt: jest.fn(() => 'token'),
  }));
  (MockAccessToken as any).VideoGrant = jest.fn();

  return {
    jwt: { AccessToken: MockAccessToken },
  };
});

jest.mock('~/utils/firebase-admin', () => ({
  auth: () => ({
    verifyIdToken: jest.fn(() => Promise.resolve({ uid: 'user' })),
  }),
}));

describe('twilio token renew function', () => {
  it('should only accept POST requests', async () => {
    const { req, res } = createMocks({ method: 'GET' });

    await token(req as any, res as any);

    expect(res.statusCode).toEqual(400);
    expect(res._isEndCalled()).toEqual(true);
  });

  it('should return a token with correct data and correct grant', async () => {
    const { req, res } = createMocks({ method: 'POST' });
    req.body = { idToken: 'hello', roomName: 'world' };

    await token(req as any, res as any);

    // FIXME: this line is not working for some reason
    //expect(admin.auth().verifyIdToken).toBeCalledWith('hello');
    expect(twilio.jwt.AccessToken.VideoGrant).toBeCalledWith({ room: 'world' });
    expect(res.statusCode).toEqual(200);
    expect(res._isEndCalled()).toEqual(true);
    expect(res._getData()).toEqual('token');
  });

  it('should reject requests with no token or room name', async () => {
    let { req, res } = createMocks({ method: 'POST' });
    req.body = { idToken: undefined, roomName: 'world' };

    await expect(token(req as any, res as any)).rejects.toThrow();
    expect(res._isEndCalled()).toEqual(false);

    res = createResponse();
    req.body = { idToken: 'hello', roomName: undefined };

    await expect(token(req as any, res as any)).rejects.toThrow();
    expect(res._isEndCalled()).toEqual(false);
  });

  it('should reject requests with tokens of invalid length', async () => {
    let { req, res } = createMocks({ method: 'POST' });
    req.body = { idToken: '', roomName: 'world' };

    await expect(token(req as any, res as any)).rejects.toThrow();
    expect(res._isEndCalled()).toEqual(false);

    res = createResponse();
    req.body = { idToken: 'hello', roomName: '' };

    await expect(token(req as any, res as any)).rejects.toThrow();
    expect(res._isEndCalled()).toEqual(false);
  });
});
