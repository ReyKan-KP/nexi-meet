// pages/api/check-session.js

import { getSession } from "next-auth/react";

const checkSession = async (req, res) => {
  const session = await getSession({ req });
  if (session) {
    res.status(200).json({ session });
  } else {
    res.status(401).json({ message: "Not authenticated" });
  }
};

export default checkSession;
