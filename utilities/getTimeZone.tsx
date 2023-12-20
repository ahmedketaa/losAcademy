"use client"
import React, { useEffect, useState } from 'react';
import moment from 'moment-timezone';

const TimeZoneClock = ({ location } : { location: string | any }) => {
  const [currentTime, setCurrentTime] = useState('');

  useEffect(() => {
    // Determine the time zone for the given location (you can get this from an API or user input)
    const timeZone = 'America/New_York'; // Example time zone, replace with your logic
    // Get the current time in the specified time zone
    const timeInZone = moment.tz(timeZone);
    // Update the current time every second
    const intervalId = setInterval(() => {
      setCurrentTime(timeInZone.format('YYYY-MM-DD HH:mm:ss'));
    }, 1000);
    return () => {
      // Clean up the interval when the component unmounts
      clearInterval(intervalId);
    };
  }, [location]);

  return (
    <div>
      <h1>Time in {location}</h1>
      <p>{currentTime}</p>
    </div>
  );
};

export default TimeZoneClock;