import React, { useState, useEffect } from 'react';
import AudioRecorder from '../components/AudioRecorder';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css'; // import default styling
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext';

export default function RecorderCalendarPage() {
  const { user } = useAuth(); // user has { userId, token }

  const [entries, setEntries] = useState([]);        // All diary entries
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [dayEntries, setDayEntries] = useState([]);   // Entries for the selected day

  const fetchEntries = async () => {
    if (!user?.token) return [];
    try {
      const res = await axios.get('http://localhost:5000/api/entries', {
        headers: { Authorization: `Bearer ${user.token}` }
      });
      setEntries(res.data);
        // Return them so the caller can do further logic
        return res.data;

    } catch (error) {
      console.error('Error fetching entries:', error);
    }
  };

  // 1) Fetch all user entries on mount
  useEffect(() => {
    fetchEntries();
  }, [user]);

  useEffect(() => {
    // Re-compute dayEntries every time `entries` or `selectedDate` changes
    const filtered = entries.filter(entry => {
      const entryDate = new Date(entry.date);
      return (
        entryDate.getFullYear() === selectedDate.getFullYear() &&
        entryDate.getMonth() === selectedDate.getMonth() &&
        entryDate.getDate() === selectedDate.getDate()
      );
    });
    setDayEntries(filtered);
  }, [entries, selectedDate]);

  const handleUploadSuccess = () => {
  // 1) Re-fetch the entire list
   fetchEntries(); 
  };

  // 2) Helper: check if a given date has entries
  function hasEntriesOnDay(date) {
    return entries.some((entry) => {
      const entryDate = new Date(entry.date);
      return (
        entryDate.getFullYear() === date.getFullYear() &&
        entryDate.getMonth() === date.getMonth() &&
        entryDate.getDate() === date.getDate()
      );
    });
  }

  // 3) When a day on the calendar is clicked
  const onCalendarChange = (date) => {
    setSelectedDate(date);
    // // Filter the relevant entries for that day
    // const filtered = entries.filter((entry) => {
    //   const entryDate = new Date(entry.date);
    //   return (
    //     entryDate.getFullYear() === date.getFullYear() &&
    //     entryDate.getMonth() === date.getMonth() &&
    //     entryDate.getDate() === date.getDate()
    //   );
    // });
    // setDayEntries(filtered);
  };

  // 4) Style or highlight days on the calendar that have entries
  const tileClassName = ({ date, view }) => {
    if (view === 'month') {
      if (hasEntriesOnDay(date)) {
        return 'has-entries'; // uses the .has-entries style from index.css
      }
    }
    return null;
  };

  return (
    <div className="container my-5">
      <h1 className="mb-4 diary-heading">Recorder + Calendar</h1>
      <div className="row g-4">
        
        {/* Left Column: Audio Recorder */}
        <div className="col-12 col-md-6">
          <div className="card p-4">
            <AudioRecorder onUploadSuccess={handleUploadSuccess}  />
          </div>
        </div>
        
        {/* Right Column: Calendar + Day Entries */}
        <div className="col-12 col-md-6">
          <div className="card p-4">
            <Calendar
              onClickDay={onCalendarChange}
              value={selectedDate}
              tileClassName={tileClassName}
            />
            <h2 className="fs-4 mt-4 mb-2">
              Entries for {selectedDate.toDateString()}:
            </h2>
            {dayEntries.length === 0 && (
              <p>No entries found for this day.</p>
            )}
            {dayEntries.map((entry, idx) => (
              <div key={entry._id || idx} className="p-2 border-bottom">
                <p><strong>Transcription:</strong> {entry.transcript}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
