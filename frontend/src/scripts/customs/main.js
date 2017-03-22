var grantId,
    //host = 'https://shielded-fortress-95039.herokuapp.com',
    host = 'http://127.0.0.1:5000',
    grantsRoute = host + '/grants',
    lastUpdatedDateRoute = host + "/last_updated_date",
    domainsRoute = host + "/domains",
    pageSize = 16,
    domains = {
        All: "All"
    };


function getDomains() {
    $.ajax({
        url: domainsRoute,
        async: false,
        success: function (data) {
            for (var i = 0; i < data.length; i++) {
                domains[data[i]] = data[i];
            }
        }
    });
}

function displayLastUpdatedDate() {
    $.get(lastUpdatedDateRoute, function (data) {
        $("#last-updated-date").text("Last updated on: " + data);
    });
}


$(document).ready(function () {
    getDomains();
    displayLastUpdatedDate();

    var grid = $("#jqGrid");
    grid.jqGrid({
        url: grantsRoute,
        mtype: "GET",
        datatype: "json",
        jsonReader: {
            root: "Data",
            total: "Pages",
            records: "Count"
        },
        colModel: [
            {
                label: 'Status',
                name: 'Status',
                width: 50,
                formatter: statusStyles,
                sortable: false,
                search: false
            },
            {
                label: 'Date',
                name: 'publication_date',
                width: 75,
                formatter: dateStyles,
                sortable: false,
                search: false
            },
            {
                label: 'Source',
                name: 'domain',
                width: 100,
                formatter: typeStyles,
                sortable: false,
                stype: 'select',
                searchoptions: {
                    value: domains
                }
            },
            {
                label: 'Title',
                name: 'url',
                formatter: linkStyles,
                width: 210,
                sortable: false,
                search: false
            },
            {
                label: 'Content preview',
                name: 'text',
                width: 580,
                formatter: previewStyles,
                sortable: false,
                search: false

            },
            {
                name: 'done',
                jsonmap: 'flags.done',
                width: 580,
                formatter: previewStyles,
                sortable: false,
                search: false,
                hidden: true
            },
            {
                name: 'unread',
                jsonmap: 'flags.unread',
                width: 580,
                formatter: previewStyles,
                sortable: false,
                search: false,
                hidden: true
            },
            {
                name: 'important',
                jsonmap: 'flags.important',
                width: 580,
                formatter: previewStyles,
                sortable: false,
                search: false,
                hidden: true
            },
            {
                name: 'skipped',
                jsonmap: 'flags.skipped',
                width: 580,
                formatter: previewStyles,
                sortable: false,
                search: false,
                hidden: true
            },
            {
                name: 'title',
                width: 0,
                formatter: previewStyles,
                sortable: false,
                search: false,
                hidden: true
            },
            {
                name: '_id',
                width: 0,
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
            {
                label: 'Actions',
                width: 250,
                formatter: actionsButtons,
                sortable: false,
                search: false
            }],


        viewrecords: true, // show the current page, data rang and total records on the toolbar
        height: 750,
        hidegrid: false,
        autowidth: true,
        rowheight: 20,
        page: 1,
        rowNum: pageSize,
        toppager: true,
        cloneToTop: true,
        loadonce: false,
        pager: "#jqGridPager",
        gridComplete: function () {
            var ids = grid.jqGrid('getDataIDs');
            for (var i = 0; i < ids.length; i++) {
                var rowId = ids[i];
                var rowData = grid.jqGrid('getRowData', rowId);
                if (($(rowData.unread).text()) == "false" && ($(rowData.done).text()) == "false" && ($(rowData.important).text()) == "false" && ($(rowData.skipped).text()) == "false") {
                    $("#" + rowId).addClass('displayed');
                }
            }
        }
    });
    grid.jqGrid('filterToolbar', {
        autosearch: true,
        stringResult: true
    });
    grid.navGrid('#',
        {
            edit: false,
            add: false,
            del: false,
            search: false,
            refresh: false,
            view: false,
            position: "left",
            cloneToTop: true
        });
    grid.jqGrid('navButtonAdd', '#' + grid[0].id + '_toppager_left', {
        caption: "<div class='add_record_button'><i class='fa fa-envelope-o' aria-hidden='true'></i>UNREAD</div>",
        buttonicon: 'none',
        onClickButton: function () {
            grid.setGridParam({url: grantsRoute, postData: {flags: '["unread"]'}}).trigger('reloadGrid');

        }
    });
    grid.jqGrid('navButtonAdd', '#' + grid[0].id + '_toppager_left', {
        caption: "<div class='add_record_button'><i class='fa fa-exclamation-circle fa-lg' aria-hidden='true'></i>IMPORTANT</div>",
        buttonicon: 'none',
        onClickButton: function () {
            grid.setGridParam({url: grantsRoute, postData: {flags: '["important"]'}}).trigger('reloadGrid');
        }
    });
    grid.jqGrid('navButtonAdd', '#' + grid[0].id + '_toppager_left', {
        caption: "<div class='add_record_button'><i class='fa fa-exclamation-circle fa-lg' aria-hidden='true'></i>SKIPPED</div>",
        buttonicon: 'none',
        onClickButton: function () {
            grid.setGridParam({url: grantsRoute, postData: {flags: '["skipped"]'}}).trigger('reloadGrid');
        }
    });
    grid.jqGrid('navButtonAdd', '#' + grid[0].id + '_toppager_left', {
        caption: "<div class='add_record_button'><i class='fa fa-check-circle-o fa-lg' aria-hidden='true'></i> DONE</div>",
        buttonicon: 'none',
        onClickButton: function () {
            grid.setGridParam({url: grantsRoute, postData: {flags: '["done"]'}}).trigger('reloadGrid');
        }
    });
    grid.jqGrid('navButtonAdd', '#' + grid[0].id + '_toppager_left', {
        caption: "<div class='add_record_button'><i class='fa fa-pencil' aria-hidden='true'></i>MODIFIED</div>",
        buttonicon: 'none',
        onClickButton: function () {
            grid.setGridParam({url: grantsRoute, postData: {flags: '["modified"]'}}).trigger('reloadGrid');
        }
    });
    $("#jqGrid_toppager_center").hide();


});


function statusStyles(cellValue, options, rowObject) {
    var statusIcon = 'fa-envelope-o';

    if (rowObject.flags.done) {
        statusIcon = 'fa-check-circle-o';
    }
    if (rowObject.flags.important) {
        statusIcon = 'fa-exclamation-circle';
    }
    if (rowObject.flags.skipped) {
        statusIcon = 'fa-ban';
    }
    if (rowObject.flags.unread) {
        statusIcon = 'fa-envelope-open-o';
    }
    if (rowObject.flags.modified) {
        statusIcon = 'fa-pencil';
    }

    return '<div class="statusStyles">' +
        '<i class="fa ' + statusIcon + '" aria-hidden="true"></i>' +
        '</div>';
}

function dateStyles(v) {
    return '<div class=" dateStyles">' + v + '</div>';
}

function typeStyles(v) {
    return '<div class="typeStyles">' + v + '</div>';
}

function linkStyles(cellValue, options, rowObject) {
    return "<a class='linkStyles' onclick='clickedLink($(this).closest(\"tr\"))' style='color: #3f51b5; height: 25px'   target='_blank' href='" + cellValue + "'>" + rowObject.title + "</a>";
}

function clickedLink(e) {
    e.addClass('display');

    var id = $(e).attr('id'),
        data = $("#jqGrid").getRowData(id);
    setGridItemStatus(data._id, 'unread', id);
}

function previewStyles(v) {
    return '<div  class="previewStyles">' + v + '</div>';
}

function contactsStyles(v) {
    return '<div class="contactsStyles">' + v + '</p></div>';
}


function actionsButtons(cellValue, options, rowObject) {

    return "<div class='buttonStyles'>" +
        "<button onclick=\"displayItem($(this).closest('tr'))\"><i class='fa fa-desktop fa-lg' aria-hidden='true' style='color:blue;'></i>DISPLAY</button>" +
        "<button onclick=\"skipItem($(this).closest('tr').addClass('displayed'))\"><i class='fa fa-ban fa-lg' aria-hidden='true' style='color:red;'></i>SKIP</button>" +
        "<button onclick=\"importantItem($(this).closest('tr').addClass('displayed'))\"><i class='fa fa-exclamation-circle fa-lg' aria-hidden='true' style='color:orange;'></i>IMPORTANT</button>" +
        "<button onclick=\"doneItem($(this).closest('tr').addClass('displayed'))\"><i class='fa fa-check-circle-o fa-lg' aria-hidden='true' style='color:green;'></i>DONE</button>" +
        "</div>";
}

function displayItem(e) {
    e.addClass('display');
    var id = $(e).attr('id'),
        data = $("#jqGrid").getRowData(id);
    document.getElementById('alertDate').innerHTML = "Date: " + $(data.publication_date).text();
    document.getElementById('alertTitle').innerHTML = ($(data.title).text());
    document.getElementById('alertContent').innerHTML = ($(data.text).text());
    document.getElementById('alertContacts').innerHTML = $(data.contacts).text();
    document.getElementById('myModal').style.display = "flex";
    document.getElementById('body').style.overflow = "hidden";
    setGridItemStatus(data._id, 'unread', id);

}

function skip() {
    document.getElementsByClassName("dateStyles").style.fontWeight = "normal";
    setGridItemStatus(grantId, 'skipped', null);
}

function importAnt() {
    setGridItemStatus(grantId, 'important', null);
}

function donE() {
    setGridItemStatus(grantId, 'done', null);
}


function skipItem(e) {
    e.addClass('display');
    var id = $(e).attr('id'),
        data = $("#jqGrid").getRowData(id);

    setGridItemStatus(data._id, 'skipped', id);
}

function importantItem(e) {
    e.addClass('display');
    var id = $(e).attr('id'),
        data = $("#jqGrid").getRowData(id);
    setGridItemStatus(data._id, 'important', id);
}

function doneItem(e) {
    e.addClass('display');
    var id = $(e).attr('id'),
        data = $("#jqGrid").getRowData(id);

    setGridItemStatus(data._id, 'done', id);
}

var setGridItemStatus = function (grant_id, statusName, rowId) {
    if (!grant_id) return;
    $.ajax({
        "url": host + "/status/" + grant_id,
        "method": "POST",
        "data": {
            "status_name": statusName,
            "value": "true"
        },
        success: function () {
            if (rowId) {
                var newClass;

                if (statusName == "unread") newClass = 'fa fa-envelope-open-o';
                if (statusName == "done") newClass = 'fa fa-check-circle-o';
                if (statusName == "important") newClass = 'fa fa-exclamation-circle';
                if (statusName == "skipped") newClass = 'fa fa-ban';

                $('tr#' + rowId + ' .statusStyles i').attr('class', newClass);
            }
        },
        error: function (e) {
            console.error(e.statusText);
        }
    });
};

function closeAlert() {
    $('#alertContent').animate({
        scrollTop: $('html').offset().top
    });
    $("#myModal").hide();
}
window.onclick = function(event) {
    if ($(event.target).is("#myModal")) {
        closeAlert();
    }
}
