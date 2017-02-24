
import glob
import os

import struct
import imghdr


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
    result = glob.glob('components/vassal/*.gif')
    max_width = 60
    max_height = 60

    with open("components.js", "w") as components_file:

        components_file.write("var component_list = [")

        for r in result:
            if r[-6:] in ['-2.gif', '-3.gif', '-4.gif', '-5.gif', '-6.gif']:
                continue

            if r[-7:] in ['-w2.gif', '-w3.gif', '-w4.gif', '-w5.gif', '-w6.gif']:
                continue

            # Analyze image
            w, h = get_image_size(r)

            if w > max_width or h > max_height:
                continue

            file_name = os.path.basename(r)

            components_file.write("\n    '"+file_name+"',")

        components_file.write("];")


if __name__ == '__main__':

    create_component_js()