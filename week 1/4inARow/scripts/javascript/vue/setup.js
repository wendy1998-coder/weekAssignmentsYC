$(window).on("load", function () {
    new Vue( {
        el: '#vue',
        data: {
            header: 'Game Setup',
            menuItems: [
                {
                    name: 'Game Setup',
                    page: 'index.html',
                    active: true,
                    invisible: false
                },
                {
                    name: '4 in a row',
                    page: '4OpEenRij.html',
                    active: false,
                    invisible: localStorage.current_setup == null ||
                        JSON.parse(localStorage.current_setup)["p1c"] === undefined
                },
                {
                    name: 'Highscores',
                    page: 'highscores.html',
                    active: false,
                    invisible: false
                }
            ]
        }
    });
});