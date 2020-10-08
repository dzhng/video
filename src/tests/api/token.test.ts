import { createMocks, createResponse } from 'node-mocks-http';
import twilio from 'twilio';
import token from '~/pages/api/token';

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

describe('twilio token renew function', () => {
  it('should only accept POST requests', async () => {
    const { req, res } = createMocks({ method: 'GET' });

    token(req as any, res as any);

    expect(res.statusCode).toEqual(400);
    expect(res._isEndCalled()).toEqual(true);
  });

  it('should return a token with correct data and correct grant', async () => {
    const { req, res } = createMocks({ method: 'POST' });
    req.body = { identity: 'hello', roomName: 'world' };

    token(req as any, res as any);

    expect(twilio.jwt.AccessToken.VideoGrant).toBeCalledWith({ room: 'world' });
    expect(res.statusCode).toEqual(200);
    expect(res._isEndCalled()).toEqual(true);
    expect(res._getData()).toEqual('token');
  });

  it('should reject requests with no token or room name', () => {
    let { req, res } = createMocks({ method: 'POST' });
    req.body = { identity: undefined, roomName: 'world' };
    token(req as any, res as any);

    expect(res.statusCode).toEqual(400);
    expect(res._isEndCalled()).toEqual(true);

    res = createResponse();
    req.body = { identity: 'hello', roomName: undefined };
    token(req as any, res as any);

    expect(res.statusCode).toEqual(400);
    expect(res._isEndCalled()).toEqual(true);
  });

  it('should reject requests with tokens of invalid length', () => {
    let { req, res } = createMocks({ method: 'POST' });
    req.body = { identity: '', roomName: 'world' };
    token(req as any, res as any);

    expect(res.statusCode).toEqual(400);
    expect(res._isEndCalled()).toEqual(true);

    res = createResponse();
    req.body = { identity: 'hello', roomName: '' };
    token(req as any, res as any);

    expect(res.statusCode).toEqual(400);
    expect(res._isEndCalled()).toEqual(true);
  });
});
