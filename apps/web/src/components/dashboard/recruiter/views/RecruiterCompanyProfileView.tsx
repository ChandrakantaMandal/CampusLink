"use client";

import React, { useEffect, useRef, useState } from "react";
import {
  Building2,
  Globe,
  Mail,
  Phone,
  MapPin,
  CheckCircle2,
  ShieldCheck,
  Edit3,
  Save,
  Plus,
  X,
  ExternalLink,
  Award,
  ImagePlus,
} from "lucide-react";
import type { RecruiterCompany } from "../recruiter.types";
import {
  getRecruiterProfile,
  updateRecruiterProfile,
  uploadCompanyLogo,
  type UpdateRecruiterProfileInput,
} from "@/lib/api/recruiter.api";
import { toast } from "sonner";

export default function RecruiterCompanyProfileView() {
  const [company, setCompany] = useState<RecruiterCompany | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [formData, setFormData] = useState<RecruiterCompany | null>(null);
  const [benefitDraft, setBenefitDraft] = useState("");

  useEffect(() => {
    let cancelled = false;
    getRecruiterProfile()
      .then((data) => {
        if (!cancelled) {
          setCompany(data);
          setFormData(data);
        }
      })
      .catch((error: Error) => {
        if (!cancelled)
          toast.error("Failed to load company profile", {
            description: error.message,
          });
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const addBenefit = () => {
    const value = benefitDraft.trim();
    if (!value || !formData || formData.benefits.length >= 30) return;
    if (formData.benefits.includes(value)) {
      setBenefitDraft("");
      return;
    }
    setFormData({ ...formData, benefits: [...formData.benefits, value] });
    setBenefitDraft("");
  };

  const logoInputRef = useRef<HTMLInputElement>(null);
  const [isUploadingLogo, setIsUploadingLogo] = useState(false);

  const handleLogoFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file || !company || !formData) return;

    const allowedTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
    if (!allowedTypes.includes(file.type)) {
      toast.error("Invalid logo file type", {
        description: "Allowed formats: JPG, PNG or WebP.",
      });
      return;
    }
    if (file.size > 2 * 1024 * 1024) {
      toast.error("Logo file too large", {
        description: "Maximum allowed size is 2MB.",
      });
      return;
    }

    setIsUploadingLogo(true);
    try {
      const logoUrl = await uploadCompanyLogo(file);
      setCompany({ ...company, logo: logoUrl });
      setFormData({ ...formData, logo: logoUrl });
      toast.success("Company logo uploaded", {
        description: "Your new logo is live. Save changes to keep other edits.",
      });
    } catch (error) {
      toast.error("Failed to upload logo", {
        description: (error as Error).message,
      });
    } finally {
      setIsUploadingLogo(false);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData) return;

    setIsSaving(true);
    try {
      const companyPayload: NonNullable<UpdateRecruiterProfileInput["company"]> =
        {
          name: formData.name,
          industry: formData.industry,
          location: formData.location,
          description: formData.description,
          logoUrl: formData.logo,
          tier: formData.tier,
          benefits: formData.benefits,
        };
      if (formData.website) companyPayload.website = formData.website;

      const input: UpdateRecruiterProfileInput = {
        phone: formData.recruiterPhone,
        company: companyPayload,
      };
      if (formData.linkedinUrl) input.linkedinUrl = formData.linkedinUrl;

      const updated = await updateRecruiterProfile(input);
      setCompany(updated);
      setFormData(updated);
      setIsEditing(false);
      toast.success("Company Profile Updated", {
        description: "Company details and recruiter credentials successfully saved.",
      });
    } catch (error) {
      toast.error("Failed to update company profile", {
        description: (error as Error).message,
      });
    } finally {
      setIsSaving(false);
    }
  };

  if (!company || !formData) {
    return (
      <div className="space-y-6 animate-in fade-in duration-200">
        <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/80 p-8 shadow-xs">
          <p className="text-sm font-semibold text-slate-400 text-center">
            Loading company profile...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header with Title & Action */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight flex items-center gap-3">
            <Building2 className="h-8 w-8 text-blue-600 dark:text-blue-400" />
            Company Profile & Verification
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Manage your official corporate presence, recruiter details, and campus hiring credentials.
          </p>
        </div>

        <button
          type="button"
          onClick={() => {
            if (isEditing) {
              setFormData(company);
              setIsEditing(false);
            } else {
              setIsEditing(true);
            }
          }}
          className="inline-flex items-center gap-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-4 py-2.5 text-xs sm:text-sm font-bold text-slate-700 dark:text-slate-200 shadow-xs hover:bg-slate-100 hover:text-slate-900 dark:hover:bg-slate-800 dark:hover:text-white transition-all cursor-pointer"
        >
          <Edit3 className="h-4 w-4" />
          <span>{isEditing ? "Cancel Editing" : "Edit Profile"}</span>
        </button>
      </div>

      {/* Main Profile Card */}
      <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/80 p-6 sm:p-8 shadow-xs">
        {isEditing ? (
          <form onSubmit={handleSave} className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Company Name</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="mt-1.5 w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-3.5 py-2 text-sm text-slate-900 dark:text-white"
                  required
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Industry</label>
                <input
                  type="text"
                  value={formData.industry}
                  onChange={(e) => setFormData({ ...formData, industry: e.target.value })}
                  className="mt-1.5 w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-3.5 py-2 text-sm text-slate-900 dark:text-white"
                  required
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Website URL</label>
                <input
                  type="url"
                  value={formData.website}
                  onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                  className="mt-1.5 w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-3.5 py-2 text-sm text-slate-900 dark:text-white"
                  required
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Headquarters / Location</label>
                <input
                  type="text"
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  className="mt-1.5 w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-3.5 py-2 text-sm text-slate-900 dark:text-white"
                  required
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Recruiter Contact Name</label>
                <input
                  type="text"
                  value={formData.recruiterName}
                  disabled
                  className="mt-1.5 w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-800 px-3.5 py-2 text-sm text-slate-500 dark:text-slate-400"
                  required
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Recruiter Email</label>
                <input
                  type="email"
                  value={formData.recruiterEmail}
                  disabled
                  className="mt-1.5 w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-800 px-3.5 py-2 text-sm text-slate-500 dark:text-slate-400"
                  required
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Recruiter Phone</label>
                <input
                  type="tel"
                  value={formData.recruiterPhone}
                  onChange={(e) => setFormData({ ...formData, recruiterPhone: e.target.value })}
                  className="mt-1.5 w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-3.5 py-2 text-sm text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">LinkedIn Profile</label>
                <input
                  type="url"
                  value={formData.linkedinUrl}
                  onChange={(e) => setFormData({ ...formData, linkedinUrl: e.target.value })}
                  className="mt-1.5 w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-3.5 py-2 text-sm text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Company Logo</label>
                <div className="mt-1.5 flex items-center gap-3">
                  {formData.logo ? (
                    <img
                      src={formData.logo}
                      alt="Company logo preview"
                      className="h-12 w-12 rounded-xl object-cover border border-slate-200 dark:border-slate-700 shrink-0"
                    />
                  ) : (
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-purple-600 text-white text-sm font-black">
                      {(formData.name
                        .split(" ")
                        .map((word) => word[0] ?? "")
                        .filter(Boolean)
                        .slice(0, 2)
                        .join("")
                        .toUpperCase() || "CO")}
                    </div>
                  )}
                  <button
                    type="button"
                    onClick={() => logoInputRef.current?.click()}
                    disabled={isUploadingLogo}
                    className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 dark:border-slate-700 px-3.5 py-2 text-xs font-bold text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
                  >
                    <ImagePlus className="h-4 w-4" />
                    <span>{isUploadingLogo ? "Uploading..." : "Upload Logo"}</span>
                  </button>
                  <input
                    ref={logoInputRef}
                    type="file"
                    accept="image/jpeg,image/jpg,image/png,image/webp"
                    onChange={handleLogoFileChange}
                    className="hidden"
                  />
                </div>
                <p className="mt-1.5 text-[11px] text-slate-400">JPG, PNG or WebP — max 2MB.</p>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Company Tier</label>
                <select
                  value={formData.tier}
                  onChange={(e) =>
                    setFormData({ ...formData, tier: e.target.value as RecruiterCompany["tier"] })
                  }
                  className="mt-1.5 w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-3.5 py-2 text-sm text-slate-900 dark:text-white cursor-pointer"
                >
                  <option value="TIER_1">Tier 1 — Top campus partner</option>
                  <option value="TIER_2">Tier 2 — Preferred partner</option>
                  <option value="TIER_3">Tier 3 — Standard partner</option>
                </select>
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Company Overview & Culture</label>
              <textarea
                rows={4}
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="mt-1.5 w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-3.5 text-sm text-slate-900 dark:text-white"
                required
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Campus Perks & Benefits</label>
              <div className="mt-2 flex flex-wrap gap-2">
                {formData.benefits.map((benefit, i) => (
                  <span
                    key={`${benefit}-${i}`}
                    className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-2.5 py-1.5 text-xs font-semibold text-slate-700 dark:text-slate-300"
                  >
                    {benefit}
                    <button
                      type="button"
                      aria-label={`Remove ${benefit}`}
                      onClick={() =>
                        setFormData({
                          ...formData,
                          benefits: formData.benefits.filter((_, idx) => idx !== i),
                        })
                      }
                      className="text-slate-400 hover:text-red-500 transition-colors cursor-pointer"
                    >
                      <X className="h-3.5 w-3.5" />
                    </button>
                  </span>
                ))}
                {formData.benefits.length === 0 && (
                  <p className="text-xs text-slate-400">No benefits added yet.</p>
                )}
              </div>
              <div className="mt-3 flex gap-2">
                <input
                  type="text"
                  value={benefitDraft}
                  onChange={(e) => setBenefitDraft(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      addBenefit();
                    }
                  }}
                  maxLength={120}
                  placeholder="e.g. Relocation assistance & hybrid work"
                  className="flex-1 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-3.5 py-2 text-sm text-slate-900 dark:text-white"
                />
                <button
                  type="button"
                  onClick={addBenefit}
                  className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 dark:border-slate-700 px-4 py-2 text-xs font-bold text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                >
                  <Plus className="h-4 w-4" />
                  Add
                </button>
              </div>
            </div>

            <div className="flex justify-center gap-3 pt-3 border-t border-slate-200 dark:border-slate-800">
              <button
                type="button"
                onClick={() => setIsEditing(false)}
                className="rounded-xl border border-slate-200 dark:border-slate-700 px-5 py-2 text-xs font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-100 hover:text-slate-900 dark:hover:bg-slate-800 dark:hover:text-white transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSaving}
                className="inline-flex items-center gap-2 rounded-xl bg-blue-600 hover:bg-blue-500 px-6 py-2 text-xs font-bold text-white shadow-md hover:shadow-lg hover:shadow-blue-500/30 transition-all cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
              >
                <Save className="h-4 w-4" />
                <span>{isSaving ? "Saving..." : "Save Changes"}</span>
              </button>
            </div>
          </form>
        ) : (
          <div className="space-y-8">
            {/* Top Brand Banner */}
            <div className="flex flex-col sm:flex-row sm:items-center gap-6 pb-6 border-b border-slate-200 dark:border-slate-800">
              {company.logo ? (
                <img
                  src={company.logo}
                  alt={`${company.name} logo`}
                  className="h-20 w-20 rounded-2xl object-cover border border-slate-200 dark:border-slate-700 shadow-lg"
                />
              ) : (
                <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-purple-600 text-white text-2xl font-black shadow-lg shadow-blue-600/30">
                  {company.name
                    .split(" ")
                    .map((word) => word[0] ?? "")
                    .filter(Boolean)
                    .slice(0, 2)
                    .join("")
                    .toUpperCase() || "CO"}
                </div>
              )}

              <div className="space-y-1.5 flex-1">
                <div className="flex flex-wrap items-center gap-3">
                  <h2 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">
                    {company.name}
                  </h2>
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-100 dark:bg-emerald-950/80 border border-emerald-300 dark:border-emerald-800 px-3 py-1 text-xs font-bold text-emerald-800 dark:text-emerald-300">
                    <ShieldCheck className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                    <span>{company.verifiedStatus}</span>
                  </span>
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-blue-100 dark:bg-blue-950/80 border border-blue-300 dark:border-blue-800 px-3 py-1 text-xs font-bold text-blue-800 dark:text-blue-300">
                    <Award className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                    <span>Tier {company.tier.slice(-1)}</span>
                  </span>
                </div>

                <p className="text-sm font-semibold text-blue-600 dark:text-blue-400">
                  {company.industry}
                </p>

                <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500 dark:text-slate-400 pt-1">
                  <span className="flex items-center gap-1">
                    <MapPin className="h-3.5 w-3.5 text-slate-400" />
                    {company.location}
                  </span>
                  <a
                    href={company.website}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-1 text-blue-600 dark:text-blue-400 hover:underline"
                  >
                    <Globe className="h-3.5 w-3.5" />
                    {company.website.replace("https://", "")}
                    <ExternalLink className="h-3 w-3" />
                  </a>
                </div>
              </div>
            </div>

            {/* Description */}
            <div>
              <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400 mb-2">
                About the Company
              </h3>
              <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed max-w-3xl">
                {company.description}
              </p>
            </div>

            {/* Recruiter Details Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 pt-4 border-t border-slate-100 dark:border-slate-800">
              <div className="p-4 rounded-xl bg-slate-50/70 dark:bg-slate-900/40 border border-slate-100 dark:border-slate-800">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Lead Campus Recruiter</span>
                <p className="text-sm font-bold text-slate-900 dark:text-white mt-1">{company.recruiterName}</p>
                <p className="text-xs text-slate-500">Director of Talent Acquisition</p>
              </div>

              <div className="p-4 rounded-xl bg-slate-50/70 dark:bg-slate-900/40 border border-slate-100 dark:border-slate-800">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Recruiter Email</span>
                <p className="text-sm font-bold text-slate-900 dark:text-white mt-1 flex items-center gap-1.5">
                  <Mail className="h-3.5 w-3.5 text-blue-600" />
                  {company.recruiterEmail}
                </p>
              </div>

              <div className="p-4 rounded-xl bg-slate-50/70 dark:bg-slate-900/40 border border-slate-100 dark:border-slate-800">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Recruiter Phone</span>
                <p className="text-sm font-bold text-slate-900 dark:text-white mt-1 flex items-center gap-1.5">
                  <Phone className="h-3.5 w-3.5 text-emerald-600" />
                  {company.recruiterPhone || "Not provided"}
                </p>
              </div>
            </div>

            {/* Campus Perks & Benefits */}
            <div>
              <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400 mb-3 flex items-center gap-2">
                <Award className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                Campus Perks & Benefits Offered
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {company.benefits.map((benefit, i) => (
                  <div
                    key={i}
                    className="flex items-center gap-2.5 p-3 rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/30 text-xs font-semibold text-slate-700 dark:text-slate-300"
                  >
                    <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0" />
                    <span>{benefit}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
