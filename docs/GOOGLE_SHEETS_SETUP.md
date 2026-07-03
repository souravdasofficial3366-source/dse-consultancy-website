# Google Sheets enquiry storage

This setup stores each website enquiry as one organized row in a Google Sheet.

## 1. Create the sheet

1. Create a blank Google Sheet.
2. Name it `DSE Consultancy Enquiries`.
3. In the sheet, open **Extensions → Apps Script**.
4. Replace the starter code with the contents of
   `integrations/google-sheets/Code.gs`.
5. Save the Apps Script project.

The script creates an `Enquiries` tab automatically with these columns:

- Received At
- Owner Name
- Phone Number
- Business Type
- City/Town
- Source Page
- Consent

## 2. Add the shared secret

1. In Apps Script, open **Project Settings**.
2. Under **Script Properties**, add a property named `WEBHOOK_SECRET`.
3. Generate a long random value (at least 32 characters) and paste it as the value.
4. Keep this value private. Do not add it to GitHub.

## 3. Deploy the webhook

1. Click **Deploy → New deployment**.
2. Select **Web app**.
3. Set **Execute as** to `Me`.
4. Set **Who has access** to `Anyone`.
5. Deploy and approve the requested Google permissions.
6. Copy the web app URL ending in `/exec`.

## 4. Add the two Vercel environment variables

Add these values to the Vercel project for Production and Preview:

```text
GOOGLE_SHEETS_WEBHOOK_URL=<the Apps Script /exec URL>
GOOGLE_SHEETS_WEBHOOK_SECRET=<the same Script Property value>
```

Redeploy the website after adding the variables. Submit one test enquiry and confirm
that a new row appears in the `Enquiries` tab.

If both Google Sheets and Supabase are configured, Google Sheets is used as the
primary enquiry store.
