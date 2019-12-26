function Game () {
    this.players = []
    this.total_score = 0
    this.shots = 0
    this.started_game = false
};

Game.prototype.add_player =
    function (player) {
        this.players.push(player);
    };

Game.prototype.get_total_score =
    function () {
        var total_score = 0
        this.players.forEach(function (player) {
            total_score += player.score
        }
        );
        return total_score
    };

Game.prototype.show_players =
    function () {
        this.players.forEach(function (player) {
            console.log(player.firstname)
            console.log("----")
        }
        );
    };

mygame = new Game()


function Player (first_name) {
    this.score = 0;
    this.firstname = first_name;
    this.record = [];
    this.score_history = [];
};

Player.prototype.record_throw =
    function (points) {
        this.score += points;
        this.score_history.push(this.score);
        this.record.push(points);

    };

Player.prototype.reset_record =
    function () {
        this.score = 0;
        this.record = [];
        this.score_history = [];
    };


function show (elements, specifiedDisplay) {
  elements = elements.length ? elements : [elements];
  for (var index = 0; index < elements.length; index++) {
    elements[index].style.display = specifiedDisplay || 'block';
  }
};

function hide (elements) {
  elements = elements.length ? elements : [elements];
  for (var index = 0; index < elements.length; index++) {
    elements[index].style.display = 'none';
  }
};

function addplayertogame() {
    var player_name = document.getElementById("playername").value
    playerobj = new Player(player_name);
    if (player_name != "") {
        mygame.add_player(playerobj)
        document.getElementById("playername").value = ""
        document.getElementById("playeraddedmessage").innerHTML = "<b>" + player_name + "</b>" + " została dodana!"

        var div_playername = document.createElement("div");
        div_playername.className = "col";
        div_playername.setAttribute("id", "player_" + player_name);
        div_playername.style.textAlign = "center";
        div_playername.style.cursor = "pointer";
        div_playername.innerHTML = player_name;
        div_playername.style.Height = "60px";
        div_playername.style.fontSize = "180%";
        document.getElementById("playerlist").appendChild(div_playername);

        document.getElementById("startgame").style.display = "initial";
    } else {
        document.getElementById("playeraddedmessage").textContent = "Prosze wspisać imię gracza";
    };
};

function start_game () {

    if (mygame.players.length > 0) {
        mygame.started_game = true;
        document.getElementById("playername").style.display = "none"
        document.getElementById("addplayer").style.display = "none"
        document.getElementById("playeraddedmessage").style.display = "none"
        document.getElementById("startgame").style.display = "none"
        document.getElementById("restartgame").style.display = "initial";

        document.getElementById("setup").className = "container addingplayers_new";

        show(document.getElementById('maincontent'));
        document.getElementById("player_" + mygame.players[0].firstname).style.backgroundColor = "black";
        document.getElementById("player_" + mygame.players[0].firstname).style.color = "white";

        mygame.players.forEach(function (player) {
            var player_name = player.firstname;
            var div_playerscore = document.createElement("div");
            div_playerscore.className = "col";
            div_playerscore.setAttribute("id", "score_" + player_name);
            div_playerscore.style.textAlign = "center";
            div_playerscore.innerHTML = 0;
            document.getElementById("playerscores").appendChild(div_playerscore);

        });
    } else {
        document.getElementById("playeraddedmessage").textContent ="Prosze wspisać imię gracza";
    };
};


function recordpoints (points) {
    var current_index = 0;
    mygame.players.some(function (player, index) {
        var current_index = index;
        var next_index = 0;
        bgcolor = document.getElementById("player_" + player.firstname).style.backgroundColor
        playername = document.getElementById("score_" + player.firstname).value
        if (bgcolor === "black") {
            player.record_throw(points);
            document.getElementById("score_" + player.firstname).innerHTML = player.score
            mygame.shots += 1;
            console.log("game shots :" + mygame.shots);
            if (mygame.shots % 3 == 0) {
                var active_player = player.firstname
                document.getElementById("player_" +  active_player).style.backgroundColor = "";
                document.getElementById("player_" +  active_player).style.color = "";

                current_index = index
                next_index = (current_index + 1) % mygame.players.length
                console.log("next index: " + next_index);
                document.getElementById("player_" +  mygame.players[next_index].firstname).style.backgroundColor = "black";
                document.getElementById("player_" +  mygame.players[next_index].firstname).style.color = "white";
                return true; // breaks the looping through the players
            };
        };
    });
    chart_it();
};

function restart_game () {
    mygame.shots = 0;
    mygame.players.forEach(function (player){
        player.reset_record();
        document.getElementById("score_" + player.firstname).innerHTML = player.score;
        document.getElementById("player_" + player.firstname).style.backgroundColor = "";
        document.getElementById("player_" + player.firstname).style.color = "";
    });
    var starting_player = mygame.players[0].firstname;
    document.getElementById("player_" + starting_player).style.backgroundColor = "black";
    document.getElementById("player_" + starting_player).style.color = "white";
    the_chart.reset();
    the_chart.destroy();
};


function chart_it () {

    var colors = ["red", "green", "blue", "black", "white", "purple", "brown"];
    the_chart = new Chart(document.getElementById("line-chart"), {
      type: 'line',
      data: {},
      options: {
        title: {
          display: true,
          text: "Leader's board"
        },
        scales: {
            xAxes: [{
                ticks: {
                    suggestedMin: 0,
                    suggestedMax: 100
                }
            }]
        }
      }
    });

    // getting data
    var throws = [];
    var longest_history = [];
    var max_throws = 0;
    var score_hist = [];
    mygame.players.forEach(function (player,  index) {
        throws = [...Array(player.record.length).keys()].map(x => ++x);
        if (throws.length > max_throws) {
            longest_history = throws;
            max_throws = throws.length;
        };
        score_hist = player.score_history;
        the_chart.data.labels = throws;
        color = colors[index];
        the_chart.data.datasets.push({data: score_hist,
                                        label: player.firstname,
                                        borderColor: color,
                                        fill: false
                                    });

        the_chart.update();
        console.log(longest_history);
        console.log(throws.length);
        console.log("----");
    });

    the_chart.data.labels = longest_history;
    the_chart.update();

};


hide(document.getElementById('maincontent'));
document.getElementById("restartgame").style.display = "none";
document.getElementById("startgame").style.display = "none";

document.getElementById("addplayer").addEventListener("click", addplayertogame);
document.getElementById("playername").addEventListener("keyup", function (event) {
    event.preventDefault();
    if (event.keyCode === 13) {
        document.getElementById("addplayer").click();
    };
});
document.getElementById("startgame").addEventListener("click", start_game);
document.getElementById("restartgame").addEventListener("click", restart_game);

document.addEventListener("keyup", function (event){


    if (mygame.started_game === true) {event.preventDefault();

        for (var i = 0; i < 10; i++){
            if (event.code === "Digit" + i){
                document.getElementById("points" + i).click();
                document.getElementById("points" + i).focus();
            };
        };
        if (event.code === "KeyD") {
            document.getElementById("points10").click();
            document.getElementById("points10").focus();
        } else if (event.code === "KeyT") {
            document.getElementById("points30").click();
            document.getElementById("points30").focus();
            // recordpoints(30);
        } else if (event.code === "KeyP") {
            document.getElementById("points50").click();
            document.getElementById("points50").focus();
        };
    };
});


