import glob
import os
import struct
import imghdr
import json
import collections

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
    max_width = 100
    max_height = 100

    min_width = 40
    min_height = 40

    with open("components.js", "w") as components_file:

        components_file.write("var component_list = [\n")

        # Two sided handling takes to passes

        component_map = dict()

        total_files = 0
        big_images = 0

        double_sided_created = 0
        single_sided_created = 0

        for r in result:
            total_files += 1
            #if r[-6:] in ['-2.gif', '-3.gif', '-4.gif', '-5.gif', '-6.gif']:
            #    continue

            #if r[-7:] in ['-w2.gif', '-w3.gif', '-w4.gif', '-w5.gif', '-w6.gif']:
            #    continue

            # Analyze image
            w, h = get_image_size(r)

            # Skip too small or too large images
            if w > max_width or h > max_height or w < min_width or h < min_height:
                big_images += 1
                continue

            file_name = os.path.basename(r)

            # Example file names:
            #
            # 'BE-10Div-Bk.png',
            # 'BE-10Div.png',
            #
            # Note, keep simplest last, like: ['-F.png', '.png']
            #  (else .png will trigger first.
            #
            suffixes = ['_Back.gif']
            c_key = get_c_key(file_name, suffixes)
            if c_key:
                component = component_map.get(c_key, {})
                component['b'] = file_name
            else:
                suffixes = ['.gif']
                c_key = get_c_key(file_name, suffixes)
                component = component_map.get(c_key, {})
                component['f'] = file_name

            component_map[c_key] = component

        component_map = collections.OrderedDict(sorted(component_map.items()))

        for c in component_map.items():
            if len(c[1]) == 1:
                single_sided_created += 1
            if len(c[1]) == 2:
                double_sided_created += 1

            components_file.write("%s,\n" % json.dumps(c))

        components_file.write("];")

        print "Result:"
        print "Total number of files: %s" % total_files
        print "Big images found: %s" % big_images
        print "Single sided components created: %s" % single_sided_created
        print "Double sided components created: %s" % double_sided_created
        print "Component sides used %s" % (single_sided_created + 2*double_sided_created)


def get_c_key(file_name, suffixes):

    for s in suffixes:
        if file_name.endswith(s):
            return file_name.replace(s, '').lower()

    return None
if __name__ == '__main__':

    create_component_js()