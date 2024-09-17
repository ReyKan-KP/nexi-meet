import connectDB from "@utils/database";
import Event from "@models/Event";

export async function POST(req) {
  try {
    await connectDB();
    const data = await req.json();

    const {
      eventName,
      eventDescription,
      eventCategory,
      startDate,
      startTime,
      endDate,
      endTime,
      locationType,
      virtualLink,
      physicalAddress,
      organizer,
      bannerUrl,
      agenda,
      sponsors,
      ticketType,
      capacity,
      isPrivate,
      userId,
      userName,
      userEmail,
      ticketPrice,
      paymentMethod,
      bankAccountNumber,
      upiId,
    } = data;

    if (
      !eventName ||
      !eventDescription ||
      !eventCategory ||
      !startDate ||
      !startTime ||
      !endDate ||
      !endTime ||
      !locationType ||
      !ticketType ||
      !capacity ||
      !userId ||
      !userName ||
      !userEmail
    ) {
      return new Response(
        JSON.stringify({ message: "Missing required fields" }),
        { status: 400 }
      );
    }

    if (ticketType === "paid" && (!ticketPrice || !paymentMethod)) {
      return new Response(
        JSON.stringify({ message: "Ticket price and payment method are required for paid tickets" }),
        { status: 400 }
      );
    }

    const event = await Event.create({
      eventName,
      eventDescription,
      eventCategory,
      startDate: new Date(startDate),
      startTime,
      endDate: new Date(endDate),
      endTime,
      locationType,
      virtualLink: locationType === "virtual" ? virtualLink : undefined,
      physicalAddress: locationType === "physical" ? physicalAddress : undefined,
      organizer: {
        name: organizer.name,
        imageUrl: organizer.imageUrl,
      },
      bannerUrl,
      agenda,
      sponsors,
      ticketType,
      capacity: parseInt(capacity, 10),
      isPrivate,
      userId,
      userName,
      userEmail,
      ticketPrice: ticketType === "paid" ? ticketPrice : undefined,
      paymentMethod: ticketType === "paid" ? paymentMethod : undefined,
      bankAccountNumber: paymentMethod === "bank" ? bankAccountNumber : undefined,
      upiId: paymentMethod === "upi" ? upiId : undefined,
    });

    return new Response(
      JSON.stringify({ message: "Event created successfully", event }),
      { status: 201 }
    );
  } catch (error) {
    console.error("POST request error:", error);
    return new Response(
      JSON.stringify({ message: "Server error", error: error.message }),
      { status: 500 }
    );
  }
}

export async function GET(req) {
  try {
    await connectDB();
    const events = await Event.find().populate("userId", "name email");
    return new Response(JSON.stringify(events), { status: 200 });
  } catch (error) {
    console.error("GET request error:", error);
    return new Response(
      JSON.stringify({ message: "Server error", error: error.message }),
      { status: 500 }
    );
  }
}
