 $(document).ready(function() { 
    var CommandStack = [];
    var CommandStackLength = 0;
    var CommandStackPostion = 0;
    $(window).bind("load", function() {
        expand_lesson();
        $('#console').append(active_input);
    });
	$("html").click(function (e) {
    	if (e.target == document.getElementById("console") || check_conosle_click(e.target) > -1) {
    		$("#console").removeClass("console_inactive");
    	    $("#console").addClass("console_active");
    	}
    	else {
    	    $("#console").removeClass("console_active");
    	    $("#console").addClass("console_inactive");
    	}
	});
	$("html").keypress(function (e) {
    	if ($('#console').hasClass('console_active')) {
    		var element = $('.console_active_input').children(".console_left_input_section");
    		var text = element.text();
			switch(e.which) {
			case 0:
				break;
			case 8:
				return false;
				break;
			case 13:
                break;
			default:
			  	element.text(text + String.fromCharCode(e.which));
                CommandStack[CommandStackLength] = $('.console_active_input').children(".console_left_input_section").text() + $('.console_active_input').children(".console_right_input_section").text();
                return false;
			}
    	}
	});
	$("html").keydown(function (e) {
    	if ($('#console').hasClass('console_active')) {
    		var left_element = $('.console_active_input').children(".console_left_input_section");
    		var left_text = left_element.text();
			switch(e.which) {
			case 0:
				break;
			case 8:
    			left_element.text(left_text.substring(0, left_text.length - 1));
    			return false;
			  	break;
			case 13:
                CommandStack[CommandStackLength] = left_text + $('.console_active_input').children(".console_right_input_section").text();
                CommandStackPostion = ++CommandStackLength;
                exec_string = left_text + $('.console_active_input').children(".console_right_input_section").text();
    			var result = evaluate(exec_string);
                checkSolution(exec_string, result);
                var element = $('.console_active_input');
                element.removeClass('console_active_input').addClass('console_inactive_input');
                $('#console').append(active_input);
                var t = document.getElementById('console');
                t.scrollTop = t.scrollHeight;
                break;
			case 37:
    			var right_element = $('.console_active_input').children(".console_right_input_section");
    			if(left_element.text()) {
    				right_element.text(left_text.charAt(left_text.length - 1) + right_element.text());
    				left_element.text(left_text.substring(0, left_text.length - 1));
    			}
			  	break;
			case 39:
    			var right_element = $('.console_active_input').children(".console_right_input_section");
    			if(right_element.text()) {
    				var right_text = right_element.text();
    				left_element.text(left_text + right_text.charAt(0));
    				right_element.text(right_text.substring(1, right_text.length));
    			}
			  	break;
            case 38: 
                    if(CommandStackPostion > 0) { CommandStackPostion--; }
                    left_element.text(CommandStack[CommandStackPostion]);
                    $('.console_active_input').children(".console_right_input_section").text("");
                    return false;
                break;
            case 40:
                    if(CommandStackPostion < CommandStackLength) { CommandStackPostion++; }
                    left_element.text(CommandStack[CommandStackPostion]);
                    $('.console_active_input').children(".console_right_input_section").text("");
                    return false;
                break;
			case 46:
				var right_element = $('.console_active_input').children(".console_right_input_section");
				var right_text = right_element.text();
    			right_element.text(right_text.substring(1, right_text.length));
			  	break;
			}
        }
    });
    $('.accordion-body').on('shown', function () {
        var id = $(this).attr("id");
        $("#title" + id).attr("href", "");
    });
    $('.accordion-body').on('hidden', function () {
        var id = $(this).attr("id");
        if($("#check" + id).size() < 1) {$("#title" + id).attr("href", "#"+id);}
    });
    $('.term-top').popover({placement: 'top'}); $('.term-bottom').popover({placement: 'bottom'});
    $('.tip').tooltip();
    var $win = $(window)
        , $nav = $('.subnav')
        , navTop = $('.subnav').length && $('.subnav').offset().top - 40
        , isFixed = 0
        processScroll()
    $win.on('scroll', processScroll)
    function processScroll() {
        var i, scrollTop = $win.scrollTop()
        if (scrollTop >= navTop && !isFixed) {
            isFixed = 1
        $nav.addClass('subnav-fixed')
        } else if (scrollTop <= navTop && isFixed) {
            isFixed = 0
            $nav.removeClass('subnav-fixed')
        }
    }
 });
function check_conosle_click(target) {
    var elements = $('div[class*="console"]');
    var found = $.inArray(target, elements);
    if (found < 0) {
        elements = $('span[class*="console"]');
        found = $.inArray(target, elements);
    }
    return found;
}
function evaluate(exec_string) {
    var result;
    try {
        result = eval(exec_string);
        if(result || result === false || result === 0) { display_result(result); }
    }
    catch(err) { display_error(err.message); }
    return result;
}
function checkSolution(exec_string, result) {
    var element_id = $(".in").attr("id");
    if(element_id){
        var element_in = $("#answer"+element_id+"_enter").text();
        var element_out = $("#answer"+element_id+"_out").text();
        var pattern = new RegExp(element_in);
        console.log(typeof result + " | " + element_out);
        console.log(exec_string.match(pattern));
        if (exec_string.match(pattern) && (typeof result) === element_out) {
            $('#console').append(pass_lesson);
            var next_id = (Number(element_id) + 1);
            var next = $("#" + next_id);
            if(next.size()) { 
                next.collapse( {parent: $("#lessons")} );
                if($("#check" + element_id).size() < 1) {
                    $('#title' + element_id).prepend( "<i id=\"check" + element_id + "\" class=\"icon-ok\"></i>").addClass("lesson_success");
                }
            }
            else{
                if($("#button_complete").size() < 1) {
                    $('#title'+element_id).prepend( "<i class=\"icon-ok\"></i>").addClass("lesson_success");
                    var next_page = $('#next_lesson').text();
                    var button_text = "Congratulations!  Next Lesson"
                    if(next_page.charAt(0) == "a" ) { button_text = "Complete! Advanced Topics"; }
                    $('#last_inner').append("<p><a id=\"button_complete\"class=\"btn btn-success btn-large\" href=\"" + next_page + "\">" + button_text + " <i class=\"icon-chevron-right icon-white\"></i></a></p>");
                }
            }
        }
        else { $('#console').append(fail_lesson); }
    }
}
function display_error(error_message) {
    var error_wrapper_open = "<div class=\"alert alert-error console_alert\">";
    var error_wrapper_close = "</div>";
    $('#console').append(error_wrapper_open + error_message + error_wrapper_close);
}
function display_result(result) {
    var result_wrapper_open = "<div class=\"alert alert-info console_alert\"> >> ";
    var result_wrapper_close = "</div>";
    $('#console').append(result_wrapper_open + result + result_wrapper_close);
}
function expand_lesson() {
    var hash = window.location.hash;
    if(hash) {
        var element = $(hash);
        if(element.length) { element.collapse( {parent: $("#lessons")} ); }
        else { $('#1').collapse( {parent: $("#lessons")} ); }
    }
    else { $('#1').collapse( {parent: $("#lessons")} ); }
}
var active_input = "<div class=\"console_active_input\"><span class=\"console_input_line_start\"> &gt; </span><span class=\"console_left_input_section\"></span><span class=\"console_input_cursor\">&nbsp;</span><span class=\"console_right_input_section\"></span></div>";
var fail_lesson = "<div class=\"alert alert-error console_alert\">Oops...try again.</div>"
var pass_lesson = "<div class=\"alert alert-success console_alert\">Correct!</div>"