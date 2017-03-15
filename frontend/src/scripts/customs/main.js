$(document).ready(function () {
    var grid = $("#jqGrid"),
        categoriesStr = ":All;Grant:Grant;Conference:Сonference;****:****;***:***",
        //host = 'http://lowcost-env.mri5njt8g2.us-west-2.elasticbeanstalk.com/grants?page_size=20';
        host = 'http://127.0.0.1:5000/grants?page_size=20';

    grid.jqGrid({
        url: host,
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
            {label: 'Status', name: '', width: 50, formatter: statusStyles, sortable: false, search: false},
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
                sortable: false,
                stype: 'select',
                searchoptions: {value: categoriesStr}
            },
            {label: 'Source', name: 'url', formatter: linkStyles, width: 210, sortable: false, search: false},
            {
                label: 'Content preview',
                name: 'text',
                width: 520,
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
                label: 'Contacts',
                name: 'contacts',
                width: 280,
                formatter: contactsStyles,
                sortable: false,
                search: false
            },
            {label: 'Actions', width: 350, sortable: false, formatter: actionsButtons, sortable: false, search: false}
        ],
        viewrecords: true, // show the current page, data rang and total records on the toolbar
        height: 750,
        hidegrid: false,
        loadonce: true,
        autowidth: true,
        rowheight: 20,
        page: 1,
        rowNum: 20,
        toppager: true,
        cloneToTop: true,
        datatype: "json",
        caption: "<div class='button_container'><div class='add_record_button'>" +
        " + ADD NEW RECORD</div><div class='add_record_button'> FILTER</div></div>",
        caption: "<div class='button_container'><div class='add_record_button'><i class='fa fa-envelope-o' aria-hidden='true'></i>" +
        " UNREAD</div><div class='add_record_button'><i class='fa fa-exclamation-circle fa-lg' aria-hidden='true'></i>" +
        " IMPORTANT</div><div class='add_record_button'><i class='fa fa-exclamation-circle fa-lg' aria-hidden='true'></i>" +
        "SKIPPED</div><div class='add_record_button'><i class='fa fa-check-circle-o fa-lg' aria-hidden='true'></i> DONE</div></div>",
        pager: "#jqGridPager"
    });
    grid.jqGrid('filterToolbar', {
        autosearch: true,
        stringResult: true
    });
    grid.jqGrid('navGrid', '#pager', {edit: false, add: false, del: false, search: false, cloneToTop: true});
    grid.jqGrid('navButtonAdd', '#' + grid[0].id + '_toppager_left', {
        caption: "UNREAD",
        buttonicon: 'fa fa-exclamation-circle fa-lg',
        onClickButton: function () {
            alert("CLICK");
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
    console.debug(rowObject);
    return "<button onclick=\"displayItem($(this).closest('tr'))\"><i class='fa fa-desktop fa-lg' aria-hidden='true' style='color:blue;'></i>DISPLAY</button>" +
        "<button onclick='skipItem()'><i class='fa fa-ban fa-lg' aria-hidden='true' style='color:red;'></i>SKIP</button>" +
        "<button onclick='importantItem()'><i class='fa fa-exclamation-circle fa-lg' aria-hidden='true' style='color:orange;'></i>IMPORTANT</button>" +
        "<button onclick='doneItem()'><i class='fa fa-check-circle-o fa-lg' aria-hidden='true' style='color:green;'></i>DONE</button>";
}
function displayItem(e) {
    var id = $(e).attr('id'),
        data = $("#jqGrid").getRowData(id);

    console.debug($(data.title).text());
    document.getElementById('allertDate').innerHTML = "Date: " + $(data.publication_date).text();
    document.getElementById('allertTitle').innerHTML = ($(data.title).text());
    document.getElementById('allertContent').innerHTML = ($(data.text).text());
    document.getElementById('allertContacts').innerHTML = $(data.contacts).text();
    document.getElementById('myModal').style.display = "flex";
    document.getElementById('body').style.overflow = "hidden";
}

function skipItem() {
}
function importantItem() {
}
function doneItem() {
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