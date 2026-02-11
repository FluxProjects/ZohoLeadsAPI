require('dotenv').config();
const express = require('express');
const { initializeZohoSDK } = require('./zohoClient');
const { createLead, updateLead, deleteLead } = require('./leadController');

const app = express();
app.use(express.json());

app.post('/api/leads', createLead);
app.put('/api/leads/:id', updateLead);
app.delete('/api/leads/:id', deleteLead);

app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

const PORT = process.env.PORT || 3000;

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
