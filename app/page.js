"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import SelectTab from "./SelectTab";
import { useRouter, useSearchParams } from "next/navigation";
import PromptTab from "./PromptTab";

export default function VoiceCloner() {
  const router = useRouter();
  const dataParams = useSearchParams();
  return (
    <section className="bg-bannerImg bg-no-repeat bg-cover bg-bottom">
      <div className="w-full h-screen flex items-end bg-blackOverlay">
        <div className="container mx-auto mb-40">
        <div className="p-4 w-full max-w-xl mx-auto">
      <Tabs
        value={dataParams.get("tab") || "select"}
        onValueChange={(val) => {
          router.push(`/?${val === "select" ? "" : `tab=${val}`}`);
        }}
        className="mt-4"
      >
        <TabsList>
          <TabsTrigger value="select">Select</TabsTrigger>
          <TabsTrigger value="prompt">Prompt</TabsTrigger>
        </TabsList>
        <TabsContent value="select">
          <SelectTab />
        </TabsContent>
        <TabsContent value="prompt">
          <PromptTab />
        </TabsContent>
      </Tabs>
    </div>
        </div>
      </div>
       
    </section>
   
  );
}