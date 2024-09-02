// AdminPage.js or AdminPage.tsx

"use client"; // This is necessary to indicate that the component is a client component

import { config } from "@/sanity.config";
import { NextStudio } from "next-sanity/studio";

export default function AdminPage() {
    return <NextStudio config={config} />;
}
