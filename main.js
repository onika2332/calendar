
const date_picker_element = document.querySelector('.date-picker');
const dates_element = document.querySelector('.date-picker .dates');
const selected_date_element = document.querySelector('.date-picker .selected-date');

function toggleDatePicker(e) {
    dates_element.classList.toggle('active');
}
selected_date_element.addEventListener('click',toggleDatePicker);

function checkEventPathForClass (path, selector) {
	for (let i = 0; i < path.length; i++) {
		if (path[i].classList && path[i].classList.contains(selector)) {
			return true;
		}
	}
	
	return false;
}

const month_element = document.querySelector('.date-picker .dates .month .mth');

const next_month_element = document.querySelector('.date-picker .dates .month .next-month');
const prev_month_element = document.querySelector('.date-picker .dates .month .prev-month');

const days_element = document.querySelector('.date-picker .dates .days');

const months = ['January',
                'February',
                'March',
                'April',
                'May',
                'June',
                'July',
                'August',
                'September',
                'October',
                'November',
                'December']


//go to next month
next_month_element.addEventListener('click', goToNextMonth);
function goToNextMonth(eve) {
    month++;
    if(month > 11){
        month = 0;
        year++;
    }
    month_element.textContent = months[month] + ' ' + year;
    populateDates();

}

//go to previous month
prev_month_element.addEventListener('click',goToPreviousMonth);
function goToPreviousMonth(eve) {
    month--;
    if(month < 0){
        month = 11;
        year--;
    }
    month_element.textContent = months[month] + ' ' + year;
    populateDates();

}

let date = new Date();
let day = date.getDate();
let month = date.getMonth();
let year = date.getFullYear();

let selectedDate = date;
let selectedDay = day;
let selectedMonth = month;
let selectedYear = year;

function formatDate(d) {
    let day =d.getDate();
    if( day < 10 ){
        day = '0' + day;
    }

    let month = d.getMonth() + 1;
    if( 10 > month ) {
        month = '0' + month;
    }

    let year = d.getFullYear();
    return day + '/' + month + '/' + year;
}

selected_date_element.textContent = formatDate(date);

month_element.textContent = months[month] + ' ' + year;

populateDates();

selected_date_element.dataset.value = selectedDate;
//populateDates();
function populateDates(e) {
    days_element.innerHTML = '';

    let amount_days = 31;
    if(month == 1){
        amount_days = 28;
    }else if(month == 3 ||
         month == 5 ||
         month == 8 ||
         month == 10){
        
        
        amount_days = 30;
    }


    for( let i = 0; i < amount_days; i++ ) {
        day_element = document.createElement('div');

        day_element.textContent = i + 1;

        day_element.classList.add('day');

        

        if( selectedDay == i + 1 &&
            selectedMonth == month &&
            selectedYear == year){

            day_element.classList.add('selected');
            
        }

        day_element.addEventListener('click', function () {
            selectedDate = new Date(year + '-' + (month + 1) + '-' + (i + 1));
			selectedDay = (i + 1);
			selectedMonth = month;
			selectedYear = year;

			selected_date_element.textContent = formatDate(selectedDate);
            selected_date_element.dataset.value = selectedDate;
            
            populateDates();
        })

        days_element.appendChild(day_element);

    }
}

























