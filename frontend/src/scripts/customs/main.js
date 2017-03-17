var grantId,
    host = 'https://shielded-fortress-95039.herokuapp.com',
    routeArguments = '/grants?page_size=20',
    routeData = host + "/last_updated_date";
var categoriesStr = ":All";
$.get(host + "/domains", function (data) {
    for (var i = 0; i < data.length; i++) {
        categoriesStr += ";" + data[i] + ":" + data[i];
    }
});


$(document).ready(function () {

    $.get(routeData, function (data) {
        document.getElementById("last-updated-time").innerHTML = "Last updated on: " + data;
    });

    var grid = $("#jqGrid");
    grid.jqGrid({
        url: host + routeArguments,
        mtype: "GET",
        datatype: "json",
        jsonReader: {
            root: "Data",
            //page:  function(obj) { console.error("!!!", obj); return 1; },
            total: function (obj) {
                return obj.Count / 20;
            },
            records: function (obj) {
                return obj.Count;
            },
        },
        colModel: [
            {label: 'Status', name: 'Status', width: 50, formatter: statusStyles, sortable: false, search: false},
            {
                label: 'Date',
                name: 'publication_date',
                width: 75,
                formatter: dateStyles,
                sortable: false,
                search: false
            },
            {
                label: 'Type',
                name: 'domain',
                width: 100,
                formatter: typeStyles,
                stype: 'select',
                searchoptions: {value: categoriesStr}
            },
            {label: 'Source', name: 'url', formatter: linkStyles, width: 210, sortable: false, search: false},
            {
                label: 'Content preview',
                name: 'text',
                width: 580,
                formatter: prewievStyles,
                sortable: false,
                search: false
            },
            {
                name: 'title',
                width: 0,
                formatter: prewievStyles,
                sortable: false,
                search: false,
                hidden: true
            },
            {
                name: '_id',
                width: 0,
                formatter: prewievStyles,
                sortable: false,
                search: false,
                hidden: true
            },
            {
                label: 'Contacts',
                name: 'contacts',
                width: 280,
                formatter: contactsStyles,
                sortable: false,
                search: false
            },
            {label: 'Actions', width: 250, sortable: false, formatter: actionsButtons, sortable: false, search: false}
        ],
        viewrecords: true, // show the current page, data rang and total records on the toolbar
        height: 750,
        hidegrid: false,
        autowidth: true,
        rowheight: 20,
        page: 1,
        rowNum: 20,
        toppager: true,
        cloneToTop: true,
        pager: "#jqGridPager"
    });
    grid.jqGrid('filterToolbar', {
        autosearch: true,
        stringResult: true,
    });
    grid.jqGrid('navGrid', '#pager', {
        edit: false,
        add: false,
        del: false,
        search: false,
        refresh: false,
        cloneToTop: true
    });
    grid.jqGrid('navButtonAdd', '#' + grid[0].id + '_toppager_left', {
        caption: "<div class='add_record_button'><i class='fa fa-envelope-o' aria-hidden='true'></i>UNREAD</div>",
        buttonicon: 'none',
        onClickButton: function () {
            alert("UNREAD");
        }
    });
    grid.jqGrid('navButtonAdd', '#' + grid[0].id + '_toppager_left', {
        caption: "<div class='add_record_button'><i class='fa fa-exclamation-circle fa-lg' aria-hidden='true'></i>IMPORTANT</div>",
        buttonicon: 'none',
        onClickButton: function () {
            alert("IMPORTANT");
        }
    });
    grid.jqGrid('navButtonAdd', '#' + grid[0].id + '_toppager_left', {
        caption: "<div class='add_record_button'><i class='fa fa-exclamation-circle fa-lg' aria-hidden='true'></i>SKIPPED</div>",
        buttonicon: 'none',
        onClickButton: function () {
            alert("SKIPPED");
        }
    });
    grid.jqGrid('navButtonAdd', '#' + grid[0].id + '_toppager_left', {
        caption: "<div class='add_record_button'><i class='fa fa-check-circle-o fa-lg' aria-hidden='true'></i> DONE</div>",
        buttonicon: 'none',
        onClickButton: function () {
            alert("DONE");
        }
    });
    $("#jqGrid_toppager_center").hide();
});

function statusStyles(cellValue, options, rowObject) {
    return '<div class="statusStyles"><i class="fa fa-envelope-o" aria-hidden="true"></i></div>';
}
function dateStyles(v) {
    return '<div class=" dateStyles">' + v + '</div>';
}

function typeStyles(v) {
    return '<div class="typeStyles">' + v + '</div>';
}

function linkStyles(cellValue, options, rowObject) {
    return '<a class="linkStyles" style="color: #3f51b5"  target="_blank" href="' + cellValue + '"+>' + rowObject.title + '</a>';
}


function prewievStyles(v) {
    return '<div class="prewievStyles">' + v + '</div>';
}
function contactsStyles(v) {
    return '<div class="contactsStyles">' + v + '</p></div>';
}

function actionsButtons(cellValue, options, rowObject) {

    return "<div class='buttonStyles'>" +
        "<button onclick=\"displayItem($(this).closest('tr').addClass('displayed'))\"><i class='fa fa-desktop fa-lg' aria-hidden='true' style='color:blue;'></i>DISPLAY</button>" +
        "<button onclick=\"skipItem($(this).closest('tr').addClass('displayed'))\"><i class='fa fa-ban fa-lg' aria-hidden='true' style='color:red;'></i>SKIP</button>" +
        "<button onclick=\"importantItem($(this).closest('tr').addClass('displayed'))\"><i class='fa fa-exclamation-circle fa-lg' aria-hidden='true' style='color:orange;'></i>IMPORTANT</button>" +
        "<button onclick=\"doneItem($(this).closest('tr').addClass('displayed'))\"><i class='fa fa-check-circle-o fa-lg' aria-hidden='true' style='color:green;'></i>DONE</button>" +
        "</div>";
}
function displayItem(e) {
    var id = $(e).attr('id'),
        data = $("#jqGrid").getRowData(id);
    document.getElementById('allertDate').innerHTML = "Date: " + $(data.publication_date).text();
    document.getElementById('allertTitle').innerHTML = ($(data.title).text());
    document.getElementById('allertContent').innerHTML = ($(data.text).text());
    document.getElementById('allertContacts').innerHTML = $(data.contacts).text();
    document.getElementById('myModal').style.display = "flex";
    document.getElementById('body').style.overflow = "hidden";
    $.ajax({
        "url": host + "/status/" + grantId,
        "method": "POST",
        "data": {
            "status_name": "displayed",
            "value": "true"
        }
    });
}

function skip() {
    document.getElementsByClassName("dateStyles").style.fontWeight = "normal";

    $.ajax({
        "url": host + "/status/" + grantId,
        "method": "POST",
        "data": {
            "status_name": "skipped",
            "value": "true"
        }
    });
}
function importAnt() {

    $.ajax({
        "url": host + "/status/" + grantId,
        "method": "POST",
        "data": {
            "status_name": "important",
            "value": "true"
        }
    });
}
function donE() {

    $.ajax({
        "url": host + "/status/" + grantId,
        "method": "POST",
        "data": {
            "status_name": "done",
            "value": "true"
        }
    });
}


function skipItem(e) {
    var id = $(e).attr('id'),
        data = $("#jqGrid").getRowData(id);

    var grant_id = $(data._id).text();
    $.ajax({
        "url": host + "/status/" + grant_id,
        "method": "POST",
        "data": {
            "status_name": "skipped",
            "value": "true"
        }
    });
}
function importantItem(e) {
    var id = $(e).attr('id'),
        data = $("#jqGrid").getRowData(id);
    var grant_id = $(data._id).text();
    $.ajax({
        "url": host + "/status/" + grant_id,
        "method": "POST",
        "data": {
            "status_name": "important",
            "value": "true"
        }
    });
}
function doneItem(e) {
    var id = $(e).attr('id'),
        data = $("#jqGrid").getRowData(id);

    var grant_id = $(data._id).text();
    $.ajax({
        "url": host + "/status/" + grant_id,
        "method": "POST",
        "data": {
            "status_name": "done",
            "value": "true"
        }
    });
}


function closeAllert() {
    $('#allertContent').animate({scrollTop: $('html').offset().top});
    document.getElementById('myModal').style.display = "none";

}
window.onclick = function (event) {
    if (event.target == document.getElementById('myModal')) {
        document.getElementById('myModal').style.display = "none";
    }
}