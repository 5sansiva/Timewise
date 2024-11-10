// src/app/api/chat/route.js

import OpenAI from 'openai';
import pool from '../../../../lib/db';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const SYSTEM_PROMPT = `You are a helpful calendar assistant that manages events and appointments. Convert casual natural language inputs into specific calendar commands in JSON format. You should understand various ways users might express dates, times, and event descriptions.

When processing event titles:
- For exact phrases in quotes (e.g., 'my birthday'), use the exact phrase as the title
- For general descriptions, extract the key terms (e.g., "doctor appointment" from "that doctor appointment thing")
- Preserve important words that help identify the event (e.g., "birthday", "meeting", "appointment")

When processing dates and times:
- Relative dates: "tomorrow", "next week", "this weekend", "day after tomorrow"
- Time expressions: "morning" (9:00 AM), "afternoon" (2:00 PM), "evening" (6:00 PM)
- Casual time formats: "10am", "3:30pm", "noon"
- Default durations: 1 hour for appointments/meetings when not specified

Carefully extract the timeframe for searches:
- "tomorrow", "today", "next week", "this week" should set appropriate timeframe
- For specific dates, use "specific_date" timeframe and include the date
- When no timeframe is specified, default to "future" to search upcoming events

Support these operations:

1. Adding events (Keywords: add, schedule, create, book, set up, make):
   {"add": {"title": string, "start_time": ISO8601, "end_time": ISO8601, "all_day": boolean}}

2. Removing events (Keywords: remove, delete, cancel):
   {"remove": {
     "search": {
       "title": string,
       "timeframe": "future" | "all" | "today" | "tomorrow" | "this_week" | "next_week" | "specific_date",
       "date"?: "YYYY-MM-DD"
     }
   }}

3. Moving events (Keywords: move, shift, reschedule):
   {"move": {
     "search": {"title": string, "date"?: "YYYY-MM-DD"},
     "to_date": "YYYY-MM-DD"
   }}

4. Listing events (Keywords: show, list, what's on, what do I have):
   {"list": {"timeframe": "today" | "tomorrow" | "this_week" | "next_week" | "specific_date", "date"?: "YYYY-MM-DD"}}

Examples of correct parsing:
"Delete the 'my birthday' event scheduled the day after tomorrow" →
{"remove": {"search": {"title": "my birthday", "timeframe": "specific_date", "date": "YYYY-MM-DD"}}}

"Cancel tomorrow's meeting" →
{"remove": {"search": {"title": "meeting", "timeframe": "tomorrow"}}}

"Delete that event from next week" →
{"remove": {"search": {"title": "event", "timeframe": "next_week"}}}

Note: When users provide quoted text (e.g., 'my birthday'), use that exact text for the title search.`;

export async function POST(req) {
  if (!process.env.OPENAI_API_KEY) {
    return new Response(
      JSON.stringify({ 
        response: "OpenAI API key is not configured", 
        error: "Missing API key" 
      }), 
      { status: 500 }
    );
  }

  try {
    const { message } = await req.json();
    const now = new Date();
    
    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        { 
          role: "user", 
          content: `Current time is ${now.toISOString()}. User request: ${message}`
        }
      ],
      temperature: 0.7
    });

    const content = completion.choices[0].message.content.trim();
    let parsedResponse;
    
    try {
      parsedResponse = JSON.parse(content);
    } catch (parseError) {
      console.error("Parsing error:", parseError, "Response content:", content);
      return new Response(
        JSON.stringify({ 
          response: "I didn't quite understand that. Could you rephrase it?" 
        }), 
        { status: 400 }
      );
    }

    // Handle remove operation with your original working logic
    if (parsedResponse.remove) {
      const { search } = parsedResponse.remove;
      let query = 'DELETE FROM events WHERE LOWER(title) LIKE LOWER($1)';
      const values = [`%${search.title}%`];
      let paramCount = 2;

      // Add timeframe conditions using your original logic
      if (search.timeframe === 'specific_date' && search.date) {
        query += ` AND DATE(start_time) = $${paramCount}`;
        values.push(search.date);
      } else {
        switch (search.timeframe) {
          case 'future':
            query += ` AND start_time >= CURRENT_DATE`;
            break;
          case 'all':
            // No additional date condition needed
            break;
          case 'today':
            query += ` AND DATE(start_time) = CURRENT_DATE`;
            break;
          case 'tomorrow':
            query += ` AND DATE(start_time) = CURRENT_DATE + interval '1 day'`;
            break;
          case 'this_week':
            query += ` AND DATE(start_time) >= date_trunc('week', CURRENT_DATE)
                      AND DATE(start_time) < date_trunc('week', CURRENT_DATE) + interval '7 days'`;
            break;
          case 'next_week':
            query += ` AND DATE(start_time) >= date_trunc('week', CURRENT_DATE + interval '7 days')
                      AND DATE(start_time) < date_trunc('week', CURRENT_DATE) + interval '14 days'`;
            break;
          default:
            query += ` AND start_time >= CURRENT_DATE ORDER BY start_time ASC LIMIT 1`;
        }
      }

      query += ' RETURNING *';
      
      try {
        const result = await pool.query(query, values);
        
        if (result.rowCount === 0) {
          return new Response(
            JSON.stringify({ 
              response: `No events found matching "${search.title}" for the specified timeframe.`,
              status: 'not_found'
            }), 
            { status: 200 }
          );
        }

        const deletedEvents = result.rows;
        const eventDates = deletedEvents.map(event => 
          new Date(event.start_time).toLocaleDateString()
        ).join(', ');

        return new Response(
          JSON.stringify({ 
            response: `Removed ${result.rowCount} event(s) matching "${search.title}" scheduled for ${eventDates}.`,
            status: 'success'
          }), 
          { status: 200 }
        );
      } catch (dbError) {
        console.error("Database error:", dbError);
        return new Response(
          JSON.stringify({ 
            response: "There was an error accessing the calendar. Please try again.",
            error: dbError.message,
            status: 'error'
          }), 
          { status: 500 }
        );
      }
    }

    // Rest of your original code for other operations...
    if (parsedResponse.update) {
      const { search, changes } = parsedResponse.update;
      
      // First find the event
      const searchResult = await pool.query(
        `SELECT * FROM events 
         WHERE LOWER(title) LIKE LOWER($1) 
         AND DATE(start_time) = $2`,
        [`%${search.title}%`, search.date]
      );
      
      if (searchResult.rowCount === 0) {
        return new Response(
          JSON.stringify({ 
            response: `No event found matching "${search.title}" on ${search.date}.` 
          }), 
          { status: 404 }
        );
      }

      const event = searchResult.rows[0];
      const setClause = [];
      const values = [event.id];
      let paramCount = 2;

      Object.entries(changes).forEach(([key, value]) => {
        setClause.push(`${key} = $${paramCount}`);
        values.push(value);
        paramCount++;
      });

      const query = `
        UPDATE events 
        SET ${setClause.join(', ')}, updated_at = NOW()
        WHERE id = $1
        RETURNING *
      `;

      const result = await pool.query(query, values);
      
      return new Response(
        JSON.stringify({ 
          response: `Updated "${event.title}" successfully.`,
          event: result.rows[0]
        }), 
        { status: 200 }
      );
    }

    if (parsedResponse.add) {
      const { title, start_time, end_time, all_day } = parsedResponse.add;
      
      // Validate the dates
      const startDate = new Date(start_time);
      const endDate = new Date(end_time);
      
      if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
        return new Response(
          JSON.stringify({ 
            response: "I couldn't understand the date/time format. Could you specify it more clearly?" 
          }), 
          { status: 400 }
        );
      }

      const result = await pool.query(
        `INSERT INTO events (title, start_time, end_time, all_day)
         VALUES ($1, $2, $3, $4)
         RETURNING *`,
        [title, start_time, end_time, all_day]
      );
      
      const friendlyStartTime = new Date(start_time).toLocaleString();
      return new Response(
        JSON.stringify({ 
          response: `Added "${title}" to your calendar for ${friendlyStartTime}.`,
          event: result.rows[0]
        }), 
        { status: 200 }
      );
    }


    if (parsedResponse.move) {
      const { title, from_date, to_date } = parsedResponse.move;
      const result = await pool.query(
        `UPDATE events 
         SET start_time = start_time + ($3::date - $2::date),
             end_time = end_time + ($3::date - $2::date),
             updated_at = NOW()
         WHERE title = $1 AND DATE(start_time) = $2
         RETURNING *`,
        [title, from_date, to_date]
      );
      
      if (result.rowCount === 0) {
        return new Response(
          JSON.stringify({ 
            response: `No event found to move.` 
          }), 
          { status: 404 }
        );
      }

      return new Response(
        JSON.stringify({ 
          response: `Moved "${title}" to ${to_date}.`,
          event: result.rows[0]
        }), 
        { status: 200 }
      );
    }

    if (parsedResponse.list) {
      const { date } = parsedResponse.list;
      let query = '';
      let values = [];

      switch (date) {
        case 'today':
          query = `SELECT * FROM events WHERE DATE(start_time) = CURRENT_DATE`;
          break;
        case 'tomorrow':
          query = `SELECT * FROM events WHERE DATE(start_time) = CURRENT_DATE + 1`;
          break;
        case 'this_week':
          query = `
            SELECT * FROM events 
            WHERE DATE(start_time) >= date_trunc('week', CURRENT_DATE)
            AND DATE(start_time) < date_trunc('week', CURRENT_DATE) + interval '7 days'
          `;
          break;
        default:
          query = `SELECT * FROM events WHERE DATE(start_time) = $1`;
          values = [date];
      }

      const result = await pool.query(query, values);
      
      const events = result.rows.map(event => ({
        title: event.title,
        start: event.start_time,
        end: event.end_time,
        allDay: event.all_day
      }));

      return new Response(
        JSON.stringify({ 
          response: `Found ${events.length} event(s)`,
          events 
        }), 
        { status: 200 }
      );
    }
    

    return new Response(
      JSON.stringify({ 
        response: "I'm not sure what you want to do with your calendar. Could you rephrase that?" 
      }), 
      { status: 400 }
    );

  } catch (error) {
    console.error("Error processing message:", error);
    return new Response(
      JSON.stringify({ 
        response: "Sorry, I couldn't process that request. Please try again.",
        error: error.message,
        status: 'error'
      }), 
      { status: 500 }
    );
  }
}