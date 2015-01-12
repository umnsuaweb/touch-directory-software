(function(){
	var extendedHeader = $('.popup-extended header h3');
	var extendedInfo = $('.popup-extended-info');
	
	$('body').on('click', '.button-info-extended', function(){
		var info = $('.leaflet-popup-content').find('.hidden-extended-info').html();
		
		$('.popup-container').removeClass('hidden').addClass('visible');
		$('.popup-extended').html(info).addClass('visible');
		
//		commented out 8/20/2013 because of js error, no apparent effect. what is this code supposed to do?
//		extendedHeader.text(currentProperties.BuildingName);
//		console.log(currentProperties);
	});
	$('body').on('click', '.button-close', function(){
		$('.popup-container').removeClass('visible');
		$('.popup-extended').removeClass('visible');

		$('.popup-container').one('webkitTransitionEnd otransitionend oTransitionEnd msTransitionEnd transitionend',
			function(e) {
				$('.popup-container').addClass('hidden');
			}
		);
	});
}());