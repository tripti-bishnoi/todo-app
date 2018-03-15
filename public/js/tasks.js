$(document).ready(function () {

    $.getJSON('/tasks-api', printTasks);
    $.getJSON('/monthlyTasks-api', printMonthlyTasks);

    $('form').submit(function (e) {
        e.preventDefault();
        $.post('/tasks-api', {desc: $('#desc').val()}, printTasks);
        $.getJSON('/tasks-api', printTasks);
        $.getJSON('/monthlyTasks-api', printMonthlyTasks);
        this.reset();
    });

});

function printTasks(tasks) {
    $('body>div>div>dl').empty();
    $.each(tasks, function () {
        if(this.completedFlag === true){
            $('<dt class="todo-text-through">').text(this.desc).appendTo('body>div>div>dl');
        } else{
            $('<dt>').text(this.desc).appendTo('body>div>div>dl');
        }
    });
    $('dt').off('dblclick').dblclick(function() {
        $(this).addClass('todo-text-through');
        console.log($(this).text());
        $.ajax({
            url: '/tasks-api/' + $(this).text(),
            type: 'PUT',
            success: printTasks
        });
    });
}

function printMonthlyTasks(tasks) {
    const MONTH_NAMES = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    $('div#months-container').empty();
    $.each(tasks, function () {
        $('div#months-container').append('<a href="/monthlyTasks-api/' + this._id.month + '" target="_blank">' + MONTH_NAMES[this._id.month-1] + " - " + this.total + '</a>');
    });
}
    // $('div#months-container').empty();
    // $.each(tasks, function () {
    //     $('<a>').href('/monthlyTasks-api/this._id.month').appendTo('div#months-container');
        //text(MONTH_NAMES[this._id.month-1] + "- " + this.total)
    // });