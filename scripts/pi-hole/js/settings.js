/* Pi-hole: A black hole for Internet advertisements
*  (c) 2017 Pi-hole, LLC (https://pi-hole.net)
*  Network-wide ad blocking via your own hardware.
*
*  This file is copyright under the latest version of the EUPL.
*  Please see LICENSE file for your rights under this license. */
$(function () {
	$("[data-mask]").inputmask();

	$("[data-static]").on("click", function(){
		var row = $(this).closest("tr");
		var mac = row.find("#MAC").text();
		var ip = row.find("#IP").text();
		var host = row.find("#HOST").text();
		$("input[name=\"AddHostname\"]").val(host);
		$("input[name=\"AddIP\"]").val(ip);
		$("input[name=\"AddMAC\"]").val(mac);
	});
});
$(".confirm-poweroff").confirm({
	text: "Are you sure you want to send a poweroff command to your Pi-Hole?",
	title: "Confirmation required",
	confirm(button) {
		$("#poweroffform").submit();
	},
	cancel(button) {
		// nothing to do
	},
	confirmButton: "Yes, poweroff",
	cancelButton: "No, go back",
	post: true,
	confirmButtonClass: "btn-danger",
	cancelButtonClass: "btn-success",
	dialogClass: "modal-dialog modal-mg" // Bootstrap classes for mid-size modal
});
$(".confirm-reboot").confirm({
	text: "Are you sure you want to send a reboot command to your Pi-Hole?",
	title: "Confirmation required",
	confirm(button) {
		$("#rebootform").submit();
	},
	cancel(button) {
		// nothing to do
	},
	confirmButton: "Yes, reboot",
	cancelButton: "No, go back",
	post: true,
	confirmButtonClass: "btn-danger",
	cancelButtonClass: "btn-success",
	dialogClass: "modal-dialog modal-mg" // Bootstrap classes for mid-size modal
});

$(".confirm-restartdns").confirm({
	text: "Are you sure you want to send a restart command to your DNS server?",
	title: "Confirmation required",
	confirm(button) {
		$("#restartdnsform").submit();
	},
	cancel(button) {
		// nothing to do
	},
	confirmButton: "Yes, restart DNS",
	cancelButton: "No, go back",
	post: true,
	confirmButtonClass: "btn-danger",
	cancelButtonClass: "btn-success",
	dialogClass: "modal-dialog modal-mg"
});

$(".confirm-flushlogs").confirm({
	text: "By default, the log is flushed at the end of the day via cron, but a very large log file can slow down the Web interface, so flushing it can be useful. Note that your statistics will be reset and you lose the statistics up to this point. Are you sure you want to flush your logs?",
	title: "Confirmation required",
	confirm(button) {
		$("#flushlogsform").submit();
	},
	cancel(button) {
		// nothing to do
	},
	confirmButton: "Yes, flush logs",
	cancelButton: "No, go back",
	post: true,
	confirmButtonClass: "btn-danger",
	cancelButtonClass: "btn-success",
	dialogClass: "modal-dialog modal-mg"
});

$(".api-token").confirm({
	text: "Make sure that nobody else can scan this code around you. They will have full access to the API without having to know the password. Note that the generation of the QR code will take some time.",
	title: "Confirmation required",
	confirm(button) {
		window.open("scripts/pi-hole/php/api_token.php");
	},
	cancel(button) {
		// nothing to do
	},
	confirmButton: "Yes, show API token",
	cancelButton: "No, go back",
	post: true,
	confirmButtonClass: "btn-danger",
	cancelButtonClass: "btn-success",
	dialogClass: "modal-dialog modal-mg"
});

$("#DHCPchk").click(function() {
	$("input.DHCPgroup").prop("disabled", !this.checked);
	$("#dhcpnotice").prop("hidden", !this.checked).addClass("lookatme");
});

var leasetable, staticleasetable;
$(document).ready(function() {
	if(document.getElementById("DHCPLeasesTable"))
	{
		leasetable = $("#DHCPLeasesTable").DataTable({
			dom: "<'row'<'col-sm-12'tr>><'row'<'col-sm-6'i><'col-sm-6'f>>",
			"columnDefs": [ { "bSortable": false, "orderable": false, targets: -1} ],
			"paging": false,
			"scrollCollapse": true,
			"scrollY": "200px",
			"scrollX" : true
		});
	}
	if(document.getElementById("DHCPStaticLeasesTable"))
	{
		staticleasetable = $("#DHCPStaticLeasesTable").DataTable({
			dom: "<'row'<'col-sm-12'tr>><'row'<'col-sm-12'i>>",
			"columnDefs": [ { "bSortable": false, "orderable": false, targets: -1} ],
			"paging": false,
			"scrollCollapse": true,
			"scrollY": "200px",
			"scrollX" : true
		});
	}
    //call draw() on each table... they don't render properly with scrollX and scrollY set... ¯\_(ツ)_/¯
    $("a[data-toggle=\"tab\"]").on("shown.bs.tab", function (e) {
        leasetable.draw();
        staticleasetable.draw();
    });

} );

// Handle hiding of alerts
$(function(){
    $("[data-hide]").on("click", function(){
        $(this).closest("." + $(this).attr("data-hide")).hide();
    });
});

// DHCP leases tooltips
$(document).ready(function(){
    $("[data-toggle=\"tooltip\"]").tooltip({"html": true, container : "body"});
});

// Handle list deletion
$("button[id^='adlist-btn-']").on("click", function (e) {
	var id = parseInt($(this).context.id.replace(/[^0-9\.]/g, ""), 10);
	e.preventDefault();

	var status = $("input[name=\"adlist-del-"+id+"\"]").is(":checked");
	var textType = status ? "none" : "line-through";

	// Check hidden delete box (or reset)
	$("input[name=\"adlist-del-"+id+"\"]").prop("checked", !status);
	// Untick and disable check box (or reset)
	$("input[name=\"adlist-enable-"+id+"\"]").prop("checked", status).prop("disabled", !status);
	// Strink through text (or reset)
	$("a[id=\"adlist-text-"+id+"\"]").css("text-decoration", textType);
	// Highlight that the button has to be clicked in order to make the change live
	$("button[id=\"blockinglistsaveupdate\"]").addClass("btn-danger").css("font-weight", "bold");

});

// Javascript to go to specified tab on save or hyperlink
$(function () {
   if(location.hash.length > 0)
   {
     var activeTab = $("[href=" + location.hash + "]");
     activeTab && activeTab.tab("show");
   }
});
// Change hash for save and reload
$(".nav-tabs a").on("shown.bs.tab", function (e) {
    window.location.hash = e.target.hash;
    window.scrollTo(0, 0);
});
