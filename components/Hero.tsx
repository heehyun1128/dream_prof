"use client";
import React, { useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import axios from "axios";
import ReactMarkdown from "react-markdown";
import Loader from "@/components/loader";
import { useRouter } from "next/navigation";

type Message = {
  role: string;
  content: string;
};

const Hero: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [isChatting, setIsChatting] = useState<boolean>(false);

  const router = useRouter();
  const searchProfessor = async () => {
    try {
      setMessages((messages) => [
        ...messages,
        { role: "user", content: searchTerm },
      ]);
      setLoading(true);
      setSearchTerm("");
      setIsChatting(true);

      const res = await axios.post(
        "/api/chat",
        JSON.stringify([...messages, { role: "user", content: searchTerm }])
      );
      console.log(res);
      const { data } = res;

      setMessages((messages) => [
        ...messages,

        { role: "assistant", content: res.data },
      ]);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching data from the server:", error);
    }
  };

  return (
    <main className="h-[calc(100vh-64px)]  container mx-auto px-4 sm:px-6 py-8 sm:py-16 text-center relative z-10 text-default">
      <motion.h1
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.5 }}
        className="text-[36px] sm:text-[52px] md:text-[56px] lg:text-[68px] font-extrabold leading-[1.1] mb-4 text-black text-center tracking-tighter"
      >
        Find Your Dream Professor Today
      </motion.h1>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, duration: 0.5 }}
        className="mt-12 flex justify-center"
      >
        <div className="relative w-full max-w-2xl">
          <input
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            type="text"
            placeholder="Search for professor rating..."
            className="w-full py-3 px-4 pr-12 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-200 focus:border-purple-500 transition duration-300 ease-in-out shadow-sm hover:shadow-md"
          />

          <Button
            onClick={searchProfessor}
            className="absolute right-1 top-1/2 transform -translate-y-1/2 rounded-full"
            size="icon"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="11" cy="11" r="8"></circle>
              <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
            </svg>
          </Button>
        </div>
      </motion.div>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1}}
        transition={{ delay: 0.6, duration: 0.4 }}
        className="mt-20 mr-12 min-h-[fit-content] mb-[40px]"
      >
        <div  className="flex justify-center">
        <div className="mr-4">
          <Button className="bg-black" onClick={() => router.push("/rating-link")}>
            Submit a Professor Review Link
          </Button>
        </div>
        <div className="mb-4">
          <Button className="bg-black" onClick={() => router.push("/view-review-trend")}>
            View a Professor&apos;s review Trend
          </Button>
        </div>
        </div>
        <AnimatePresence>
          {messages.map((chat, index) => (
            <motion.div
              key={index}
              className={`my-2 flex ${
                chat?.role === "user" ? "justify-end" : "justify-start"
              }`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <motion.div
                className={`p-3 rounded-2xl ${
                  chat?.role === "user"
                    ? "bg-purple-700 text-white"
                    : "bg-white shadow-purple-300"
                } shadow-md max-w-[90%] break-words`}
              >
                <strong>
                  {chat?.role === "user" ? "You: " : "Dream Professor: "}
                </strong>{" "}
                {chat?.role === "user" ? (
                  chat?.content
                ) : (
                  <ReactMarkdown className="prose prose-sm max-w-none overflow-hidden">
                    {chat?.content}
                  </ReactMarkdown>
                )}
              </motion.div>
            </motion.div>
          ))}
        </AnimatePresence>
        {loading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <Loader />
          </motion.div>
        )}
      </motion.div>

      {!isChatting && <div></div>}
    </main>
  );
};

export default Hero;
