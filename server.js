require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { initializeZohoSDK } = require('./zohoClient');
const { createLead, updateLead, deleteLead, getLeads, getLead } = require('./leadController');

const app = express();

app.use(cors({ origin: 'http://localhost:3001' }));

app.use(express.json());

app.post('/leads', createLead);
app.get('/leads', getLeads);
app.get('/leads/:id', getLead);
app.put('/leads/:id', updateLead);
app.delete('/leads/:id', deleteLead);

app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

const PORT = process.env.PORT || 3004;

initializeZohoSDK()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch(error => {
    console.error('Failed to initialize Zoho SDK:', error);
    process.exit(1);
  });
