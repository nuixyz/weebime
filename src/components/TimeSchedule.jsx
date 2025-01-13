import React, { useState, useEffect } from "react";

function TimeSchedule() {
  const [schedule, setSchedule] = useState([]);

  useEffect(() => {
    console.log("Fetching data...");

    fetch("/ScrapedData/animeSchedule.json")
      .then((res) => {
        console.log("Response:", res);
        return res.json();
      })
      .then((data) => {
        console.log("Data:", data);
        setSchedule(data);
      })
      .catch((err) => {
        console.error("Error fetching data:", err);
      });
  }, []);

  // Debug log to check if component is rendering
  console.log("Current schedule:", schedule);

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Anime Schedule</h1>
      {Array.isArray(schedule) && schedule.length > 0 ? (
        schedule.map((anime, index) => (
          <div key={index} className="mb-6 p-4 border rounded">
            <h2 className="text-xl font-semibold mb-2">{anime.title}</h2>
            <p className="mb-2">Airing Time: {anime.animeDate}</p>
            <p className="mb-2">Genres: {anime.genre}</p>
          </div>
        ))
      ) : (
        <p>Loading schedule data...</p>
      )}
    </div>
  );
}

export default TimeSchedule;
