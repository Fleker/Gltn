<?php
 session_start();
    #felkerdigialmedia credentials
    $mysql_host = "sanscable.db.2425934.hostedresource.com";
    $mysql_database = "sanscable";
    $mysql_user = "sanscable";
    $mysql_password = "u6339!Sans_dvr";

    $error = "Problem connecting to the database (not our fault!). Please try again later or <a href='mailto:nickfelker@gmail.com'>tell the admin</a>.";

    $connect = mysql_connect($mysql_host, $mysql_user, $mysql_password);
    echo mysql_error();
    mysql_select_db($mysql_database, $connect) or die($error);

error_reporting(E_ALL);
ini_set('display_errors','On');

if(!isset($_GET['item'])) 
	$id = 'Nothing';
else
    $id = $_GET['item'];

if($_GET['action'] == "Download")
    $q = "SET `install` = `install` + 1";
else
    $q = "SET `uninstall` = `uninstall` + 1";

mysql_query("UPDATE `gltn_plugins` ".$q." WHERE `plugin_id` = '$id'");
echo mysql_error();
?>