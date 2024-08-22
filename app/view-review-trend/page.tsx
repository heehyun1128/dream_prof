'use client'
import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import axios from 'axios';

const ViewTrend = () => {
    // State to hold the image URL
    const [professorName, setProfessorName] = useState<string>('');
    const [imageLink, setImageLink] = useState<string>('');
    const [loading, setLoading] = useState<boolean>(false);

  
       const handleSubmit=async (e)=>{
        e.preventDefault();
        if (!professorName) return; 
        setLoading(true);
        try {
            setProfessorName("")
            const name=professorName.trim()
            const response = await axios.get(`http://127.0.0.1:5000/api/sentiment-trend/${encodeURIComponent(name)}`, {
                responseType: 'arraybuffer',
            });
            setImageLink(`/${name}_sentiment_graph.png`); 
        } catch (error) {
            console.error('Error fetching image:', error);
            setImageLink(''); // Clear image link on error
        } finally {
            setLoading(false);
            
        }
       }
       

        
   
       return (
        <div>
            <h1>Professor Review</h1>
            <form onSubmit={handleSubmit}>
                <label htmlFor="professorName">Professor Name:</label>
                <input
                    type="text"
                    id="professorName"
                    value={professorName}
                    onChange={(e) => setProfessorName(e.target.value)}
                    required
                />
                <button type="submit" disabled={loading}>Fetch Trend</button>
            </form>
            {loading && <p>Loading...</p>}
            {imageLink && !loading ? (
                <Image
                    src={imageLink}
                    alt="Sentiment Trend Graph"
                    width={800}
                    height={400}
                    layout="responsive"
                />
            ) : (
                <p></p>
            )}
        </div>
    );
};

export default ViewTrend;
