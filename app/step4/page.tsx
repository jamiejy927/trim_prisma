"use client";

import { useRouter } from "next/navigation";
import { SubmitEvent, useEffect, useState } from "react";
import { toast } from "sonner";

import StepHeader from "@/components/StepHeader";
import StepNav from "@/components/StepNav";
import TextField from "@/components/TextField";
import { getDraft, saveDraft } from "@/lib/storage";

export default function Step4Page() {
  const router = useRouter();
  const [additionalInfo, setAdditionalInfo] = useState("");

  useEffect(() => {
    const currentDraft = getDraft();
    if (currentDraft.additional_info) setAdditionalInfo(currentDraft.additional_info);
  }, []);

  const handleNext = (e: SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    toast.dismiss();

    saveDraft({
      additional_info: additionalInfo.trim(),
    });

    router.push("/step5");
  };

  return (
    <div className="max-w-xl mx-auto">
      <StepHeader
        step={4}
        total={5}
        title="Any additional details?"
        subtitle="Let us know about pets, gates, or specific instructions for your lawn."
      />

      <form
        onSubmit={handleNext}
        className="space-y-4 bg-white p-5 rounded-xl border border-gray-100 shadow-sm"
      >
        <TextField
          label="Additional Information (Optional)"
          name="additional_info"
          type="text"
          placeholder="e.g. Dog in backyard, back gate code is 1234"
          value={additionalInfo}
          onChange={(e) => setAdditionalInfo(e.target.value)}
        />

        <StepNav onBack={() => router.push("/step3")} nextLabel="Next: Referral Source →" />
      </form>
    </div>
  );
}