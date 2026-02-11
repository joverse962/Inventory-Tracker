import type { APIRoute } from 'astro';
import { connectDB } from '../../../../lib/db';
import { Item } from '../../../../models/Item';
import { User } from '../../../../models/User';
import { getUserFromRequest } from '../../../../lib/auth';

// POST borrow an item
export const POST: APIRoute = async ({ params, request }) => {
  try {
    await connectDB();

    const currentUser = getUserFromRequest(request);
    if (!currentUser) {
      return new Response(
        JSON.stringify({ error: 'Unauthorized' }),
        { status: 401, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const item = await Item.findById(params.id);

    if (!item) {
      return new Response(
        JSON.stringify({ error: 'Item not found' }),
        { status: 404, headers: { 'Content-Type': 'application/json' } }
      );
    }

    if (item.status !== 'available') {
      return new Response(
        JSON.stringify({ error: 'Item is not available for borrowing' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Update item
    item.status = 'borrowed';
    item.borrowedBy = currentUser.userId as any;
    item.borrowedAt = new Date();
    await item.save();

    // Update user
    await User.findByIdAndUpdate(currentUser.userId, {
      $addToSet: { borrowedItems: item._id },
    });

    await item.populate('borrowedBy', 'name email');

    return new Response(
      JSON.stringify({ item, message: 'Item borrowed successfully' }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error: any) {
    console.error('Borrow item error:', error);
    return new Response(
      JSON.stringify({ error: 'Failed to borrow item' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
};
