"use client";

import APODViewer from "@/components/APODViewer";

export default function Home() {
  return (
    <div className="flex flex-col flex-1 items-center justify-center bg-zinc-50 font-sans dark:bg-black py-10">
      <main className="flex flex-1 w-full max-w-4xl flex-col items-center px-4 sm:px-16 bg-white dark:bg-black rounded-lg">
        <APODViewer />
      </main>
    </div>
  );
}
