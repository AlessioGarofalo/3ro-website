// Waitlist provider settings. Edit this file only — no other code needs to change.
//
// Brevo (recommended, EU-based): create a subscription form in Brevo
// (Contacts → Forms → Subscription), enable double opt-in, then open the
// form's "Share → Embed → HTML" code and copy the <form action="..."> URL here.
// Add contact attributes FIRSTNAME and INTEREST (text) in Brevo to keep those fields.
//
// Buttondown: set provider to 'buttondown' and action to
// 'https://buttondown.com/api/emails/embed-subscribe/<your-username>'.
//
// While action is empty, the form falls back to a pre-filled email to info@3ro.io,
// so sign-ups are never lost.
export const WAITLIST = {
  provider: 'brevo',          // 'brevo' | 'buttondown'
  action: 'https://68968fdf.sibforms.com/serve/MUIFAOVSv2Q05SnFOIRto6PjEcaa-d9zBX02mxhPgEQOG2GuVK5DpEzdOHpJrZ5x7hYUUIgE99cDs6M8xD_i1IZdrKqURy0YJvG6yZqsMzTlIub6ZvKmeHN_ycpQ003XhxHkRBFJ3TEX23nn-PIKxSqzA1aOsdFq-IUFh_tuL36Y72NuzgWqOtEPXod7jQspJ-9NZka-fgjh2QojIA==',
  fallbackEmail: 'info@3ro.io'
};

// Maps the page's fields to each provider's expected field names.
export const FIELD_MAP = {
  brevo: {email: 'EMAIL', firstname: 'FIRSTNAME', interest: 'INTEREST', extra: {locale: 'en', html_type: 'simple', email_address_check: ''}},
  buttondown: {email: 'email', firstname: 'metadata__first_name', interest: 'tag', extra: {}}
};
