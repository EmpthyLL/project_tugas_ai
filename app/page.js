"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import SelectTab from "./SelectTab";
import PromptTab from "./PromptTab";
import { useRouter, useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";

export default function VoiceCloner() {
  const router = useRouter();
  const dataParams = useSearchParams();
  const currentTab = dataParams.get("tab") || "select";
  const [render, setRender] = useState("prompt");

  return (
    <section className="w-full bg-gradient-to-br from-[#1a1a40] via-[#3f0d85] to-[#8a2be2] transition-all duration-700">
      <div
        className={`min-h-screen ${
          render ? (render === "select" ? "pb-20" : "pb-[575px]") : ""
        } flex flex-col items-center justify-start`}
      >
        {/* Tabs */}
        <div className="w-full max-w-3xl mx-auto p-6">
          <Tabs
            value={currentTab}
            onValueChange={(val) => {
              router.push(`/?${val === "select" ? "" : `tab=${val}`}`);
            }}
            className="w-full"
          >
            {/* Tab Header */}
            <TabsList className="flex justify-center gap-6 mb-10 bg-transparent">
              <TabsTrigger
                value="select"
                className="text-white px-6 py-3 rounded-lg hover:bg-white/15 data-[state=active]:bg-indigo-500/80 transition"
              >
                Select
              </TabsTrigger>
              <TabsTrigger
                value="prompt"
                className="text-white px-6 py-3 rounded-lg hover:bg-white/15 data-[state=active]:bg-purple-500/80 transition"
              >
                Prompt
              </TabsTrigger>
            </TabsList>

            {/* Content */}
            <div className="relative min-h-[500px] w-full">
              <AnimatePresence mode="wait" initial={false}>
                {currentTab === "select" && (
                  <motion.div
                    key="select"
                    initial={{ opacity: 0, x: -100 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 100 }}
                    transition={{ duration: 0.5 }}
                    className="absolute w-full"
                  >
                    <TabsContent value="select" forceMount>
                      <SelectTab setRender={setRender} />
                    </TabsContent>
                  </motion.div>
                )}
                {currentTab === "prompt" && (
                  <motion.div
                    key="prompt"
                    initial={{ opacity: 0, x: 100 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -100 }}
                    transition={{ duration: 0.5 }}
                    className="absolute w-full"
                  >
                    <TabsContent value="prompt" forceMount>
                      <PromptTab setRender={setRender} />
                    </TabsContent>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </Tabs>
        </div>
      </div>
    </section>
  );
}
