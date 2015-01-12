<?php
require_once('std_lib.php');
require_once('DB.php');

ini_set("memory_limit", "1024M");

$db = &DB::getDB();

$q = "SELECT * FROM TDIR__Categories";
$categories = $db->getRows($q);

$q = "SELECT * FROM TDIR__Locations";
$results = $db->getRows($q);

ob_start();

foreach ($results as $r)
{
    $id = $r['id'];
    $created = '2014-04-01 00:00:00';
    $last_modified = '2014-04-01 00:00:00';
    $title = str_replace("'", "''", $r['label_text']);
    $slug = $r['slug'];
    $description_short = str_replace("'", "''", $r['info_short']);
    $description_long = str_replace("'", "''", $r['info_long']);
    $room = $r['room'];
    $type = $r['type'];
    $x = $r['label_x'];
    $y = $r['label_y'];
    $z = $r['label_z'];
        $parts = explode('-', $r['directory']);
    $building_slug = $parts[0];
    $floor_slug = strtolower(trim(preg_replace('/[^A-Za-z0-9-]+/', '-', $r['floor'])));
    $visible = ($r['show'] == 'yes') ? 1 : 0;

    $q = "SELECT * FROM TDIR__Cats2Locs WHERE `location_id` = $id ORDER BY `rank`";
    $lookups = $db->getRows($q);

    $csv_text = '';
    $csv = array();

    foreach ($lookups as $k)
    {
        foreach ($categories as $c)
        {
            if ($c['id'] == $k['category_id'])
            {
                $csv[] = $c['slug'];
            }
        }
        $csv_text = implode(',', $csv);
    }

    $insert = "insert into Locations values($id, '$created', '$last_modified', '$title', '$slug', '$description_short', '$description_long', '$room', '$type', $x, $y, $z,  '$building_slug', '$floor_slug', $visible, '$csv_text');" . "<br><br>";
    echo $insert;
}

$long_string = ob_get_contents();
ob_end_clean();
print $long_string;
