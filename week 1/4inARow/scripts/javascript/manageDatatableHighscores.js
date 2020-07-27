$(window).on("load", function () {
    // create table
    const table = $('#datatable').DataTable(
        {
            rowGroup: {
                dataSrc: 0
            }
        }
    );

    const fill_table = function(table, data) {
        table.clear().draw();
        table.rows.add(data);
        // Adjust column width depending on new contents (making sure it fits)
        table.columns.adjust().draw();
    };

    if (localStorage.highscores != null) {
        fill_table(table, JSON.parse(localStorage.highscores))
    }
});