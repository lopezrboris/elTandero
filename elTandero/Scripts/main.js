var events = [];
currentEvent = null;
tooltip = '';
currentColor = null;
window.currentEventTextColor = null;
defaultColor = null;
colors = [{ backgroundColor: "#FFF", color: "black"}
, { backgroundColor: "#F2f2f2", color: "black"}
, { backgroundColor: "#ff6600", color: "black" }
, { backgroundColor: "#BFBFBF", color: "black"}
, { backgroundColor: "#595959", color: "white"}
, { backgroundColor: "#95bcd7", color: "black"}
, { backgroundColor: "#64b9ce", color: "black" }
, { backgroundColor: "#244061", color: "white"}
, { backgroundColor: "#9bbb59", color: "black"}
, { backgroundColor: "#3a87ad", color: "white" }
, { backgroundColor: "#00ccff", color: "black"}
, { backgroundColor: "#cc99ff", color: "black"}
, { backgroundColor: "#660066", color: "white"}
, { backgroundColor: "#ff5050", color: "black"}
, { backgroundColor: "#993300", color: "white"}
, { backgroundColor: "#ffcc66", color: "black"}
, { backgroundColor: "#999966", color: "black"}
, { backgroundColor: "#244061", color: "white"}
, { backgroundColor: "#336600", color: "white"}
, { backgroundColor: "#669900", color: "black"}
, { backgroundColor: "#000000", color: "white"}
, { backgroundColor: "#003366", color: "white"}
, { backgroundColor: "#666699", color: "white"}
, { backgroundColor: "#99ff66", color: "black"}];



$('#calendar').fullCalendar({
    header: {
        left: 'prev,next today',
        center: 'title',
        right: 'year,month,agendaWeek,agendaDay'
    },
    defaultDate: '2015-01-12',//new Date(), //
    lang: 'es',
    defaultView: 'year',
    yearColumns: 3,
    selectable: true,
    selectHelper: true,
    weekNumbersWithinDays: true,
    select: function (start, end) {
        window.currentEvent = null;
        $("#txtCampaña").val("");
        $("#dpkInicio").datepicker("setDate", start.toDate().addDays(1));
        $("#dpkFin").datepicker("setDate", end.toDate());
        $("#txtCategoria").val(0);
        $("#txtTipo").val(0);
        $("#txtEmpresa").val("");
        $("#txtCampaña").val("");
        $("#txtDuracion").val("");
        $("#colorpicker").css("background-color", window.defaultColor);

        $('#myModal').modal("show");
    },
    firstDay: 0,
    editable: true,
    eventLimit: true, // allow "more" link when too many events
    eventClick: function (calEvent, jsEvent, view) {
        window.currentEvent = calEvent;
        $("#txtCampaña").val(calEvent.title);
        $("#dpkInicio").datepicker("setDate", calEvent.start.toDate());
        $("#dpkFin").datepicker("setDate", calEvent.end ? calEvent.end.toDate().addDays(-1) : calEvent.start.toDate());
        $("#txtCategoria").val(calEvent.categoria);
        $("#txtTipo").val(calEvent.tipo);
        $("#txtEmpresa").val(calEvent.empresa);
        $("#txtCampaña").val(calEvent.campaña);
        $("#txtDuracion").val(calEvent.duracion);
        $("#colorpicker").css("background-color", calEvent.color);
        $("#spnMuestra").css("backgroundColor", calEvent.color).css("color", window.colors.where(function (color) {
            return color.backgroundColor == rgb2hex(calEvent.color);
        })[0].color);

        $('#myModal').modal("show");
    },
    events: function (start, end, timezone, callback) {
        $.ajax({
            url: '/home/campañas',
            dataType: 'json',
            data: { start: '2015-01-01', end: '2015-12-30' },
            success: function (doc) {
                $(doc).each(function () {
                    var event = $(this);
                    var foreColor = window.colors.where(function(color) {
                        return color.backgroundColor == (event.attr('color') || "#3a87ad");
                    })[0].color; 
                    events.push({
                        title: event.attr('title'),
                        start: event.attr('start'), // will be parsed
                        end: event.attr('end') || event.attr('start'),
                        color: event.attr('color') || "#3a87ad",
                        textColor: foreColor
                    });
                    event.attr('color', event.attr('color') || "#3a87ad");
                });
                $(".notification-info").toggle(events.length).text(events.length);
                callback(events);
                loadNotifications(doc);
                //responsive();
            },
            error: function (e) {
            }
        });
        //$.ajax({
        //    url: 'demos/php/get-events.php',
        //    dataType: 'json',
        //    data: { start: '2015-01-01', end: '2015-12-30' },
        //    success: function (doc) {
        //        var events = [];
        //        $(doc).each(function () {
        //            events.push({
        //                title: $(this).attr('title'),
        //                start: $(this).attr('start') // will be parsed
        //            });
        //        });
        //        callback(events);
        //    },
        //    error: function (e) {
        //    }
        //});
    },
    eventMouseover: function (data, event, view) {
        tooltip = '<div class="tooltiptopicevent" style="width:auto;height:auto;background:#000;color:#fff;position:absolute;z-index:10001;padding:0px 10px 0px 10px ;  line-height: 200%;">' +
        'Campaña: ' + data.title + '</br>' +
        'Inicia: ' + $.datepicker.formatDate("dd/mm/yy", data.start.toDate()) + '</br>' +
        'Termina: ' + $.datepicker.formatDate("dd/mm/yy", (data.end ? data.end.toDate().addDays(-1) : data.start.toDate())) + '</div>';

        $("body").append(tooltip);
        $(this).mouseover(function (e) {
            $(this).css('z-index', 10000);
            $('.tooltiptopicevent').fadeIn('500');
            $('.tooltiptopicevent').fadeTo('10', 1.9);
        }).mousemove(function (e) {
            $('.tooltiptopicevent').css('top', e.pageY + 10);
            $('.tooltiptopicevent').css('left', e.pageX + 20);
        });
    },
    eventMouseout: function (data, event, view) {
        $(this).css('z-index', 8);

        $('.tooltiptopicevent').remove();

    },
    dayClick: function () {
        tooltip && tooltip.hide && tooltip.hide()
    },
    eventResizeStart: function () {
        tooltip && tooltip.hide && tooltip.hide()
    },
    eventDragStart: function () {
        tooltip && tooltip.hide && tooltip.hide()
    },
    viewDisplay: function () {
        tooltip && tooltip.hide && tooltip.hide();
    },
    eventAfterAllRender: function (view) {
        if (!view.title.match(/[a-z]/i)) responsive();

        $("#calendar > div.fc-view-container > div > div > div > div.fc-day-grid-container.fc-scroller").css("min-height", 254);
        $("#calendar > div.fc-view-container > div > table > tbody > tr > td > div").css("height", "100%").css("overflow-y", "auto");
        $("#calendar > div.fc-view-container > div > table > tbody > tr > td > div.fc-time-grid-container.fc-scroller").css("min-height", "100%");
    }
});

function loadNotifications(notifications) {
    var collapseButton = $("<a href='#' style='display:initial; margin-right: 13px;' class='pull-right'><span class='glyphicon glyphicon-chevron-left'></a>");
    collapseButton.bind("click", function () { $("#menu-toggle").trigger("click"); });
    $(".sidebar-nav").empty().append($("<li>").text("Notificaciones").addClass("sidebar-brand").append(collapseButton));
    notifications.select(function (notification) {
        var foreColor = window.colors.where(function(color) { return color.backgroundColor == rgb2hex(notification.color); })[0].color;
        $(".sidebar-nav").append($("<li>").text(notification.title).append($("<span class='badge notification-state'>10</span>")
            .css("backgroundColor", notification.color).css("color", foreColor)));
    });
    $(".sidebar-brand").toggle(false);
}

$("#btnNuevoEvento").click(function () {
    if (currentEvent) return;
    var eventData = {
        title: $("#txtCampaña").val(),
        start: $("#dpkInicio").datepicker("getDate"),
        end: $("#dpkFin").datepicker("getDate").addDays(1),
        color: window.currentColor,
        textColor: window.currentEventTextColor,
        categoria: $("#txtCategoria").val(),
        tipo: $("#txtTipo").val(),
        empresa: $("#txtEmpresa").val(),
        campaña: $("#txtCampaña").val(),
        duracion: $("#txtDuracion").val()
    };
    $('#calendar').fullCalendar('renderEvent', eventData, true); // stick? = true
    $('#calendar').fullCalendar('unselect');
});

// build the locale selector's options
//$.each($.fullCalendar.langs, function(localeCode) {
//	$('#locale-selector').append(
//		$('<option/>')
//			.attr('value', localeCode)
//			//.prop('selected', localeCode == initialLocaleCode)
//			.text(localeCode)
//	);
//});

// when the selected option changes, dynamically change the calendar option
//$('#locale-selector').on('change', function() {
//	if (this.value) {
//		$('#calendar').fullCalendar('option', 'lang', this.value);
//	}
//});

$(".colorschemebox .btn").on("click", function () {
    $("#colorpicker").css("background-color", $(this).attr('name'));
    window.currentColor = $(this).css("background-color");
    window.currentEventTextColor = $(this).css("color");
    $("#spnMuestra").css("backgroundColor", window.currentColor).css("color", $(this).css("color"));
});

$("#btnDefault").on("click", function () {
    window.defaultColor = window.currentColor;
});

$("#menu-toggle").click(function (e) {
    e.preventDefault();
    $("#wrapper").toggleClass("toggled").promise().done(function () {
        if ($("#wrapper").hasClass("toggled"))
            $(".sidebar-brand").animate({ 'width': 'toggle' }, 600);
        else
            $(".sidebar-brand").animate({ 'width': 'toggle' }, 200);
    });
});

$('#addPop').click(function () {
    if ($('#distriList option:selected').val() != null) {
        var tempSelect = $('#distriList option:selected').val();
        $('#distriList option:selected').remove().appendTo('#selectDistriList');
        $("#distriList").attr('selectedIndex', '-1').find("option:selected").removeAttr("selected");
        $("#selectDistriList").attr('selectedIndex', '-1').find("option:selected").removeAttr("selected");
        $("#selectDistriList").val(tempSelect);
        tempSelect = '';
        sortLists();
    } else {
        alert("Before add please select any position.");
    }
});

$('#removePop').click(function () {
    if ($('#selectDistriList option:selected').val() != null) {
        var tempSelect = $('#selectDistriList option:selected').val();
        $('#selectDistriList option:selected').remove().appendTo('#distriList');
        $("#selectDistriList").attr('selectedIndex', '-1').find("option:selected").removeAttr("selected");
        $("#distriList").attr('selectedIndex', '-1').find("option:selected").removeAttr("selected");

        $("#distriList").val(tempSelect);
        tempSelect = '';
        sortLists();
    } else {
        alert("Before remove please select any position.");
    }
});

function sortLists() {
    sortList("#selectDistriList");
    sortList("#distriList");
}

function sortList(list) {
    var selectList = $(list + ' option');
    selectList.sort(function (a, b) { var segA = a.value.split(':'); var segB = b.value.split(':'); return ((+segA[0]) * 60 * 60 + (+segA[1]) * 60) - ((+segB[0]) * 60 * 60 + (+segB[1]) * 60); });
    $(list).html(selectList);
}

$('.dropdown-toggle').dropdown();
$(".ctrl-calendar").datepicker({ dateFormat: 'dd/mm/yy' });
$('[data-toggle="tooltip"]').tooltip();
$("#wrapper").css("padding-left", "0px");


/* viewports */
(function ($, document, window, viewport) {
    $(document).ready(function () {
        console.log('Current breakpoint:', viewport.current());
    });

    $(window).resize(
        viewport.changed(function () {
            console.log('Current breakpoint:', viewport.current());
            if (viewport.current() == "xs")
                $("#page-content-wrapper").css("padding-right", 40);
            else
                $("#page-content-wrapper").css("padding-right", 15);

            $("#calendar > div.fc-view-container > div > div > div > div.fc-day-grid-container.fc-scroller").css("min-height", 254);
            $("#calendar > div.fc-view-container > div > table > tbody > tr > td > div").css("height", "100%").css("overflow-y", "auto");
            $("#calendar > div.fc-view-container > div > table > tbody > tr > td > div.fc-time-grid-container.fc-scroller").css("min-height", "100%");

        })
    );

})(jQuery, document, window, ResponsiveBootstrapToolkit);