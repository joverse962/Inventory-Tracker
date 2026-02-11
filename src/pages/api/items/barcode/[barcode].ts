import type { APIRoute } from 'astro';
import { connectDB } from '../../../../lib/db';
import { Item } from '../../../../models/Item';
import { User } from '../../../../models/User';
import { getUserFromRequest } from '../../../../lib/auth';

// GET item by barcode
export const GET: APIRoute = async ({ params, request }) => {
  try {
    await connectDB();

    const currentUser = getUserFromRequest(request);
    if (!currentUser) {
      return new Response(
        JSON.stringify({ error: 'Unauthorized' }),
        { status: 401, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const item = await Item.findOne({ barcode: params.barcode })
      .populate('borrowedBy', 'name email')
      .populate('createdBy', 'name email');

    if (!item) {
      return new Response(
        JSON.stringify({ error: 'Item not found with this barcode' }),
        { status: 404, headers: { 'Content-Type': 'application/json' } }
      );
    }

    return new Response(
      JSON.stringify({ item }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error: any) {
    console.error('Get item by barcode error:', error);
    return new Response(
      JSON.stringify({ error: 'Failed to fetch item' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
};
