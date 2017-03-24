var grantId,
    host = 'https://shielded-fortress-95039.herokuapp.com',
    //host = 'http://127.0.0.1:5000',
    grantsRoute = host + '/grants',
    lastUpdatedDateRoute = host + "/last_updated_date",
    domainsRoute = host + "/domains",
    pageSize = 16,
    domains = {
        All: "All"
    };

if(document.cookie.length==0){
    window.location.href = "./login.html";
}

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
                name: 'notes',
                width: 280,
                formatter: contactsStyles,
                sortable: false,
                search: false,
                hidden: true
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
        loadError : function(xhr,st,err) { 
            if(xhr.status == 401)
            {
                console.log(window.location.protocol);
                window.location.href = '/login.html';
            }
        },
        gridComplete: function () {
            var ids = grid.jqGrid('getDataIDs');
            for (var i = 0; i < ids.length; i++) {
                var rowId = ids[i];
                var rowData = grid.jqGrid('getRowData', rowId);
                if ($(rowData.unread).text() == "true" ) {
                    $("#" + rowId).addClass('unread');
                }
                if (($(rowData.skipped).text()) == "true") {
                    $("#" + rowId+" .skp").addClass('sideButtonPressed');
                }
                if (($(rowData.important).text()) == "true") {
                    $("#" + rowId+" .imp").addClass('sideButtonPressed');
                }
                if (($(rowData.done).text()) == "true") {
                    $("#" + rowId+" .dn").addClass('sideButtonPressed');
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
        caption: "<div class='add_record_button filterButtonPressed' id='all-button'><i class='fa fa-list' aria-hidden='true'></i>ALL</div>",
        buttonicon: 'none',
        onClickButton: function () {
            grid.setGridParam({url: grantsRoute, postData: {flags: '[]'}, page: 1}).trigger('reloadGrid');
            highlightTopButtons('all-button');
        }
    });

        grid.jqGrid('navButtonAdd', '#' + grid[0].id + '_toppager_left', {
        caption: "<div class='add_record_button' id='unread-button'><i class='fa fa-envelope-o' aria-hidden='true'></i>UNREAD</div>",
        buttonicon: 'none',
        onClickButton: function () {
            grid.setGridParam({url: grantsRoute, postData: {flags: '["unread"]'}, page: 1}).trigger('reloadGrid');
            highlightTopButtons('unread-button');
        }
    });

    grid.jqGrid('navButtonAdd', '#' + grid[0].id + '_toppager_left', {
        caption: "<div class='add_record_button' id='important-button'><i class='fa fa-exclamation-circle fa-lg' aria-hidden='true'></i>IMPORTANT</div>",
        buttonicon: 'none',
        onClickButton: function () {
            grid.setGridParam({url: grantsRoute, postData: {flags: '["important"]'}, page: 1}).trigger('reloadGrid');
            highlightTopButtons('important-button');
        }
    });

    grid.jqGrid('navButtonAdd', '#' + grid[0].id + '_toppager_left', {
        caption: "<div class='add_record_button' id='skipped-button'><i class='fa fa-exclamation-circle fa-lg' aria-hidden='true'></i>SKIPPED</div>",
        buttonicon: 'none',
        onClickButton: function () {
            grid.setGridParam({url: grantsRoute, postData: {flags: '["skipped"]'}, page: 1}).trigger('reloadGrid');
            highlightTopButtons('skipped-button');
        }
    });

    grid.jqGrid('navButtonAdd', '#' + grid[0].id + '_toppager_left', {
        caption: "<div class='add_record_button' id='done-button'><i class='fa fa-check-circle-o fa-lg' aria-hidden='true'></i> DONE</div>",
        buttonicon: 'none',
        onClickButton: function () {
            grid.setGridParam({url: grantsRoute, postData: {flags: '["done"]'}, page: 1}).trigger('reloadGrid');
            highlightTopButtons('done-button');
        }
    });

    grid.jqGrid('navButtonAdd', '#' + grid[0].id + '_toppager_left', {
        caption: "<div class='add_record_button' id='modified-button'><i class='fa fa-pencil' aria-hidden='true'></i>MODIFIED</div>",
        buttonicon: 'none',
        onClickButton: function () {
            grid.setGridParam({url: grantsRoute, postData: {flags: '["modified"]'}, page: 1}).trigger('reloadGrid');
            highlightTopButtons('modified-button');
        }
    });
    $("#jqGrid_toppager_center").hide();


});

function highlightTopButtons(e) {
    var filterButtons = ["all-button", "unread-button", "important-button", "skipped-button", "done-button", "modified-button"];
    for (var i = 0; i < filterButtons.length; i++) {
        if (e==filterButtons[i]){
            $("#"+filterButtons[i]).addClass("filterButtonPressed");
        }
        else{
            $("#"+filterButtons[i]).removeClass("filterButtonPressed");
        }
    }
}


function statusStyles(cellValue, options, rowObject) {
    var statusIcon = 'fa-envelope-open-o';

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
        statusIcon = 'fa-envelope-o';
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
    e.removeClass('unread');

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
        "<button class='dsp' onclick=\"displayItem($(this).closest('tr'))\"><i class='fa fa-desktop fa-lg' aria-hidden='true' style='color:blue;'></i>DISPLAY</button>" +
        "<button class='skp' onclick=\"skipItem($(this).closest('tr').addClass('displayed'))\"><i class='fa fa-ban fa-lg' aria-hidden='true' style='color:red;'></i>SKIP</button>" +
        "<button class='imp' onclick=\"importantItem($(this).closest('tr').addClass('displayed'))\"><i class='fa fa-exclamation-circle fa-lg' aria-hidden='true' style='color:orange;'></i>IMPORTANT</button>" +
        "<button class='dn' onclick=\"doneItem($(this).closest('tr').addClass('displayed'))\"><i class='fa fa-check-circle-o fa-lg' aria-hidden='true' style='color:green;'></i>DONE</button>" +
        "</div>";
}

function displayItem(e) {
    e.removeClass('unread');
    var id = $(e).attr('id'),
        data = $("#jqGrid").getRowData(id);
    document.getElementById('alertDate').innerHTML = "Date: " + $(data.publication_date).text();
    document.getElementById('alertTitle').innerHTML = ($(data.title).text());
    document.getElementById('alertContent').innerHTML = ($(data.text).text());
    document.getElementById('alertContacts').innerHTML = $(data.contacts).text();
    document.getElementById('noteText').innerHTML = $(data.notes).text();
    document.getElementById('myModal').style.display = "flex";
    document.getElementById('body').style.overflow = "hidden";
    setGridItemStatus(data._id, 'unread', id);
}

function skip() {
    setGridItemStatus(grantId, 'skip', null);
}

function importAnt() {
    setGridItemStatus(grantId, 'important', null);
}

function donE() {
    setGridItemStatus(grantId, 'done', null);
}

function updateNote() {
    var noteText;
    noteText = document.getElementById('noteText').value;
    $.ajax({
        "url": host + "/grants/" + grantId,
        "method": "POST",
        "data": {
            ["notes"]: noteText
        },
        success: function () {
            $("#jqGrid").trigger('reloadGrid');
        },
        error: function (e) {
            console.error(e);
        }
    });

}


function skipItem(e) {

    e.removeClass('unread');
    e.addClass('buttonPressedSkip');
    var id = $(e).attr('id'),
        data = $("#jqGrid").getRowData(id);

    setGridItemStatus(data._id, 'skipped', id);
}

function importantItem(e) {
    e.removeClass('unread');
    e.addClass('buttonPressedImportant');
    var id = $(e).attr('id'),
        data = $("#jqGrid").getRowData(id);
    setGridItemStatus(data._id, 'important', id);
}

function doneItem(e) {
    e.removeClass('unread');
    e.addClass('buttonPressedDone');
    var id = $(e).attr('id'),
        data = $("#jqGrid").getRowData(id);

    setGridItemStatus(data._id, 'done', id);
}


var setGridItemStatus = function (grant_id, statusName, rowId) {
    if (!grant_id) return;

    var statusValue = "true";
    if (statusName == "unread") statusValue = "false";

    $.ajax({
        "url": host + "/grants/" + grant_id,
        "method": "POST",
        "data": {
            [statusName]: statusValue
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
            $("#jqGrid").trigger('reloadGrid');
        },
        error: function (e) {
            console.error(e);
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
