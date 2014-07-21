<?php

//TODO Move location to store
//TODO Twitter
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
    
    $query = mysql_query("SELECT * 
FROM  `gltn_plugins` 
INNER JOIN  `gltn_users` ON gltn_users.id = gltn_plugins.credit");
    $data = array();
    while($row = mysql_fetch_assoc($query)) {
        array_push($data, array(
            "name" => $row['name'],
            "icon_fa" => $row['icon_fa'],
            "plugin_id"=> $row['plugin_id'],
            "url" => $row['url'],
            "type"=>$row['type'],
            "credit"=>$row['credit'],
            "description"=>$row['description'],
            "updated_last"=>$row['updated_last'],
            "version"=>$row['version'],
            "github" =>$row['github'],
            "twitter" => $row['twitter'],
            "featured" =>$row['featured'],
            "featured_c"=>$row['featured_c'],
            "install"=>$row['install'],
            "uninstall"=>$row['uninstall'],
            "uid" => $row['uid'],
            "dev_twitter" => $row['dev_twitter']
        ));
    }
    echo json_encode($data);
?>