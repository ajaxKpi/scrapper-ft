const axios = require('axios');
const cheerio = require('cheerio');
const config = require('./config');
const { sendEmailNotification } = require('./shared');


const args = process.argv;
const urlLink = args[2] || config.urls.largeSceneUrl;
const SELECTORS_Buna = {
  EVENT_ITEM: '.performanceHero__dates-item',
  BUTTON: '.button.hvr-shutter-out-horizontal',
  SVG_STATUS: '#svgStatus',
  TOOLTIP_BUTTON: '.tooltip-button'
};

/**
 * Checks for new available events
 */
async function checkForNewEvent() {
  try {
    const response = await axios.get(urlLink);
    const $ = cheerio.load(response.data);
    const events = $(SELECTORS_Buna.EVENT_ITEM);

    for (const event of events) {
      const button = $(event).find('a');
      const link = button.attr('href');
      const seatPlaces = [];

      const eventResponse = await axios.get(link);
      if (eventResponse.status !== 200) {
        console.error('Error:', eventResponse.statusText);
        continue;
      }

      const event$ = cheerio.load(eventResponse.data);
      const rect = event$(SELECTORS_Buna.TOOLTIP_BUTTON);

      const availableTickets = rect.filter(function () {
        const classes = event$(this).attr('class').split(' ');
        if (classes.includes('occupied')) {
          return false;
        }
        seatPlaces.push(this.attribs.title);
        return true;
      });

      if (availableTickets.length > config.minAvailableTickets) {
        const msg = `At least ${config.minAvailableTickets} place(s) found for date found on ${config.urls.baseUrl} here - ${link}. With Seats: ${seatPlaces.join(', ')}`;
        console.log('Event found! Email notification sent.', seatPlaces.join(', '));
        await sendEmailNotification(msg);
        break;
      }
    }

    console.log(`No Events found. At the time: ${new Date().toLocaleString()}`);
  } catch (error) {
    console.error('Error:', error.message);
  }
}

// Run check every 2 minutes
setInterval(checkForNewEvent, config.checkInterval);

// Initial check
checkForNewEvent();
