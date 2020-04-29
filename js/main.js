/**
 * WELCOME TO MOMENT JS
 */


 /**
  * Creare un calendario dinamico con le festività. 
  * Partiamo dal gennaio 2018 dando la possibilità di cambiare mese, 
  * gestendo il caso in cui l’API non possa ritornare festività. 
  * Il calendario partirà da gennaio 2018 e si concluderà a dicembre 2018 (unici dati disponibili sull’API).
  * 
  * Ogni volta che cambio mese dovrò:
  *  - Controllare se il mese è valido (per ovviare al problema che l’API non carichi holiday non del 2018)
  *  - Controllare quanti giorni ha il mese scelto formando così una lista
  *  - Chiedere all’api quali sono le festività per il mese scelto
  *  - Evidenziare le festività nella lista
  *
  * BONUS OPZIONALE:
  * Trasformare la lista precedente in un vero e proprio calendario, 
  * generando una griglia che segua l’andamento dei giorni di un mese a scelta, 
  * evidenziando le festività.`
  * Creare dei bottoni che permettano di spostarsi di mese in mese,
  * rigenerando ogni volta la griglia e le festività associate
  */
$(document).ready(function () {
    
    /**
     * SETUP
     */

    var prevBtn = $('.prev');
    var nextBtn = $('.next');

    // Punto di partenza data
    var baseMonth = moment('2018-01-01'); 

    // Init Hndlenars
    var source = $('#day-template').html();
    var template = Handlebars.compile(source);

    // print giorno
    printMonth(template, baseMonth);

    // ottieni festività mese corrente
    printHoliday(baseMonth);

    // mese successivo al click bottone
    nextBtn.click(function(e){
        baseMonth.add(1, 'month');
        printMonth(template, baseMonth);
        printHoliday(baseMonth);
        
        // messaggio errore dopo dic 2018
        if (baseMonth.year() === 2019) {
            alert('non puoi andare oltre')
            // torno a dic 2018 e ristampo i giorni
            baseMonth.subtract(1, 'month');
            printMonth(template, baseMonth);
            printHoliday(baseMonth);
        }
    });

    // mese precedente al click bottone
    prevBtn.click(function(){
        baseMonth.subtract(1, 'month');
        printMonth(template, baseMonth);
        printHoliday(baseMonth);

        // messaggio errore prima di gen 2018
        if (baseMonth.year() === 2017) {
            alert('non puoi andare oltre')
            // torno a gen 2018 e ristampo i giorni
            baseMonth.add(1, 'month');
            printMonth(template, baseMonth);
            printHoliday(baseMonth);
        }
    });
    

}); // <-- End doc ready


/*************************************
    FUNCTIONS
 *************************************/

// Stampa a schermo i giorni del mese
function printMonth(template, date) {
    // numero giorni nel mese
    var daysInMonth = date.daysInMonth();

    //  setta header
    $('h1').html( date.format('MMMM YYYY') );

    // Imposta data attribute data visualizzata
    $('.month').attr('data-this-date',  date.format('YYYY-MM-DD'));
    
    // pulizia giorni mese precedenti
    $('.month-list').children('li').remove();

    // genera giorni mese
    for (var i = 0; i < daysInMonth; i++) {
        // genera data con moment js
        var thisDate = moment({
            year: date.year(),
            month: date.month(),
            day: i + 1
        });

        // imposta dati template
        var context = {
            class: 'day',
            day: thisDate.format('DD MMMM'),
            completeDate: thisDate.format('YYYY-MM-DD')
        };

        //compilare e aggiungere template
        var html = template(context);
        $('.month-list').append(html);
    }
}

// Ottieni e stampa festività
function printHoliday(date) {
    // chiamo API
    $.ajax({
        url: 'https://flynn.boolean.careers/exercises/api/holidays' ,
        method: 'GET',
        data: {
            year: date.year(),
            month: date.month()
        },
        success: function(res) {
            var holidays = res.response;

            for (var i = 0; i < holidays.length; i++) {
                var thisHoliday = holidays[i];

                var listItem = $('li[data-complete-date="' + thisHoliday.date + '"]');

                if(listItem) {
                    listItem.addClass('holiday');
                    listItem.text( listItem.text() + ' - ' + thisHoliday.name );
                }
            }
        },
        error: function() {
            console.log('Errore chiamata festività'); 
        }
    });
}