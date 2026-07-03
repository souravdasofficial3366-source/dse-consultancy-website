const SHEET_NAME = "Enquiries";
const HEADERS = [
  "Received At",
  "Owner Name",
  "Phone Number",
  "Email Address",
  "Business Type",
  "City/Town",
  "Source Page",
  "Consent"
];

function doPost(event) {
  const lock = LockService.getScriptLock();

  try {
    const payload = JSON.parse(event.postData.contents);
    const expectedSecret =
      PropertiesService.getScriptProperties().getProperty("WEBHOOK_SECRET");

    if (!expectedSecret || payload.secret !== expectedSecret) {
      return jsonResponse({ ok: false, error: "Unauthorized." });
    }

    const lead = payload.lead || {};
    if (
      !lead.owner_name ||
      !lead.phone_number ||
      !lead.email_address ||
      !lead.shop_type ||
      !lead.city_town ||
      lead.privacy_consent !== true
    ) {
      return jsonResponse({ ok: false, error: "Invalid enquiry data." });
    }

    lock.waitLock(10000);

    const spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
    let sheet = spreadsheet.getSheetByName(SHEET_NAME);

    if (!sheet) {
      sheet = spreadsheet.insertSheet(SHEET_NAME);
    }

    if (sheet.getLastRow() === 0) {
      sheet.appendRow(HEADERS);
      sheet.getRange(1, 1, 1, HEADERS.length).setFontWeight("bold");
      sheet.setFrozenRows(1);
    }

    sheet.appendRow([
      new Date(),
      safeCell(lead.owner_name),
      safeCell(lead.phone_number),
      safeCell(lead.email_address),
      safeCell(lead.shop_type),
      safeCell(lead.city_town),
      safeCell(lead.source_path || "/"),
      "Yes"
    ]);

    const row = sheet.getLastRow();
    sheet.getRange(row, 1).setNumberFormat("dd mmm yyyy, hh:mm:ss");
    sheet.getRange(row, 3).setNumberFormat("@");
    sheet.autoResizeColumns(1, HEADERS.length);

    return jsonResponse({ ok: true });
  } catch (error) {
    return jsonResponse({
      ok: false,
      error: error instanceof Error ? error.message : String(error)
    });
  } finally {
    if (lock.hasLock()) {
      lock.releaseLock();
    }
  }
}

function safeCell(value) {
  const text = String(value).trim();
  return /^[=+\-@]/.test(text) ? "'" + text : text;
}

function jsonResponse(value) {
  return ContentService.createTextOutput(JSON.stringify(value)).setMimeType(
    ContentService.MimeType.JSON
  );
}
