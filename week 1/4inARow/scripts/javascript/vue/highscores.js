$(window).on("load", function () {
    new Vue( {
        el: '#vue',
        data: {
            header: 'Highscores',
            menuItems: [
                {
                    name: 'Game Setup',
                    page: 'index.html',
                    active: false,
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
                    active: true,
                    invisible: false
                }
            ]
        }
    });
});