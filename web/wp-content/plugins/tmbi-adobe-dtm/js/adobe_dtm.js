
var qs = (function() {
	query_string_url = window.location.search.substr(1).split('&');
	if ( query_string_url === "" ) return {};
	var query_strings = {};
	for ( var i = 0; i < query_string_url.length; ++i ) {
		var parameter = query_string_url[i].split('=', 2);
		if ( parameter.length === 1 ) {
			query_strings[parameter[0]] = "";
		} else {
			query_strings[parameter[0]] = decodeURIComponent( parameter[1].replace( /\+/g, " " ) );
		}
	}
	return query_strings;
})();

jQuery( document ).ready(function($) {

	if ( qs['ehid'] !== undefined ) {
		localStorage.newsletter = qs['ehid'];
		digitalData.newsletter  = digitalData.newsletter||{};
		digitalData.newsletter.ehid = qs['ehid'];
	}
	if ( typeof( localStorage.newsletter ) !== 'undefined' && typeof qs['ehid'] === 'undefined' ){
		digitalData.newsletter      = digitalData.newsletter||{};
		digitalData.newsletter.ehid = localStorage.newsletter;
	}


    //TOH Related Changes
    var login_status = 'false';
	var userData = {"profile" : { "profileInfo" : {}}};
    if ( getCookie( 'ID' ) !== undefined ) {
        login_id = getCookie( 'ID' );
        login_status = 'true';
        userData["profile"]["profileInfo"]["profileID"] = login_id;

    }
    userData["profile"]["profileInfo"]["profileStatus"] = login_status;
    digitalData.user = userData;

	var $body = $("body");
	$body.on("click", "[data-analytics-metrics]", function (e) {
		e.stopPropagation();
		if ( $( this ).is( "form" ) ) {
			return true;
		}
		adobe_data_analytics( $( this ) );
	});

	$body.on("submit", "[data-analytics-metrics]", function () {
		adobe_data_analytics( $( this ) );
	});

	function getCookie(cname) {
		var name = cname + "=";
		var decodedCookie = decodeURIComponent(document.cookie);
		var ca = decodedCookie.split(';');
		for(var i = 0; i <ca.length; i++) {
			var c = ca[i];
			while (c.charAt(0) == ' ') {
				c = c.substring(1);
			}
			if (c.indexOf(name) == 0) {
				return c.substring(name.length, c.length);
			}
		}
		return "";
	}

});

// Trigger slide click on embedded slideshow swipe
function do_embedded_slide_click() {
	var s = _satellite.getToolsByType('sc')[0].getS();
	if ( s ) {
		s.clearVars();
		embedListicle_digitalData.click = {module: 'embedded slideshow', name: 'navigation', position: 'article page'};
		var digitalDataTemp = digitalData;
		digitalData = embedListicle_digitalData;
		_satellite.track('slide click');
		digitalData = digitalDataTemp;
	}
}


function do_adobe_data_analytics( name, module, position ) {
	var data = {};
	data['attr'] = function( att_name ) {
		return '{"name":"' + name + '", "module":"' + module + '", "position":"' + position + '"}';
	};
	adobe_data_analytics( data );
}

function adobe_data_analytics( data ) {
	if ( data.attr('data-analytics-metrics') !== undefined ) {
		digitalData.click = JSON.parse(data.attr('data-analytics-metrics'));
		satellite_track("link click");
	}
}

function satellite_track( track_name ) {
	if( typeof _satellite !== 'undefined' && typeof _satellite.track === 'function' ) {
		_satellite.track( track_name );
	}
}

// Manually setting up click variables.
function set_click_data( name, module, position ) {
	digitalData.click = digitalData.click||{};
	digitalData.click.name = name;
	digitalData.click.module = module;
	digitalData.click.position = position;
}

//setting up total slides click variable
function set_click_total_slideshows( current_slide, total_slides ) {
	digitalData.click = digitalData.click||{};
	digitalData.click.slideShowNumber = current_slide + ' of ' + total_slides
}

//setting special variable for condition check inside adobe dtm
function set_digitalData_slideshow_ad() {
	digitalData.slideshowAdEvent = true;
}

//setting variable for image credits
function set_digitalData_image_credits( slide ) {
	var data_image_analytics = jQuery(slide).find('img').attr('data-image-analytics');
	if ( typeof data_image_analytics !== 'undefined' ) {
		digitalData.page.content.image = JSON.parse(data_image_analytics);
	}

}
