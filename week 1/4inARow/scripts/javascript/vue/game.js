$(window).on("load", function () {
    let players = getUrlVars();
    // setup game parameters
    function getUrlVars() {
        let vars = {};
        window.location.href.replace(/[?&]+([^=&]+)=([^&]*)/gi, function (m, key, value) {
            vars[key] = value;
        });
        return vars;
    }
    if (localStorage.current_setup != null && localStorage.from_setup == null) {
        players = JSON.parse(localStorage.current_setup)
    }

    new Vue( {
        el: '#vue',
        data: {
            header: '4 In A Row',
            menuItems: [
                {
                    name: 'Game Setup',
                    page: 'index.html',
                    active: false
                },
                {
                    name: '4 in a row',
                    page: '4OpEenRij.html',
                    active: true
                },
                {
                    name: 'Highscores',
                    page: 'highscores.html',
                    active: false
                }
            ],
            players: [
                {
                    name: players["p1n"],
                    color: players["p1c"] + "_stone"
                },
                {
                    name: players["p2n"],
                    color: players["p2c"] + "_stone"
                }
            ]
        }
    });
});