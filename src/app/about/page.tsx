"use client";

import React from "react";
import { Navigation } from "@/components/layout/Navigation";

export default function AboutPage() {
  return (
    <div>
      <Navigation />
      <main className="min-h-screen bg-abyss-black p-8">
        <h1 className="text-4xl font-bold text-white">About TMT</h1>
        <p className="text-gray-400 mt-4">This is a test page</p>
      </main>
    </div>
  );
}