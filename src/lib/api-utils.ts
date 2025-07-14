import { NextResponse } from 'next/server';
import { ZodError } from 'zod';

export function createErrorResponse(message: string, status = 400) {
  return NextResponse.json({ error: message }, { status });
}

export function createSuccessResponse(data: unknown, status = 200) {
  return NextResponse.json(data, { status });
}

export function handleApiError(error: unknown) {
  console.error('API Error:', error);

  if (error instanceof ZodError) {
    return createErrorResponse(error.issues[0].message, 400);
  }

  if (error instanceof Error) {
    return createErrorResponse(error.message, 500);
  }

  return createErrorResponse('Internal server error', 500);
}

export function validateRequiredFields(
  data: Record<string, unknown>,
  fields: string[]
) {
  const missing = fields.filter(field => !data[field]);
  if (missing.length > 0) {
    throw new Error(`Missing required fields: ${missing.join(', ')}`);
  }
}

export async function parseJsonBody(request: Request) {
  try {
    return await request.json();
  } catch {
    throw new Error('Invalid JSON body');
  }
}

export function createPaginationParams(searchParams: URLSearchParams) {
  const page = Math.max(1, parseInt(searchParams.get('page') || '1'));
  const limit = Math.min(
    50,
    Math.max(1, parseInt(searchParams.get('limit') || '10'))
  );
  const skip = (page - 1) * limit;

  return { page, limit, skip };
}

export function createFilterParams(searchParams: URLSearchParams) {
  return {
    search: searchParams.get('search') || undefined,
    category: searchParams.get('category') || undefined,
    city: searchParams.get('city') || undefined,
    ageMin: searchParams.get('ageMin')
      ? parseInt(searchParams.get('ageMin')!)
      : undefined,
    ageMax: searchParams.get('ageMax')
      ? parseInt(searchParams.get('ageMax')!)
      : undefined,
    priceMin: searchParams.get('priceMin')
      ? parseFloat(searchParams.get('priceMin')!)
      : undefined,
    priceMax: searchParams.get('priceMax')
      ? parseFloat(searchParams.get('priceMax')!)
      : undefined,
    language: searchParams.get('language') || undefined,
    difficulty: searchParams.get('difficulty') || undefined,
  };
}
