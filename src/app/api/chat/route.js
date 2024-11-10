// Name: Venkat Sai Eshwar Varma Sagi (VXS210103)

// import the OpenAI library to use their API
import OpenAI from 'openai';
// import database connection pool
import pool from '../../../../lib/db';

// create new OpenAI instance with API key
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// define system prompt that tells GPT how to process calendar commands
// this is the instruction set for the AI to understand natural language
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

3. Updating events (Keywords: change, update, modify, edit, rename, reschedule):
   {"update": {
     "search": {
       "title": string,
       "timeframe": "future" | "today" | "tomorrow" | "this_week" | "next_week" | "specific_date",
       "date"?: "YYYY-MM-DD"
     },
     "changes": {
       "title"?: string,
       "start_time"?: ISO8601,
       "end_time"?: ISO8601,
       "all_day"?: boolean
     }
   }}

4. Listing events (Keywords: show, list, what's on, what do I have):
   {"list": {"timeframe": "today" | "tomorrow" | "this_week" | "next_week" | "specific_date", "date"?: "YYYY-MM-DD"}}

Examples of correct parsing:
"Change the name of the 'doctor appointment' tomorrow to 'medical checkup'" →
{"update": {
  "search": {"title": "doctor appointment", "timeframe": "tomorrow"},
  "changes": {"title": "medical checkup"}
}}

"Make tomorrow's meeting an all-day event" →
{"update": {
  "search": {"title": "meeting", "timeframe": "tomorrow"},
  "changes": {"all_day": true}
}}

Note: For updates, search for the most specific match possible using the provided title and timeframe.`;

// main POST function that handles all calendar requests
export async function POST(req) {
  // check if OpenAI API key exists
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
    // get message from request body
    const { message } = await req.json();
    // get current time
    const now = new Date();
    
    // send request to OpenAI to process the natural language
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

    // get response content and trim whitespace
    const content = completion.choices[0].message.content.trim();
    let parsedResponse;
    
    // try to parse JSON response from OpenAI
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

    // handle update operations for calendar events
    if (parsedResponse.update) {
      // get search criteria and changes to make
      const { search, changes } = parsedResponse.update;
      // start building SQL query
      let query = 'SELECT * FROM events WHERE LOWER(title) LIKE LOWER($1)';
      const values = [`%${search.title}%`];
      let paramCount = 2;

      // add date/time conditions to query based on timeframe
      if (search.timeframe === 'specific_date' && search.date) {
        query += ` AND DATE(start_time) = $${paramCount}`;
        values.push(search.date);
        paramCount++;
      } else {
        // handle different timeframe options
        switch (search.timeframe) {
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
            query += ` AND start_time >= CURRENT_DATE`;
        }
      }

      // limit to first matching event
      query += ' ORDER BY start_time ASC LIMIT 1';

      // search for event in database
      const searchResult = await pool.query(query, values);
      
      // if no event found, return error
      if (searchResult.rowCount === 0) {
        return new Response(
          JSON.stringify({ 
            response: `No event found matching "${search.title}" for the specified timeframe.` 
          }), 
          { status: 404 }
        );
      }

      // get found event
      const event = searchResult.rows[0];
      
      // prepare update query
      const updateValues = [event.id];
      const updateClauses = [];
      paramCount = 2;

      // add title update if provided
      if (changes.title) {
        updateClauses.push(`title = $${paramCount}`);
        updateValues.push(changes.title);
        paramCount++;
      }
      
      // add start time update if provided
      if (changes.start_time) {
        updateClauses.push(`start_time = $${paramCount}`);
        updateValues.push(changes.start_time);
        paramCount++;
      }
      
      // add end time update if provided
      if (changes.end_time) {
        updateClauses.push(`end_time = $${paramCount}`);
        updateValues.push(changes.end_time);
        paramCount++;
      }
      
      // add all-day flag update if provided
      if (changes.all_day !== undefined) {
        updateClauses.push(`all_day = $${paramCount}`);
        updateValues.push(changes.all_day);
        paramCount++;
      }

      // create final update query
      const updateQuery = `
        UPDATE events 
        SET ${updateClauses.join(', ')}, updated_at = NOW()
        WHERE id = $1
        RETURNING *
      `;

      // execute update query
      const result = await pool.query(updateQuery, updateValues);
      
      // prepare response message
      const updatedEvent = result.rows[0];
      let responseMessage = `Updated event: "${updatedEvent.title}"`;
      if (changes.all_day) {
        responseMessage += ' (now an all-day event)';
      } else if (changes.start_time) {
        responseMessage += ` for ${new Date(updatedEvent.start_time).toLocaleString()}`;
      }

      // return success response
      return new Response(
        JSON.stringify({ 
          response: responseMessage,
          event: updatedEvent
        }), 
        { status: 200 }
      );
    }

    // handle remove operations
    if (parsedResponse.remove) {
      // get search criteria
      const { search } = parsedResponse.remove;
      // start building delete query
      let query = 'DELETE FROM events WHERE LOWER(title) LIKE LOWER($1)';
      const values = [`%${search.title}%`];
      let paramCount = 2;

      // add timeframe conditions to query
      if (search.timeframe === 'specific_date' && search.date) {
        query += ` AND DATE(start_time) = $${paramCount}`;
        values.push(search.date);
      } else {
        // handle different timeframe options
        switch (search.timeframe) {
          case 'future':
            query += ` AND start_time >= CURRENT_DATE`;
            break;
          case 'all':
            // no date filter needed
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

      // add returning clause to get deleted events
      query += ' RETURNING *';
      
      try {
        // execute delete query
        const result = await pool.query(query, values);
        
        // if no events found
        if (result.rowCount === 0) {
          return new Response(
            JSON.stringify({ 
              response: `No events found matching "${search.title}" for the specified timeframe.`,
              status: 'not_found'
            }), 
            { status: 200 }
          );
        }

        // prepare response with deleted events info
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

    // handle add operations
    if (parsedResponse.add) {
      // get event details
      const { title, start_time, end_time, all_day } = parsedResponse.add;
      
      // validate dates
      const startDate = new Date(start_time);
      const endDate = new Date(end_time);
      
      // check if dates are valid
      if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
        return new Response(
          JSON.stringify({ 
            response: "I couldn't understand the date/time format. Could you specify it more clearly?" 
          }), 
          { status: 400 }
        );
      }

      // insert new event into database
      const result = await pool.query(
        `INSERT INTO events (title, start_time, end_time, all_day)
         VALUES ($1, $2, $3, $4)
         RETURNING *`,
        [title, start_time, end_time, all_day]
      );
      
      // format response with friendly time
      const friendlyStartTime = new Date(start_time).toLocaleString();
      return new Response(
        JSON.stringify({ 
          response: `Added "${title}" to your calendar for ${friendlyStartTime}.`,
          event: result.rows[0]
        }), 
        { status: 200 }
      );
    }

    // handle move operations
    if (parsedResponse.move) {
      // get move details
      const { title, from_date, to_date } = parsedResponse.move;
      // update event dates
      const result = await pool.query(
        `UPDATE events 
         SET start_time = start_time + ($3::date - $2::date),
             end_time = end_time + ($3::date - $2::date),
             updated_at = NOW()
         WHERE title = $1 AND DATE(start_time) = $2
         RETURNING *`,
        [title, from_date, to_date]
      );
      
      // if no event found
      if (result.rowCount === 0) {
        return new Response(
          JSON.stringify({ 
            response: `No event found to move.` 
          }), 
          { status: 404 }
        );
      }

      // return success response
      return new Response(
        JSON.stringify({ 
          response: `Moved "${title}" to ${to_date}.`,
          event: result.rows[0]
        }), 
        { status: 200 }
      );
    }

    // handle list operations
    if (parsedResponse.list) {
      // get date parameter
      const { date } = parsedResponse.list;
      let query = '';
      let values = [];

      // build query based on timeframe
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
          // for specific date queries
          query = `SELECT * FROM events WHERE DATE(start_time) = $1`;
          values = [date];
      }

      // execute list query
      const result = await pool.query(query, values);
      
      // format events for response
      const events = result.rows.map(event => ({
        title: event.title,
        start: event.start_time,
        end: event.end_time,
        allDay: event.all_day
      }));

      // return list of events
      return new Response(
        JSON.stringify({ 
          response: `Found ${events.length} event(s)`,
          events 
        }), 
        { status: 200 }
      );
    }
    
    // if no valid operation found, return error
    return new Response(
      JSON.stringify({ 
        response: "I'm not sure what you want to do with your calendar. Could you rephrase that?" 
      }), 
      { status: 400 }
    );

  } catch (error) {
    // log any errors that occur
    console.error("Error processing message:", error);
    // return error response
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