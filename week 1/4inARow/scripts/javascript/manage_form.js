$(window).on("load", function () {
    // remove previous game setup if that game has finished
    if (localStorage.finished === "true") {
        localStorage.finished = "false";
        localStorage.removeItem("current_setup");
    }

    const p1c = $(document.getElementsByName("p1c")[0]);
    const p2c = $(document.getElementsByName("p2c")[0]);
    const submit = $(document.getElementsByName("submit")[0]);

    // if one of the selectors of colors changes, make sure the other one is the opposite
    p1c.on("change", function () {
       if (p1c.val() === p2c.val()) {
           p2c.val(p1c.val() === "red"? "yellow": "red")
       }
    });

    p2c.on("change", function () {
       if (p1c.val() === p2c.val()) {
           p1c.val(p2c.val() === "red"? "yellow": "red")
       }
    });

    // get a flag on the local storage that a new game needs to be started.
    submit.on("click", function () {
        localStorage.from_setup = "true";
    })
});