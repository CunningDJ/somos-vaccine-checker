const ListingDateColumn = require("./ListingDateColumn");

module.exports = class ListingEntry {
    constructor(listingRowElement) {
        this.el = listingRowElement;
        
        this.header = this.el.getElementsByTagName('h5')[0].textContent;
        this.columns = Array.from(this.el.getElementsByClassName('col-2'))
                            .map(col => new ListingDateColumn(col));
    }
}