import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import connectDB from "@utils/database";
import Event from '@/models/Event';

export async function DELETE(request, { params }) {
  const session = await getServerSession();
  
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { id } = params;

  await connectDB();

  try {
    const event = await Event.findById(id);

    if (!event) {
      return NextResponse.json({ error: 'Event not found' }, { status: 404 });
    }

    // if (event.userId !== session.user.id) {
    //   return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    // }

    await Event.findByIdAndDelete(id);
    return NextResponse.json({ message: 'Event deleted successfully' }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: 'Error deleting event' }, { status: 500 });
  }
}
