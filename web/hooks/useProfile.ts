"use client";

import axios from "axios";
import { useRouter } from "next/navigation";
import type { ChangeEvent } from "react";
import { useEffect, useRef, useState } from "react";

interface UserData {
  id: string;
  email: string;
  name?: string;
  username: string;
  profileImage?: string;
}

export function useProfile() {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [user, setUser] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);
  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await axios.get("/api/user/profile");
        setUser(response.data.user || response.data);
      } catch (error) {
        console.error("Профайл уншихад алдаа гарлаа:", error);
        router.push("/signin");
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, [router]);

  const handleAvatarClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      alert("Зөвхөн зураг сонгоно уу!");
      return;
    }

    try {
      setIsUploading(true);

      const formData = new FormData();
      formData.append("file", file);

      const response = await axios.post("/api/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (response.data.success) {
        setUser((prev) =>
          prev ? { ...prev, profileImage: response.data.url } : null,
        );
      }
    } catch (error) {
      console.error("Upload failed:", error);
      alert("Зураг шинэчлэхэд алдаа гарлаа.");
    } finally {
      setIsUploading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await axios.post("/api/auth/logout");
      router.push("/signin");
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  return {
    user,
    loading,
    isUploading,
    fileInputRef,
    handleAvatarClick,
    handleFileChange,
    handleLogout,
  };
}
