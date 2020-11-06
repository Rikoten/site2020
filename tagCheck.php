<?php
  $urlSheetJson = "/data/eventData.json";
  $jsonSheet = file_get_contents($_SERVER["DOCUMENT_ROOT"] . $urlSheetJson);
  $sheetData = json_decode($jsonSheet, true);

  foreach($sheetData as $data) {
    if (isset($data["tag"])) {
      foreach($data["tag"] as $tag) {
        if ($tag == "Zoom") echo $data["eventID"] . '<br>';
      }
    }
  }

?>