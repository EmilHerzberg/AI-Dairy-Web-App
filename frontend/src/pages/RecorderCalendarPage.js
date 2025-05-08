// frontend/pages/RecorderCalendarPage.js

/**
 * Purpose:
 *  - Shows an audio recorder component and a calendar.
 *  - Fetches/saves diary entries, highlights dates with entries, and displays transcripts for the selected day.
 */

import React, { useState, useEffect } from 'react';
import AudioRecorder from '../components/AudioRecorder';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css'; 
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext';

/**
 * RecorderCalendarPage shows:
 *  1) A calendar that highlights days with diary entries.
 *  2) An audio recorder component to record and upload audio.
 *  3) A display of transcripts for the currently selected date.
 */
export default function RecorderCalendarPage() {
  // Get the current logged-in user's info (userId, token)
  const { user } = useAuth();

  // Store all entries from the database
  const [entries, setEntries] = useState([]);
  // The currently selected date in the calendar
  const [selectedDate, setSelectedDate] = useState(new Date());
  // The array of entries specific to the selected date
  const [dayEntries, setDayEntries] = useState([]);

  /**
   * Fetches all diary entries from the server for the authenticated user.
   * Attaches the JWT token in the header for authorization.
   */
  const fetchEntries = async () => {
    if (!user?.token) return [];
    try {
      const res = await axios.get('http://localhost:5000/api/entries', {
        headers: { Authorization: `Bearer ${user.token}` }
      });
      setEntries(res.data);
      return res.data;
    } catch (error) {
      console.error('Error fetching entries:', error);
    }
  };

  /**
   * Runs once on component mount (or when `user` changes).
   * It retrieves all existing diary entries from the server.
   */
  useEffect(() => {
    fetchEntries();
  }, [user]);

  /**
   * Whenever `entries` or `selectedDate` changes,
   * compute which diary entries belong to the selected day.
   */
  useEffect(() => {
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

  /**
   * Callback triggered after a successful file upload in the AudioRecorder component.
   * Re-fetch the entire list of entries to keep the UI in sync.
   */
  const handleUploadSuccess = () => {
    fetchEntries();
  };

  /**
   * Helper function to check if a given date has any entries.
   * This is used to determine if we should highlight the calendar date.
   */
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

  /**
   * Handler when a calendar day is clicked:
   * we just set the selectedDate, which triggers the useEffect to filter dayEntries.
   */
  const onCalendarChange = (date) => {
    setSelectedDate(date);
  };

  /**
   * Dynamically add a CSS class to calendar days that have entries,
   * so we can highlight them in the UI.
   */
  const tileClassName = ({ date, view }) => {
    if (view === 'month') {
      if (hasEntriesOnDay(date)) {
        // 'has-entries' is a custom CSS class in index.css
        return 'has-entries';
      }
    }
    return null;
  };

  return (
    <div className="container my-5">
      <h1 className="mb-4 diary-heading">Recorder + Calendar</h1>
      <div className="row g-4">

        {/* LEFT COLUMN: The audio recorder card */}
        <div className="col-12 col-md-6">
          <div className="card p-4">
            <AudioRecorder onUploadSuccess={handleUploadSuccess}  />
          </div>
        </div>
        
        {/* RIGHT COLUMN: The calendar and the day's transcripts */}
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
