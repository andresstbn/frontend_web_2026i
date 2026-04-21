"use client";
import PageUI from "@/components/PageUI";
import { ApodProvider } from "@/hooks/ApodContext";

export default function Home() {
  
  return (
    <ApodProvider>
      <PageUI />
    </ApodProvider>      
  );
}
