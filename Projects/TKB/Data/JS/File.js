const table = document.querySelector('table');
const today = new Date().getDay();

if (today > 0 && today < 7) {
    table.rows[today].classList.add('today');
    table.rows[today].cells[3].style.backgroundColor = 'red';
}