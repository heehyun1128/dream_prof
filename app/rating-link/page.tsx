'use client'
import React, { useState } from "react";
import axios from "axios";

const SubmitProfessorRatingLink: React.FC = () => {
  const [link, setLink] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      setLink("")
      setLoading(true)
      const response = await axios.post("/api/scraping", { url:link });
      
    } catch (error) {
      console.error("Error submitting link:", error); 
    }finally{
      setLoading(false)
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="url"
        value={link}
        onChange={(e) => setLink(e.target.value)}
        placeholder="Enter Rate My Professor link"
        required
      />
      <button type="submit">Submit</button>
    </form>
  );
};

export default SubmitProfessorRatingLink;
