import type { APIRoute } from 'astro';
import { connectDB } from '../../../lib/db';
import { Item } from '../../../models/Item';
import { User } from '../../../models/User';
import { getUserFromRequest } from '../../../lib/auth';

// GET single item
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

    const item = await Item.findById(params.id)
      .populate('borrowedBy', 'name email')
      .populate('createdBy', 'name email');

    if (!item) {
      return new Response(
        JSON.stringify({ error: 'Item not found' }),
        { status: 404, headers: { 'Content-Type': 'application/json' } }
      );
    }

    return new Response(
      JSON.stringify({ item }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error: any) {
    console.error('Get item error:', error);
    return new Response(
      JSON.stringify({ error: 'Failed to fetch item' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
};

// PUT update item
export const PUT: APIRoute = async ({ params, request }) => {
  try {
    await connectDB();

    const currentUser = getUserFromRequest(request);
    if (!currentUser) {
      return new Response(
        JSON.stringify({ error: 'Unauthorized' }),
        { status: 401, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const body = await request.json();
    const item = await Item.findByIdAndUpdate(
      params.id,
      body,
      { new: true, runValidators: true }
    )
      .populate('borrowedBy', 'name email')
      .populate('createdBy', 'name email');

    if (!item) {
      return new Response(
        JSON.stringify({ error: 'Item not found' }),
        { status: 404, headers: { 'Content-Type': 'application/json' } }
      );
    }

    return new Response(
      JSON.stringify({ item }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error: any) {
    console.error('Update item error:', error);
    return new Response(
      JSON.stringify({ error: 'Failed to update item' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
};

// DELETE item
export const DELETE: APIRoute = async ({ params, request }) => {
  try {
    await connectDB();

    const currentUser = getUserFromRequest(request);
    if (!currentUser) {
      return new Response(
        JSON.stringify({ error: 'Unauthorized' }),
        { status: 401, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const item = await Item.findByIdAndDelete(params.id);

    if (!item) {
      return new Response(
        JSON.stringify({ error: 'Item not found' }),
        { status: 404, headers: { 'Content-Type': 'application/json' } }
      );
    }

    return new Response(
      JSON.stringify({ message: 'Item deleted successfully' }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error: any) {
    console.error('Delete item error:', error);
    return new Response(
      JSON.stringify({ error: 'Failed to delete item' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
};
