"use client";

import { useRouter } from "next/navigation";
import { SubmitEvent, useEffect, useState } from "react";
import { toast } from "sonner";

import { getBookedSlotsByDate, type BookedSlots } from "@/app/actions/booking";
import DateField from "@/components/DateField";
import RadioCardGroup from "@/components/RadioCardGroup";
import StepHeader from "@/components/StepHeader";
import StepNav from "@/components/StepNav";
import { getDraft, saveDraft } from "@/lib/storage";
import { TIME_SLOTS, type TimeSlot } from "@/lib/types";

const NO_BOOKED_SLOTS: BookedSlots = {
  morning: false,
  afternoon: false,
  full_day: false,
};

export default function Step3Page() {
  const router = useRouter();

  const [serviceDate, setServiceDate] = useState("");
  const [timeSlot, setTimeSlot] = useState<TimeSlot | "">("");
  const [bookedSlots, setBookedSlots] = useState<BookedSlots>(NO_BOOKED_SLOTS);

  useEffect(() => {
    const currentDraft = getDraft();
    if (currentDraft.service_date) setServiceDate(currentDraft.service_date);
    if (currentDraft.time_slot) setTimeSlot(currentDraft.time_slot as TimeSlot);
  }, []);

  useEffect(() => {
    if (!serviceDate) return;

    async function fetchBookedSlots() {
      const result = await getBookedSlotsByDate(serviceDate);
      setBookedSlots(result.bookedSlots);
    }

    fetchBookedSlots();
  }, [serviceDate]);

  const disabledValues = !serviceDate
    ? new Set(TIME_SLOTS.map((slot) => slot.value))
    : (() => {
        const disabled = new Set<TimeSlot>();
        const isMorningBooked = bookedSlots.morning;
        const isAfternoonBooked = bookedSlots.afternoon;
        const isFullDayBooked = bookedSlots.full_day;

        if (isFullDayBooked) {
          disabled.add("morning");
          disabled.add("afternoon");
          disabled.add("full_day");
        }

        if (isMorningBooked || isAfternoonBooked) {
          disabled.add("full_day");
        }

        if (isMorningBooked) disabled.add("morning");
        if (isAfternoonBooked) disabled.add("afternoon");

        return disabled;
      })();

  const handleSubmit = async (e: SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    toast.dismiss();

    if (!serviceDate) {
      toast.error("Please select a service date.");
      return;
    }

    if (!timeSlot) {
      toast.error("Please select a time slot.");
      return;
    }

    if (bookedSlots[timeSlot]) {
      toast.error("That time slot is already booked. Please choose another.");
      return;
    }

    saveDraft({
      service_date: serviceDate,
      time_slot: timeSlot as TimeSlot,
    });

    router.push("/step4");
  };

  return (
    <div className="max-w-xl mx-auto">
      <StepHeader
        step={3}
        total={5}
        title="When should we come?"
        subtitle="Choose your preferred date and time slot for the lawn service."
      />

      <form
        onSubmit={handleSubmit}
        className="space-y-4 bg-white p-5 rounded-xl border border-gray-100 shadow-sm"
      >
        <DateField label="Service Date" value={serviceDate} onChange={setServiceDate} />

        <RadioCardGroup
          label="Time Slot"
          name="time_slot"
          value={timeSlot}
          onChange={setTimeSlot}
          options={TIME_SLOTS}
          disabledValues={disabledValues}
          disabledLabel={serviceDate ? "Already Booked" : "Select a date first"}
        />

        <StepNav onBack={() => router.push("/step2")} nextLabel="Next: Additional Info →" />
      </form>
    </div>
  );
}