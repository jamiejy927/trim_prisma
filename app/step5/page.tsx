"use client";

import { useRouter } from "next/navigation";
import { SubmitEvent, useEffect, useState } from "react";
import { toast } from "sonner";

import { createBooking } from "@/app/actions/booking";
import RadioCardGroup from "@/components/RadioCardGroup";
import StepHeader from "@/components/StepHeader";
import StepNav from "@/components/StepNav";
import { clearDraft, getDraft, saveDraft } from "@/lib/storage";

const REFERRAL_OPTIONS = [
  { label: "Google Search", value: "google" },
  { label: "Instagram / Social Media", value: "social" },
  { label: "Friend or Neighbor Recommendation", value: "friend" },
  { label: "Flyer / Mail", value: "flyer" },
];

export default function Step5Page() {
  const router = useRouter();
  const [referralSource, setReferralSource] = useState("");

  useEffect(() => {
    const currentDraft = getDraft();
    if (currentDraft.referral_source) setReferralSource(currentDraft.referral_source);
  }, []);

  const handleSubmit = async (e: SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    toast.dismiss();

    if (!referralSource) {
      toast.error("Please let us know how you heard about us.");
      return;
    }

    const draft = saveDraft({
      referral_source: referralSource,
    });

    if (
      !draft.city ||
      !draft.street_address ||
      !draft.lawn_size ||
      !draft.full_name ||
      !draft.email ||
      !draft.phone ||
      !draft.service_date ||
      !draft.time_slot
    ) {
      toast.error("Please complete all booking steps before submitting.");
      return;
    }

    const result = await createBooking({
      city: draft.city,
      street_address: draft.street_address,
      lawn_size: draft.lawn_size,
      full_name: draft.full_name,
      email: draft.email,
      phone: draft.phone,
      service_date: draft.service_date,
      time_slot: draft.time_slot,
      additional_info: draft.additional_info,
      referral_source: draft.referral_source,
    });

    if (result.success) {
      clearDraft();
      toast.success("Booking completed successfully!");
      router.push("/");
      return;
    }

    toast.error(result.error);
  };

  return (
    <div className="max-w-xl mx-auto">
      <StepHeader
        step={5}
        total={5}
        title="How did you hear about us?"
        subtitle="This helps us improve our service reach."
      />

      <form
        onSubmit={handleSubmit}
        className="space-y-4 bg-white p-5 rounded-xl border border-gray-100 shadow-sm"
      >
        <RadioCardGroup
          label="Referral Source"
          name="referral_source"
          value={referralSource}
          onChange={setReferralSource}
          options={REFERRAL_OPTIONS}
        />

        <StepNav onBack={() => router.push("/step4")} nextLabel="Complete Booking →" />
      </form>
    </div>
  );
}