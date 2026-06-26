/**
 * RSVP webhook — receives POST from the wedding site and appends a row.
 *
 * Setup:
 *   1. Open the Google Sheet that will hold RSVPs.
 *   2. Extensions → Apps Script → paste this file's contents into Code.gs.
 *   3. Deploy → New deployment → type "Web app".
 *        - Execute as: Me
 *        - Who has access: Anyone
 *      Authorize when prompted.
 *   4. Copy the deployment URL into the site's .env as VITE_RSVP_ENDPOINT.
 *
 * Re-deploying: if you change this code, redeploy (Deploy → Manage deployments
 * → pencil icon → "New version") and re-copy the URL.
 */

const SHEET_NAME = 'RSVPs';

function doPost(e) {
  try {
    const body = JSON.parse(e.postData.contents);
    const sheet = getOrCreateSheet_();
    sheet.appendRow([
      new Date(),
      body.name || '',
      body.phone || '',
      body.guests || '',
      body.attending || '',
      body.message || '',
      body.submittedAt || ''
    ]);
    return json_({ ok: true });
  } catch (err) {
    return json_({ ok: false, error: String(err) });
  }
}

function doGet() {
  return json_({ ok: true, hint: 'POST your RSVP JSON to this URL.' });
}

function getOrCreateSheet_() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sheet = ss.getSheetByName(SHEET_NAME);
  if (!sheet) {
    sheet = ss.insertSheet(SHEET_NAME);
    sheet.appendRow(['Received At', 'Name', 'Phone', 'Guests', 'Attending', 'Message', 'Client Timestamp']);
    sheet.setFrozenRows(1);
  }
  return sheet;
}

function json_(obj) {
  return ContentService
    .createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}
