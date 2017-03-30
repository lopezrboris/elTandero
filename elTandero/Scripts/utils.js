Date.prototype.addDays = function (days) {
    var dat = new Date(this.valueOf());
    dat.setDate(dat.getDate() + days);
    return dat;
}

Array.prototype.where = Array.prototype.filter || function (predicate, context) {
    context = context || window;
    var arr = [];
    var l = this.length;
    for (var i = 0; i < l; i++)
        if (predicate.call(context, this[i], i, this) === true) arr.push(this[i]);
    return arr;
};

Array.prototype.select = Array.prototype.map || function (selector, context) {
    context = context || window;
    var arr = [];
    var l = this.length;
    for (var i = 0; i < l; i++)
        arr.push(selector.call(context, this[i], i, this));
    return arr;
};

function DefaultEqualityComparer(a, b) {
    return a === b || a.valueOf() === b.valueOf();
};

Array.prototype.contains = function (o, comparer) {
    comparer = comparer || DefaultEqualityComparer;
    var l = this.length;
    while (l-- > 0)
        if (comparer(this[l], o) === true) return true;
    return false;
};

function rgb2hex(orig) {
    var rgb = orig.replace(/\s/g, '').match(/^rgba?\((\d+),(\d+),(\d+)/i);
    return (rgb && rgb.length === 4) ? "#" +
     ("0" + parseInt(rgb[1], 10).toString(16)).slice(-2) +
     ("0" + parseInt(rgb[2], 10).toString(16)).slice(-2) +
     ("0" + parseInt(rgb[3], 10).toString(16)).slice(-2) : orig;
}


//******************** ResponsiveBootstrapToolkit ****************

function reemplazar(inicial, replacement) {
    var original = $(inicial).get(0);

    for (var i = 0, l = original.attributes.length; i < l; ++i) {
        var nodeName = original.attributes.item(i).nodeName;
        var nodeValue = original.attributes.item(i).nodeValue;

        replacement.setAttribute(nodeName, nodeValue);
    }

    while (original.childNodes.length > 0) {
        replacement.appendChild(original.childNodes[0]);
    }
    original.parentNode.replaceChild(replacement, original);
}

function ajustes() {
    $("#calendar > div.fc-view-container > div > div > div").css("padding-left", 0).css("padding-right", 0);

    $("#calendar > div.fc-view-container > div > div > div > div.fc-year-monthly-name.fc-first").css("padding-left", 5).css("padding-right", 5);
    $("#calendar > div.fc-view-container > div > div > div > div.fc-row.fc-widget-header").css("padding-left", 5).css("padding-right", 5);
    $("#calendar > div.fc-view-container > div > div > div > div.fc-day-grid-container").css("padding-left", 5).css("padding-right", 5);
    $("#calendar > div.fc-view-container > div > div > div > div.fc-year-monthly-footer").css("padding-left", 5).css("padding-right", 5);

    $("body > div.container.body-content > footer").addClass("col-lg-4 col-md-4 col-sm-6 col-xs-12");

    $("#calendar > div.fc-view-container > div > div > div > div.fc-day-grid-container.fc-scroller").css("min-height", 254).css("overflow-y", "auto");
    $(".fc-year-monthly-name").css("margin-top: 0px");
}

function responsive() {
    $(".fc-year-month-border, .fc-year-month-separator").remove();

    reemplazar("#calendar > div.fc-view-container > div > table", $("<div>").get(0));
    reemplazar("#calendar > div.fc-view-container > div > div > tbody", $("<div>").get(0));

    $("#calendar > div.fc-view-container > div > div > div > tr").each(function () {
        var parent = $(this).parent().parent();
        $(this).children().each(function () { reemplazar($(this), $("<div>").get(0)); });
        $(this).children().each(function () { parent.append($(this).addClass("col-lg-4 col-md-4 col-sm-6 col-xs-12")); });
        $(this).remove();
    });
    ajustes();
}
