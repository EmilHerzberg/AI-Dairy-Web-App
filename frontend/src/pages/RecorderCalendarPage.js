/* frontend/pages/RecorderCalendarPage.js */
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

  // 1) Fetch all user entries on mount
  useEffect(() => {
    const fetchEntries = async () => {
      if (!user?.token) return;
      try {
        const res = await axios.get('http://localhost:5000/api/entries', {
          headers: { Authorization: `Bearer ${user.token}` }
        });
        setEntries(res.data);
      } catch (error) {
        console.error('Error fetching entries:', error);
      }
    };
    fetchEntries();
  }, [user]);

  // 2) Helper: check if a given date has entries
  //    We can compare only the date portion (year, month, day)
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

  // 3) When a day on the calendar is clicked, set 'selectedDate'
  const onCalendarChange = (date) => {
    setSelectedDate(date);

    // Filter the relevant entries for that day
    const filtered = entries.filter((entry) => {
      const entryDate = new Date(entry.date);
      return (
        entryDate.getFullYear() === date.getFullYear() &&
        entryDate.getMonth() === date.getMonth() &&
        entryDate.getDate() === date.getDate()
      );
    });
    setDayEntries(filtered);
  };

  // 4) Style or highlight days on the calendar that have entries
  const tileClassName = ({ date, view }) => {
    // view = 'month' -> we only want to style days in month view
    if (view === 'month') {
      if (hasEntriesOnDay(date)) {
        return 'has-entries'; // a custom CSS class, see below
      }
    }
    return null;
  };

  return (
    <div className="max-w-5xl mx-auto p-6">
      <h1 className="text-3xl mb-4">Recorder + Calendar</h1>
      <div className="flex flex-col md:flex-row gap-8">
        
        {/* Left Column: Audio Recorder */}
        <div className="md:w-1/2">
          <AudioRecorder />
        </div>
        
        {/* Right Column: Calendar + Day Entries */}
        <div className="md:w-1/2">
          <Calendar
            onClickDay={onCalendarChange}
            value={selectedDate}
            tileClassName={tileClassName}
          />

          <h2 className="text-xl mt-4 mb-2">
            Entries for {selectedDate.toDateString()}:
          </h2>
          {dayEntries.length === 0 && (
            <p>No entries found for this day.</p>
          )}
          {dayEntries.map((entry, idx) => (
            <div key={entry._id || idx} className="p-2 border-b">
              <p><strong>Transcription:</strong> {entry.transcript}</p>
              {/* Optionally add more details */}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
