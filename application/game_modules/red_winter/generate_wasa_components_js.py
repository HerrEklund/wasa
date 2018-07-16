
import glob
import os

import struct
import imghdr

result = glob.glob('components/vassal/*')


def get_image_size(fname):
    '''Determine the image type of fhandle and return its size.
    from draco'''
    with open(fname, 'rb') as fhandle:
        head = fhandle.read(24)
        if len(head) != 24:
            return
        if imghdr.what(fname) == 'png':
            check = struct.unpack('>i', head[4:8])[0]
            if check != 0x0d0a1a0a:
                return
            width, height = struct.unpack('>ii', head[16:24])
        elif imghdr.what(fname) == 'gif':
            width, height = struct.unpack('<HH', head[6:10])
        elif imghdr.what(fname) == 'jpeg':
            try:
                fhandle.seek(0) # Read 0xff next
                size = 2
                ftype = 0
                while not 0xc0 <= ftype <= 0xcf:
                    fhandle.seek(size, 1)
                    byte = fhandle.read(1)
                    while ord(byte) == 0xff:
                        byte = fhandle.read(1)
                    ftype = ord(byte)
                    size = struct.unpack('>H', fhandle.read(2))[0] - 2
                # We are at a SOFn block
                fhandle.seek(1, 1)  # Skip `precision' byte.
                height, width = struct.unpack('>HH', fhandle.read(4))
            except Exception: #IGNORE:W0703
                return
        else:
            return
        return width, height


def create_component_js():
    '''

    Generate a file like this

    var component_list = [
        '1-0-0-6_ErP_Platoon.gif',
        '1-0-2-6_ErP_Platoon.gif',
        '1-0-2-6_JR16_Platoon_A.gif',
        '1-1-139 AT.gif'
    ];

    '''
    exp_width = 80
    exp_height = 80

    back_pattern1 = '_Back.gif'
    back_pattern2 = '_B.gif'

    all_components = list()

    with open("components.js", "w") as components_file:

        # Store until pass two
        front_images = list()
        back_images = dict()

        # Pass1, split list of files into front and back lists and filter out invalid images
        for r in result:
            # Analyze image
            w, h = get_image_size(r)

            if w > exp_width or h > exp_height:
                continue

            file_name = os.path.basename(r)

            all_components.append(file_name)

            if file_name.endswith(back_pattern1):
                component_id = file_name.replace(back_pattern1, '')
                back_images[component_id] = file_name

            elif file_name.endswith(back_pattern2):
                component_id = file_name.replace(back_pattern2, '')
                back_images[component_id] = file_name
            else:
                front_images.append(file_name)

        #
        # 2 - Pair front with back
        #
        double_sided_components = list()
        single_sided_components = list()
        for front_file_name in front_images:

            # Extract first part without ending
            component_id = front_file_name.split('.')[0]

            back_file_name = back_images.get(component_id, None)

            if back_file_name:
                double_sided_components.append((component_id, front_file_name, back_file_name))
            else:
                single_sided_components.append((component_id, front_file_name, '?'))
                print "No back found for %s" % front_file_name

        # Now generate components.js

        # New front/back model
        components_file.write("var double_sided_component_list = [")
        for c in double_sided_components:
            components_file.write("\n    {"
                                              "\n        'id':'"+c[0]+"',"
                                              "\n        'front':'"+c[1]+"',"
                                              "\n        'back':'"+c[2]+"'\n"
                                          "    },")

        components_file.write("];")

        components_file.write("\n\nvar single_sided_component_list = [")
        for c in single_sided_components:
            components_file.write("\n    {"
                                              "\n        'id':'"+c[0]+"',"
                                              "\n        'front':'"+c[1]+"',"
                                              "\n        'back':'"+c[2]+"'\n"
                                          "    },")

        components_file.write("];")

        # Old style
        components_file.write("\n\n\n\nvar component_list = [")
        for file_name in all_components:
            components_file.write("\n    '"+file_name+"',")

        components_file.write("];")


if __name__ == '__main__':

    create_component_js()