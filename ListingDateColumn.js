
module.exports = class ListingDateColumn {
    constructor(columnElement) { 
        this.el = columnElement;
        this.header = this.el.getElementsByTagName('h5')[0].getElementsByTagName('span')[0].textContent;

        this.date = new Date(this.header);
        // Only the month and day of month is given, so this sets the assumed year as this year
        this.date.setFullYear((new Date()).getFullYear());

        this.button = this.el.getElementsByTagName('button')[0];
        // class: appoint-slot-closed indicates there's no available slot
        this.available = !this.button.classList.contains('appointment-slot-closed');
    }
}