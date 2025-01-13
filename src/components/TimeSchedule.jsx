import React, { useState, useEffect } from "react";
import "./TimeSchedule.css";

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

  console.log("Current schedule:", schedule);

  return (
    <div className="anime-schedule-container">
      <h1 className="schedule-title">Anime Schedule</h1>
      {Array.isArray(schedule) && schedule.length > 0 ? (
        <div className="anime-grid">
          {schedule.map((anime, index) => (
            <div key={index} className="anime-card">
              <img
                className="anime-poster"
                src={anime.poster}
                alt={anime.title}
              />
              <h2 className="anime-title">{anime.title}</h2>
              <p className="anime-studio">Studio: {anime.studio}</p>
              <p className="anime-airing-time">
                Airing Time: {anime.animeDate}
              </p>
              <p className="anime-genres">Genres: {anime.genre}</p>
            </div>
          ))}
        </div>
      ) : (
        <p className="loading-message">Loading schedule data...</p>
      )}
    </div>
  );
}

export default TimeSchedule;
