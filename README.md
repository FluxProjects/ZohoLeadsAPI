# Zoho CRM Lead API

Node.js API for managing Leads in Zoho CRM Standard module.

## Setup

1. Install dependencies:
```bash
npm install
```

2. Create `.env` file from `.env.example`:
```bash
cp .env.example .env
```

3. Configure `.env` with your Zoho credentials:
- CLIENT_ID: Your Zoho OAuth client ID
- CLIENT_SECRET: Your Zoho OAuth client secret
- REFRESH_TOKEN: Your OAuth refresh token
- REDIRECT_URI: Your OAuth redirect URI
- ENVIRONMENT: PRODUCTION or SANDBOX
- DOMAIN: com, eu, in, com.cn, or com.au

## Run

```bash
npm start
```

## API Endpoints

### Create Lead
```
POST /api/leads
Content-Type: application/json

{
  "Last_Name": "Doe",
  "Phone": "+1234567890",
  "Lead_Status": "New",
  "Location": "Audi City Showroom",
  "First_Name": "John",
  "Email": "john@example.com"
}
```

### Update Lead
```
PUT /api/leads/:id
Content-Type: application/json

{
  "Lead_Status": "Contacted",
  "Email": "newemail@example.com"
}
```

### Delete Lead
```
DELETE /api/leads/:id
```

## Required Fields
- Last_Name
- Phone (unique)
- Lead_Status
- Location

## Field Options

### Lead_Status
Closed, Contacted, Junk Lead, Lost Lead, New, Not Contacted, Not Qualified, Pre-Qualified

### Location
Audi City Showroom, Salwa Showroom

### Nationality
Afghanistan (and others as configured in Zoho)
