
function createComponentsForTray(component_list, component_path_prefix, tray_id) {

    var component_tray = $('#'+tray_id);

    for (var i=0; i<component_list.length; i++) {
        var file_name = component_list[i];

        var component_image_path = component_path_prefix+encodeURIComponent(file_name);

        // Create ID from the file name, make sure it is safe for ID also
        var new_id = 'C_'+file_name.split('.')[0];
        new_id = new_id.replace(/[^a-z0-9\-_:\.]|^[^a-z]+/gi, "");

        if (new_id.length == 0) {
            console.error("Failed to synthesize ID from file name = "+file_name);
            continue;
        } else {
            console.log("Adding component ("+file_name+") using ID = "+new_id);
        }

        var tray_component = $('<div class="new_component RW_component" id="'+new_id+'"></div>');

        tray_component.css('backgroundImage', 'url(' + component_image_path + ')');

        tray_component.appendTo(component_tray);

    }
}

