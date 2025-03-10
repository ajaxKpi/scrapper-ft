const axios = require('axios');
const cheerio = require('cheerio');
const config = require('./config');
const { SELECTORS, sendEmailNotification } = require('./shared');

/**
 * Checks for available tickets
 */
async function checkForAvailableTickets() {
  try {
    const response = await axios.get(config.urls.smallSceneUrl);
    const $ = cheerio.load(response.data);
    const events = $(SELECTORS.EVENT_ITEM);
    const blacklistedUrl = [];

    for (const event of events) {
      const button = $(event).find(SELECTORS.BUTTON);
      const onclickValue = button.attr('onclick');
      const urlMatch = onclickValue.match(/popup_ticket_banner\('(.*)'\)/);
      const link = urlMatch[1];
      const seatPlaces = [];
      const date = $(event).find(SELECTORS.DATE).text().trim();

      let eventResponse;
      try {
        eventResponse = await axios.get(link);
      } catch (error) {
        blacklistedUrl.push(link);
        console.error('Failed with a link:', link);
        continue;
      }

      if (eventResponse.status !== 200 && !blacklistedUrl.includes(link)) {
        continue;
      }

      const event$ = cheerio.load(eventResponse.data);
      const svgStatus = event$(SELECTORS.SVG_STATUS);

      const availableTickets = svgStatus.find('rect').filter(function () {
        if (this.attribs.fill === 'gray') {
          return false;
        }
        seatPlaces.push(this.attribs.title || this.attribs['data-original-title']);
        return true;
      });

      if (availableTickets.length > config.minAvailableTickets) {
        const msg = `Tickets available at date: ${date}! Check out the link: ${link}. Seats: ${seatPlaces.join(', ')}`;
        console.log(msg);
        await sendEmailNotification(msg);
      } else {
        await sendEmailNotification(`No tickets available at date: ${date}.`);
        console.log(`No tickets available at date: ${date}.`);
      }
    }
  } catch (error) {
    console.error('Error:', error.message);
  }
}

// Run check every 2 minutes
setInterval(checkForAvailableTickets, config.checkInterval);

// Initial check
checkForAvailableTickets();
