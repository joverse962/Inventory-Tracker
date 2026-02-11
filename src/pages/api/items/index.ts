import type { APIRoute } from 'astro';
import { connectDB } from '../../../lib/db';
import { Item } from '../../../models/Item';
import { User } from '../../../models/User';
import { getUserFromRequest } from '../../../lib/auth';

// GET all items with optional filters
export const GET: APIRoute = async ({ request, url }) => {
  try {
    await connectDB();

    const currentUser = getUserFromRequest(request);
    if (!currentUser) {
      return new Response(
        JSON.stringify({ error: 'Unauthorized' }),
        { status: 401, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Get query parameters for filtering
    const status = url.searchParams.get('status');
    const category = url.searchParams.get('category');
    const location = url.searchParams.get('location');
    const search = url.searchParams.get('search');

    // Build filter object
    const filter: any = {};
    if (status) filter.status = status;
    if (category) filter.category = category;
    if (location) filter.location = location;
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { barcode: { $regex: search, $options: 'i' } },
      ];
    }

    const items = await Item.find(filter)
      .populate('borrowedBy', 'name email')
      .populate('createdBy', 'name email')
      .sort({ createdAt: -1 });

    console.log('[API GET] Returning', items.length, 'items');
    if (items.length > 0) {
      console.log('[API GET] First item:', {
        id: items[0]._id,
        name: items[0].name,
        image: items[0].image,
        hasImage: !!items[0].image
      });
    }

    return new Response(
      JSON.stringify({ items }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error: any) {
    console.error('Get items error:', error);
    return new Response(
      JSON.stringify({ error: 'Failed to fetch items' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
};

// POST create new item
export const POST: APIRoute = async ({ request }) => {
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
    console.log('[API] Raw request body:', JSON.stringify(body, null, 2));
    const { name, description, category, location, quantity, components, image } = body;
    console.log('[API] Extracted image value:', image);

    // Validation
    if (!name || !description || !category || !location) {
      return new Response(
        JSON.stringify({ error: 'Name, description, category, and location are required' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Prepare item data
    const itemData: any = {
      name,
      description,
      category,
      location,
      quantity: quantity || 1,
      components: components || [],
      createdBy: currentUser.userId,
    };

    // Only add image if it exists and is not empty
    if (image && image.trim() !== '') {
      itemData.image = image;
      console.log('[API] Added image to itemData:', image);
    } else {
      console.log('[API] No image provided or empty. Image value:', image);
    }

    console.log('[API] Final itemData before create:', JSON.stringify(itemData, null, 2));
    // Create item
    const item = await Item.create(itemData);
    console.log('[API] Item created with ID:', item._id, 'Image field:', item.image);

    await item.populate('createdBy', 'name email');

    return new Response(
      JSON.stringify({ item }),
      { status: 201, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error: any) {
    console.error('Create item error:', error);
    return new Response(
      JSON.stringify({ error: 'Failed to create item' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
};
