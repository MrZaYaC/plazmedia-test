<?php
function jsOnResponse()
{
    echo '
 <script type="text/javascript">
 window.parent.getXml();
 </script>
 ';
}
$upload = FALSE;
if( isset( $_POST)){
    $name = $_POST['name'];
    $description = $_POST['description'];
}
if( isset( $_FILES['photo'] ) ){
    $extensions = array('jpeg', 'jpg', 'png',);
    $path     = '../photos/';
    $tmp_file = $_FILES['photo']['tmp_name'];
    $file_name     = $_FILES['photo']['name'];
    $ext      = explode(".", $file_name);
    $ext      = $ext[1];

    // Проверить расширение
    if( $ext != '' ){
        if( in_array( strtolower($ext), $extensions  ) ){
            $ext = TRUE;
        } else {
            $ext = FALSE;
        }
    } else {
        $ext = FALSE;
    }

    if($ext){
        if( move_uploaded_file( $tmp_file, $path.$file_name ) ){
            $upload = TRUE;
        } else {
            echo 'Проверте права у папки';
        }
    } else {
        echo 'Загруженный файл не является изображением';
    }
}

if(!empty($name)){
    $xml = simplexml_load_file('../xml/people.xml');
    $item = $xml->items->addChild('item');
    if($upload){
        $item->addChild('photo', 'photos/'.$file_name);
    }
    $item->addChild('name', $name);
    $item->addChild('description', $description);
    $item->addChild('escapes', '0');
    if($xml->asXML('../xml/people_temp.xml')){
        unlink('../xml/people.xml');
        rename('../xml/people_temp.xml', '../xml/people.xml');
        jsOnResponse();
    } else {
        echo 'не получилось сохранить';
    }
}
?>

