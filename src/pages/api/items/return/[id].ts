import type { APIRoute } from 'astro';
import { connectDB } from '../../../../lib/db';
import { Item } from '../../../../models/Item';
import { User } from '../../../../models/User';
import { getUserFromRequest } from '../../../../lib/auth';

// POST return an item
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

    if (item.status !== 'borrowed') {
      return new Response(
        JSON.stringify({ error: 'Item is not borrowed' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const borrowerId = item.borrowedBy?.toString();

    // Update item
    item.status = 'available';
    item.borrowedBy = undefined;
    item.borrowedAt = undefined;
    await item.save();

    // Update user
    if (borrowerId) {
      await User.findByIdAndUpdate(borrowerId, {
        $pull: { borrowedItems: item._id },
      });
    }

    return new Response(
      JSON.stringify({ item, message: 'Item returned successfully' }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error: any) {
    console.error('Return item error:', error);
    return new Response(
      JSON.stringify({ error: 'Failed to return item' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
};
