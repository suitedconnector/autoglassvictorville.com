const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const fs = require('fs');
const cloudinary = require('cloudinary').v2;
const busboy = require('busboy');

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Initialize database
const dbPath = path.join('/tmp', 'leads.db');
const db = new sqlite3.Database(dbPath);

// Create table if not exists
db.run(`
  CREATE TABLE IF NOT EXISTS leads (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    phone TEXT NOT NULL,
    year INTEGER,
    make TEXT,
    model TEXT,
    photo_url TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )
`);

exports.handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Method not allowed' }),
    };
  }

  return new Promise((resolve) => {
    const bb = busboy({ headers: event.headers });
    const fields = {};
    let photoFile = null;
    let photoMimetype = null;

    bb.on('file', (fieldname, file, info) => {
      if (fieldname === 'photo') {
        const chunks = [];
        file.on('data', (data) => {
          chunks.push(data);
        });
        file.on('end', () => {
          photoFile = Buffer.concat(chunks);
          photoMimetype = info.mimeType;
        });
      }
    });

    bb.on('field', (fieldname, val) => {
      fields[fieldname] = val;
    });

    bb.on('close', async () => {
      try {
        const { name, phone, year, make, model } = fields;

        // Validate required fields
        if (!name || !phone) {
          return resolve({
            statusCode: 400,
            body: JSON.stringify({ error: 'Name and phone are required' }),
          });
        }

        let photoUrl = null;

        // Upload photo to Cloudinary if provided
        if (photoFile) {
          try {
            const result = await new Promise((resolve, reject) => {
              const uploadStream = cloudinary.uploader.upload_stream(
                {
                  folder: 'autoglassvictorville/leads',
                  resource_type: 'auto',
                },
                (error, result) => {
                  if (error) reject(error);
                  else resolve(result);
                }
              );
              uploadStream.end(photoFile);
            });
            photoUrl = result.secure_url;
          } catch (uploadError) {
            console.error('Cloudinary upload error:', uploadError);
            return resolve({
              statusCode: 500,
              body: JSON.stringify({ error: 'Photo upload failed' }),
            });
          }
        }

        // Save lead to SQLite
        return new Promise((resolve) => {
          db.run(
            `INSERT INTO leads (name, phone, year, make, model, photo_url)
             VALUES (?, ?, ?, ?, ?, ?)`,
            [name, phone, year || null, make || null, model || null, photoUrl],
            function (err) {
              if (err) {
                console.error('Database error:', err);
                return resolve({
                  statusCode: 500,
                  body: JSON.stringify({ error: 'Failed to save lead' }),
                });
              }

              resolve({
                statusCode: 200,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                  success: true,
                  leadId: this.lastID,
                  message: 'Lead saved successfully',
                }),
              });
            }
          );
        });
      } catch (error) {
        console.error('Error:', error);
        return resolve({
          statusCode: 500,
          body: JSON.stringify({ error: 'Internal server error' }),
        });
      }
    });

    bb.write(event.body, event.isBase64Encoded ? 'base64' : 'binary');
    bb.end();
  });
};
