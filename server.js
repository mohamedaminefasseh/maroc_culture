const express = require('express');
const fs = require('fs/promises');
const path = require('path');
const nodemailer = require('nodemailer');

const app = express();
const PORT = process.env.PORT || 3000;
const DATA_DIR = path.join(__dirname, 'data');
const DESTINATIONS_FILE = path.join(DATA_DIR, 'destinations.json');
const MESSAGES_FILE = path.join(DATA_DIR, 'messages.json');

const ITINERARY_TO_EMAIL = process.env.ITINERARY_TO_EMAIL || 'mohamedamine.fasseh@e-polytechnique.ma';

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

async function readJson(filePath, fallback) {
  try {
    const raw = await fs.readFile(filePath, 'utf8');
    return JSON.parse(raw);
  } catch (error) {
    return fallback;
  }
}

async function writeJson(filePath, data) {
  await fs.mkdir(path.dirname(filePath), { recursive: true });
  await fs.writeFile(filePath, JSON.stringify(data, null, 2), 'utf8');
}

function smtpReady() {
  return Boolean(process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS);
}

function buildMailText(message) {
  return `New Morocco itinerary request\n\n` +
    `Name: ${message.name}\n` +
    `Email: ${message.email}\n` +
    `Destination: ${message.destination}\n` +
    `Created at: ${message.createdAt}\n\n` +
    `Message:\n${message.message}\n`;
}

function buildMailHtml(message) {
  return `
    <div style="font-family:Arial,sans-serif;line-height:1.6;color:#241710">
      <h2 style="color:#8d1f2d">New Morocco itinerary request</h2>
      <p><strong>Name:</strong> ${escapeHtml(message.name)}</p>
      <p><strong>Email:</strong> ${escapeHtml(message.email)}</p>
      <p><strong>Destination:</strong> ${escapeHtml(message.destination)}</p>
      <p><strong>Created at:</strong> ${escapeHtml(message.createdAt)}</p>
      <hr />
      <p><strong>Message:</strong></p>
      <p>${escapeHtml(message.message).replace(/\n/g, '<br>')}</p>
    </div>
  `;
}

function escapeHtml(value) {
  return String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;');
}

async function sendItineraryEmail(message) {
  if (!smtpReady()) {
    return {
      sent: false,
      reason: 'SMTP is not configured. Add SMTP_HOST, SMTP_USER and SMTP_PASS in a .env file to send real emails automatically.',
    };
  }

  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT || 465),
    secure: String(process.env.SMTP_SECURE || 'true') === 'true',
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });

  await transporter.sendMail({
    from: process.env.SMTP_FROM || process.env.SMTP_USER,
    to: ITINERARY_TO_EMAIL,
    replyTo: message.email,
    subject: `Morocco itinerary request - ${message.destination}`,
    text: buildMailText(message),
    html: buildMailHtml(message),
  });

  return { sent: true };
}

app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    project: 'Discover Morocco',
    emailTarget: ITINERARY_TO_EMAIL,
    smtpConfigured: smtpReady(),
    timestamp: new Date().toISOString(),
  });
});

app.get('/api/destinations', async (req, res) => {
  const destinations = await readJson(DESTINATIONS_FILE, []);
  const { region, q } = req.query;
  let result = destinations;

  if (region && region !== 'all') {
    result = result.filter((d) => d.region === region);
  }

  if (q) {
    const query = String(q).toLowerCase();
    result = result.filter((d) => `${d.name} ${d.tagline} ${d.scene} ${d.description} ${d.culture || ''} ${d.heritage || ''} ${d.localFood || ''} ${d.craft || ''} ${d.highlights.join(' ')}`.toLowerCase().includes(query));
  }

  res.json(result);
});

app.get('/api/destinations/:slug', async (req, res) => {
  const destinations = await readJson(DESTINATIONS_FILE, []);
  const destination = destinations.find((d) => d.slug === req.params.slug);
  if (!destination) return res.status(404).json({ message: 'Destination not found' });
  res.json(destination);
});

app.get('/api/stats', async (req, res) => {
  const destinations = await readJson(DESTINATIONS_FILE, []);
  const byRegion = destinations.reduce((acc, d) => {
    acc[d.region] = (acc[d.region] || 0) + 1;
    return acc;
  }, {});

  res.json({
    destinations: destinations.length,
    regions: Object.keys(byRegion).length,
    byRegion,
    itineraryEmail: ITINERARY_TO_EMAIL,
    smtpConfigured: smtpReady(),
    landmarks: destinations.map((d) => ({ name: d.name, marker: d.mapLabel, coordinates: [d.lat, d.lng] })),
  });
});

async function handleItineraryRequest(req, res) {
  const { name, email, destination, message } = req.body;
  if (!name || !email || !destination || !message) {
    return res.status(400).json({ message: 'Name, email, destination and message are required.' });
  }

  const messages = await readJson(MESSAGES_FILE, []);
  const newMessage = {
    id: Date.now(),
    name: String(name).trim(),
    email: String(email).trim(),
    destination: String(destination).trim(),
    message: String(message).trim(),
    to: ITINERARY_TO_EMAIL,
    createdAt: new Date().toISOString(),
  };

  messages.unshift(newMessage);
  await writeJson(MESSAGES_FILE, messages);

  let emailStatus;
  try {
    emailStatus = await sendItineraryEmail(newMessage);
  } catch (error) {
    emailStatus = { sent: false, reason: error.message };
  }

  res.status(201).json({
    message: emailStatus.sent
      ? `Itinerary request saved and emailed to ${ITINERARY_TO_EMAIL}.`
      : `Itinerary request saved. Email target is ${ITINERARY_TO_EMAIL}, but automatic email sending needs SMTP configuration.`,
    emailSent: emailStatus.sent,
    emailTarget: ITINERARY_TO_EMAIL,
    emailReason: emailStatus.reason || null,
    data: newMessage,
  });
}

app.post('/api/contact', handleItineraryRequest);
app.post('/api/itinerary', handleItineraryRequest);

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Discover Morocco is running at http://localhost:${PORT}`);
  console.log(`Itinerary requests will be saved and sent to: ${ITINERARY_TO_EMAIL}`);
  if (!smtpReady()) console.log('SMTP is not configured yet. See .env.example to enable automatic email sending.');
});
