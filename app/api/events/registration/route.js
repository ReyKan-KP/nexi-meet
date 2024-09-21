import { NextResponse } from "next/server";
import EventRegistration from "@/models/EventRegistration"; // Adjust the import path as necessary

export async function POST(request) {
  try {
    const { name, email, userId, eventId, idOfEvent } = await request.json();

    // Create a new registration entry
    const registration = await EventRegistration.create({
      eventId,
      idOfEvent,
      userId,
      name,
      email,
    });

    return NextResponse.json({ registration }, { status: 201 });
  } catch (error) {
    console.error("Error creating registration:", error);
    return NextResponse.json(
      { error: "Failed to create registration" },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const registrations = await EventRegistration.find().populate(
      "eventId userId"
    );
    return NextResponse.json({ registrations }, { status: 200 });
  } catch (error) {
    console.error("Error fetching registrations:", error);
    return NextResponse.json(
      { error: "Failed to fetch registrations" },
      { status: 500 }
    );
  }
}
