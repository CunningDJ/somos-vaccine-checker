
const axios = require('axios');
const { JSDOM } = require('jsdom');
const nodemailer = require('nodemailer');

const ListingEntry = require('./ListingEntry');

const config = require('./config.json');
const auth = require('./auth.json');

var senderEmail = config.senderEmail.replace('@', '%40');
var mailTransport = nodemailer.createTransport(`smtps://${senderEmail}:${auth.email}@${config.smtpHost}`);

function main() {
    const SEARCH_ZIP_CODE = config.searchZip;
    const FIVE_DAY_INCREMENTS = 3;
    
    const PLACE_NAME_SEARCH_TEXT = config.searchPlaceName;

    const now = new Date();

    let checkDate = now;
    // Increments start date by five days at a time
    let availabilityPromises = []
    for (let i=0; i<FIVE_DAY_INCREMENTS; ++i, checkDate.setDate(checkDate.getDate() + 5)) {
        availabilityPromises.push(checkAvailablityEntry(checkDate, SEARCH_ZIP_CODE, PLACE_NAME_SEARCH_TEXT));
    }
    Promise.all(availabilityPromises)
        .then(listingEntries => {
            const availableDateColumns = listingEntries.reduce((availDateCols, entry) => {
                availDateCols.concat(entry.columns.filter(col => col.available));
            }, []);
            const unAvailableDateColumns = listingEntries.reduce((unAvailDateCols, entry) => {
                unAvailDateCols.concat(entry.columns.filter(col => !col.available));
            }, []);
            console.log(`avail dateCols: ${availableDateColumns}`);
            console.log(`UNavail dateCols: ${unAvailableDateColumns}`);
        })
}

function checkAvailablityEntry(date, zip, placeNameSearchText) {
    // Returns a Promise with the matching Entry with 5 date availabilities
    const endpoint = getEndpoint(date, zip);
    return new Promise((reject, resolve) => {
        axios.get(endpoint)
            .then(res => {
                const { data } = res;
                if (data && data.Content) {
                    // console.log(res.data);
                    const dom = new JSDOM(data.Content);
                    const { body } = dom.window.document;
                    const rows = body.getElementsByClassName('row');

                    let matchingEntry = null;
                    for (let i=0; i < rows.length; ++i) {
                        let r = rows[i];
                        // console.log(r.innerHTML)
                        // const headers = getRowHeaders(r);
                        let listingEntry = null;
                        try {
                            listingEntry = new ListingEntry(r);
                        } catch (e) {
                            // console.log('Failed for row: ', e);
                            continue;
                        }
                        console.log(listingEntry.header);
                        
                        if (listingEntry.header.indexOf(placeNameSearchText) !== -1) {
                            // Found Brandeis High row
                            // matchingRow = r;
                            // Turns all headers into Date objects, then filters by valid resulting dates
                            // currentDates = headers.map(h => (new Date(h)))
                            //                       .filter(d => (d instanceof Date && d.getTime() === d.getTime()));
                            
                            matchingEntry = listingEntry;
                            // console.log(`Matching Entry: ${matchingEntry}`);
                            // console.log(matchingEntry.columns);
                            break;
                        }
                    }

                    if (matchingEntry !== null) {
                        resolve(matchingEntry);
                        matchingEntry.columns.forEach(c => {
                            if (c.available) {
                                console.log(`DATE AVAILABLE: ${date.toLocaleDateString()} (place: ${placeNameSearchText})`)
                                console.log(c.button.innerHTML)
                            }
                        });
                    } else {
                        resolve(null);
                    }
                } else {
                    reject(`ERROR: No data retrieved for API endpoint search [PLACE:${placeNameSearchText} | ZIP:${zip} | DATE:${date.toLocaleDateString()}]`);
                }
            })
        .catch(err => {
            reject('Axios error:', err);
        })
    })
}

function getEndpoint(date, zip) {
    // localeDateString e.g.: '3/29/2021'
    date = new Date(date);
    const localeDateString = date.toLocaleDateString();
    return `https://somosvaccination.mdland.com/p/sites/?action=getSiteWithSlot&zipcode=${zip}&day=${localeDateString}&step=0`;
}

if (require.main === module) {
    main();
}
