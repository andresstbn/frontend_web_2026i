"use client";
import PageUI from "@/components/PageUI";
import { ApodProvider } from "@/context/ApodContext";

export default function Home() {
  
  return (
    <ApodProvider>
      <PageUI />
    </ApodProvider>      
  );
}
