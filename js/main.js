
$( document ).ready(function() {
//    $(".nav a").click(function(e){
//        e.preventDefault();
//        $(".nav a").removeClass("active");
//        $(".jumbotron .container").addClass('hidden').hide( "slide", {direction: "up" }, 2000 );;
//        $(this).addClass("active");
//        $($(this).attr('href')).removeClass('hidden').show( "slide", {direction: "down" }, 2000 );
//    });
    
    var	_bh = jQuery('body, html'),
    _window = jQuery(window),
    _nav = jQuery('#nav'),
    _panels = jQuery(".panel"),
    _wrapper = jQuery('#wrapper'),
    panels = [],
    activePanelId = null,
    firstPanelId = null;
    
    _panels.each(function(i) {
        var t = jQuery(this), id = t.attr('id');

        panels[id] = t;

        if (i == 0)
        {
                firstPanelId = id;
                activePanelId = id;
        }
        else
                t.hide();
    });
    
    jQuery('a').click(function(e) {
            var t = jQuery(this), h = t.attr('href'), article;
            
            $("#navbarCollapse a").removeClass("active");
            t.addClass("active");

            if (h.charAt(0) == '#' && h.length > 1 && (article = jQuery('article#' + h.substring(1))).length > 0)
            {
                var pos = Math.max(article.parent().offset().top - _nav.height() + 15, 0);
                e.preventDefault();
                //_bh.animate({ scrollTop: pos }, 'slow', 'swing');
                $(".jumbotron .container").hide(1000).fadeOut();
                $($(this).attr('href')).show(500).fadeIn();
                $("#navbarCollapse").collapse("hide");
                
                /*e.preventDefault();
                $("body, html").animate({scrollTop: $($(this).attr('href')).offset().top}, 600);*/
            }
    });
    
});
