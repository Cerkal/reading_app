// Add Global Variables

var results;
var lastScreen;
var currentScreen;
var paused;

var item_list = {};

function leaderBoard() {
	if (checkNetConnection()) {
    	callAjax();
	} else {
	    $('.error').text('Please check your internet connection');
	}
}

function checkNetConnection() {
    jQuery.ajaxSetup({ async: false });
    re = "";
    r = Math.round(Math.random() * 10000);
    $.get("http://crossroadsedu.com/_appdb/dbinsert.php", { subins: r }, function(d) {
        re = true;
    }).error(function() {
        re = false;
    });
    return re;
}

function callAjax() {
	$.ajax({
	        type: "POST",
	        url: "http://crossroadsedu.com/_appdb/dbread.php", 
	        data: { id: 'johncook', score: 'score' },
	        dataType: "json",  
	        cache: false,
	        success: 
	            function(response){ 
	            	results = response;
	            }
	        });
	
	string = "";
	
	$.each(results, function(key, val) {
		string += "<tr><td>" + val.id + "</td><td>" + val.score + "</tr>";
	});

	$('#leaderboard').html(string);

	$('#leaderboard td:first-of-type').each(function(k,v) {
		curr_row = $(this).text();
	    if (curr_row == storage.getItem('user_name')) {
	        $(this).css('color','white');
	        $(this).next().css('color','white');
			return false;
    	}
	});
}

function playEffect(soundFile) {
	/*
	soundFile.toString();
    if (storage.getItem('settings_effects') == 'on') {
        fx = new Audio('sounds/fx/select/'+soundFile+'.wav');
        fx.play();
        fx.volume = storage.getItem('settings_volume');
    }
    */
}

function gameEffect(soundFile) {
	/*
	soundFile.toString();
    if (storage.getItem('settings_effects') == 'on') {
        fx = new Audio('sounds/fx/'+soundFile+'.wav');
        fx.play();
        fx.volume = storage.getItem('settings_volume');
    }
    */
}


function postScore(data) {
	var returning;
	$.ajax({
        type: "POST",
        url: "http://crossroadsedu.com/_appdb/dbinsert.php", 
        data: data,
        dataType: "text",  
        cache: false,
        success: 
            function(response){ 
            	console.log(response);
            	returning = "200";
        }
    });
    return returning;
}


$(document).ready(function() {

	function slant() {
		ww = $(window).width();
		wh = $(window).height();
		angle = (Math.atan(ww/wh) * 180/Math.PI);
		$('.clicker').css('transform', 'rotate('+angle+'deg)');
	}

	$(window).resize(function() {
		slant();
	});

	slant();

	var min;
	var sec;

	// TOP NAV 
	$('#nav #settings').on('click', function() { 

		if ($('#settings_screen').css('display') === 'block') {

			if (game_active) {
				$('#settings_screen').hide();
				$('#gameContainer').show();
				$('#btmNav').hide();
				countdown(min, sec);
				currentScreen = 'gameContainer';
			}

		} else {

			if (game_active) {
				$('.menu1.play').text('Resume');
			} else {
				$('.menu1.play').text('Play');
			}

			min = storage.getItem('game_time_min')*1;
			sec = storage.getItem('game_time_sec')*1;

			$('.screen').hide();
			$('#settings_screen').show();
			$('#nav h3').text('Settings');
			$('#nav').show();
			$('#btmNav').show();
			//playEffect('000');	
			currentScreen = 'settings_screen';
		}
	})

	// NAV

	$('#welcomePlay').on('click', function() { 
		$('.screen').hide();
		$('#nav').show();
		$('#main').hide();
		$('#level_select').show();
		$('#btmNav').show();
		//playEffect('000');
		currentScreen = 'level_select';
		level_select();
		$('#nav h3').text('Level Select');
	})

	$('#welcomeHero').on('click', function() {
		$('.screen').hide();
		$('#myhero').show();
		$('#nav').show();
		$('#nav h3').text('My Hero');
		//playEffect('000');
		currentScreen = 'myhero';
	})

	$('#welcomeSettings').on('click', function() {
		$('.screen').hide();
		$('#main').hide();
		$('#settings_screen').show();
		$('#nav h3').text('Settings');
		$('#nav').show();
		$('#btmNav').show();
		//playEffect('000');
		currentScreen = 'settings_screen';
	})

	// BOTTOM NAV

	$('#btmNav .home').on('click', function() { 
		$('.screen').hide();
		$('#main').show();
		$('#cover').hide();
		$('#btmNav').hide();
		//playEffect('000');
		currentScreen = 'main';
	})

	$('#btmNav .play').on('click', function() {
		if (game_active) {
			$('.screen').hide();
			$('#gameContainer').show();
			$('#btmNav').hide();
			countdown(min, sec);
			currentScreen = 'gameContainer';
		} else {
			$('.screen').hide();
			$('#nav').show();
			$('#main').hide();
			$('#level_select').show();
			level_select();
			$('#btmNav').show();
			//playEffect('000');
			currentScreen = 'level_select';
			$('#nav h3').text('Level Select');
		}
	})

	$('#btmNav .myhero').on('click', function() {
		$('.screen').hide();
		$('#main').hide();
		$('#myhero').show();
		$('#btmNav').show();
		$('#nav h3').text('My Hero');
		//playEffect('000');
		currentScreen = 'myhero';
	})

	$('#btmNav .items').on('click', function() {
		$('#nav').show();
		$('.screen').hide();
		$('#main').hide();
		$('#items_menu').show();
		$('#btmNav').show();
		//playEffect('000');
		currentScreen = 'items';
		$('.points_text').text(storage.getItem('game_score'));
	})

	$('#btmNav .hero').on('click', function() {
		$('.screen').hide();
		$('#main').hide();
		$('#myhero').show();
		$('#btmNav').show();
		$('#nav h3').text('My Hero');
		//playEffect('000');
		currentScreen = 'myhero';
	})

	// UPLOAD TO TEACHER
	$('#uploadtoteacher').on('click', function() {
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
	
		$.ajax({
	        type: "POST",
	        url: "http://crossroadsedu.com/_appdb/dbinsert.php", 
	        data: user_data,
	        dataType: "text",  
	        cache: false,
	        success: 
            function(response){ 
            	console.log(response);
            	letemknow(response);
        	}
	    });
	});

	function letemknow(response) {
		$('#settings_screen .upload_success').show();
		setTimeout(function() { $('#settings_screen .upload_success').fadeOut(1000); }, 2000);
	}

	// GAME OVER

	$('.startButton.leaderboard').on('click', function() {
		leaderBoard();
		$('.screen').hide();
		$('#leaderboard').show();
		$('#nav h3').text('Leaderboard');
        $('#btmNav').show();
        $('#nav').show();
        currentScreen = 'leaderboard';
	})	

	// ITEMS

	$('#items_menu .items_menu.item ').on('click', function() {
		
		type = $(this).attr('data-type');
		
		$('#nav').show();
		$('.screen').hide();
		$('#main').hide();
		$('#items').show();
		$('#btmNav').show();
		//playEffect('000');
		currentScreen = 'items';
		$('#items .item').hide();
		$('#items .'+type).show();
	})

	function level_select() {
		if(JSON.parse(storage.getItem('user_completed'))) {
			$.each(JSON.parse(storage.getItem('user_completed')), function(k,v) {
		        $('.items_menu.item').each(function() {
		            if ($(this).attr('data-lesson') == k) {
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
		        });
	    	});
		}
	}
})

nav_height = $('#btmNav').height();
$('#items').css('height', 'calc(100% - ' + nav_height);


function runtest() {

	$('#myhero').addClass(storage.getItem('hero_gender')); // set background_image size
	$('#items_menu .'+storage.getItem('hero_gender')).show(); // set item list

	console.log(storage.getItem('hero_gender'));

	if (storage.getItem('hero_gender') == "male") {

		item_list = {
			/*****************************************************/
			/******************* SHIRTS **************************/
			/*****************************************************/
			"item001": {
				"name": "Cat Shirt",
				"image": "img/dressup/male/tops/top001.png",
				"icon": "img/dressup/male/tops/icons/top001.png",
				"price": 1200,
				"type": "top"
			},
			"item002": {
				"name": "Black Shirt",
				"image": "img/dressup/male/tops/top002.png",
				"icon": "img/dressup/male/tops/icons/top002.png",
				"price": 1200,
				"type": "top"
			},
			"item003": {
				"name": "White Shirt",
				"image": "img/dressup/male/tops/top003.png",
				"icon": "img/dressup/male/tops/icons/top003.png",
				"price": 1200,
				"type": "top"
			},
			"item004": {
				"name": "Pink Shirt",
				"image": "img/dressup/male/tops/top004.png",
				"icon": "img/dressup/male/tops/icons/top004.png",
				"price": 1200,
				"type": "top"
			},
			"item005": {
				"name": "Green Shirt",
				"image": "img/dressup/male/tops/top005.png",
				"icon": "img/dressup/male/tops/icons/top005.png",
				"price": 1200,
				"type": "top"
			},
			"item006": {
				"name": "Hockey Jersey Dark",
				"image": "img/dressup/male/tops/top006.png",
				"icon": "img/dressup/male/tops/icons/top006.png",
				"price": 1200,
				"type": "top"
			},
			"item007": {
				"name": "Hockey Jersey Red",
				"image": "img/dressup/male/tops/top007.png",
				"icon": "img/dressup/male/tops/icons/top007.png",
				"price": 1200,
				"type": "top"
			},
			"item008": {
				"name": "Hockey Jersey Blue",
				"image": "img/dressup/male/tops/top008.png",
				"icon": "img/dressup/male/tops/icons/top008.png",
				"price": 1200,
				"type": "top"
			},
			"item009": {
				"name": "Hockey Jersey Orange",
				"image": "img/dressup/male/tops/top009.png",
				"icon": "img/dressup/male/tops/icons/top009.png",
				"price": 1200,
				"type": "top"
			},
			"item010": {
				"name": "Hockey Jersey White",
				"image": "img/dressup/male/tops/top010.png",
				"icon": "img/dressup/male/tops/icons/top010.png",
				"price": 1200,
				"type": "top"
			},
			"item011": {
				"name": "Bolt Shirt Orange",
				"image": "img/dressup/male/tops/top011.png",
				"icon": "img/dressup/male/tops/icons/top011.png",
				"price": 1200,
				"type": "top"
			},
			"item012": {
				"name": "Bolt Shirt Yellow",
				"image": "img/dressup/male/tops/top012.png",
				"icon": "img/dressup/male/tops/icons/top012.png",
				"price": 1200,
				"type": "top"
			},
			"item013": {
				"name": "Bolt Shirt Black",
				"image": "img/dressup/male/tops/top013.png",
				"icon": "img/dressup/male/tops/icons/top013.png",
				"price": 1200,
				"type": "top"
			},
			"item014": {
				"name": "Bolt Shirt White",
				"image": "img/dressup/male/tops/top014.png",
				"icon": "img/dressup/male/tops/icons/top014.png",
				"price": 1200,
				"type": "top"
			},
			"item015": {
				"name": "Bolt Shirt Blue",
				"image": "img/dressup/male/tops/top015.png",
				"icon": "img/dressup/male/tops/icons/top015.png",
				"price": 1200,
				"type": "top"
			},
			"item016": {
				"name": "Dress Shirt Yellow",
				"image": "img/dressup/male/tops/top016.png",
				"icon": "img/dressup/male/tops/icons/top016.png",
				"price": 1200,
				"type": "top"
			},
			"item017": {
				"name": "Dress Shirt Pink",
				"image": "img/dressup/male/tops/top017.png",
				"icon": "img/dressup/male/tops/icons/top017.png",
				"price": 1200,
				"type": "top"
			},
			"item018": {
				"name": "Dress Shirt Blue",
				"image": "img/dressup/male/tops/top018.png",
				"icon": "img/dressup/male/tops/icons/top018.png",
				"price": 1200,
				"type": "top"
			},
			"item019": {
				"name": "Dress Shirt Dark",
				"image": "img/dressup/male/tops/top019.png",
				"icon": "img/dressup/male/tops/icons/top019.png",
				"price": 1200,
				"type": "top"
			},
			"item020": {
				"name": "Dress Shirt White",
				"image": "img/dressup/male/tops/top020.png",
				"icon": "img/dressup/male/tops/icons/top020.png",
				"price": 1200,
				"type": "top"
			},
			"item021": {
				"name": "Football Jersey Dark",
				"image": "img/dressup/male/tops/top021.png",
				"icon": "img/dressup/male/tops/icons/top021.png",
				"price": 1200,
				"type": "top"
			},
			"item022": {
				"name": "Football Jersey Green",
				"image": "img/dressup/male/tops/top022.png",
				"icon": "img/dressup/male/tops/icons/top022.png",
				"price": 1200,
				"type": "top"
			},
			"item023": {
				"name": "Football Jersey Neon Green",
				"image": "img/dressup/male/tops/top023.png",
				"icon": "img/dressup/male/tops/icons/top023.png",
				"price": 1200,
				"type": "top"
			},
			"item024": {
				"name": "Football Jersey Red",
				"image": "img/dressup/male/tops/top024.png",
				"icon": "img/dressup/male/tops/icons/top024.png",
				"price": 1200,
				"type": "top"
			},
			"item025": {
				"name": "Football Jersey White",
				"image": "img/dressup/male/tops/top025.png",
				"icon": "img/dressup/male/tops/icons/top025.png",
				"price": 1200,
				"type": "top"
			},
			"item026": {
				"name": "Tank top Dark",
				"image": "img/dressup/male/tops/top026.png",
				"icon": "img/dressup/male/tops/icons/top026.png",
				"price": 1200,
				"type": "top"
			},
			"item027": {
				"name": "Tank Top Red",
				"image": "img/dressup/male/tops/top027.png",
				"icon": "img/dressup/male/tops/icons/top027.png",
				"price": 1200,
				"type": "top"
			},
			"item028": {
				"name": "Tank Top Blue",
				"image": "img/dressup/male/tops/top028.png",
				"icon": "img/dressup/male/tops/icons/top028.png",
				"price": 1200,
				"type": "top"
			},
			"item029": {
				"name": "Tank Top Dark",
				"image": "img/dressup/male/tops/top029.png",
				"icon": "img/dressup/male/tops/icons/top029.png",
				"price": 1200,
				"type": "top"
			},
			"item030": {
				"name": "Tank Top White",
				"image": "img/dressup/male/tops/top030.png",
				"icon": "img/dressup/male/tops/icons/top030.png",
				"price": 1200,
				"type": "top"
			},
			"item031": {
				"name": "Long Sleeves Blue",
				"image": "img/dressup/male/tops/top031.png",
				"icon": "img/dressup/male/tops/icons/top031.png",
				"price": 1200,
				"type": "top"
			},
			"item032": {
				"name": "Long Sleeves White",
				"image": "img/dressup/male/tops/top032.png",
				"icon": "img/dressup/male/tops/icons/top032.png",
				"price": 1200,
				"type": "top"
			},
			"item033": {
				"name": "Long Sleeves Grey",
				"image": "img/dressup/male/tops/top033.png",
				"icon": "img/dressup/male/tops/icons/top033.png",
				"price": 1200,
				"type": "top"
			},
			"item034": {
				"name": "Long Sleeves Red",
				"image": "img/dressup/male/tops/top034.png",
				"icon": "img/dressup/male/tops/icons/top034.png",
				"price": 1200,
				"type": "top"
			},
			"item035": {
				"name": "Long Sleeves Orange",
				"image": "img/dressup/male/tops/top035.png",
				"icon": "img/dressup/male/tops/icons/top035.png",
				"price": 1200,
				"type": "top"
			},
			"item036": {
				"name": "Ripped Dark",
				"image": "img/dressup/male/tops/top036.png",
				"icon": "img/dressup/male/tops/icons/top036.png",
				"price": 1200,
				"type": "top"
			},
			"item037": {
				"name": "Ripped White",
				"image": "img/dressup/male/tops/top037.png",
				"icon": "img/dressup/male/tops/icons/top037.png",
				"price": 1200,
				"type": "top"
			},
			"item038": {
				"name": "Ripped Red",
				"image": "img/dressup/male/tops/top038.png",
				"icon": "img/dressup/male/tops/icons/top038.png",
				"price": 1200,
				"type": "top"
			},
			"item039": {
				"name": "Ripped Blue",
				"image": "img/dressup/male/tops/top039.png",
				"icon": "img/dressup/male/tops/icons/top039.png",
				"price": 1200,
				"type": "top"
			},
			"item040": {
				"name": "Ripped Green",
				"image": "img/dressup/male/tops/top040.png",
				"icon": "img/dressup/male/tops/icons/top040.png",
				"price": 1200,
				"type": "top"
			},
			/*****************************************************/
			/******************* PANTS **************************/
			/*****************************************************/
			"item041": {
				"name": "Jeans",
				"image": "img/dressup/male/pants/pants001.png",
				"icon": "img/dressup/male/pants/icons/pants001.png",
				"price": 1200,
				"type": "pants"
			},
			"item042": {
				"name": "Gray Pants",
				"image": "img/dressup/male/pants/pants002.png",
				"icon": "img/dressup/male/pants/icons/pants002.png",
				"price": 1200,
				"type": "pants"
			},
			"item043": {
				"name": "Black Pants",
				"image": "img/dressup/male/pants/pants003.png",
				"icon": "img/dressup/male/pants/icons/pants003.png",
				"price": 1200,
				"type": "pants"
			},
			"item044": {
				"name": "Comfort Shorts Yellow",
				"image": "img/dressup/male/pants/pants004.png",
				"icon": "img/dressup/male/pants/icons/pants004.png",
				"price": 1200,
				"type": "pants"
			},
			"item045": {
				"name": "Comfort Shorts Dark",
				"image": "img/dressup/male/pants/pants005.png",
				"icon": "img/dressup/male/pants/icons/pants005.png",
				"price": 1200,
				"type": "pants"
			},
			"item046": {
				"name": "Comfort Shorts Blue",
				"image": "img/dressup/male/pants/pants006.png",
				"icon": "img/dressup/male/pants/icons/pants006.png",
				"price": 1200,
				"type": "pants"
			},
			"item047": {
				"name": "Comfort Shorts White",
				"image": "img/dressup/male/pants/pants007.png",
				"icon": "img/dressup/male/pants/icons/pants007.png",
				"price": 1200,
				"type": "pants"
			},
			"item048": {
				"name": "Comfort Shorts Red",
				"image": "img/dressup/male/pants/pants008.png",
				"icon": "img/dressup/male/pants/icons/pants008.png",
				"price": 1200,
				"type": "pants"
			},
			"item049": {
				"name": "Shorts Dark Red",
				"image": "img/dressup/male/pants/pants009.png",
				"icon": "img/dressup/male/pants/icons/pants009.png",
				"price": 1200,
				"type": "pants"
			},
			"item050": {
				"name": "Shorts Black",
				"image": "img/dressup/male/pants/pants010.png",
				"icon": "img/dressup/male/pants/icons/pants010.png",
				"price": 1200,
				"type": "pants"
			},
			"item051": {
				"name": "Shorts Grey",
				"image": "img/dressup/male/pants/pants011.png",
				"icon": "img/dressup/male/pants/icons/pants011.png",
				"price": 1200,
				"type": "pants"
			},
			"item052": {
				"name": "Shorts White",
				"image": "img/dressup/male/pants/pants012.png",
				"icon": "img/dressup/male/pants/icons/pants012.png",
				"price": 1200,
				"type": "pants"
			},
			"item053": {
				"name": "Shorts Yellow",
				"image": "img/dressup/male/pants/pants013.png",
				"icon": "img/dressup/male/pants/icons/pants013.png",
				"price": 1200,
				"type": "pants"
			},
			"item054": {
				"name": "Super Pants Blue",
				"image": "img/dressup/male/pants/pants014.png",
				"icon": "img/dressup/male/pants/icons/pants014.png",
				"price": 1200,
				"type": "pants"
			},
			"item055": {
				"name": "Super Pants Black",
				"image": "img/dressup/male/pants/pants015.png",
				"icon": "img/dressup/male/pants/icons/pants015.png",
				"price": 1200,
				"type": "pants"
			},
			"item056": {
				"name": "Super Pants Grey",
				"image": "img/dressup/male/pants/pants016.png",
				"icon": "img/dressup/male/pants/icons/pants016.png",
				"price": 1200,
				"type": "pants"
			},
			"item057": {
				"name": "Super Pants Red",
				"image": "img/dressup/male/pants/pants017.png",
				"icon": "img/dressup/male/pants/icons/pants017.png",
				"price": 1200,
				"type": "pants"
			},
			"item058": {
				"name": "Super Pants Orange",
				"image": "img/dressup/male/pants/pants018.png",
				"icon": "img/dressup/male/pants/icons/pants018.png",
				"price": 1200,
				"type": "pants"
			},
			"item059": {
				"name": "Super Pants White",
				"image": "img/dressup/male/pants/pants019.png",
				"icon": "img/dressup/male/pants/icons/pants019.png",
				"price": 1200,
				"type": "pants"
			},
			"item060": {
				"name": "Super Pants Black / Yellow",
				"image": "img/dressup/male/pants/pants020.png",
				"icon": "img/dressup/male/pants/icons/pants020.png",
				"price": 1200,
				"type": "pants"
			},
			"item061": {
				"name": "Super Pants White / Black",
				"image": "img/dressup/male/pants/pants021.png",
				"icon": "img/dressup/male/pants/icons/pants021.png",
				"price": 1200,
				"type": "pants"
			},
			"item062": {
				"name": "Super Pants White / Blue",
				"image": "img/dressup/male/pants/pants022.png",
				"icon": "img/dressup/male/pants/icons/pants022.png",
				"price": 1200,
				"type": "pants"
			},
			"item063": {
				"name": "Super Pants Blue / White",
				"image": "img/dressup/male/pants/pants023.png",
				"icon": "img/dressup/male/pants/icons/pants023.png",
				"price": 1200,
				"type": "pants"
			},
			"item064": {
				"name": "Athletic Pants Blue",
				"image": "img/dressup/male/pants/pants024.png",
				"icon": "img/dressup/male/pants/icons/pants024.png",
				"price": 1200,
				"type": "pants"
			},
			"item065": {
				"name": "Athletic Pants Grey",
				"image": "img/dressup/male/pants/pants0025.png",
				"icon": "img/dressup/male/pants/icons/pants025.png",
				"price": 1200,
				"type": "pants"
			},
			"item066": {
				"name": "Athletic Pants Dark",
				"image": "img/dressup/male/pants/pants026.png",
				"icon": "img/dressup/male/pants/icons/pants026.png",
				"price": 1200,
				"type": "pants"
			},
			"item067": {
				"name": "Athletic Pants Red",
				"image": "img/dressup/male/pants/pants027.png",
				"icon": "img/dressup/male/pants/icons/pants027.png",
				"price": 1200,
				"type": "pants"
			},
			"item068": {
				"name": "Athletic Pants Orange",
				"image": "img/dressup/male/pants/pants028.png",
				"icon": "img/dressup/male/pants/icons/pants028.png",
				"price": 1200,
				"type": "pants"
			},
			"item069": {
				"name": "Casual Shorts Dark",
				"image": "img/dressup/male/pants/pants029.png",
				"icon": "img/dressup/male/pants/icons/pants029.png",
				"price": 1200,
				"type": "pants"
			},
			"item070": {
				"name": "Casual Shorts White",
				"image": "img/dressup/male/pants/pants030.png",
				"icon": "img/dressup/male/pants/icons/pants030.png",
				"price": 1200,
				"type": "pants"
			},
			"item071": {
				"name": "Casual Shorts Orange",
				"image": "img/dressup/male/pants/pants031.png",
				"icon": "img/dressup/male/pants/icons/pants031.png",
				"price": 1200,
				"type": "pants"
			},
			"item072": {
				"name": "Casual Shorts Blue",
				"image": "img/dressup/male/pants/pants032.png",
				"icon": "img/dressup/male/pants/icons/pants032.png",
				"price": 1200,
				"type": "pants"
			},
			"item073": {
				"name": "Casual Shorts Green",
				"image": "img/dressup/male/pants/pants033.png",
				"icon": "img/dressup/male/pants/icons/pants033.png",
				"price": 1200,
				"type": "pants"
			},
			/*****************************************************/
			/******************* SHOES ***************************/
			/*****************************************************/
			"item074": {
				"name": "White Shoes",
				"image": "img/dressup/male/shoes/shoe001.png",
				"icon": "img/dressup/male/shoes/icons/shoe001.png",
				"price": 1200,
				"type": "shoe"
			},
			"item075": {
				"name": "Gray Shoes",
				"image": "img/dressup/male/shoes/shoe002.png",
				"icon": "img/dressup/male/shoes/icons/shoe002.png",
				"price": 1200,
				"type": "shoe"
			},
			"item076": {
				"name": "Dark Shoes",
				"image": "img/dressup/male/shoes/shoe003.png",
				"icon": "img/dressup/male/shoes/icons/shoe003.png",
				"price": 1200,
				"type": "shoe"
			},
			"item077": {
				"name": "Black Shoes",
				"image": "img/dressup/male/shoes/shoe004.png",
				"icon": "img/dressup/male/shoes/icons/shoe004.png",
				"price": 1200,
				"type": "shoe"
			},
			"item078": {
				"name": "Cleats Dark",
				"image": "img/dressup/male/shoes/shoe005.png",
				"icon": "img/dressup/male/shoes/icons/shoe005.png",
				"price": 1200,
				"type": "shoe"
			},
			"item079": {
				"name": "Cleats Grey",
				"image": "img/dressup/male/shoes/shoe006.png",
				"icon": "img/dressup/male/shoes/icons/shoe006.png",
				"price": 1200,
				"type": "shoe"
			},
			"item080": {
				"name": "Cleats White Green",
				"image": "img/dressup/male/shoes/shoe007.png",
				"icon": "img/dressup/male/shoes/icons/shoe007.png",
				"price": 1200,
				"type": "shoe"
			},
			"item081": {
				"name": "Cleats Green",
				"image": "img/dressup/male/shoes/shoe008.png",
				"icon": "img/dressup/male/shoes/icons/shoe008.png",
				"price": 1200,
				"type": "shoe"
			},
			"item082": {
				"name": "Feather White",
				"image": "img/dressup/male/shoes/shoe009.png",
				"icon": "img/dressup/male/shoes/icons/shoe009.png",
				"price": 1200,
				"type": "shoe"
			},
			"item083": {
				"name": "Feather Dark",
				"image": "img/dressup/male/shoes/shoe010.png",
				"icon": "img/dressup/male/shoes/icons/shoe010.png",
				"price": 1200,
				"type": "shoe"
			},
			"item084": {
				"name": "Feather White",
				"image": "img/dressup/male/shoes/shoe011.png",
				"icon": "img/dressup/male/shoes/icons/shoe011.png",
				"price": 1200,
				"type": "shoe"
			},
			"item085": {
				"name": "Feather Red",
				"image": "img/dressup/male/shoes/shoe012.png",
				"icon": "img/dressup/male/shoes/icons/shoe012.png",
				"price": 1200,
				"type": "shoe"
			},
			"item086": {
				"name": "Feather White / Green",
				"image": "img/dressup/male/shoes/shoe013.png",
				"icon": "img/dressup/male/shoes/icons/shoe013.png",
				"price": 1200,
				"type": "shoe"
			},
			"item087": {
				"name": "Feather White / Blue",
				"image": "img/dressup/male/shoes/shoe014.png",
				"icon": "img/dressup/male/shoes/icons/shoe014.png",
				"price": 1200,
				"type": "shoe"
			},
			"item088": {
				"name": "Soft Grey",
				"image": "img/dressup/male/shoes/shoe015.png",
				"icon": "img/dressup/male/shoes/icons/shoe015.png",
				"price": 1200,
				"type": "shoe"
			},
			"item089": {
				"name": "Soft Yellow",
				"image": "img/dressup/male/shoes/shoe016.png",
				"icon": "img/dressup/male/shoes/icons/shoe016.png",
				"price": 1200,
				"type": "shoe"
			},
			"item090": {
				"name": "Soft Brown",
				"image": "img/dressup/male/shoes/shoe017.png",
				"icon": "img/dressup/male/shoes/icons/shoe017.png",
				"price": 1200,
				"type": "shoe"
			},
			"item091": {
				"name": "Soft Orange",
				"image": "img/dressup/male/shoes/shoe018.png",
				"icon": "img/dressup/male/shoes/icons/shoe018.png",
				"price": 1200,
				"type": "shoe"
			},
			"item092": {
				"name": "Soft Yellow",
				"image": "img/dressup/male/shoes/shoe019.png",
				"icon": "img/dressup/male/shoes/icons/shoe019.png",
				"price": 1200,
				"type": "shoe"
			},
			"item093": {
				"name": "Boots Dark",
				"image": "img/dressup/male/shoes/shoe020.png",
				"icon": "img/dressup/male/shoes/icons/shoe020.png",
				"price": 1200,
				"type": "shoe"
			},
			"item094": {
				"name": "Boots Blue",
				"image": "img/dressup/male/shoes/shoe021.png",
				"icon": "img/dressup/male/shoes/icons/shoe021.png",
				"price": 1200,
				"type": "shoe"
			},
			"item095": {
				"name": "Boots Red",
				"image": "img/dressup/male/shoes/shoe022.png",
				"icon": "img/dressup/male/shoes/icons/shoe022.png",
				"price": 1200,
				"type": "shoe"
			},
			"item096": {
				"name": "Boots Red",
				"image": "img/dressup/male/shoes/shoe023.png",
				"icon": "img/dressup/male/shoes/icons/shoe023.png",
				"price": 1200,
				"type": "shoe"
			},
			"item097": {
				"name": "Boots Brown",
				"image": "img/dressup/male/shoes/shoe024.png",
				"icon": "img/dressup/male/shoes/icons/shoe024.png",
				"price": 1200,
				"type": "shoe"
			},
			"item098": {
				"name": "Boots Low Dark",
				"image": "img/dressup/male/shoes/shoe025.png",
				"icon": "img/dressup/male/shoes/icons/shoe025.png",
				"price": 1200,
				"type": "shoe"
			},
			"item099": {
				"name": "Boots Low Yellow",
				"image": "img/dressup/male/shoes/shoe026.png",
				"icon": "img/dressup/male/shoes/icons/shoe026.png",
				"price": 1200,
				"type": "shoe"
			},
			"item100": {
				"name": "Soft Brown",
				"image": "img/dressup/male/shoes/shoe027.png",
				"icon": "img/dressup/male/shoes/icons/shoe027.png",
				"price": 1200,
				"type": "shoe"
			},
			"item101": {
				"name": "Soft Orange",
				"image": "img/dressup/male/shoes/shoe028.png",
				"icon": "img/dressup/male/shoes/icons/shoe028.png",
				"price": 1200,
				"type": "shoe"
			},
			"item102": {
				"name": "Soft Yellow",
				"image": "img/dressup/male/shoes/shoe029.png",
				"icon": "img/dressup/male/shoes/icons/shoe029.png",
				"price": 1200,
				"type": "shoe"
			},
			"item103": {
				"name": "Boots Dark",
				"image": "img/dressup/male/shoes/shoe030.png",
				"icon": "img/dressup/male/shoes/icons/shoe030.png",
				"price": 1200,
				"type": "shoe"
			},
			"item104": {
				"name": "Boots Blue",
				"image": "img/dressup/male/shoes/shoe031.png",
				"icon": "img/dressup/male/shoes/icons/shoe031.png",
				"price": 1200,
				"type": "shoe"
			},
			"item105": {
				"name": "Boots Black",
				"image": "img/dressup/male/shoes/shoe032.png",
				"icon": "img/dressup/male/shoes/icons/shoe032.png",
				"price": 1200,
				"type": "shoe"
			},
			"item106": {
				"name": "Boots Red",
				"image": "img/dressup/male/shoes/shoe033.png",
				"icon": "img/dressup/male/shoes/icons/shoe033.png",
				"price": 1200,
				"type": "shoe"
			},
			"item107": {
				"name": "Boots White",
				"image": "img/dressup/male/shoes/shoe034.png",
				"icon": "img/dressup/male/shoes/icons/shoe034.png",
				"price": 1200,
				"type": "shoe"
			},
			"item108": {
				"name": "Space Boot White",
				"image": "img/dressup/male/shoes/shoe035.png",
				"icon": "img/dressup/male/shoes/icons/shoe035.png",
				"price": 1200,
				"type": "shoe"
			},
			"item109": {
				"name": "Space Boot Black",
				"image": "img/dressup/male/shoes/shoe036.png",
				"icon": "img/dressup/male/shoes/icons/shoe036.png",
				"price": 1200,
				"type": "shoe"
			},
			"item110": {
				"name": "Space Boot Red / White",
				"image": "img/dressup/male/shoes/shoe037.png",
				"icon": "img/dressup/male/shoes/icons/shoe037.png",
				"price": 1200,
				"type": "shoe"
			},
			"item111": {
				"name": "Space Boot Red",
				"image": "img/dressup/male/shoes/shoe038.png",
				"icon": "img/dressup/male/shoes/icons/shoe038.png",
				"price": 1200,
				"type": "shoe"
			},
			"item112": {
				"name": "Space Boot White / Black",
				"image": "img/dressup/male/shoes/shoe039.png",
				"icon": "img/dressup/male/shoes/icons/shoe039.png",
				"price": 1200,
				"type": "shoe"
			},
			"item113": {
				"name": "Sneakers Grey",
				"image": "img/dressup/male/shoes/shoe040.png",
				"icon": "img/dressup/male/shoes/icons/shoe040.png",
				"price": 1200,
				"type": "shoe"
			},
			"item114": {
				"name": "Sneakers White / Red",
				"image": "img/dressup/male/shoes/shoe041.png",
				"icon": "img/dressup/male/shoes/icons/shoe041.png",
				"price": 1200,
				"type": "shoe"
			},
			"item115": {
				"name": "Sneakers Darl / Red",
				"image": "img/dressup/male/shoes/shoe042.png",
				"icon": "img/dressup/male/shoes/icons/shoe042.png",
				"price": 1200,
				"type": "shoe"
			},
			"item116": {
				"name": "Sneakers Yellow",
				"image": "img/dressup/male/shoes/shoe043.png",
				"icon": "img/dressup/male/shoes/icons/shoe043.png",
				"price": 1200,
				"type": "shoe"
			},
			"item117": {
				"name": "Sneakers White / Blue",
				"image": "img/dressup/male/shoes/shoe044.png",
				"icon": "img/dressup/male/shoes/icons/shoe044.png",
				"price": 1200,
				"type": "shoe"
			}
		}		
	} else {
		item_list = {
			/*****************************************************/
			/******************* SHOES ***************************/
			/*****************************************************/
			"item001": {
				"name": "Blue Shoes",
				"image": "img/dressup/female/shoes/shoe001.png",
				"icon": "img/dressup/female/shoes/icons/shoe001.png",
				"price": 1200,
				"type": "shoe"
			},
			"item002": {
				"name": "Black Shoes",
				"image": "img/dressup/female/shoes/shoe002.png",
				"icon": "img/dressup/female/shoes/icons/shoe002.png",
				"price": 1200,
				"type": "shoe"
			},
			"item003": {
				"name": "Yellow Shoes",
				"image": "img/dressup/female/shoes/shoe003.png",
				"icon": "img/dressup/female/shoes/icons/shoe003.png",
				"price": 1200,
				"type": "shoe"
			},
			"item004": {
				"name": "Hero Boots Red",
				"image": "img/dressup/female/shoes/shoe004.png",
				"icon": "img/dressup/female/shoes/icons/shoe004.png",
				"price": 1200,
				"type": "shoe"
			},
			"item005": {
				"name": "Hero Boots White",
				"image": "img/dressup/female/shoes/shoe005.png",
				"icon": "img/dressup/female/shoes/icons/shoe005.png",
				"price": 1200,
				"type": "shoe"
			},
			"item006": {
				"name": "Hero Boots Dark",
				"image": "img/dressup/female/shoes/shoe006.png",
				"icon": "img/dressup/female/shoes/icons/shoe006.png",
				"price": 1200,
				"type": "shoe"
			},
			"item007": {
				"name": "Hero Boots White",
				"image": "img/dressup/female/shoes/shoe007.png",
				"icon": "img/dressup/female/shoes/icons/shoe007.png",
				"price": 1200,
				"type": "shoe"
			},
			"item008": {
				"name": "Hero Boots Yellow",
				"image": "img/dressup/female/shoes/shoe008.png",
				"icon": "img/dressup/female/shoes/icons/shoe008.png",
				"price": 1200,
				"type": "shoe"
			},
			"item009": {
				"name": "Hero Boots Red",
				"image": "img/dressup/female/shoes/shoe009.png",
				"icon": "img/dressup/female/shoes/icons/shoe009.png",
				"price": 1200,
				"type": "shoe"
			},
			"item010": {
				"name": "Hero Boots White",
				"image": "img/dressup/female/shoes/shoe010.png",
				"icon": "img/dressup/female/shoes/icons/shoe010.png",
				"price": 1200,
				"type": "shoe"
			},
			"item011": {
				"name": "Hero Boots Dark",
				"image": "img/dressup/female/shoes/shoe011.png",
				"icon": "img/dressup/female/shoes/icons/shoe011.png",
				"price": 1200,
				"type": "shoe"
			},
			"item012": {
				"name": "Hero Boots Blue",
				"image": "img/dressup/female/shoes/shoe012.png",
				"icon": "img/dressup/female/shoes/icons/shoe012.png",
				"price": 1200,
				"type": "shoe"
			},
			"item013": {
				"name": "Hero Boots Light Blue",
				"image": "img/dressup/female/shoes/shoe013.png",
				"icon": "img/dressup/female/shoes/icons/shoe013.png",
				"price": 1200,
				"type": "shoe"
			},
			"item014": {
				"name": "Short Boots Grey",
				"image": "img/dressup/female/shoes/shoe014.png",
				"icon": "img/dressup/female/shoes/icons/shoe014.png",
				"price": 1200,
				"type": "shoe"
			},
			"item015": {
				"name": "Short Boots Purple",
				"image": "img/dressup/female/shoes/shoe015.png",
				"icon": "img/dressup/female/shoes/icons/shoe015.png",
				"price": 1200,
				"type": "shoe"
			},
			"item016": {
				"name": "Short Boots Dark White",
				"image": "img/dressup/female/shoes/shoe016.png",
				"icon": "img/dressup/female/shoes/icons/shoe016.png",
				"price": 1200,
				"type": "shoe"
			},
			"item017": {
				"name": "Short Boots Light Blue",
				"image": "img/dressup/female/shoes/shoe017.png",
				"icon": "img/dressup/female/shoes/icons/shoe017.png",
				"price": 1200,
				"type": "shoe"
			},
			"item018": {
				"name": "Short Boots Yellow",
				"image": "img/dressup/female/shoes/shoe018.png",
				"icon": "img/dressup/female/shoes/icons/shoe018.png",
				"price": 1200,
				"type": "shoe"
			},
			"item019": {
				"name": "Short Boots Pink",
				"image": "img/dressup/female/shoes/shoe019.png",
				"icon": "img/dressup/female/shoes/icons/shoe019.png",
				"price": 1200,
				"type": "shoe"
			},
			"item020": {
				"name": "Short Boots Purple",
				"image": "img/dressup/female/shoes/shoe020.png",
				"icon": "img/dressup/female/shoes/icons/shoe020.png",
				"price": 1200,
				"type": "shoe"
			},
			"item021": {
				"name": "Short Boots Dark",
				"image": "img/dressup/female/shoes/shoe021.png",
				"icon": "img/dressup/female/shoes/icons/shoe021.png",
				"price": 1200,
				"type": "shoe"
			},
			"item022": {
				"name": "Short Boots Dark",
				"image": "img/dressup/female/shoes/shoe022.png",
				"icon": "img/dressup/female/shoes/icons/shoe022.png",
				"price": 1200,
				"type": "shoe"
			},
			"item023": {
				"name": "Short Boots Red",
				"image": "img/dressup/female/shoes/shoe023.png",
				"icon": "img/dressup/female/shoes/icons/shoe023.png",
				"price": 1200,
				"type": "shoe"
			},
			"item024": {
				"name": "Heels Dark",
				"image": "img/dressup/female/shoes/shoe024.png",
				"icon": "img/dressup/female/shoes/icons/shoe024.png",
				"price": 1200,
				"type": "shoe"
			},
			"item025": {
				"name": "Heels White",
				"image": "img/dressup/female/shoes/shoe025.png",
				"icon": "img/dressup/female/shoes/icons/shoe025.png",
				"price": 1200,
				"type": "shoe"
			},
			"item026": {
				"name": "Heels Red",
				"image": "img/dressup/female/shoes/shoe026.png",
				"icon": "img/dressup/female/shoes/icons/shoe026.png",
				"price": 1200,
				"type": "shoe"
			},
			"item027": {
				"name": "Heels Pink",
				"image": "img/dressup/female/shoes/shoe027.png",
				"icon": "img/dressup/female/shoes/icons/shoe027.png",
				"price": 1200,
				"type": "shoe"
			},
			"item028": {
				"name": "Heels Blue",
				"image": "img/dressup/female/shoes/shoe028.png",
				"icon": "img/dressup/female/shoes/icons/shoe028.png",
				"price": 1200,
				"type": "shoe"
			},
			"item029": {
				"name": "Short White",
				"image": "img/dressup/female/shoes/shoe029.png",
				"icon": "img/dressup/female/shoes/icons/shoe029.png",
				"price": 1200,
				"type": "shoe"
			},
			"item030": {
				"name": "Short Dark",
				"image": "img/dressup/female/shoes/shoe030.png",
				"icon": "img/dressup/female/shoes/icons/shoe030.png",
				"price": 1200,
				"type": "shoe"
			},
			"item031": {
				"name": "Short Light Grey",
				"image": "img/dressup/female/shoes/shoe031.png",
				"icon": "img/dressup/female/shoes/icons/shoe031.png",
				"price": 1200,
				"type": "shoe"
			},
			"item032": {
				"name": "Short Grey",
				"image": "img/dressup/female/shoes/shoe032.png",
				"icon": "img/dressup/female/shoes/icons/shoe032.png",
				"price": 1200,
				"type": "shoe"
			},
			"item033": {
				"name": "Short Dark Grey",
				"image": "img/dressup/female/shoes/shoe033.png",
				"icon": "img/dressup/female/shoes/icons/shoe033.png",
				"price": 1200,
				"type": "shoe"
			},
			"item034": {
				"name": "Feather Pink",
				"image": "img/dressup/female/shoes/shoe034.png",
				"icon": "img/dressup/female/shoes/icons/shoe034.png",
				"price": 1200,
				"type": "shoe"
			},
			"item035": {
				"name": "Feather Red",
				"image": "img/dressup/female/shoes/shoe035.png",
				"icon": "img/dressup/female/shoes/icons/shoe035.png",
				"price": 1200,
				"type": "shoe"
			},
			"item036": {
				"name": "Feather Orange",
				"image": "img/dressup/female/shoes/shoe036.png",
				"icon": "img/dressup/female/shoes/icons/shoe036.png",
				"price": 1200,
				"type": "shoe"
			},
			"item037": {
				"name": "Feather Teal",
				"image": "img/dressup/female/shoes/shoe037.png",
				"icon": "img/dressup/female/shoes/icons/shoe037.png",
				"price": 1200,
				"type": "shoe"
			},
			"item038": {
				"name": "Feather Yellow",
				"image": "img/dressup/female/shoes/shoe038.png",
				"icon": "img/dressup/female/shoes/icons/shoe038.png",
				"price": 1200,
				"type": "shoe"
			},
			/*****************************************************/
			/******************* TOPS  ***************************/
			/*****************************************************/
			"item043": {
				"name": "Yellow Top",
				"image": "img/dressup/female/tops/top001.png",
				"icon": "img/dressup/female/tops/icons/top001.png",
				"price": 1200,
				"type": "top"
			},
			"item044": {
				"name": "Blue Top",
				"image": "img/dressup/female/tops/top002.png",
				"icon": "img/dressup/female/tops/icons/top002.png",
				"price": 1300,
				"type": "top"
			},
			"item045": {
				"name": "Gray Top",
				"image": "img/dressup/female/tops/top003.png",
				"icon": "img/dressup/female/tops/icons/top003.png",
				"price": 1100,
				"type": "top"
			},
			"item046": {
				"name": "Dark Top",
				"image": "img/dressup/female/tops/top004.png",
				"icon": "img/dressup/female/tops/icons/top004.png",
				"price": 1100,
				"type": "top"
			},
			"item047": {
				"name": "Long Sleeve Pink",
				"image": "img/dressup/female/tops/top005.png",
				"icon": "img/dressup/female/tops/icons/top005.png",
				"price": 1200,
				"type": "top"
			},
			"item048": {
				"name": "Long Sleeve Green",
				"image": "img/dressup/female/tops/top006.png",
				"icon": "img/dressup/female/tops/icons/top006.png",
				"price": 1300,
				"type": "top"
			},
			"item049": {
				"name": "Long Sleeve Red",
				"image": "img/dressup/female/tops/top007.png",
				"icon": "img/dressup/female/tops/icons/top007.png",
				"price": 1100,
				"type": "top"
			},
			"item050": {
				"name": "Long Sleeve Teal",
				"image": "img/dressup/female/tops/top008.png",
				"icon": "img/dressup/female/tops/icons/top008.png",
				"price": 1100,
				"type": "top"
			},
			"item051": {
				"name": "Long Sleeve White",
				"image": "img/dressup/female/tops/top009.png",
				"icon": "img/dressup/female/tops/icons/top009.png",
				"price": 1100,
				"type": "top"
			},
			"item052": {
				"name": "Long Sleeve Green",
				"image": "img/dressup/female/tops/top010.png",
				"icon": "img/dressup/female/tops/icons/top010.png",
				"price": 1100,
				"type": "top"
			},
			"item053": {
				"name": "Long Sleeve Red",
				"image": "img/dressup/female/tops/top011.png",
				"icon": "img/dressup/female/tops/icons/top011.png",
				"price": 1100,
				"type": "top"
			},
			"item054": {
				"name": "Long Sleeve Purple",
				"image": "img/dressup/female/tops/top012.png",
				"icon": "img/dressup/female/tops/icons/top012.png",
				"price": 1100,
				"type": "top"
			},
			"item055": {
				"name": "Long Sleeve Black",
				"image": "img/dressup/female/tops/top013.png",
				"icon": "img/dressup/female/tops/icons/top013.png",
				"price": 1100,
				"type": "top"
			},
			"item056": {
				"name": "Long Sleeve White",
				"image": "img/dressup/female/tops/top014.png",
				"icon": "img/dressup/female/tops/icons/top014.png",
				"price": 1100,
				"type": "top"
			},
			"item057": {
				"name": "Tank Top Yellow",
				"image": "img/dressup/female/tops/top015.png",
				"icon": "img/dressup/female/tops/icons/top015.png",
				"price": 1100,
				"type": "top"
			},
			"item058": {
				"name": "Tank Top Teal",
				"image": "img/dressup/female/tops/top016.png",
				"icon": "img/dressup/female/tops/icons/top016.png",
				"price": 1100,
				"type": "top"
			},
			"item059": {
				"name": "Tank Top Pink",
				"image": "img/dressup/female/tops/top017.png",
				"icon": "img/dressup/female/tops/icons/top017.png",
				"price": 1100,
				"type": "top"
			},
			"item060": {
				"name": "Tank Top Black",
				"image": "img/dressup/female/tops/top018.png",
				"icon": "img/dressup/female/tops/icons/top018.png",
				"price": 1100,
				"type": "top"
			},
			"item061": {
				"name": "Tank Top White",
				"image": "img/dressup/female/tops/top019.png",
				"icon": "img/dressup/female/tops/icons/top019.png",
				"price": 1100,
				"type": "top"
			},
			"item062": {
				"name": "Elegant Black",
				"image": "img/dressup/female/tops/top020.png",
				"icon": "img/dressup/female/tops/icons/top020.png",
				"price": 1100,
				"type": "top"
			},
			"item063": {
				"name": "Elegant Teal",
				"image": "img/dressup/female/tops/top021.png",
				"icon": "img/dressup/female/tops/icons/top021.png",
				"price": 1100,
				"type": "top"
			},
			"item064": {
				"name": "Elegant Pink",
				"image": "img/dressup/female/tops/top022.png",
				"icon": "img/dressup/female/tops/icons/top022.png",
				"price": 1100,
				"type": "top"
			},
			"item065": {
				"name": "Elegant Hot Pink",
				"image": "img/dressup/female/tops/top023.png",
				"icon": "img/dressup/female/tops/icons/top023.png",
				"price": 1100,
				"type": "top"
			},
			"item066": {
				"name": "Elegant White",
				"image": "img/dressup/female/tops/top024.png",
				"icon": "img/dressup/female/tops/icons/top024.png",
				"price": 1100,
				"type": "top"
			},
			"item067": {
				"name": "Dress Pink",
				"image": "img/dressup/female/tops/top025.png",
				"icon": "img/dressup/female/tops/icons/top025.png",
				"price": 1100,
				"type": "top"
			},
			"item068": {
				"name": "Dress Yellow",
				"image": "img/dressup/female/tops/top026.png",
				"icon": "img/dressup/female/tops/icons/top026.png",
				"price": 1100,
				"type": "top"
			},
			"item069": {
				"name": "Dress Orange",
				"image": "img/dressup/female/tops/top027.png",
				"icon": "img/dressup/female/tops/icons/top027.png",
				"price": 1100,
				"type": "top"
			},
			"item070": {
				"name": "Dress Deep Orange",
				"image": "img/dressup/female/tops/top028.png",
				"icon": "img/dressup/female/tops/icons/top028.png",
				"price": 1100,
				"type": "top"
			},
			"item071": {
				"name": "Dress Teal",
				"image": "img/dressup/female/tops/top029.png",
				"icon": "img/dressup/female/tops/icons/top029.png",
				"price": 1100,
				"type": "top"
			},
			"item072": {
				"name": "Dress Red",
				"image": "img/dressup/female/tops/top030.png",
				"icon": "img/dressup/female/tops/icons/top030.png",
				"price": 1100,
				"type": "top"
			},
			"item073": {
				"name": "Long Dress Red",
				"image": "img/dressup/female/tops/top031.png",
				"icon": "img/dressup/female/tops/icons/top031.png",
				"price": 1100,
				"type": "top"
			},
			"item074": {
				"name": "Long Dress Teal",
				"image": "img/dressup/female/tops/top032.png",
				"icon": "img/dressup/female/tops/icons/top032.png",
				"price": 1100,
				"type": "top"
			},
			"item075": {
				"name": "Long Dress Yellow",
				"image": "img/dressup/female/tops/top033.png",
				"icon": "img/dressup/female/tops/icons/top033.png",
				"price": 1100,
				"type": "top"
			},
			"item076": {
				"name": "Long Dress Pink",
				"image": "img/dressup/female/tops/top034.png",
				"icon": "img/dressup/female/tops/icons/top034.png",
				"price": 1100,
				"type": "top"
			},
			"item077": {
				"name": "Sporty Black Stripe",
				"image": "img/dressup/female/tops/top035.png",
				"icon": "img/dressup/female/tops/icons/top035.png",
				"price": 1100,
				"type": "top"
			},
			"item078": {
				"name": "Sporty Red Stripe",
				"image": "img/dressup/female/tops/top036.png",
				"icon": "img/dressup/female/tops/icons/top036.png",
				"price": 1100,
				"type": "top"
			},
			"item079": {
				"name": "Sporty Orange Stripe",
				"image": "img/dressup/female/tops/top037.png",
				"icon": "img/dressup/female/tops/icons/top037.png",
				"price": 1100,
				"type": "top"
			},
			"item080": {
				"name": "Sporty Yellow Stripe",
				"image": "img/dressup/female/tops/top038.png",
				"icon": "img/dressup/female/tops/icons/top038.png",
				"price": 1100,
				"type": "top"
			},
			"item081": {
				"name": "Sporty Pink Stripe",
				"image": "img/dressup/female/tops/top039.png",
				"icon": "img/dressup/female/tops/icons/top039.png",
				"price": 1100,
				"type": "top"
			},
			"item082": {
				"name": "Red Scarf",
				"image": "img/dressup/female/tops/top040.png",
				"icon": "img/dressup/female/tops/icons/top040.png",
				"price": 1100,
				"type": "top"
			},
			"item083": {
				"name": "White Scarf",
				"image": "img/dressup/female/tops/top041.png",
				"icon": "img/dressup/female/tops/icons/top041.png",
				"price": 1100,
				"type": "top"
			},
			"item084": {
				"name": "Teal Scarf",
				"image": "img/dressup/female/tops/top042.png",
				"icon": "img/dressup/female/tops/icons/top042.png",
				"price": 1100,
				"type": "top"
			},
			"item085": {
				"name": "White Scarf",
				"image": "img/dressup/female/tops/top043.png",
				"icon": "img/dressup/female/tops/icons/top043.png",
				"price": 1100,
				"type": "top"
			},
			"item086": {
				"name": "Yellow Scarf",
				"image": "img/dressup/female/tops/top044.png",
				"icon": "img/dressup/female/tops/icons/top044.png",
				"price": 1100,
				"type": "top"
			},
			"item087": {
				"name": "V Neck White",
				"image": "img/dressup/female/tops/top045.png",
				"icon": "img/dressup/female/tops/icons/top045.png",
				"price": 1100,
				"type": "top"
			},
			"item088": {
				"name": "V Neck Dark",
				"image": "img/dressup/female/tops/top046.png",
				"icon": "img/dressup/female/tops/icons/top046.png",
				"price": 1100,
				"type": "top"
			},
			"item089": {
				"name": "V Neck Red",
				"image": "img/dressup/female/tops/top047.png",
				"icon": "img/dressup/female/tops/icons/top047.png",
				"price": 1100,
				"type": "top"
			},
			"item090": {
				"name": "V Neck Pink",
				"image": "img/dressup/female/tops/top048.png",
				"icon": "img/dressup/female/tops/icons/top048.png",
				"price": 1100,
				"type": "top"
			},
			"item091": {
				"name": "V Neck Black",
				"image": "img/dressup/female/tops/top049.png",
				"icon": "img/dressup/female/tops/icons/top049.png",
				"price": 1100,
				"type": "top"
			},
			/*****************************************************/
			/******************* Pants  **************************/
			/*****************************************************/
			"item092": {
				"name": "Jeans",
				"image": "img/dressup/female/pants/pants001.png",
				"icon": "img/dressup/female/pants/icons/pants001.png",
				"price": 1100,
				"type": "pants"
			},
			"item093": {
				"name": "Yellow Pants",
				"image": "img/dressup/female/pants/pants002.png",
				"icon": "img/dressup/female/pants/icons/pants002.png",
				"price": 1100,
				"type": "pants"
			},
			"item094": {
				"name": "Purple Pants",
				"image": "img/dressup/female/pants/pants004.png",
				"icon": "img/dressup/female/pants/icons/pants004.png",
				"price": 1100,
				"type": "pants"
			},
			"item095": {
				"name": "Grey Pants",
				"image": "img/dressup/female/pants/pants005.png",
				"icon": "img/dressup/female/pants/icons/pants005.png",
				"price": 1100,
				"type": "pants"
			},
			"item096": {
				"name": "Blue Pants",
				"image": "img/dressup/female/pants/pants006.png",
				"icon": "img/dressup/female/pants/icons/pants006.png",
				"price": 1100,
				"type": "pants"
			},
			"item097": {
				"name": "Sweatpants Red",
				"image": "img/dressup/female/pants/pants007.png",
				"icon": "img/dressup/female/pants/icons/pants007.png",
				"price": 1100,
				"type": "pants"
			},
			"item098": {
				"name": "Sweatpants Black",
				"image": "img/dressup/female/pants/pants008.png",
				"icon": "img/dressup/female/pants/icons/pants008.png",
				"price": 1100,
				"type": "pants"
			},
			"item099": {
				"name": "Sweatpants Grey",
				"image": "img/dressup/female/pants/pants009.png",
				"icon": "img/dressup/female/pants/icons/pants009.png",
				"price": 1100,
				"type": "pants"
			},
			"item100": {
				"name": "Sweatpants Dark Grey",
				"image": "img/dressup/female/pants/pants010.png",
				"icon": "img/dressup/female/pants/icons/pants010.png",
				"price": 1100,
				"type": "pants"
			},
			"item101": {
				"name": "Sweatpants White",
				"image": "img/dressup/female/pants/pants011.png",
				"icon": "img/dressup/female/pants/icons/pants011.png",
				"price": 1100,
				"type": "pants"
			},
			"item102": {
				"name": "Shorts Red",
				"image": "img/dressup/female/pants/pants012.png",
				"icon": "img/dressup/female/pants/icons/pants012.png",
				"price": 1100,
				"type": "pants"
			},
			"item103": {
				"name": "Shorts Purple",
				"image": "img/dressup/female/pants/pants013.png",
				"icon": "img/dressup/female/pants/icons/pants013.png",
				"price": 1100,
				"type": "pants"
			},
			"item104": {
				"name": "Shorts White",
				"image": "img/dressup/female/pants/pants014.png",
				"icon": "img/dressup/female/pants/icons/pants014.png",
				"price": 1100,
				"type": "pants"
			},
			"item105": {
				"name": "Shorts Black",
				"image": "img/dressup/female/pants/pants015.png",
				"icon": "img/dressup/female/pants/icons/pants015.png",
				"price": 1100,
				"type": "pants"
			},
			"item106": {
				"name": "Shorts Blue",
				"image": "img/dressup/female/pants/pants016.png",
				"icon": "img/dressup/female/pants/icons/pants016.png",
				"price": 1100,
				"type": "pants"
			},
			"item107": {
				"name": "Skirt White",
				"image": "img/dressup/female/pants/pants017.png",
				"icon": "img/dressup/female/pants/icons/pants017.png",
				"price": 1100,
				"type": "pants"
			},
			"item108": {
				"name": "Skirt Blue",
				"image": "img/dressup/female/pants/pants018.png",
				"icon": "img/dressup/female/pants/icons/pants018.png",
				"price": 1100,
				"type": "pants"
			},
			"item109": {
				"name": "Skirt Red",
				"image": "img/dressup/female/pants/pants019.png",
				"icon": "img/dressup/female/pants/icons/pants019.png",
				"price": 1100,
				"type": "pants"
			},
			"item110": {
				"name": "Skirt Pink",
				"image": "img/dressup/female/pants/pants020.png",
				"icon": "img/dressup/female/pants/icons/pants020.png",
				"price": 1100,
				"type": "pants"
			},
			"item111": {
				"name": "Skirt Yellow",
				"image": "img/dressup/female/pants/pants021.png",
				"icon": "img/dressup/female/pants/icons/pants021.png",
				"price": 1100,
				"type": "pants"
			},
			"item112": {
				"name": "Short Skirt Blue",
				"image": "img/dressup/female/pants/pants022.png",
				"icon": "img/dressup/female/pants/icons/pants022.png",
				"price": 1100,
				"type": "pants"
			},
			"item113": {
				"name": "Short Skirt Purple",
				"image": "img/dressup/female/pants/pants023.png",
				"icon": "img/dressup/female/pants/icons/pants023.png",
				"price": 1100,
				"type": "pants"
			},
			"item114": {
				"name": "Short Skirt Red",
				"image": "img/dressup/female/pants/pants024.png",
				"icon": "img/dressup/female/pants/icons/pants024.png",
				"price": 1100,
				"type": "pants"
			},
			"item115": {
				"name": "Short Skirt Black",
				"image": "img/dressup/female/pants/pants025.png",
				"icon": "img/dressup/female/pants/icons/pants025.png",
				"price": 1100,
				"type": "pants"
			},
			"item116": {
				"name": "Short Skirt White",
				"image": "img/dressup/female/pants/pants026.png",
				"icon": "img/dressup/female/pants/icons/pants026.png",
				"price": 1100,
				"type": "pants"
			},
			"item117": {
				"name": "Ripped White / Black",
				"image": "img/dressup/female/pants/pants027.png",
				"icon": "img/dressup/female/pants/icons/pants027.png",
				"price": 1100,
				"type": "pants"
			},
			"item118": {
				"name": "Ripped Black",
				"image": "img/dressup/female/pants/pants028.png",
				"icon": "img/dressup/female/pants/icons/pants028.png",
				"price": 1100,
				"type": "pants"
			},
			"item119": {
				"name": "Ripped Red / White",
				"image": "img/dressup/female/pants/pants029.png",
				"icon": "img/dressup/female/pants/icons/pants029.png",
				"price": 1100,
				"type": "pants"
			},
			"item120": {
				"name": "Ripped Black / Red",
				"image": "img/dressup/female/pants/pants030.png",
				"icon": "img/dressup/female/pants/icons/pants030.png",
				"price": 1100,
				"type": "pants"
			},
			"item121": {
				"name": "Ripped Blue / Yellow",
				"image": "img/dressup/female/pants/pants031.png",
				"icon": "img/dressup/female/pants/icons/pants031.png",
				"price": 1100,
				"type": "pants"
			},
			"item122": {
				"name": "Pants Teal",
				"image": "img/dressup/female/pants/pants032.png",
				"icon": "img/dressup/female/pants/icons/pants032.png",
				"price": 1100,
				"type": "pants"
			},
			"item123": {
				"name": "Pants Black",
				"image": "img/dressup/female/pants/pants033.png",
				"icon": "img/dressup/female/pants/icons/pants033.png",
				"price": 1100,
				"type": "pants"
			},
			"item124": {
				"name": "Pants Grey",
				"image": "img/dressup/female/pants/pants034.png",
				"icon": "img/dressup/female/pants/icons/pants034.png",
				"price": 1100,
				"type": "pants"
			},
			"item125": {
				"name": "Pants Purple",
				"image": "img/dressup/female/pants/pants035.png",
				"icon": "img/dressup/female/pants/icons/pants035.png",
				"price": 1100,
				"type": "pants"
			},
			"item126": {
				"name": "Pants White",
				"image": "img/dressup/female/pants/pants036.png",
				"icon": "img/dressup/female/pants/icons/pants036.png",
				"price": 1100,
				"type": "pants"
			},
			"item127": {
				"name": "Feather Pink",
				"image": "img/dressup/female/pants/pants037.png",
				"icon": "img/dressup/female/pants/icons/pants037.png",
				"price": 1100,
				"type": "pants"
			},
			"item128": {
				"name": "Feather Orange",
				"image": "img/dressup/female/pants/pants038.png",
				"icon": "img/dressup/female/pants/icons/pants038.png",
				"price": 1100,
				"type": "pants"
			},
			"item129": {
				"name": "Feather Red",
				"image": "img/dressup/female/pants/pants039.png",
				"icon": "img/dressup/female/pants/icons/pants039.png",
				"price": 1100,
				"type": "pants"
			},
			"item130": {
				"name": "Feather Teal",
				"image": "img/dressup/female/pants/pants040.png",
				"icon": "img/dressup/female/pants/icons/pants040.png",
				"price": 1100,
				"type": "pants"
			},
			"item131": {
				"name": "Feather Yellow",
				"image": "img/dressup/female/pants/pants041.png",
				"icon": "img/dressup/female/pants/icons/pants041.png",
				"price": 1100,
				"type": "pants"
			},
			"item132": {
				"name": "White Tights",
				"image": "img/dressup/female/pants/pants042.png",
				"icon": "img/dressup/female/pants/icons/pants042.png",
				"price": 1100,
				"type": "pants"
			},
			"item133": {
				"name": "Purple and White Tights",
				"image": "img/dressup/female/pants/pants043.png",
				"icon": "img/dressup/female/pants/icons/pants043.png",
				"price": 1100,
				"type": "pants"
			},
			"item134": {
				"name": "Red Stripe Tights",
				"image": "img/dressup/female/pants/pants044.png",
				"icon": "img/dressup/female/pants/icons/pants044.png",
				"price": 1100,
				"type": "pants"
			},
			"item135": {
				"name": "Red Black Tights",
				"image": "img/dressup/female/pants/pants045.png",
				"icon": "img/dressup/female/pants/icons/pants045.png",
				"price": 1100,
				"type": "pants"
			},
			"item136": {
				"name": "Blue Black Tights",
				"image": "img/dressup/female/pants/pants046.png",
				"icon": "img/dressup/female/pants/icons/pants046.png",
				"price": 1100,
				"type": "pants"
			},
			"item137": {
				"name": "Yellow Teal Tights",
				"image": "img/dressup/female/pants/pants047.png",
				"icon": "img/dressup/female/pants/icons/pants047.png",
				"price": 1100,
				"type": "pants"
			},
			/*****************************************************/
			/******************* HATS ***************************/
			/*****************************************************
			"item138": {
				"name": "News Cap",
				"image": "img/dressup/female/hats/hat002.png",
				"icon": "img/dressup/female/hats/icons/hat002.png",
				"price": 1100,
				"type": "hat"
			},
			"item139": {
				"name": "News Cap",
				"image": "img/dressup/female/hats/hat002.png",
				"icon": "img/dressup/female/hats/icons/hat002.png",
				"price": 1100,
				"type": "hat"
			},
			"item140": {
				"name": "News Cap",
				"image": "img/dressup/female/hats/hat002.png",
				"icon": "img/dressup/female/hats/icons/hat002.png",
				"price": 1100,
				"type": "hat"
			},
			"item141": {
				"name": "News Cap",
				"image": "img/dressup/female/hats/hat002.png",
				"icon": "img/dressup/female/hats/icons/hat002.png",
				"price": 1100,
				"type": "hat"
			},
			/*****************************************************/
			/******************* GLOVES **************************/
			/*****************************************************/
			"item142": {
				"name": "Fancy Gloves",
				"image": "img/dressup/female/gloves/glove001.png",
				"icon": "img/dressup/female/gloves/icons/glove001.png",
				"price": 1100,
				"type": "glove"
			},
			"item143": {
				"name": "Fancy Gloves",
				"image": "img/dressup/female/gloves/glove002.png",
				"icon": "img/dressup/female/gloves/icons/glove002.png",
				"price": 1100,
				"type": "glove"
			},
			"item144": {
				"name": "Fancy Gloves",
				"image": "img/dressup/female/gloves/glove003.png",
				"icon": "img/dressup/female/gloves/icons/glove003.png",
				"price": 1100,
				"type": "glove"
			},
			"item145": {
				"name": "Fancy Gloves",
				"image": "img/dressup/female/gloves/glove004.png",
				"icon": "img/dressup/female/gloves/icons/glove004.png",
				"price": 1100,
				"type": "glove"
			},
			"item146": {
				"name": "Fancy Gloves",
				"image": "img/dressup/female/gloves/glove005.png",
				"icon": "img/dressup/female/gloves/icons/glove005.png",
				"price": 1100,
				"type": "glove"
			},
			"item147": {
				"name": "Fancy Gloves",
				"image": "img/dressup/female/gloves/glove006.png",
				"icon": "img/dressup/female/gloves/icons/glove006.png",
				"price": 1100,
				"type": "glove"
			},
			"item148": {
				"name": "Fancy Gloves",
				"image": "img/dressup/female/gloves/glove007.png",
				"icon": "img/dressup/female/gloves/icons/glove007.png",
				"price": 1100,
				"type": "glove"
			},
			"item149": {
				"name": "Fancy Gloves",
				"image": "img/dressup/female/gloves/glove008.png",
				"icon": "img/dressup/female/gloves/icons/glove008.png",
				"price": 1100,
				"type": "glove"
			},
			"item150": {
				"name": "Fancy Gloves",
				"image": "img/dressup/female/gloves/glove009.png",
				"icon": "img/dressup/female/gloves/icons/glove009.png",
				"price": 1100,
				"type": "glove"
			},
			"item151": {
				"name": "Fancy Gloves",
				"image": "img/dressup/female/gloves/glove010.png",
				"icon": "img/dressup/female/gloves/icons/glove010.png",
				"price": 1100,
				"type": "glove"
			},
			"item152": {
				"name": "Fancy Gloves",
				"image": "img/dressup/female/gloves/glove011.png",
				"icon": "img/dressup/female/gloves/icons/glove011.png",
				"price": 1100,
				"type": "glove"
			},
			"item153": {
				"name": "Fancy Gloves",
				"image": "img/dressup/female/gloves/glove012.png",
				"icon": "img/dressup/female/gloves/icons/glove012.png",
				"price": 1100,
				"type": "glove"
			},
			"item154": {
				"name": "Fancy Gloves",
				"image": "img/dressup/female/gloves/glove013.png",
				"icon": "img/dressup/female/gloves/icons/glove013.png",
				"price": 1100,
				"type": "glove"
			},
			"item155": {
				"name": "Fancy Gloves",
				"image": "img/dressup/female/gloves/glove014.png",
				"icon": "img/dressup/female/gloves/icons/glove014.png",
				"price": 1100,
				"type": "glove"
			},
			"item156": {
				"name": "Fancy Gloves",
				"image": "img/dressup/female/gloves/glove015.png",
				"icon": "img/dressup/female/gloves/icons/glove015.png",
				"price": 1100,
				"type": "glove"
			},
			"item157": {
				"name": "Fancy Gloves",
				"image": "img/dressup/female/gloves/glove016.png",
				"icon": "img/dressup/female/gloves/icons/glove016.png",
				"price": 1100,
				"type": "glove"
			},
			"item158": {
				"name": "Fancy Gloves",
				"image": "img/dressup/female/gloves/glove017.png",
				"icon": "img/dressup/female/gloves/icons/glove017.png",
				"price": 1100,
				"type": "glove"
			},
			"item159": {
				"name": "Fancy Gloves",
				"image": "img/dressup/female/gloves/glove018.png",
				"icon": "img/dressup/female/gloves/icons/glove018.png",
				"price": 1100,
				"type": "glove"
			},
			"item160": {
				"name": "Fancy Gloves",
				"image": "img/dressup/female/gloves/glove019.png",
				"icon": "img/dressup/female/gloves/icons/glove019.png",
				"price": 1100,
				"type": "glove"
			},
			"item161": {
				"name": "Fancy Gloves",
				"image": "img/dressup/female/gloves/glove020.png",
				"icon": "img/dressup/female/gloves/icons/glove020.png",
				"price": 1100,
				"type": "glove"
			},
			"item162": {
				"name": "Fancy Gloves",
				"image": "img/dressup/female/gloves/glove021.png",
				"icon": "img/dressup/female/gloves/icons/glove021.png",
				"price": 1100,
				"type": "glove"
			},
			"item163": {
				"name": "Fancy Gloves",
				"image": "img/dressup/female/gloves/glove022.png",
				"icon": "img/dressup/female/gloves/icons/glove022.png",
				"price": 1100,
				"type": "glove"
			},
			"item164": {
				"name": "Fancy Gloves",
				"image": "img/dressup/female/gloves/glove023.png",
				"icon": "img/dressup/female/gloves/icons/glove023.png",
				"price": 1100,
				"type": "glove"
			},
			"item165": {
				"name": "Fancy Gloves",
				"image": "img/dressup/female/gloves/glove024.png",
				"icon": "img/dressup/female/gloves/icons/glove024.png",
				"price": 1100,
				"type": "glove"
			},
			"item166": {
				"name": "Fancy Gloves",
				"image": "img/dressup/female/gloves/glove025.png",
				"icon": "img/dressup/female/gloves/icons/glove025.png",
				"price": 1100,
				"type": "glove"
			},
			"item167": {
				"name": "White Cap",
				"image": "img/dressup/female/hats/hat001.png",
				"icon": "img/dressup/female/hats/icons/hat001.png",
				"price": 1100,
				"type": "hat"
			},
			"item168": {
				"name": "Yellow Cap",
				"image": "img/dressup/female/hats/hat002.png",
				"icon": "img/dressup/female/hats/icons/hat002.png",
				"price": 1100,
				"type": "hat"
			},
			"item169": {
				"name": "Black Cap",
				"image": "img/dressup/female/hats/hat003.png",
				"icon": "img/dressup/female/hats/icons/hat003.png",
				"price": 1100,
				"type": "hat"
			},
			"item170": {
				"name": "White Cap",
				"image": "img/dressup/female/hats/hat004.png",
				"icon": "img/dressup/female/hats/icons/hat004.png",
				"price": 1100,
				"type": "hat"
			},
			"item171": {
				"name": "Pink Sun Hat",
				"image": "img/dressup/female/hats/hat005.png",
				"icon": "img/dressup/female/hats/icons/hat005.png",
				"price": 1100,
				"type": "hat"
			},
			"item172": {
				"name": "Yellow Sun Hat",
				"image": "img/dressup/female/hats/hat006.png",
				"icon": "img/dressup/female/hats/icons/hat006.png",
				"price": 1100,
				"type": "hat"
			},
			"item173": {
				"name": "Blue Sun Hat",
				"image": "img/dressup/female/hats/hat007.png",
				"icon": "img/dressup/female/hats/icons/hat007.png",
				"price": 1100,
				"type": "hat"
			},
			"item174": {
				"name": "Yellow Sun Hat",
				"image": "img/dressup/female/hats/hat008.png",
				"icon": "img/dressup/female/hats/icons/hat008.png",
				"price": 1100,
				"type": "hat"
			},
			"item175": {
				"name": "Red Sun Hat",
				"image": "img/dressup/female/hats/hat009.png",
				"icon": "img/dressup/female/hats/icons/hat009.png",
				"price": 1100,
				"type": "hat"
			},
			"item176": {
				"name": "Blue Bow",
				"image": "img/dressup/female/hats/hat010.png",
				"icon": "img/dressup/female/hats/icons/hat010.png",
				"price": 1100,
				"type": "hat"
			},
			"item177": {
				"name": "White Bow",
				"image": "img/dressup/female/hats/hat011.png",
				"icon": "img/dressup/female/hats/icons/hat011.png",
				"price": 1100,
				"type": "hat"
			},
			"item178": {
				"name": "Dot Bow",
				"image": "img/dressup/female/hats/hat012.png",
				"icon": "img/dressup/female/hats/icons/hat012.png",
				"price": 1100,
				"type": "hat"
			},
			"item179": {
				"name": "Red Bow",
				"image": "img/dressup/female/hats/hat013.png",
				"icon": "img/dressup/female/hats/icons/hat013.png",
				"price": 1100,
				"type": "hat"
			},
			"item180": {
				"name": "Purple Bow",
				"image": "img/dressup/female/hats/hat014.png",
				"icon": "img/dressup/female/hats/icons/hat014.png",
				"price": 1100,
				"type": "hat"
			},
			"item181": {
				"name": "White Mini Hat",
				"image": "img/dressup/female/hats/hat015.png",
				"icon": "img/dressup/female/hats/icons/hat015.png",
				"price": 1100,
				"type": "hat"
			},
			"item182": {
				"name": "Black Mini Hat",
				"image": "img/dressup/female/hats/hat016.png",
				"icon": "img/dressup/female/hats/icons/hat016.png",
				"price": 1100,
				"type": "hat"
			},
			"item183": {
				"name": "Blue Mini Hat",
				"image": "img/dressup/female/hats/hat017.png",
				"icon": "img/dressup/female/hats/icons/hat017.png",
				"price": 1100,
				"type": "hat"
			},
			"item184": {
				"name": "Red Mini Hat",
				"image": "img/dressup/female/hats/hat018.png",
				"icon": "img/dressup/female/hats/icons/hat018.png",
				"price": 1100,
				"type": "hat"
			},
			"item185": {
				"name": "White Ski Hat",
				"image": "img/dressup/female/hats/hat019.png",
				"icon": "img/dressup/female/hats/icons/hat019.png",
				"price": 1100,
				"type": "hat"
			},
			"item186": {
				"name": "Blue Ski Hat",
				"image": "img/dressup/female/hats/hat020.png",
				"icon": "img/dressup/female/hats/icons/hat020.png",
				"price": 1100,
				"type": "hat"
			},
			"item187": {
				"name": "Red Ski Hat",
				"image": "img/dressup/female/hats/hat021.png",
				"icon": "img/dressup/female/hats/icons/hat021.png",
				"price": 1100,
				"type": "hat"
			},
			"item188": {
				"name": "Black Ski Hat",
				"image": "img/dressup/female/hats/hat022.png",
				"icon": "img/dressup/female/hats/icons/hat022.png",
				"price": 1100,
				"type": "hat"
			},
			"item189": {
				"name": "Blue Ski Hat",
				"image": "img/dressup/female/hats/hat023.png",
				"icon": "img/dressup/female/hats/icons/hat023.png",
				"price": 1100,
				"type": "hat"
			},
			"item190": {
				"name": "Funny Arrow",
				"image": "img/dressup/female/hats/hat024.png",
				"icon": "img/dressup/female/hats/icons/hat024.png",
				"price": 1100,
				"type": "hat"
			},
			"item191": {
				"name": "White Cowboy Hat",
				"image": "img/dressup/female/hats/hat025.png",
				"icon": "img/dressup/female/hats/icons/hat025.png",
				"price": 1100,
				"type": "hat"
			},
			"item192": {
				"name": "Black Cowboy Hat",
				"image": "img/dressup/female/hats/hat026.png",
				"icon": "img/dressup/female/hats/icons/hat026.png",
				"price": 1100,
				"type": "hat"
			},
			"item193": {
				"name": "Brown Cowboy Hat",
				"image": "img/dressup/female/hats/hat027.png",
				"icon": "img/dressup/female/hats/icons/hat027.png",
				"price": 1100,
				"type": "hat"
			},
			"item194": {
				"name": "Grey Cowboy Hat",
				"image": "img/dressup/female/hats/hat028.png",
				"icon": "img/dressup/female/hats/icons/hat028.png",
				"price": 1100,
				"type": "hat"
			},
		}
	}

	$('.points .points_text').text(storage.getItem('game_score'));

	item = $('#items .item').html();
	$('#items .item').remove();

	var i = 0;

	$.each(item_list, function(k,v) {

		i++;

		type = v.type;

		$('.rollthrough.char').prepend('<div class="item i' + i + ' ' + v.type + '">' + item + '</div>');
		$('#items .item.i' + i + ' .title').text(v.name);

		$('#items .item.i' + i + ' .image').css('background-image', 'url(' + v.icon + ')');
		
		$('#items .item.i' + i + ' .menuButton').attr('data-id', k);
		$('#items .item.i' + i + ' .menuButton').attr('data-name', v.name);
		$('#items .item.i' + i + ' .menuButton').attr('data-price', v.price);
		$('#items .item.i' + i + ' .menuButton').attr('data-type', v.type);
		$('#items .item.i' + i + ' .menuButton').attr('data-image', v.icon);

		ihave = storage.getItem('items');

		if (ihave) {
			list = ihave.split(', ');
			$.each(list, function(sk,sv) {
				if (k == sv) {
					$('#items .item.i' + i + ' .menuButton').addClass('owned');
					$('#items .item.i' + i + ' .menuButton').text('add to hero');
					if (storage.getItem('hero_' + type) == sv) {
						console.log(type + ' ' + sv);
						$('#items .item.i' + i + ' .menuButton').text('current');

						$('#items .' + type + ' .menuButton').removeClass('current');
						$('#items .item.i' + i + ' .menuButton').addClass('current');
						$('#myhero .' + type).css('background-image', 'url('+(item_list[k].image)+')');
					}
				}
			})
		}
	})

	$('#items .item .menuButton').on('click', function() {
		id = $(this).attr('data-id');
		name = $(this).attr('data-name');
		price = $(this).attr('data-price');
		type = $(this).attr('data-type');
		image = $(this).attr('data-image');
	
		if (!$(this).hasClass('owned')) {		
			prompt(id, name, price, type, image);
		} else {
			// set item
			storage.setItem('hero_'+type, id);

			$('#myhero .'+type).css('background-image', 'url('+(item_list[id].image)+')');

			$('#items .' + type + ' .menuButton').text('buy now');
			$('#items .' + type + ' .menuButton.owned').text('add to hero');
			$(this).text('current');
			
			
			$('#items .' + type + ' .menuButton').removeClass('current');
			$(this).addClass('current');

			storage.setItem('hero_'+type, id);
			
		}
	})

	function prompt(id, name, price, type, image) {

		$('#buy_prompt').css('display', 'block');
		$('.overlay').css('display', 'block');

		$('#buy_prompt .title').text(name);
		$('#buy_prompt .price').text(price);
		$('#buy_prompt img').attr('src', image);
		
		$('#buy_prompt .buy').attr('data-id', id);
		$('#buy_prompt .buy').attr('data-name', name);
		$('#buy_prompt .buy').attr('data-price', price);
		$('#buy_prompt .buy').attr('data-type', type);

		score = storage.getItem('game_score');
		if ((score - price) < 0) {
			$('#buy_prompt .buy').text('insufficient funds');			
		} else {
			$('#buy_prompt .buy').text('buy now');			
		}
	}

	$('#buy_prompt .buy').on('click', function() {

		//console.log($(this).attr('data-id'));
		//console.log($(this).attr('data-name'));
		//console.log($(this).attr('data-price'));
		//console.log($(this).attr('data-type'));

		id = $(this).attr('data-id');
		image = $(this).attr('data-image');
		price = $(this).attr('data-price');
		type = $(this).attr('data-type');
		
		score = storage.getItem('game_score');

		if ((score - price) < 0) {
			console.log('less than 0');
		} else {
			score = score - price;
			storage.setItem('game_score', score);
			
			items_arr = storage.getItem('items');
			add_item = items_arr + ', ' + id;
			storage.setItem('items', add_item);

			$('#items .item p[data-id="'+id+'"]').addClass('owned');
			$('#items .item p[data-id="'+id+'"]').text('add to hero');

			$('.points .points_text').text(storage.getItem('game_score'));
		}
		$('#buy_prompt').css('display', 'none');
		$('.overlay').css('display', 'none');
	}) 

	$('#buy_prompt .cancel').on('click', function() {
		$('#buy_prompt').css('display', 'none');
		$('.overlay').css('display', 'none');
	})

	$.get('./dictonary/levels/levels.json', function(data) {
    	$.each(data, function(k,v) {

    		label = "Lesson " + v['level'];
    		num = k.split('level')[1];

    		if (v['level_sub'] == 'a') {

	    		$('#level_select .scroller').append("<div class=\"items_menu item\" data-lesson=\"" + v['level'] + "\" data-type=\""+num+"\">"+label+"<br/>"+v['letter_sounds']+"</div>");
	    		$('#level_select .items_menu.item').on('click', function() {
					$('.screen').hide();
					$('#main').hide();
					$('#cover').show();
					$('#btmNav').show();
					currentScreen = 'cover';
					level = $(this).attr('data-type');
					console.log('LEVEL SET: ' + level);
					storage.setItem('game_level', level);
				})
	    	}
    	})
    	$('#level_select .scroller').append("<div class=\"items_menu item\" data-type=\""+000+"\"></div>");
	}, 'json');	
}