// Elari welcome: bewaart de planning in een Google Sheet.
// Plak deze code in Extensies > Apps Script van een lege Google Sheet en zet hem live als web-app.

const SHEET = 'Planning';
const HEADER = ['id', 'name', 'message', 'theme', 'start', 'end'];

function sheet_() {
  const ss = SpreadsheetApp.getActive();
  let s = ss.getSheetByName(SHEET);
  if (!s) {
    s = ss.insertSheet(SHEET);
    s.appendRow(HEADER);
    s.setFrozenRows(1);
  }
  return s;
}

function read_() {
  const rows = sheet_().getDataRange().getValues();
  rows.shift();
  return rows.filter((r) => r[0]).map((r) => ({
    id: String(r[0]), name: String(r[1]), message: String(r[2]), theme: String(r[3] || 'auto'),
    start: new Date(r[4]).toISOString(), end: new Date(r[5]).toISOString(),
  }));
}

function json_(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(ContentService.MimeType.JSON);
}

// De tv-pagina en de plan-pagina halen hiermee de planning op.
function doGet() {
  return json_({ now: Date.now(), items: read_() });
}

// De plan-pagina stuurt hiermee { action: 'add', item } of { action: 'delete', id }.
function doPost(e) {
  const lock = LockService.getScriptLock();
  lock.waitLock(10000);
  try {
    const body = JSON.parse(e.postData.contents);
    const s = sheet_();

    if (body.action === 'add') {
      const i = body.item;
      const name = String(i.name || '').trim().slice(0, 60);
      const start = new Date(i.start), end = new Date(i.end);
      if (!name || isNaN(start) || isNaN(end) || end <= start) return json_({ ok: false, error: 'Ongeldige invoer' });
      s.appendRow([String(i.id), name, String(i.message || '').slice(0, 100), String(i.theme || 'auto'), start, end]);
    } else if (body.action === 'delete') {
      const ids = s.getRange(1, 1, s.getLastRow(), 1).getValues().map((r) => String(r[0]));
      const row = ids.indexOf(String(body.id)) + 1;
      if (row > 1) s.deleteRow(row);
    }

    // opruimen: alles wat meer dan een dag geleden is afgelopen
    const cutoff = Date.now() - 24 * 3600e3;
    const data = s.getDataRange().getValues();
    for (let r = data.length; r >= 2; r--) {
      if (new Date(data[r - 1][5]).getTime() < cutoff) s.deleteRow(r);
    }
    return json_({ ok: true, now: Date.now(), items: read_() });
  } finally {
    lock.releaseLock();
  }
}
