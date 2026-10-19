import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { jwtVerify } from 'jose';

const COOKIE_NAME = 'admin_token';
const BASE_PATH = '/admin';

function getSecret() {
  return new TextEncoder().encode(
    process.env.JWT_SECRET || 'css-ai-builder-jwt-secret-change-me',
  );
}

function stripBasePath(pathname: string) {
  if (pathname === BASE_PATH) return '/';
  if (pathname.startsWith(`${BASE_PATH}/`)) {
    return pathname.slice(BASE_PATH.length) || '/';
  }
  return pathname || '/';
}

function redirectTo(request: NextRequest, path: string, next?: string) {
  const url = new URL(request.url);
  const forwardedHost = request.headers
    .get('x-forwarded-host')
    ?.split(',')[0]
    ?.trim();
  const forwardedProto = request.headers
    .get('x-forwarded-proto')
    ?.split(',')[0]
    ?.trim();

  if (forwardedHost) {
    url.host = forwardedHost;
  }
  if (forwardedProto === 'http' || forwardedProto === 'https') {
    url.protocol = `${forwardedProto}:`;
  }

  const destPath = path.startsWith(BASE_PATH) ? path : `${BASE_PATH}${path}`;
  url.pathname = destPath;
  url.search = next ? `?next=${encodeURIComponent(next)}` : '';
  url.hash = '';
  return NextResponse.redirect(url);
}

export async function middleware(request: NextRequest) {
  try {
    return await runMiddleware(request);
  } catch {
    return NextResponse.next();
  }
}

async function runMiddleware(request: NextRequest) {
  const pathname = stripBasePath(request.nextUrl.pathname);
  const token = request.cookies.get(COOKIE_NAME)?.value;

  const isAuthPage =
    pathname.startsWith('/auth/login') ||
    pathname.startsWith('/auth/register');
  const isPublicApi = pathname.startsWith('/api/auth/');

  if (isPublicApi) {
    return NextResponse.next();
  }

  let valid = false;
  if (token) {
    try {
      const { payload } = await jwtVerify(token, getSecret());
      valid = payload.type === 'admin' || payload.role === 'ADMIN';
    } catch {
      valid = false;
    }
  }

  if (isAuthPage) {
    if (valid) {
      return redirectTo(request, '/dashboard');
    }
    return NextResponse.next();
  }

  if (!valid) {
    const res = redirectTo(request, '/auth/login', pathname);
    if (token) {
      res.cookies.set(COOKIE_NAME, '', { path: '/', maxAge: 0 });
    }
    return res;
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/',
    '/((?!_next/static|_next/image|favicon.ico|images|fonts).*)',
  ],
};
