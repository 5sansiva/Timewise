import pool from '../../../../lib/db';


app.post('/api/signup', async (req, res) => {
    const { email, password, first_name, last_name } = req.body;
  
    // Simple validation
    if (!email || !password || !first_name || !last_name) {
      return res.status(400).json({ error: "All fields are required" });
    }
  
    // Check if the email is already registered
    const existingUserResult = await client.query('SELECT * FROM users WHERE email = $1', [email]);
    if (existingUserResult.rows.length > 0) {
      return res.status(400).json({ error: "Email already in use" });
    }
  
    // Hash the password before saving it
    const hashedPassword = await bcrypt.hash(password, 10);
  
    // Insert the new user into the database
    try {
      const query = `
        INSERT INTO users (first_name, last_name, email, password)
        VALUES ($1, $2, $3, $4)
      `;
      await client.query(query, [first_name, last_name, email, hashedPassword]);
      return res.status(201).json({ message: "Signup successful!" });
    } catch (err) {
      console.error(err);
      return res.status(500).json({ error: "Internal server error" });
    }
  });
  
  // Start the server
  app.listen(3000, () => console.log("Server running on http://localhost:3000"));