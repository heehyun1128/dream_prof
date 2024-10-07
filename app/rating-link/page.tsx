'use client'
import React, { useState } from "react";
import axios from "axios";
import { Button } from "@/components/ui/button";

const SubmitProfessorRatingLink: React.FC = () => {
  const [link, setLink] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      setLink("")
      setLoading(true)
      const response = await axios.post("/api/scrape-ratings", { url:link });
      // const response = await axios.post("/api/scraping", { url:link });
      
    } catch (error) {
      console.error("Error submitting link:", error); 
    }finally{
      setLoading(false)
    }
  };

  return (
   <div className="flex flex-col items-center justify-start min-h-screen mt-36">
    <h1 className="mb-16 font-bold text-xl">Enter a link to Professor Review Page</h1>
  {!loading && <form 
    onSubmit={handleSubmit} 
    className="border-cyan-950 flex flex-col items-center justify-center p-6 border rounded-lg shadow-lg w-80"
  >
    <input
      type="url"
      value={link}
      onChange={(e) => setLink(e.target.value)}
      placeholder="Enter Rate My Professor link..."
      required
      className="mb-4 p-2 border border-cyan-950 rounded w-72"
    />
    <Button 
      type="submit" 
      className="transition-colors px-4 py-2  text-white rounded hover:bg-blue-600"
    >
      Submit
    </Button>
  </form>}
  {loading&&<p>Loading data from the link</p>}
</div>

  );
};

export default SubmitProfessorRatingLink;
