$(document).ready(function () {

    $.getJSON('/tasks-api', printTasks);
    $('form').submit(function (e) {
        e.preventDefault();
        $.post('/tasks-api', {task: $('#task').val()}, printTasks);
        this.reset();
    });

});

function printTasks(tasks) {
    $('body>div>dl').empty();
    $.each(tasks, function () {
        if(this.status === true){
            $('<input type="checkbox" checked/>').appendTo('body>div>dl');
            $('<dt class="todo-text-through">').text(this.task).appendTo('body>div>dl');
        } else{
            $('<input type="checkbox"/>').appendTo('body>div>dl');
            $('<dt>').text(this.task).appendTo('body>div>dl');
        }
    });
    $(".checkbox").change(function() {
        if(this.checked) {
            
        }
    });
    // $('dt').off('dblclick').dblclick(function() {
    //     $(this).addClass('todo-text-through');
        // $.ajax({
        //     url: '/tasks-api/' + $(this).text(),
        //     type: 'DELETE',
        //     success: printTasks
        // });
    // });
}
