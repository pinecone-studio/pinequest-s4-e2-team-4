// import React from "react";
// import HomeBackdrop from "@/components/home/HomeBackdrop";
// import PhoneFrame from "@/components/home/PhoneFrame";

// export const myProfile = () => {
//   return (
//     <div className="h-screen w-screen flex items-center justify-center">
//       <HomeBackdrop active={true} />
//       <PhoneFrame>
//         <div>
//           <div></div>
//           <div></div>
//           <div></div>
//         </div>
//       </PhoneFrame>
//     </div>
//   );
// };

// export default myProfile;

"use client";

import React, { useEffect, useState } from "react";
import HomeBackdrop from "@/components/home/HomeBackdrop";
import PhoneFrame from "@/components/home/PhoneFrame";

interface ProfileData {
  id: string;
  name: string | null;
  email: string;
  phone: string | null;
  profileImage: string | null;
}

const initials = (name: string | null, email: string) => {
  const source = name?.trim() || email;
  const parts = source.split(/[\s@.]+/).filter(Boolean);
  if (parts.length === 0) return "?";
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[1][0]).toUpperCase();
};

export const MyProfile = () => {
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [form, setForm] = useState({ name: "", phone: "" });

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

        let data: any = null;
        try {
          data = await res.json();
        } catch {
          // response wasn't JSON — server likely crashed with an HTML error page
        }

        if (!res.ok) {
          setError(
            data?.error || `Мэдээлэл татахад алдаа гарлаа (код: ${res.status})`,
          );
          return;
        }

        setProfile(data);
        setForm({ name: data?.name ?? "", phone: data?.phone ?? "" });
      } catch {
        setError("Сервертэй холбогдоход алдаа гарлаа");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

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

    // Only send fields that changed and that the backend route reads (name, phone)
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

      let data: any = null;
      try {
        data = await res.json();
      } catch {
        // server crashed before returning valid JSON
      }

      if (!res.ok) {
        if (res.status === 500) {
          setError(
            "Серверт алдаа гарлаа. Мэдээлэл хадгалагдаагүй байж болзошгүй — түр хүлээгээд дахин оролдоно уу.",
          );
        } else {
          setError(
            data?.error || `Шинэчлэхэд алдаа гарлаа (код: ${res.status})`,
          );
        }
        return;
      }

      setProfile((prev) => (prev ? { ...prev, ...data.user } : prev));
      setForm({
        name: data?.user?.name ?? "",
        phone: data?.user?.phone ?? "",
      });
      setSuccess(data?.message || "Амжилттай шинэчлэгдлээ");
    } catch {
      setError("Сервертэй холбогдоход алдаа гарлаа");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="h-screen w-screen flex items-center justify-center">
      <HomeBackdrop active={true} />
      <PhoneFrame>
        <div className="w-full h-full overflow-y-auto bg-gradient-to-b from-zinc-950 via-zinc-950 to-zinc-900 text-white">
          {loading ? (
            <div className="flex h-full items-center justify-center">
              <div className="h-8 w-8 animate-spin rounded-full border-2 border-white/15 border-t-amber-400" />
            </div>
          ) : (
            <div className="flex flex-col px-6 pb-10 pt-12">
              {/* Header / identity */}
              <div className="flex flex-col items-center text-center">
                <div className="relative flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-amber-300 via-amber-400 to-orange-500 text-lg font-semibold tracking-wide text-zinc-950 shadow-[0_0_0_4px_rgba(255,255,255,0.06)]">
                  {initials(profile?.name ?? null, profile?.email ?? "")}
                </div>
                <h1 className="mt-4 text-lg font-semibold text-white">
                  {profile?.name?.trim() || "Нэргүй хэрэглэгч"}
                </h1>
                <p className="mt-0.5 text-sm text-white/40">{profile?.email}</p>
              </div>

              {/* Field list */}
              <form
                onSubmit={handleSubmit}
                className="mt-10 flex flex-col gap-1"
              >
                <span className="px-1 pb-2 text-[11px] font-medium uppercase tracking-[0.14em] text-white/35">
                  Хувийн мэдээлэл
                </span>

                <div className="overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03]">
                  {/* Name */}
                  <label className="flex items-center gap-3 px-4 py-3.5">
                    <svg
                      className="h-4 w-4 shrink-0 text-white/30"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.8"
                    >
                      <path d="M12 12a4 4 0 100-8 4 4 0 000 8z" />
                      <path d="M4 20c0-3.6 3.6-6 8-6s8 2.4 8 6" />
                    </svg>
                    <div className="flex min-w-0 flex-1 flex-col">
                      <span className="text-[11px] text-white/35">Нэр</span>
                      <input
                        type="text"
                        name="name"
                        value={form.name}
                        onChange={handleChange}
                        placeholder="Нэрээ оруулна уу"
                        className="w-full bg-transparent py-0.5 text-sm text-white placeholder-white/25 outline-none"
                      />
                    </div>
                  </label>

                  <div className="h-px bg-white/[0.06]" />

                  {/* Phone */}
                  <label className="flex items-center gap-3 px-4 py-3.5">
                    <svg
                      className="h-4 w-4 shrink-0 text-white/30"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.8"
                    >
                      <path d="M6.6 10.8a15.5 15.5 0 006.6 6.6l2.2-2.2a1 1 0 011-.25c1.1.36 2.3.56 3.5.56a1 1 0 011 1V20a1 1 0 01-1 1C10.6 21 3 13.4 3 4a1 1 0 011-1h3.5a1 1 0 011 1c0 1.2.2 2.4.56 3.5a1 1 0 01-.25 1L6.6 10.8z" />
                    </svg>
                    <div className="flex min-w-0 flex-1 flex-col">
                      <span className="text-[11px] text-white/35">
                        Утасны дугаар
                      </span>
                      <input
                        type="tel"
                        name="phone"
                        value={form.phone}
                        onChange={handleChange}
                        placeholder="99112233"
                        className="w-full bg-transparent py-0.5 text-sm text-white placeholder-white/25 outline-none"
                      />
                    </div>
                  </label>

                  <div className="h-px bg-white/[0.06]" />

                  {/* Email - read only, backend doesn't support editing this */}
                  <div className="flex items-center gap-3 px-4 py-3.5 opacity-50">
                    <svg
                      className="h-4 w-4 shrink-0 text-white/30"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.8"
                    >
                      <rect x="3" y="5" width="18" height="14" rx="2" />
                      <path d="M3 7l9 6 9-6" />
                    </svg>
                    <div className="flex min-w-0 flex-1 flex-col">
                      <span className="text-[11px] text-white/35">Имэйл</span>
                      <span className="truncate py-0.5 text-sm text-white/70">
                        {profile?.email}
                      </span>
                    </div>
                    <svg
                      className="h-3.5 w-3.5 shrink-0 text-white/25"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.8"
                    >
                      <rect x="5" y="11" width="14" height="9" rx="2" />
                      <path d="M8 11V7a4 4 0 118 0v4" />
                    </svg>
                  </div>
                </div>

                {/* Feedback */}
                {error && (
                  <p className="mt-4 rounded-xl border border-red-400/20 bg-red-400/10 px-4 py-2.5 text-sm text-red-300">
                    {error}
                  </p>
                )}
                {success && (
                  <p className="mt-4 rounded-xl border border-emerald-400/20 bg-emerald-400/10 px-4 py-2.5 text-sm text-emerald-300">
                    {success}
                  </p>
                )}

                {/* Save button */}
                <button
                  type="submit"
                  disabled={!isDirty || saving}
                  className="mt-6 w-full rounded-xl bg-amber-400 py-3 text-sm font-semibold text-zinc-950 transition-all disabled:cursor-not-allowed disabled:bg-white/10 disabled:text-white/30"
                >
                  {saving
                    ? "Хадгалж байна…"
                    : isDirty
                      ? "Хадгалах"
                      : "Өөрчлөлт алга"}
                </button>
              </form>
            </div>
          )}
        </div>
      </PhoneFrame>
    </div>
  );
};

export default MyProfile;
