"use client";

import React, { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import HomeBackdrop from "@/components/home/HomeBackdrop";
import PhoneFrame from "@/components/home/PhoneFrame";
import { ProfileData, ProfileFormState } from "./components/types";
import { ProfileHeader } from "./components/ProfileHeader";
import { ProfileForm } from "./components/ProfileForm";
import { useLanguage } from "@/app/lib/language";

type ProfileFetchResponse = ProfileData & {
  error?: string;
};

type ProfileUpdateResponse = {
  error?: string;
  message?: string;
  user?: Partial<ProfileData>;
};

export const MyProfile = () => {
  const router = useRouter();
  const { language } = useLanguage();
  const t = useMemo(
    () =>
      language === "en"
        ? {
            fetchError: (status: number) =>
              `Failed to load profile (code: ${status})`,
            networkError: "Could not connect to the server",
            saveServerError:
              "Server error. Your profile may not have been saved.",
            saveError: (status: number) =>
              `Failed to update profile (code: ${status})`,
            saveSuccess: "Profile updated successfully",
          }
        : {
            fetchError: (status: number) =>
              `Мэдээлэл татахад алдаа гарлаа (код: ${status})`,
            networkError: "Сервертэй холбогдоход алдаа гарлаа",
            saveServerError:
              "Серверт алдаа гарлаа. Мэдээлэл хадгалагдаагүй байж болзошгүй.",
            saveError: (status: number) =>
              `Шинэчлэхэд алдаа гарлаа (код: ${status})`,
            saveSuccess: "Амжилттай шинэчлэгдлээ",
          },
    [language],
  );
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [form, setForm] = useState<ProfileFormState>({ name: "", phone: "" });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await fetch("/api/user/profile", {
          method: "GET",
          credentials: "include",
        });

        let data: ProfileFetchResponse | null = null;
        try {
          data = (await res.json()) as ProfileFetchResponse;
        } catch {}

        if (!res.ok) {
          setError(language === "en" ? t.fetchError(res.status) : data?.error || t.fetchError(res.status));
          return;
        }

        setProfile(data);
        setForm({ name: data?.name ?? "", phone: data?.phone ?? "" });
      } catch {
        setError(t.networkError);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [language, t]);

  const isDirty =
    !!profile &&
    (form.name !== (profile.name ?? "") ||
      form.phone !== (profile.phone ?? ""));

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setError(null);
    setSuccess(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!profile || !isDirty || saving) return;

    setSaving(true);
    setError(null);
    setSuccess(null);

    const payload: Record<string, string> = {};
    if (form.name !== (profile.name ?? "")) payload.name = form.name;
    if (form.phone !== (profile.phone ?? "")) payload.phone = form.phone;

    try {
      const res = await fetch("/api/user/profile/update", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(payload),
      });

      let data: ProfileUpdateResponse | null = null;
      try {
        data = (await res.json()) as ProfileUpdateResponse;
      } catch {}

      if (!res.ok) {
        setError(
          res.status === 500
            ? t.saveServerError
            : language === "en"
              ? t.saveError(res.status)
              : data?.error || t.saveError(res.status),
        );
        return;
      }

      setProfile((prev) => (prev ? { ...prev, ...data?.user } : prev));
      setForm({ name: data?.user?.name ?? "", phone: data?.user?.phone ?? "" });
      setSuccess(language === "en" ? t.saveSuccess : data?.message || t.saveSuccess);
    } catch {
      setError(t.networkError);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="h-screen w-screen flex items-center justify-center">
      <HomeBackdrop active={true} />
      <PhoneFrame>
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.3, ease: "easeInOut" }}
          className="flex h-full w-full flex-col overflow-y-auto bg-[#f3f4f2]"
        >
          {loading ? (
            <div className="flex h-full items-center justify-center bg-[#1c3226]">
              <div className="h-8 w-8 animate-spin rounded-full border-2 border-white/15 border-t-amber-400" />
            </div>
          ) : (
            <>
              <ProfileHeader
                profile={profile}
                onBack={() => router.push("/profile")}
              />
              <ProfileForm
                form={form}
                email={profile?.email ?? ""}
                isDirty={isDirty}
                saving={saving}
                error={error}
                success={success}
                onChange={handleChange}
                onSubmit={handleSubmit}
              />
            </>
          )}
        </motion.div>
      </PhoneFrame>
    </div>
  );
};

export default MyProfile;
