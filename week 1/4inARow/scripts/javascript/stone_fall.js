$(window).on("load", function () {
    // load all necessary variables
    const grid = $("#grid tbody").children().toArray();
    let gameState = [
        [],
        [],
        [],
        [],
        [],
        [],
        []
    ];
    let finished = false;
    const animators = $(document.getElementsByClassName("animator")).toArray();
    const tds = $('#grid td');
    let setup = getUrlVars();
    let color = setup["p1c"];
    const highscoreButten = $(document.getElementsByName("submit")[0]);
    const reloadButton = $(document.getElementsByName("reload")[0]);
    let scoreInfo = [];

    // check whether game was in progress and if so, redraw that game
    if (localStorage.getItem("current_gamestate") != null && localStorage.from_setup == null) {
        respawn_game()
    } else {
        localStorage.removeItem("from_setup");
        localStorage.current_gamestate = JSON.stringify(gameState);
        localStorage.current_color = color;
        localStorage.current_setup = JSON.stringify(setup);
    }

    function respawn_game() {
        color = localStorage.current_color;
        setup = JSON.parse(localStorage.current_setup);
        gameState = JSON.parse(localStorage.current_gamestate);

        // update visual grid
        // find highest row containing stones
        let max_length = 0;
        gameState.forEach(function (item) {
            if (item.length > max_length) {
                max_length = item.length
            }
        });

        // loop through row indexes until the highest point in the grid was reached which had stones.
        for (let rowIdx = 0; rowIdx < max_length; rowIdx++) {
            const rowObjct = $(grid[5-rowIdx]).children().toArray();
            // loop through the cols in gamestate and use the rowindex to find the correct cell in the grid
            // and if applicable, modify the classes to show a stone.
            gameState.forEach(function (col) {
                const cell = $(rowObjct[$(gameState).index(col)]);
                if (col.length >= rowIdx + 1) {
                    const stone = col[rowIdx];
                    cell.addClass("stone");
                    cell.addClass(stone + "_stone")
                }
            })
        }
    }

    // parse parameters from url
    function getUrlVars() {
        let vars = {};
        window.location.href.replace(/[?&]+([^=&]+)=([^&]*)/gi, function (m, key, value) {
            vars[key] = value;
        });
        return vars;
    }

    function find_correct_cell(col) {
        const rowIdx = gameState[col].length;
        const row = $(grid[5-rowIdx]);
        return $(row.children().toArray()[col]);
    }

    // show animation
    function animateFall(_callfirst, colIdx, _callback, current_color) {
        _callfirst();
        let animatorIdx = colIdx * 2;
        if (current_color === "yellow") {
            animatorIdx++
        }
        let animator = animators[animatorIdx];
        animator.style.top = 0 + "px";

        let pos = 0;
        if (!$(animator).hasClass("inProgress")) {
            $(animator).addClass("inProgress");
        }

        const id = setInterval(move, 5);

        function move() {
            const goal = (6 - gameState[colIdx].length - 1 )*100;
            if (pos >= goal) {
                clearInterval(id);
                $(animator).removeClass("inProgress");
                animator.style.top = 0 + "px";
                _callback();
            } else {
                pos += 2;
                animator.style.top = pos + "px";
            }
        }
    }

    // on click, let stone fall
    tds.click(function(){
        if (finished) {
            alert("This game is over, if you want to continue, start a new game!");
            return;
        }
        const col = $(this).parent().children().index($(this));
        const rowIdx = gameState[col].length;

        if (rowIdx > 5) {
            alert("Chosen column is full, pick another one!");
            return;
        }
        const current_color = color;
        const td = find_correct_cell(col);

        // make stone fall
        // has to be done prior to showing animation
        function first() {
            if (current_color === "red") {
                color = "yellow";
            } else {
                color = "red";
            }
            td.addClass("destination");
            td.removeClass("stone");
            td.removeClass("yellow_hover");
            td.removeClass("red_hover");
        }

        animateFall(function (){
            first()
        },col, function () {
            last();
        }, current_color);

        // has to be done after the animation has finished
        function last() {
            td.addClass("stone");
            if (current_color === "red") {
                td.addClass("red_stone");
            } else {
                td.addClass("yellow_stone");
            }
            gameState[col].push(current_color);
            localStorage.current_gamestate = JSON.stringify(gameState);

            td.removeClass("destination");
            localStorage.current_color = color;

            // make possible to save high score and reset most settings
            if (check_won()) {
                const won = document.getElementById("won");
                let name = setup["p1n"];
                if (current_color === setup["p2c"]) {
                    name = setup["p2n"]
                }
                won.innerHTML = "Congratulations " + name + ", you won!";
                finished = true;
                localStorage.finished = true;
                localStorage.removeItem("current_gamestate");
                localStorage.removeItem("current_color");

                // show form to save score or start over
                $("#highscore").removeClass("hidden");
                reloadButton.removeClass("hidden");

                // gather info for score saving
                // counting amount of turns per player
                let yellow = 0;
                let red = 0;
                gameState.forEach(function (col) {
                    col.forEach(function (value) {
                        if (value === "red") {
                            red++
                        } else {
                            yellow++
                        }
                    })
                });
                scoreInfo.push(get_current_date(), name, current_color, red + "/" + yellow);
            }
        }

        // checking for won
        function check_won() {
            // check horizontal
            if(check_along_row(rowIdx)) {
                return true;
            }

            // check vertical
            // up
            let row_to_check = rowIdx + 1;
            let up = 0;
            while (row_to_check < 6) {
                if (check_along_row(row_to_check, col)) {
                    up++;
                    row_to_check++;
                    if (up > 2) {
                        return true;
                    }
                } else {
                    break;
                }
            }

            // down
            let down = 0;
            row_to_check = rowIdx - 1;
            while (row_to_check >= 0) {
                if (check_along_row(row_to_check, col)) {
                    down++;
                    row_to_check--;
                    if ((down + 1 + up) > 3) {
                        return true;
                    }
                } else {
                    break;
                }
            }

            // check diagonal
            // up
            row_to_check = rowIdx + 1;
            up = [0, 0];
            for (let i = 0; i < 6-(rowIdx+1); i++) {
                const output = check_along_row(row_to_check, -1, i+1);
                let found = false;
                if(output[0]) {
                    up[0]++;
                    found = true;
                }
                if (output[1]) {
                    up[1]++;
                    found = true;
                }

                // nothing changed
                if (!found) {
                    break;
                } else {
                    row_to_check++;
                    if (up[0] > 2 || up[1] > 2) {
                        return true;
                    }
                }
            }

            // down
            row_to_check = rowIdx - 1;
            down = [0, 0];
            for (let i = 0; i < rowIdx; i++) {
                const output = check_along_row(row_to_check, -1, i+1);
                let found = false;
                if(output[0]) {
                    down[0]++;
                    found = true;
                }
                if (output[1]) {
                    down[1]++;
                    found = true;
                }

                // nothing changed
                if (!found) {
                    break;
                } else {
                    row_to_check--;
                    if ((up[0] + 1 + down[1]) > 3 ||
                        (up[1] + 1 + down[0]) > 3
                    ) {
                        return true;
                    }
                }
            }

            return false;
        }

        // row: array with td instances which represents the table row to check
        // col_to_check: index of a specific col to check, -1 of not applicable (used for vertical checking)
        // margin: how many indices away from current_index to check, -1 if not applicable (used for diagonal checking)
        // returns either a boolean if the row has 4 consecutive colors or the one requested field is the same color or
        //  a list with two booleans for left and right with the margin applied.
        function check_along_row(rowIdx, col_to_check = -1, margin = -1) {
            // for vertical checking
            if (col_to_check > -1) {
                return gameState[col_to_check].length >= rowIdx + 1 && gameState[col_to_check][rowIdx] === current_color;
            }

            // for diagonal checking
            if (margin > -1) {
                const left = col - margin;
                const right = col + margin;
                let out = [false, false];
                if (left > -1) {
                    if (gameState[left].length >= rowIdx + 1) {
                        out[0] = gameState[left][rowIdx] === current_color;
                    }
                }
                if (right < 7) {
                    if (gameState[right].length >= rowIdx + 1) {
                        out[0] = gameState[right][rowIdx] === current_color;
                    }
                }
                return out;
            }

            // horizontal checking
            let right = 0;
            let current_check = col + 1;

            // right side
            while (current_check < 7) {
                if (gameState[current_check].length >= rowIdx + 1 &&
                    gameState[current_check][rowIdx] === current_color)
                {
                    right++;
                    current_check++;
                    if (right > 2) {
                        return true;
                    }
                } else {
                    break;
                }
            }

            let left = 0;
            // left side
            current_check = col - 1;
            while (current_check >= 0) {
                if (gameState[current_check].length >= rowIdx + 1 &&
                    gameState[current_check][rowIdx] === current_color) {
                    left++;
                    current_check--;
                    if ((left + 1 + right) > 3) {
                        return true;
                    }
                } else {
                    break;
                }
            }

            return false;
        }
    });

    // on hover, tell where stone would fall
    tds.on("mouseover", function () {
        // show stone projection
        const col = $(this).parent().children().index($(this));
        const destination = find_correct_cell(col);
        if (!destination.hasClass("destination")) {
            destination.addClass("stone");
            if (color === "red") {
                destination.addClass("red_hover");
            } else {
                destination.addClass("yellow_hover");
            }
        }

        // color in column
        for (let i = 0; i < 6; i++) {
            const row_objct = $(grid[i]).children().toArray();
            const cell = $(row_objct[col]);
            if (!cell.hasClass("column_hover")) {
                cell.addClass("column_hover")
            }
        }
    });

    tds.on("mouseleave", function () {
        // remove stone projection
        const col = $(this).parent().children().index($(this));
        const destination = find_correct_cell(col);
        destination.removeClass("stone");
        destination.removeClass("red_hover");
        destination.removeClass("yellow_hover");

        // remove color in column
        for (let i = 0; i < 6; i++) {
            const row_objct = $(grid[i]).children().toArray();
            const cell = $(row_objct[col]);
            if (cell.hasClass("column_hover")) {
                cell.removeClass("column_hover")
            }
        }
    });

    // save high score
    highscoreButten.on("click", function () {
        let highscores;
        if (localStorage.getItem("highscores") != null) {
            highscores = JSON.parse(localStorage.highscores);
        } else {
            highscores = [];
        }

        highscores.push(scoreInfo);
        localStorage.highscores = JSON.stringify(highscores)
    });

    // used to save high score
    function get_current_date() {
        const today = new Date();
        const dd = String(today.getDate()).padStart(2, '0');
        const mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
        const yyyy = today.getFullYear();

        return  dd + "-" + mm + "-" + yyyy;
    }

    // start over
    reloadButton.on("click", function () {
        localStorage.finished = false;
        location.reload()
    })
});