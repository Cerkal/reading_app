$(document).ready(function() {

	names = ['Beyonce','Rihanna','Lady Gaga','Katy Perry','Taylor Swift','Britney Spears','Miley Cyrus','Nicki Minaj','Madonna','Ariana Grande','Adele','Selena Gomez','Mariah Carey','Demi Lovato','Whitney Houston','Janet Jackson','Jennifer Lopez','Shakira','Kelly Clarkson','Cher','Sia','Kesha','Carly Rae Jepsen','Alicia Keys','Kylie Minogue','Iggy Azalea','Lana Del Rey','Celine Dion','Meghan Trainor','Tina Turner','Avril Lavigne','Shania Twain','Alessia Cara','Cyndi Lauper','Alanis Morissette','Donna Summer','Diana Ross','Amy Winehouse'];
	rand = Math.floor(Math.random() * (names.length-1) + 1);
	storage.setItem('user_name', names[rand]+'001');

	// ***************************************************************
 	// REMOVE AFTER CONNY LOOKS AT THIS For Dev, Developer, Development
 	// ***************************************************************

 	storage.setItem('device', 'ipad');
	storage.setItem('hero_race', 'white');
 	storage.setItem('game_score', "0");

	// ***************************************************************

	if (storage.getItem('hero_gender') == 'male') {
		if (storage.getItem('hero_race') == 'white') {
			$('#myhero .hero').addClass('guy');	
		} else {
			$('#myhero .hero').addClass('guy-black');
		}
	} else {
		if (storage.getItem('hero_race') == 'white') {
			$('#myhero .hero').addClass('girl');	
		} else {
			$('#myhero .hero').addClass('girl-black');
		}
	}

	// Check for device type

	if (storage.getItem('device') == 'ipad') {
		$('head').append( $('<link rel="stylesheet" type="text/css" />').attr('href', './style/ipad.css') );
	}

	// Default settings for first time player
	if (storage.getItem('firstTime') != 'false') {
		console.log('loaded first time screen');
		storage.setItem('user_id', Math.floor(Math.random() * 26) + Date.now());
	 
	    storage.setItem('firstTime', false);

	    storage.setItem('settings_effects', 'on');
		storage.setItem('settings_music', 'on');
		storage.setItem('settings_volume', .5);

		storage.setItem('hero_race','white');

		//storage.setItem('game_score', 0);

		$('.screen').hide();
		$('#account').delay(2000).fadeIn(3000);
		$('.submit').delay(2000).fadeIn(3000);
	
	} else {
		console.log('loaded correctly');
		$(".screen").hide();

		$('#nav h3').text('Title');
		
		// LOAD PREGAME SCREEN

		$('.logo').show();
		$('#main').delay(2000).fadeIn(3000);

		runtest();
	}

	$('#help').on('click', function() {
		$('#nav').hide();
		$('.screen').hide();
		$('.logo').show();
		$('#main').show();
		$('.submit').hide();		
		$('#chooseHero').hide();
		$('#btmNav').hide();
	});

	$('.submit').on('click', function() {
		first_name = $('#first_name_input').val();
		last_name = $('#last_name_input').val();
		class_input = $('#class_input').val();
		user_progress = { }
		
		storage.setItem('user_first_name', first_name);
		storage.setItem('user_last_name', last_name);
		storage.setItem('user_class', class_input);
		storage.setItem('user_progress', JSON.stringify(user_progress));
		
		//JSON.parse(storage.getItem('user_progress'))
		$('.screen').hide();
		$('.submit').hide();		
		$('#chooseHero').show();
		$('#nav').show();
		$('#nav h3').text('Choose Hero');
	})

	$('.clicker-male').on('click', function() {
		storage.setItem('hero_gender','male');
		location.reload();
		$('#nav').hide();
		$('.screen').hide();
		$('.logo').show();
		$('#main').fadeIn(3000);
		$('.submit').hide();		
		$('#chooseHero').hide();
		storage.setItem('hero_shoe', "item075");
		storage.setItem('hero_top', "item001");
		storage.setItem('hero_pants', "item041");
		storage.setItem('items', ", item075, item001, item041");
		runtest();
	})

	$('.clicker-female').on('click', function() {
		storage.setItem('hero_gender','female');
		$('#nav').hide();
		$('.screen').hide();
		$('.logo').show();
		$('#main').fadeIn(3000);
		$('.submit').hide();		
		$('#chooseHero').hide();	
		storage.setItem('hero_shoe', "item003");
		storage.setItem('hero_top', "item043");
		storage.setItem('hero_pants', "item093");	
		storage.setItem('items', ", item003, item043, item093");
		runtest();
	})

	$('.race-click').on('click', function() {
		if (storage.getItem('hero_race') == 'white') {
			storage.setItem('hero_race','black');
			$('.clicker-male').removeClass('clicker-male').addClass('clicker-male-black');
			$('.clicker-female').removeClass('clicker-female').addClass('clicker-female-black');

			$('.hero.char.guy').removeClass('guy').addClass('guy-black');
			$('.hero.char.girl').removeClass('girl').addClass('girl-black');
			$('.race-display').text('Dark');
		} else {
			storage.setItem('hero_race','white');	
			$('.clicker-male-black').removeClass('clicker-male-black').addClass('clicker-male');
			$('.clicker-female-black').removeClass('clicker-female-black').addClass('clicker-female');

			$('.hero.char.guy-black').removeClass('guy-black').addClass('guy');
			$('.hero.char.girl-black').removeClass('girl-black').addClass('girl');
			$('.race-display').text('Light');
		}
	})

	$('.reset-data').on('click', function() {
		$('.prompt').css('display', 'block');
	})

	function clearData() {
		localStorage.clear();
		location.reload(); 
	}
	
	if (storage.getItem('settings_effects') == 'off') {
		$('.slider #effects').attr('src', 'img/slider_off.png');
	} else {
		$('.slider #effects').attr('src', 'img/slider_on.png');
	}

	if (storage.getItem('settings_music') == 'off') {
		$('.slider #music').attr('src', 'img/slider_off.png');
	} else {
		$('.slider #music').attr('src', 'img/slider_on.png');
	}

	volItem = storage.getItem('settings_volume')*100;
	$('#volSlider .top').width(volItem+'%');

	// SETTINGS

    $('.slider #effects').on('click', function() {
        if ($(this).attr('src') == 'img/slider_on.png') {
            $(this).attr('src', 'img/slider_off.png');
            storage.setItem('settings_effects', 'off');
        } else {
            $(this).attr('src', 'img/slider_on.png');
            storage.setItem('settings_effects', 'on');
            //playEffect('001');
        }
    })

    $('.slider #music').on('click', function() {
        if ($(this).attr('src') == 'img/slider_on.png') {
            $(this).attr('src', 'img/slider_off.png');
            storage.setItem('settings_music', 'off');
        	if(typeof myAudio != 'undefined') {
	    		myAudio.pause();
	    	}    
        } else {
            $(this).attr('src', 'img/slider_on.png');
            storage.setItem('settings_music', 'on');
            playEffect('001');
            if(typeof myAudio != 'undefined') {
	    		myAudio.play();
	    	}
        }
    })

    if (storage.getItem('device') == 'iphone' || storage.getItem('device') == 'ipad') {
    	$('#volSlider').remove();
    	$('#vol_meter').on('click', function() {
			ww = $(document).width();
			vol = ((100/ww)*event.clientX);
			$('#vol_meter_fg').css('width', vol+'%');
			console.log(vol);
			vol = vol/100;
			storage.setItem('settings_volume', vol);
		    if(typeof myAudio != 'undefined') {
				myAudio.volume = vol;
			}
		});
    } else {
    	$('#vol_meter').remove();
    	$('#slider').on('change', function() {
		    vol = $(this).val();
		    $('#volSlider .top').width(vol+'%');
		    //console.log(vol);
		    vol = vol/100;
		    storage.setItem('settings_volume', vol);
		    if(typeof myAudio != 'undefined') {
				myAudio.volume = vol;
			}
		    //playEffect('006');
		});
    }

});
