const timeZone = 7.0;


const date_picker_element = document.querySelector('.date-picker');
const dates_element = document.querySelector('.date-picker .dates');
const selected_date_element = document.querySelector('.date-picker .selected-date');

function toggleDatePicker(e) {
    dates_element.classList.toggle('active');
}
selected_date_element.addEventListener('click',toggleDatePicker);


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
        if(year % 400 == 0){
            amount_days = 29;
        }else if( year % 100 != 0 && year % 4 == 0){
            amount_days = 29;
        }
        else{
            amount_days = 28;
        }
    }else if(month == 3 ||
         month == 5 ||
         month == 8 ||
         month == 10){
        
        
        amount_days = 30;
    }


    for( let i = 0; i < amount_days; i++ ) {
        day_element = document.createElement('div');

        //day_element.textContent = i + 1;

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

        solar_day = document.createElement('div');
        solar_day.textContent = i + 1;
        solar_day.classList.add('solar-day');
        day_element.appendChild(solar_day);

        lunar_day = document.createElement('div');
        lunar_day.classList.add('lunar-day');
        day_element.appendChild(lunar_day);
        console.log( selectedYear  + '/' + (selectedMonth + 1));
        let lunar_day_obj = convertSolar2Lunar(i + 1, month + 1, year, 7.0);
        lunar_day.textContent = lunar_day_obj.getDate() + '/' + (1 + lunar_day_obj.getMonth());

    }
}

var PI = Math.PI;

function INT(d) {
	return Math.floor(d);
}
//convert from date to Julius day
function jdFromDate(dd, mm, yy){    
    var a, y, m, jd;
    a = INT((14 - mm) / 12);
    y = yy+4800-a;
    m = mm+12*a-3;
    jd = dd + INT((153*m+2)/5) + 365*y + INT(y/4) - INT(y/100) + INT(y/400) - 32045;
    if (jd < 2299161) {
        jd = dd + INT((153*m+2)/5) + 365*y + INT(y/4) - 32083;
    }
    return jd;
}

//convert julius day to date
function jdToDate(jd){

    var a, b, c, d, e, m, day, month, year;
    if (jd > 2299160) { // After 5/10/1582, Gregorian calendar
        a = jd + 32044;
        b = INT((4*a+3)/146097);
        c = a - INT((b*146097)/4);
    } else {
        b = 0;
        c = jd + 32082;
    }
    d = INT((4*c+3)/1461);
    e = c - INT((1461*d)/4);
    m = INT((5*e+2)/153);
    day = e - INT((153*m+2)/5) + 1;
    month = m + 3 - 12*INT(m/10);
    year = b*100 + d - 4800 + INT(m/10);
    return new Array(day, month, year);
}

function getNewMoonDay(k, timeZone){

    var T, T2, T3, dr, Jd1, M, Mpr, F, C1, deltat, JdNew;
    T = k/1236.85; // Time in Julian centuries from 1900 January 0.5
    T2 = T * T;
    T3 = T2 * T;
    dr = PI/180;
    Jd1 = 2415020.75933 + 29.53058868*k + 0.0001178*T2 - 0.000000155*T3;
    Jd1 = Jd1 + 0.00033*Math.sin((166.56 + 132.87*T - 0.009173*T2)*dr); // Mean new moon
    M = 359.2242 + 29.10535608*k - 0.0000333*T2 - 0.00000347*T3; // Sun's mean anomaly
    Mpr = 306.0253 + 385.81691806*k + 0.0107306*T2 + 0.00001236*T3; // Moon's mean anomaly
    F = 21.2964 + 390.67050646*k - 0.0016528*T2 - 0.00000239*T3; // Moon's argument of latitude
    C1=(0.1734 - 0.000393*T)*Math.sin(M*dr) + 0.0021*Math.sin(2*dr*M);
    C1 = C1 - 0.4068*Math.sin(Mpr*dr) + 0.0161*Math.sin(dr*2*Mpr);
    C1 = C1 - 0.0004*Math.sin(dr*3*Mpr);
    C1 = C1 + 0.0104*Math.sin(dr*2*F) - 0.0051*Math.sin(dr*(M+Mpr));
    C1 = C1 - 0.0074*Math.sin(dr*(M-Mpr)) + 0.0004*Math.sin(dr*(2*F+M));
    C1 = C1 - 0.0004*Math.sin(dr*(2*F-M)) - 0.0006*Math.sin(dr*(2*F+Mpr));
    C1 = C1 + 0.0010*Math.sin(dr*(2*F-Mpr)) + 0.0005*Math.sin(dr*(2*Mpr+M));
    if (T < -11) {
        deltat= 0.001 + 0.000839*T + 0.0002261*T2 - 0.00000845*T3 - 0.000000081*T*T3;
    } else {
        deltat= -0.000278 + 0.000265*T + 0.000262*T2;
    };
    JdNew = Jd1 + C1 - deltat;
    return INT(JdNew + 0.5 + timeZone/24);
}

//
function getSunLongitude(jdn, timeZone){

    var T, T2, dr, M, L0, DL, L;
    T = (jdn - 2451545.5 - timeZone/24) / 36525; // Time in Julian centuries from 2000-01-01 12:00:00 GMT
    T2 = T*T;
    dr = PI/180; // degree to radian
    M = 357.52910 + 35999.05030*T - 0.0001559*T2 - 0.00000048*T*T2; // mean anomaly, degree
    L0 = 280.46645 + 36000.76983*T + 0.0003032*T2; // mean longitude, degree
    DL = (1.914600 - 0.004817*T - 0.000014*T2)*Math.sin(dr*M);
    DL = DL + (0.019993 - 0.000101*T)*Math.sin(dr*2*M) + 0.000290*Math.sin(dr*3*M);
    L = L0 + DL; // true longitude, degree
    L = L*dr;
    L = L - PI*2*(INT(L/(PI*2))); // Normalize to (0, 2*PI)
    return INT(L / PI * 6);
}

//
function getLunarMonth11(yy, timeZone){

    var k, off, nm, sunLong;
    off = jdFromDate(31, 12, yy) - 2415021;
    k = INT(off / 29.530588853);
    nm = getNewMoonDay(k, timeZone);
    sunLong = getSunLongitude(nm, timeZone); // sun longitude at local midnight
    if (sunLong >= 9) {
        nm = getNewMoonDay(k-1, timeZone);
    }
    return nm;
}

//
function getLeapMonthOffset(a11, timeZone){

    var k, last, arc, i;
    k = INT((a11 - 2415021.076998695) / 29.530588853 + 0.5);
    last = 0;
    i = 1; // We start with the month following lunar month 11
    arc = getSunLongitude(getNewMoonDay(k+i, timeZone), timeZone);
    do {
        last = arc;
        i++;
        arc = getSunLongitude(getNewMoonDay(k+i, timeZone), timeZone);
    } while (arc != last && i < 14);
    return i-1;
}

////

function convertSolar2Lunar(dd, mm, yy, timeZone){

    var k, dayNumber, monthStart, a11, b11, lunarDay, lunarMonth, lunarYear, lunarLeap;
    dayNumber = jdFromDate(dd, mm, yy);
    k = INT((dayNumber - 2415021.076998695) / 29.530588853);
    monthStart = getNewMoonDay(k+1, timeZone);
    if (monthStart > dayNumber) {
        monthStart = getNewMoonDay(k, timeZone);
    }
    a11 = getLunarMonth11(yy, timeZone);
    b11 = a11;
    if (a11 >= monthStart) {
        lunarYear = yy;
        a11 = getLunarMonth11(yy-1, timeZone);
    } else {
        lunarYear = yy+1;
        b11 = getLunarMonth11(yy+1, timeZone);
    }
    lunarDay = dayNumber-monthStart+1;
    diff = INT((monthStart - a11)/29);
    lunarLeap = 0;
    lunarMonth = diff+11;
    if (b11 - a11 > 365) {
        leapMonthDiff = getLeapMonthOffset(a11, timeZone);
        if (diff >= leapMonthDiff) {
            lunarMonth = diff + 10;
            if (diff == leapMonthDiff) {
                lunarLeap = 1;
            }
        }
    }
    if (lunarMonth > 12) {
        lunarMonth = lunarMonth - 12;
    }
    if (lunarMonth >= 11 && diff < 4) {
        lunarYear -= 1;
    }

    return new Date(lunarYear + '-' + lunarMonth + '-' + lunarDay);
}



























