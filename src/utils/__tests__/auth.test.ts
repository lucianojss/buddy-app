import Cookies from 'js-cookie';
import { UserRole } from 'types';
import Auth from '../auth';

jest.mock('js-cookie');

const mockedCookies = Cookies as jest.Mocked<typeof Cookies>;

describe('Utils - auth', () => {
  const OLD_ENV = process.env;
  const authPayload = { token: 'sample', role: UserRole.Buddy, userId: '1' };

  beforeEach(() => {
    jest.resetModules();
    process.env = { ...OLD_ENV };
    delete process.env.REACT_APP_AUTH_USER;
  });

  afterEach(() => {
    process.env = OLD_ENV;
  });

  it('auth.getToken should return the token', () => {
    mockedCookies.get.mockReturnValueOnce(JSON.stringify(authPayload));

    expect(Auth.getToken()).toBe(authPayload.token);
  });

  it('auth.getUser should return the User data', () => {
    mockedCookies.get.mockReturnValueOnce(JSON.stringify(authPayload));

    expect(Auth.getUser()).toHaveProperty('role');
  });

  it('auth.setUser should set the cookie', () => {
    Auth.setUser(authPayload);

    expect(mockedCookies.set).toHaveBeenCalledWith(
      'auth/user',
      JSON.stringify(authPayload)
    );
  });

  it('auth.removeUser should remove the cookie', () => {
    Auth.setUser(authPayload);
    Auth.removeUser();

    expect(Auth.getToken()).toBe(undefined);
  });
});