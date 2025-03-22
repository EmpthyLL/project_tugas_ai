"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import SelectTab from "./SelectTab";
import { useRouter, useSearchParams } from "next/navigation";
import PromptTab from "./PromptTab";

export default function VoiceCloner() {
  const router = useRouter();
  const dataParams = useSearchParams();
  return (
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
  );
}
