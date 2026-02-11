import type { APIRoute } from 'astro';
import { connectDB } from '../../../lib/db';
import { User } from '../../../models/User';
import { getUserFromRequest } from '../../../lib/auth';

export const GET: APIRoute = async ({ request }) => {
  try {
    await connectDB();

    const currentUser = getUserFromRequest(request);
    if (!currentUser) {
      return new Response(
        JSON.stringify({ error: 'Unauthorized' }),
        { status: 401, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const user = await User.findById(currentUser.userId)
      .select('-password')
      .populate('borrowedItems');

    if (!user) {
      return new Response(
        JSON.stringify({ error: 'User not found' }),
        { status: 404, headers: { 'Content-Type': 'application/json' } }
      );
    }

    return new Response(
      JSON.stringify({ user }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error: any) {
    console.error('Get user error:', error);
    return new Response(
      JSON.stringify({ error: 'Failed to get user data' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
};
