/**
 * KELME შეკვეთების ცხრილი — Google Apps Script
 * ჩასმა: Google Sheets → Extensions → Apps Script → ჩაანაცვლე ეს კოდი → შეინახე.
 * Project Settings → Script properties: SECRET = (იგივე, რაც Netlify-ში SHEETS_SECRET)
 *                                     NOTIFY_EMAIL = (სურვილისამებრ, ვისაც მოუვიდეს წერილი)
 * Deploy → New deployment → Web app → Execute as: Me, Who has access: Anyone → URL ჩასვი Netlify-ში SHEETS_WEBHOOK_URL-ად.
 */
const HEAD = {
  orders: ["შეკვეთა", "თარიღი", "სტატუსი", "სახელი", "ტელეფონი", "ელფოსტა", "პროდუქტები", "წყვილი", "ჯამი ₾", "დაზოგა ₾", "მიწოდება ₾", "მიღება", "მისამართი", "გადახდა", "კომენტარი", "ბანკის ID", "განახლდა"],
  leads: ["თარიღი", "ორგანიზაცია", "სახელი", "ტელეფონი", "რაოდენობა", "შენიშვნა"],
  newsletter: ["თარიღი", "ელფოსტა"]
};
const NAMES = { orders: "შეკვეთები", leads: "გუნდური მოთხოვნები", newsletter: "გამომწერები" };

function sheet_(key) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sh = ss.getSheetByName(NAMES[key]);
  if (!sh) {
    sh = ss.insertSheet(NAMES[key]);
    sh.appendRow(HEAD[key]);
    sh.getRange(1, 1, 1, HEAD[key].length).setFontWeight("bold").setBackground("#111").setFontColor("#fff");
    sh.setFrozenRows(1);
  }
  return sh;
}

function doPost(e) {
  const props = PropertiesService.getScriptProperties();
  let d;
  try { d = JSON.parse(e.postData.contents); } catch (err) { return out_({ ok: false, error: "json" }); }
  if ((props.getProperty("SECRET") || "") !== (d.secret || "")) return out_({ ok: false, error: "secret" });

  const lock = LockService.getScriptLock(); lock.waitLock(20000);
  try {
    if (d.kind === "order") upsertOrder_(d.order, props);
    else if (d.kind === "lead") sheet_("leads").appendRow([new Date(d.at), d.data.org, d.data.name, "'" + d.data.phone, d.data.qty, d.data.note]);
    else if (d.kind === "newsletter") sheet_("newsletter").appendRow([new Date(d.at), d.data.email]);
  } finally { lock.releaseLock(); }
  return out_({ ok: true });
}

function upsertOrder_(o, props) {
  const sh = sheet_("orders");
  const items = o.lines.map(l => `${l.model} (${l.color}) ${l.size} ×${l.q}`).join("\n");
  const pairs = o.lines.reduce((a, l) => a + l.q, 0);
  const row = [o.id, new Date(o.createdAt), o.statusText, o.customer.name, "'" + o.customer.phone, o.customer.email, items, pairs, o.total, o.discount, o.shipping,
    o.ship === "pickup" ? "აღება ისთ ფოინთი" : "მიწოდება", o.ship === "pickup" ? "" : (o.city + ", " + o.address), o.pay === "card" ? "ბარათი ონლაინ" : "მაღაზიაში", o.note, o.payment ? o.payment.provider + ":" + o.payment.id : "", new Date()];
  const ids = sh.getRange(1, 1, Math.max(sh.getLastRow(), 1), 1).getValues().map(r => r[0]);
  const idx = ids.indexOf(o.id);
  if (idx > 0) sh.getRange(idx + 1, 1, 1, row.length).setValues([row]);
  else {
    sh.appendRow(row);
    const email = props.getProperty("NOTIFY_EMAIL");
    if (email) MailApp.sendEmail(email, `KELME შეკვეთა ${o.id} — ${o.total} ₾`, `${o.customer.name} ${o.customer.phone}\n\n${items}\n\nჯამი: ${o.total} ₾\nსტატუსი: ${o.statusText}`);
  }
  const color = { "გადახდილია": "#d9f2e1", "ელოდება გადახდას": "#fff4cc", "გადახდა ვერ შესრულდა": "#fde2e2" }[o.statusText];
  const r = idx > 0 ? idx + 1 : sh.getLastRow();
  sh.getRange(r, 3).setBackground(color || null);
}

function out_(obj) { return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(ContentService.MimeType.JSON); }

/** ტესტი: Apps Script რედაქტორში აირჩიე testOrder და Run */
function testOrder() {
  upsertOrder_({ id: "KG000000-TEST01", createdAt: new Date().toISOString(), statusText: "ახალი (ტესტი)", customer: { name: "ტესტი", phone: "+995599000000", email: "" }, lines: [{ model: "Elite", color: "შავი", size: "42", q: 1 }], total: 107.5, discount: 107.5, shipping: 0, ship: "pickup", pay: "store", note: "" }, PropertiesService.getScriptProperties());
}
