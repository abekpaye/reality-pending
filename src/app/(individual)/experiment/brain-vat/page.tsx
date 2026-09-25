import type { Metadata } from "next";
import { BrainVatExperience } from "@/features/experiments/brain-vat/brain-vat-experience";
export const metadata:Metadata={title:"Can You Trust Your Experience? — REALITY PENDING"};
export default function BrainVatPage(){return <BrainVatExperience/>}
