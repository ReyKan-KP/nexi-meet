import { useSession } from "next-auth/react";
import { useState, useEffect } from "react";
import { toast, ToastContainer } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";

const PrivacySettings: React.FC = () => {
  const { data: session, status } = useSession();
  const [formData, setFormData] = useState({
    id: "",
    profileVisibility: "Public",
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (status === "authenticated" && session?.user) {
      const userId = session?.user?.id;
      setFormData((prevData) => ({
        ...prevData,
        id: userId,
      }));

      const fetchProfileVisibility = async () => {
        try {
          const response = await fetch(
            `/api/updateProfile/getProfileVisibility?id=${userId}`
          );
          if (!response.ok) {
            throw new Error("Failed to fetch profile visibility");
          }
          const data = await response.json();
          setFormData((prevData) => ({
            ...prevData,
            profileVisibility: data.profileVisibility || "Public",
          }));
        } catch (error) {
          console.error("Error fetching profile visibility:", error);
        }
      };

      fetchProfileVisibility();
    }
  }, [status, session]);

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch(
        "/api/updateProfile/updateProfileVisibility",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to update profile visibility");
      }

      toast.success("Profile visibility updated successfully");
    } catch (error) {
      console.error("Error updating profile visibility:", error);
      toast.error("Error updating profile visibility: " + error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2 className="text-lg font-bold text-black mb-2">Privacy Settings</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-gray-700">Profile Visibility</label>
          <select
            name="profileVisibility"
            value={formData.profileVisibility}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border border-gray-300 bg-transparent px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-gray-400 focus:ring-offset-1"
          >
            <option>Public</option>
            <option>Private</option>
            <option>Friends Only</option>
          </select>
        </div>
        <button
          type="submit"
          className="inline-flex items-center justify-center rounded-md bg-black px-3.5 py-2.5 font-semibold leading-7 text-white hover:bg-black/80"
          disabled={loading}
        >
          {loading ? "Updating..." : "Update"}
        </button>
      </form>
      <ToastContainer
      />
    </div>
  );
};

export default PrivacySettings;
