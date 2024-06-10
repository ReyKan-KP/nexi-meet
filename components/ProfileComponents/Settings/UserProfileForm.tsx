"use client"
import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const UserProfileForm: React.FC = () => {
  const { data: session, status } = useSession();
  const router = useRouter();

  const [formData, setFormData] = useState({
    id: "",
    name: "",
    email: "",
    phoneNumber: "",
    bio: "",
    image: "",
  });

  useEffect(() => {
    if (status === "authenticated" && session?.user) {
      const userId = session?.user?.id;
      setFormData((prevData) => ({
        ...prevData,
        id: userId,
      }));

      const fetchUserProfile = async () => {
        try {
          const response = await fetch(`/api/updateProfile?id=${userId}`);
          if (!response.ok) {
            throw new Error("Failed to fetch user profile");
          }
          const data = await response.json();
          setFormData({
            id: userId,
            name: data.name || "",
            email: data.email || "",
            phoneNumber: data.phoneNumber || "",
            bio: data.bio || "",
            image: data.image || "",
          });
        } catch (error) {
          console.error("Error fetching user profile:", error);
        }
      };

      fetchUserProfile();
    }
  }, [status, session]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await fetch("/api/updateProfile", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error("Failed to update profile");
      }

      toast.success("Profile updated successfully");
      router.push("/profile");
    } catch (error) {
      console.error("Error updating profile:", error);
      toast.error("Error updating profile: " + error);
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-4 sm:p-6 lg:p-8 bg-white shadow-md rounded-md">
      <ToastContainer />
      <h2 className="text-2xl font-bold text-teal-700 mb-6">Update Profile</h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-teal-700 font-medium">Name</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
          />
        </div>
        <div>
          <label className="block text-teal-700 font-medium">Email</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
          />
        </div>
        <div>
          <label className="block text-teal-700 font-medium">
            Phone Number
          </label>
          <input
            type="tel"
            name="phoneNumber"
            value={formData.phoneNumber}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
          />
        </div>
        <div>
          <label className="block text-teal-700 font-medium">Bio</label>
          <textarea
            name="bio"
            value={formData.bio}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
            rows={4}
          ></textarea>
        </div>
        <div>
          <label className="block text-teal-700 font-medium">
            Profile Picture
          </label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) {
                setFormData((prevData) => ({
                  ...prevData,
                  image: URL.createObjectURL(file),
                }));
              }
            }}
            className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-teal-600 file:text-white hover:file:bg-teal-700"
          />
          {formData.image && (
            <div className="mt-4">
              <Image
                src={formData.image}
                alt="Profile Preview"
                width={80}
                height={80}
                className="w-20 h-20 rounded-full"
              />
            </div>
          )}
        </div>
        <button
          type="submit"
          className="inline-flex items-center justify-center rounded-md bg-gradient-to-r from-teal-600 to-green-500 px-4 py-2 font-semibold text-white hover:from-teal-700 hover:to-green-700"
        >
          Update
        </button>
      </form>
    </div>
  );
};

export default UserProfileForm;