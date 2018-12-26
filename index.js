const whois = require('whois');
const twilio = require('twilio');
const envVars = require('./envVars');

const twilioClient = new twilio(envVars.twilioSID, envVars.twilioAuth);
let isAvailable = false;

function checkOnInterval(interval) {
  let checker = setInterval(() => {
    if (isAvailable) {
      clearInterval(checker);
    } else {
      performLookup('jordanbourne.com');
    }
  }, interval);
}

function performLookup(domain) {
  whois.lookup(domain, {
    timeout: 15000,
    verbose: true
  }, (err, data) => {
    if (domainIsAvailable(data[0].data)) {
      console.log(`Domain ${domain} is available`);
      isAvailable = true;
      sendText(`Domain ${domain} is available`);
    } else {
      console.log(`Domain ${domain} is not available`);
    }
  });
}

function domainIsAvailable(data) {
  if (data.includes('No match for domain') || data.includes('ACTIVE')) {
    return true;
  }
  return false;
}

function sendText(message) {
  twilioClient.messages.create({
    to: envVars.myPhone,
    from: envVars.twilioNumber,
    body: message
  });
}

performLookup('jordanbourne.com');
checkOnInterval(5 * 60 * 1000);
