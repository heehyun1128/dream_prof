# DREAM PROFESSOR

This project allows users to search for professor ratings, view sentiment trends for professor reviews, and contribute to this platform by providing links to professor ratings. 


# Tech Stack

- **Frontend:**
  - Next.js 14
  - TypeScript
  - Tailwind CSS
  - Axios for API requests

- **Backend:**
  - Python/Flask
  - Next.js
  - Pinecone Vector Database
  - OpenAI 
  - Playwright

- **Data Visualization:**
  - matplotlib (for sentiment graph generations)

# Legal
All rights reserved. You may not use, distribute, or reproduce any part of this repository without the owner's explicit written permission.
You must notify the owner before using this repository in any way.

# Getting Started

## Landing page

  - On this page, users can search for a professor rating by inputing professor-related information, using natural human language. 
    - For example, a good question can be "Can you find me a professor teaching Art History whose rating is greater than 4?"
    
  - **Semantic Search:**
    
    empowered by a RAG pipeline that was developed with OpenAI, Pinecone, and Python/Flask
    
  - **Submit Links:**

    By clicking on the <img width="179" alt="Screenshot 2024-10-07 at 2 36 10 PM" src="https://github.com/user-attachments/assets/587b5761-a7c1-41f3-b78b-ac588d3e1e48"> button, a user can submit links to professor ratings
 
  - **Review Trends:**
    
    By clicking on the <img width="183" alt="Screenshot 2024-10-07 at 2 36 45 PM" src="https://github.com/user-attachments/assets/d5bb4f72-35d7-49b1-8576-8dff8dd6bb8c"> button, a user can review professor rating trends over time

  - **Overview**
    
  <img width="1493" alt="Screenshot 2024-10-07 at 2 16 37 PM" src="https://github.com/user-attachments/assets/85b33aa3-74cf-43ac-ada4-f2d705a22450">

##




##  Submit Links to Professor Reviews

  - **Submit Links:**

    On this page, users can submit links to professor ratings.
    
  - **Automated data processing:**
  
    Our platform will process the input URL, perform automated data scraping, cleaning, embedding, and upsering to Pinecone database.

  - **Overview**
    
  <img width="1420" alt="Screenshot 2024-10-07 at 2 17 24 PM" src="https://github.com/user-attachments/assets/b93f1c98-4470-4d4a-8e67-35e5be3f1d0d">

##

## Sentiment Analysis of Professor Ratings

  - **Review Trends:**
    
    On this page, users can input professor name to view trends ( sentiment ) of professor ratings over time

  - **Overview**
    
  <img width="1486" alt="Screenshot 2024-10-07 at 2 19 51 PM" src="https://github.com/user-attachments/assets/0fa5f1c5-4613-4352-9600-c4b738a5bc0b">

 
