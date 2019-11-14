var storage = window.localStorage;

var englishWords;
var wordList = [];

storage.setItem('game_level', '001');
level_num = storage.getItem('game_level');

level = 'level' + level_num;

$.get('./dictonary/levels/levels.json', function(data) {
    ALL_LEVELS = data;
    STANDARD_CUBES = data[level].board;
}, 'json');

var user_progress;
var letterBoxDiv;
var foundWords = [];
var userWords = [];
var boardCube;
var foundCount;
var level_list;
var game_active = false;
var element, endTime, hours, mins, msLeft, time;

$(document).ready(function() {

    // ON APPLICATION LOAD

    var setLength = 2;
    var timeMin = 2;
    var currentWord = "";
    var lastRow, lastCol;
    var allWords;
    var playerWords;
    var flag = {};
    var boardMapStr;

    var boggleSize;
    var gameOver = false;

    reSize();

    function reSize() {
        boxWidth = $('.letterBox').width();
        $('.letterBox').css('min-height', boxWidth+6);
    }

    function letterOnClick(row, col) {
        if (gameOver)
            return false;
        if (currentWord.length > 0 && (Math.abs(row - lastRow) > 1 || Math.abs(col - lastCol) > 1))
            return false;
        if (flag[row * boggleSize + col])
            return false;
        currentWord += boardCube[row * boggleSize + col];
        flag[row * boggleSize + col] = true;
        $(".letterBox[row=\"" + row + "\"][col=\"" + col + "\"]").addClass("selected");
        lastRow = row;
        lastCol = col;
        updateMonitor();
        gameEffect('letter');
        $('#mainBtn').text("End Word");
        checkWord(currentWord);
    }

    function checkWord(currentWord) {
        if (trieSearch(englishWords, currentWord.toLowerCase()) && currentWord.length > setLength && (!trieSearch(playerWords, currentWord))) {
            userWords.push(currentWord.toUpperCase());

            if (userWords.length > (foundWords.length/100)*75) {
                isOver();
            }

            $('#mainBtn').click();
        }
    }

    function monitorDisplay(str) {
        $('#infoLine').text($('#infoLine').text() + str[0]);
        if (str.length > 1) {
            setTimeout(function() {
                monitorDisplay(str.substring(1));
            }, 20);
        }
    }

    function updateMonitor(str) {
        if (typeof str !== "string") {
            $('#infoLine').text(currentWord + '_');
        } else {
            $('#infoLine').text('');
            monitorDisplay(str + '_');
        }
    }

    function loadBoggle() {

        currentScreen = 'gameContainer';

        game_active = true;

        console.log('loadBoggle');

        if (storage.getItem('settings_music') == 'on') {
            if(typeof myAudio != 'undefined') {
                myAudio.pause();
            }
            myAudio = new Audio('sounds/gameMusic.wav');
            myAudio.addEventListener('ended', function() {
                this.currentTime = 0;
                this.play();
            }, false);
            myAudio.play();
            myAudio.volume = storage.getItem('settings_volume');
        }

        $('#nav').show();
        $('.screen').hide();
        $('#gameContainer').fadeIn(1000);
        //$('.wordlist table tbody').html('');    
        foundCount = 0;
        $('.wordlist .amount').text(foundCount);

        countdown(timeMin, 0);

        currentWord = "";
        flag = {};
        playerWords = {};
        allWords = {};
        userWords = [];
        foundWords = [];

        $('#gameCube .letterBox').remove();
        $('.wordCard').slideUp(500, function() {
            $(this).remove();
        });
        $('#humanScore').text(0);
        $('#computerScore').text(0);
        boardMapStr = "";
        boardCube = [];
        boggleSize = 4;
        $('#gameCube').attr('board', 'standard');


        JSON.parse(storage.getItem('user_progress'))

        $.ajax({
            url: "./dictonary/levels/levels.json",
            dataType: 'json',
            success: function(data) {
                level_num = storage.getItem('game_level');
                level = 'level' + level_num;

                STANDARD_CUBES = data[level].board;

                englishWords = data[level].list;

                if (data[level].bonus[0] != "") {
                    englishWords = englishWords.concat(data[level].bonus);
                }

                level_list = englishWords;

                $('.wordlist .wordcount').text(level_list.length);

                trie = {};

                for (var i = 0; i < englishWords.length; i++) {
                    var word = englishWords[i],
                        curr = trie;
                    for (var j = 0; j < word.length; j++) {
                        var letter = word[j];
                        if (typeof curr[letter] == 'undefined') {
                            curr[letter] = {};
                        }
                        curr = curr[letter];
                    }
                    curr["$"] = 1; // end of word
                }
                englishWords = trie;
            }
        }).done(function() {

            function lesson_convert(num) {
                n = num/3;
                n = n.toString();
                if (n.indexOf('.') != -1) {
                    return parseInt(n.split('.')[0]) + 1;
                } else {
                    return parseInt(n);
                }   
            }

            $('#display #left').text('Level ' + lesson_convert(parseInt(level_num)));

            $('#nav h3').text('Level ' + lesson_convert(parseInt(level_num)));


            boardCube = STANDARD_CUBES;

            for (var i = 0; i < boggleSize * boggleSize; i++) {
                var randIndex = i;

                var tmp = boardCube[randIndex];

                boardCube[randIndex] = boardCube[i];

                boardCube[i] = tmp;
            }

            for (var i = 0; i < boggleSize * boggleSize; i++) {
                boardMapStr += boardCube[i];
            }
            for (var i = 0; i < boggleSize; i++)
                for (var j = 0; j < boggleSize; j++) {
                    letterBoxDiv = $('<div class="letterBox"></div>').attr({
                        "row": i,
                        "col": j
                    }).data("pos", {
                        "row": i,
                        "col": j
                    }).text(boardCube[i * boggleSize + j]).click(function() {
                        if ($(this).hasClass('selected')) return false;
                        var pos = $(this).data('pos');
                        letterOnClick(pos.row, pos.col);
                    }).mouseleave(function(e) {
                        if (e.which) $(this).click();
                    }).mouseenter(function(e) {
                        if (e.which) $(this).click();
                    });

                    $('#gameCube').append(letterBoxDiv);
                }
            $('#mainBtn').text("End Word").show();


            for (var i = 0; i < boggleSize; i++) {
                for (var j = 0; j < boggleSize; j++) {
                    var passedflag = {};
                    findAllWords("", passedflag, i, j);
                }

            trieIterator(allWords, function(word) {
                if (!trieSearch(playerWords, word)) {
                    recordWord(word, true);
                }
            });
            }

            humanScore = parseInt($('#humanScore').text());

            reSize();


            $('.letterBox').each(function() {
                if ($(this).text().length == 3) {
                    $(this).addClass('len3');
                } else if ($(this).text().length == 2) {
                    $(this).addClass('len2');
                }
            });

            //updateMonitor();
            $('#infoLine').text("click on a letter to start");
            gameEffect('diceroll');

            console.log('current level: ' + storage.getItem('game_level'));
            console.log(foundWords);
        })
    }

    function gameReady() {

        $('#main .waiting').fadeOut(500, function() {
            $('.startButton').css('opacity', 1);
        })

        $('.startButton.easy').click(function() {
            setLength = 1;
            timeMin = 10;
            score_difficulty = 10;
            $('#btmNav').hide();
            loadBoggle();
            $('#cover').fadeOut(500);
            storage.setItem('game_difficulty', 'easy');
        })

        $('.startButton.medium').click(function() {
            setLength = 1;
            timeMin = 8;
            score_difficulty = 50;
            $('#btmNav').hide();
            loadBoggle();
            $('#cover').fadeOut(500);
            storage.setItem('game_difficulty', 'medium');

        })

        $('.startButton.hard').click(function() {
            setLength = 1;
            timeMin = 6;
            score_difficulty = 100;
            $('#btmNav').hide();
            loadBoggle();
            $('#cover').fadeOut(500);
            storage.setItem('game_difficulty', 'hard');
        })

        $('.startButton.play').click(function() {
            setLength = 1;
            timeMin = 6;
            score_difficulty = 100;
            $('#btmNav').hide();
            loadBoggle();
            $('#cover').fadeOut(500);
        })

        $('.startButton.level_select').click(function() {
            $('.screen').hide();
            $('#main').hide();
            $('#level_select').show();
            $('#btmNav').hide();
            currentScreen = 'cover';
        })

        

        updateMonitor('Welcome');
    }

    function recordWord(word, isComputer) {
        if (word.length < setLength + 1) return false;
        word = word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
        var point = (word.length - (setLength)) * score_difficulty;
        var wordCard = $('<div class="wordCard"><div class="word"></div><div class="point"></div></div>');
        wordCard.find('.word').text(word);
        wordCard.find('.point').text('+' + point);
        if (isComputer) {
            $('#computerScoreBoard .wordCardContainer').append(wordCard);
            $('#computerScore').text(parseInt($('#computerScore').text()) + point);
            $('#computerScoreBoard .wordCardContainer').scrollTop(10000000);
            wordList.push(word);
        } else {
            $('#humanScoreBoard .wordCardContainer').append(wordCard);
            $('#humanScore').text(parseInt($('#humanScore').text()) + point);
            wordCard.hide().slideDown(500, function() {
                $('#humanScoreBoard .wordCardContainer').scrollTop(10000000);
            });
        }
    }


    function findAllWords(word, pressedflag, x, y) {
        trieInsert(allWords, word);
        foundWords = level_list;
    }

    $.get('./dictonary/levels/levels.json', function(data) {
        englishWords = data[level].list;
        level_list = data[level].list;
        trie = {};
        for (var i = 0; i < englishWords.length; i++) {
            var word = englishWords[i],
                curr = trie;
            for (var j = 0; j < word.length; j++) {
                var letter = word[j];
                if (typeof curr[letter] == 'undefined') {
                    curr[letter] = {};
                }
                curr = curr[letter];
            }
            curr["$"] = 1; // end of word
        }
        englishWords = trie;
        gameReady();
    }, 'json');

    $('#mainBtn').click(function() {
        if (gameOver) {
            alert(gameOver);
            gameOver = false;
            $("#cover").fadeIn(500);
            $(this).fadeOut(500);
            return;
        }
        if (currentWord.length > 0) {
            if (currentWord.length < setLength + 1) {
                updateMonitor("'" + currentWord + "' is too short");
                gameEffect('fail2');
            } else if (!trieSearch(englishWords, currentWord.toLowerCase())) {
                updateMonitor("'" + currentWord + "' is not a list word");
                gameEffect('fail2');
            } else if (trieSearch(playerWords, currentWord)) {
                updateMonitor("Already Found");
                gameEffect('fail2');
            } else {
                /*
                $('.wordlist table td').each(function(k,v) {
                    if ($(this).text() == currentWord.toLowerCase()) {
                        $(this).removeClass('hidden_word');
                    }
                })
                */
                foundCount++;
                $('.wordlist .amount').text(foundCount);
                recordWord(currentWord);
                trieInsert(playerWords, currentWord);
                updateMonitor("You found '" + currentWord + "'");
                gameEffect('found');
            }
            currentWord = "";
            flag = {};
            $('#mainBtn').text("End Word");
            $('.letterBox.selected').removeClass('selected');
        }
    });
});

function trieSearch(trie, word, prefixOnly) {
    var curr = trie;
    for (var i = 0; i < word.length; i++) {
        if (typeof curr[word[i]] != 'object') return false;
        curr = curr[word[i]];
    }
    if (prefixOnly) return true;
    return curr['$'] == 1;
}

function trieInsert(trie, word) {
    var curr = trie;
    for (var j = 0; j < word.length; j++) {
        var letter = word[j];
        if (typeof curr[letter] == 'undefined') {
            curr[letter] = {};
        }
        curr = curr[letter];
    }
    curr["$"] = 1;
}

function trieIterator(trie, callback, prefix) {
    if (!prefix) prefix = "";
    Object.keys(trie).forEach(function(key) {
        if (key == '$') {
            callback(prefix);
        } else {
            trieIterator(trie[key], callback, prefix + key);
        }
    });
}

function countdown(minutes, seconds) {
    
    function twoDigits(n) {
        return (n <= 9 ? "0" + n : n);
    }

    function updateTimer() {
        msLeft = endTime - (+new Date);
        if (msLeft < 0) {
            if (currentScreen == 'gameContainer') {
                isOver();    
                msLeft = 0;
            }
        } else {
            time = new Date(msLeft);
            hours = time.getUTCHours();
            mins = time.getUTCMinutes();

            seconds = twoDigits(time.getUTCSeconds());

            $('#countdown').text(mins + ':' + seconds);

            storage.setItem('game_time_min', mins);
            storage.setItem('game_time_sec', seconds);

            if ($('#gameContainer').css('display')) {
                setTimeout(updateTimer, time.getUTCMilliseconds() + 500);
            }
        }
    }

    endTime = (+new Date) + 1000 * (60 * minutes + seconds) + 500;
    updateTimer();
}

function isOver() {

    score = parseInt($('#humanScore').text()) + score_difficulty;

    console.log(score);
    console.log(storage.getItem('game_score'));
    total_score = (storage.getItem('game_score')*1) + (score*1);

    $('.screen').hide();
    $('#gameover').show();
    $('#gameover .over').text(score);
    $('#btmNav').hide();

    // CONTINUE SCREEN
    $('.diff_select').hide();
    $('.complete').hide();
    $('.startButton.play').text('continue').css('margin-top','20px');
    $('.startButton.play').show();

    console.log('userWords: ' + userWords.length);
    console.log('level_list: ' + level_list.length);
    console.log('foundWords: ' + foundWords.length);
    
    // move on
    if (userWords.length > (level_list.length/100)*75) {

        storage.setItem('game_score', total_score);

        l_num = parseInt(level_num);
        l_num += 1;
        l_num = l_num.toString();
        if (l_num.length == 1) {
            l_num = '00' + l_num;
        } else if (l_num.length == 2) {
            l_num = '0' + l_num;
        } else {
            l_num = l_num;
        }

        storage.setItem('game_level', l_num);
        console.log(storage.getItem('game_level'));

        if (ALL_LEVELS['level'+l_num].level_sub == 'a') {
            $('.diff_select').show();
            $('.complete').show();
            $('.startButton.play').hide();
        }

    }

    // PROGRESS

    user_progress = JSON.parse(storage.getItem('user_progress'));

    if (user_progress[level]) {
        user_progress[level] = user_progress[level]+1;
    } else {
        user_progress[level] = 1;
    }

    storage.setItem('user_progress', JSON.stringify(user_progress));

    // COMPLETED

    user_completed = {};

    if (JSON.parse(storage.getItem('user_completed'))) {
        user_completed = JSON.parse(storage.getItem('user_completed'));
    }

    if (ALL_LEVELS[level].level_sub == 'c') {
        level_num = ALL_LEVELS[level].level;

        obj = {
            'difficulty': storage.getItem('game_difficulty'),
        }

        user_completed[level_num] = obj;
    }

    storage.setItem('user_completed', JSON.stringify(user_completed));

    user_data = { 
        id: storage.getItem('user_id'),
        first_name: storage.getItem('user_first_name'),
        last_name: storage.getItem('user_last_name'),
        current_level: parseInt(storage.getItem('game_level')),
        class_id: parseInt(storage.getItem('user_class')),
        teacher_id: '',
        progress: JSON.stringify(storage.getItem('user_progress')),
        completed: JSON.stringify(storage.getItem('user_completed'))
    }

    console.log(user_data);

    postScore(user_data);

    foundWords = [];
    userWords = [];

    game_active = false;

    if(typeof myAudio != 'undefined') {
        myAudio.pause();
    }

    if(JSON.parse(storage.getItem('user_completed'))) {
        $.each(JSON.parse(storage.getItem('user_completed')), function(k,v) {
            $('.items_menu.item').each(function() {
                if ($(this).attr('data-lesson') == k) {
                    if (v['difficulty'] == 'easy') {
                        $(this).addClass('bronze_star');
                    } else if (v['difficulty'] == 'medium') {
                        $(this).addClass('silver_star');
                    } else if (v['difficulty'] == 'hard') {
                        $(this).addClass('gold_star');
                    }
                }
            });
        });
    }
}

