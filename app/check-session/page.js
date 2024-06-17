"use client"
import { useEffect, useState } from "react";
import { getSession } from "next-auth/react";

const CheckSession = () => {
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSession = async () => {
      const session = await getSession();
      setSession(session);
      setLoading(false);
    };

    fetchSession();
  }, []);

  if (loading) return <p>Loading...</p>;

  if (!session) {
    return <p>User is not authenticated</p>;
  }

  return (
    <div>
      <h1>Session Information</h1>
      <pre>{JSON.stringify(session, null, 2)}</pre>
    </div>
  );
};

export default CheckSession;
