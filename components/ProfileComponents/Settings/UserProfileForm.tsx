"use client";
import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { motion } from "framer-motion";
import { FileUpload } from "@/components/ui/file-upload";

const UserProfileForm: React.FC = () => {
  const { data: session, status } = useSession();
  const router = useRouter();

  const [formData, setFormData] = useState<{
    id: string;
    name: string;
    email: string;
    phoneNumber: string;
    bio: string;
    image: string | File; // Allow image to be a string or a File
  }>({
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

    // Handle file upload if a file is selected
    if (formData.image && typeof formData.image !== "string") {
      const file = formData.image;
      const uploadFormData = new FormData();
      uploadFormData.append("file", file);

      try {
        const uploadResponse = await fetch("/api/upload", {
          method: "POST",
          body: uploadFormData,
        });

        if (!uploadResponse.ok) {
          throw new Error("Failed to upload image");
        }

        const uploadData = await uploadResponse.json();
        formData.image = uploadData.url; // Update formData with the uploaded image URL
      } catch (error) {
        console.error("Error uploading image:", error);
        toast.error("Error uploading image: " + error);
        return; // Exit the function if image upload fails
      }
    }

    // Proceed with form submission
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

  const handleFileChange = (files: File[]) => {
    if (files.length > 0) {
      setFormData((prevData) => ({
        ...prevData,
        image: files[0], // Temporarily store the file object
      }));
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="max-w-3xl mx-auto p-6 lg:p-8 bg-[#e0faf7] shadow-lg rounded-lg"
    >
      <ToastContainer />
      <h2 className="text-3xl font-bold text-[#564476] mb-8">Update Profile</h2>
      <form onSubmit={handleSubmit} className="space-y-8">
        <div>
          <label className="block text-[#564476] font-medium mb-2">Name</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border border-[#d5fbe2] px-4 py-3 text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#564476] focus:border-[#564476] transition duration-200"
          />
        </div>
        <div>
          <label className="block text-[#564476] font-medium">Email</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
          />
        </div>
        <div>
          <label className="block text-[#564476] font-medium">
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
          <label className="block text-[#564476] font-medium">Bio</label>
          <textarea
            name="bio"
            value={formData.bio}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
            rows={4}
          ></textarea>
        </div>
        <div>
          <label className="block text-[#564476] font-medium">
            Profile Picture
          </label>
          <div className="flex flex-col sm:flex-row items-center gap-4">
            <div className="w-full sm:w-2/3">
              <FileUpload onChange={handleFileChange} />
            </div>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
              className="w-full sm:w-1/3 flex justify-center"
            >
              <motion.div
                whileHover={{ scale: 1.1 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <Image
                  src={typeof formData.image === "string" ? formData.image : "/images/user1.png"}
                  alt="Profile Preview"
                  width={80}
                  height={80}
                  className="w-20 h-20 rounded-full border-2 border-[#564476] object-cover" // Added object-cover class
                />
              </motion.div>
            </motion.div>
          </div>
        </div>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          type="submit"
          className="w-full mt-6 px-6 py-3 bg-[#fff4a4] text-[#564476] font-semibold rounded-md hover:bg-[#f0e3ff] transition duration-200"
        >
          Update
        </motion.button>
      </form>
    </motion.div>
  );
};

export default UserProfileForm;
