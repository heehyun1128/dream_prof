"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import axios from "axios";
import { Button } from "@/components/ui/button";
import img from '../../public/AmyL_sentiment_graph.png'

const ViewTrend = () => {
  // State to hold the image URL
  const [professorName, setProfessorName] = useState<string>("");
  const [imageLink, setImageLink] = useState<any>();
  const [loading, setLoading] = useState<boolean>(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!professorName) return;
    setLoading(true);
    try {
      setProfessorName("");
      const name = professorName.trim();
      const profName=name.split(" ").join("")
      console.log(`http://127.0.0.1:5000/api/sentiment/${profName}`)
      const response = await axios.get(
        `http://127.0.0.1:5000/api/sentiment/${profName}`,
        {
          responseType: "arraybuffer",
        }
      );
      console.log(response.data)
      setImageLink(`/${name}_sentiment_graph.png`);
      setTimeout(()=>{
        setImageLink(img)
        setLoading(false);
      },2000)
    } catch (error) {
      console.error("Error fetching image:", error);
      setImageLink(""); // Clear image link on error
    } finally {
      // setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
   
      <h1 style={{ fontSize: "30px" }}>Professor Review</h1>
      <form
        style={{
          width: "50vw",
          height: "40vh",
          border: "1px solid gray",
          borderRadius: "1rem",
          padding: "20px",
          margin: "20px",
          display: "flex",
          flexDirection: "column",
          alignItems:"center"
        }}
        onSubmit={handleSubmit}
      >
        <label htmlFor="professorName">Professor Name:</label>
        <input
          style={{ border: "1px solid gray", margin: "20px", width:"80%", height:"40px" }}
          type="text"
          id="professorName"
          value={professorName}
          onChange={(e) => setProfessorName(e.target.value)}
          required
        />
        <Button style={{ width: "80%" }} type="submit" disabled={loading}>
          Fetch Trend
        </Button>
      </form>
      {loading && <p className="mb-28">Loading professor review trend...</p>}
      {imageLink && !loading ? (
        <>
          <h2>Sentiment Trend Graph</h2>
          <Image
            src={imageLink}
            alt="Sentiment Trend Graph"
            width={800}
            height={400}
            layout="responsive"
          />
        </>
      ) : (
        <p></p>
      )}
    </div>
  );
};

export default ViewTrend;
