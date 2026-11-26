"""
IOL Plug achievement badges, second pass.

Fixes from reviewing the first renders:

  * Camera is face-on. Off-axis made the coin an ellipse, which at the ~128px
    these display at just looked squashed.
  * Cone orientation. Blender's cones point along +Z; the camera looks along
    +Y, so +Z is already "up" on screen and the 90-degree X rotation I had was
    laying every cone down toward the lens. That is what turned the trophy
    into a snowman.
  * Shading. shade_smooth across a low-poly cone rounds its silhouette into a
    blob. Auto-smooth by angle keeps hard edges hard and round surfaces round.
  * Dropped the emissive accent. It was tinting the gold tier pink and the
    metals already carry the tiering.
  * Added a recessed inner face so the emblem sits in a well, which is what
    makes a medal look struck rather than printed.
"""

import bpy
import bmesh
import math
import os

OUT_DIR = "C:/Users/shiaa/OneDrive/Desktop/iol website/iol-wire/public/badges"
SIZE = 256
SMOOTH_ANGLE = math.radians(34)

# Camera looks along +Y, so screen-right is +X and screen-up is +Z.
# Emblems live slightly toward the lens, at negative Y.
Y = -0.26


# ---------------------------------------------------------------- utilities

def purge():
    if bpy.context.object and bpy.context.object.mode != "OBJECT":
        bpy.ops.object.mode_set(mode="OBJECT")
    bpy.ops.object.select_all(action="SELECT")
    bpy.ops.object.delete(use_global=False)
    for block in (bpy.data.meshes, bpy.data.materials, bpy.data.lights, bpy.data.cameras):
        for item in list(block):
            if item.users == 0:
                block.remove(item)


def pick_engine():
    scene = bpy.context.scene
    for candidate in ("BLENDER_EEVEE_NEXT", "BLENDER_EEVEE", "EEVEE"):
        try:
            scene.render.engine = candidate
            return candidate
        except TypeError:
            continue
    return scene.render.engine


def only(obj):
    for o in bpy.context.selected_objects:
        o.select_set(False)
    obj.select_set(True)
    bpy.context.view_layer.objects.active = obj


def smooth(obj):
    """Auto-smooth keeps a cone a cone. Degrade gracefully on older builds."""
    only(obj)
    try:
        bpy.ops.object.shade_auto_smooth(angle=SMOOTH_ANGLE)
        return
    except Exception:
        pass
    try:
        bpy.ops.object.shade_smooth()
        obj.data.use_auto_smooth = True
        obj.data.auto_smooth_angle = SMOOTH_ANGLE
    except Exception:
        pass


def bevel(obj, width=0.012, segments=3):
    only(obj)
    m = obj.modifiers.new("Bevel", "BEVEL")
    m.width = width
    m.segments = segments
    m.limit_method = "ANGLE"
    m.angle_limit = math.radians(40)


def mat(name, base, metallic=1.0, rough=0.3):
    m = bpy.data.materials.get(name) or bpy.data.materials.new(name)
    m.use_nodes = True
    bsdf = next(n for n in m.node_tree.nodes if n.type == "BSDF_PRINCIPLED")

    def setk(k, v):
        if k in bsdf.inputs:
            bsdf.inputs[k].default_value = v

    setk("Base Color", (*base, 1.0))
    setk("Metallic", metallic)
    setk("Roughness", rough)
    return m


def join(objs, name="Emblem"):
    objs = [o for o in objs if o is not None]
    for o in bpy.context.selected_objects:
        o.select_set(False)
    for o in objs:
        o.select_set(True)
    bpy.context.view_layer.objects.active = objs[0]
    if len(objs) > 1:
        bpy.ops.object.join()
    out = bpy.context.view_layer.objects.active
    out.name = name
    return out


def prism(verts2d, depth, name="Prism"):
    me = bpy.data.meshes.new(name)
    bm = bmesh.new()
    vs = [bm.verts.new((x, 0.0, y)) for x, y in verts2d]
    bm.faces.new(vs)
    bmesh.ops.solidify(bm, geom=bm.faces[:], thickness=depth)
    bm.to_mesh(me)
    bm.free()
    obj = bpy.data.objects.new(name, me)
    bpy.context.collection.objects.link(obj)
    return obj


def cone(r1, r2, depth, loc, verts=48):
    """Cone with +Z up, which is already screen-up. No rotation needed."""
    bpy.ops.mesh.primitive_cone_add(vertices=verts, radius1=r1, radius2=r2, depth=depth, location=loc)
    return bpy.context.active_object


def cyl(r, depth, loc, verts=32):
    bpy.ops.mesh.primitive_cylinder_add(vertices=verts, radius=r, depth=depth, location=loc)
    return bpy.context.active_object


def sphere(r, loc, segs=32):
    bpy.ops.mesh.primitive_uv_sphere_add(segments=segs, ring_count=segs // 2, radius=r, location=loc)
    return bpy.context.active_object


def cube(scale, loc):
    bpy.ops.mesh.primitive_cube_add(size=1, location=loc)
    o = bpy.context.active_object
    o.scale = scale
    return o


# ----------------------------------------------------------------- the stage

def build_stage():
    scene = bpy.context.scene
    engine = pick_engine()
    scene.render.resolution_x = SIZE
    scene.render.resolution_y = SIZE
    scene.render.film_transparent = True
    scene.render.image_settings.file_format = "PNG"
    scene.render.image_settings.color_mode = "RGBA"

    cam_data = bpy.data.cameras.new("Cam")
    cam_data.type = "ORTHO"
    cam_data.ortho_scale = 2.32
    cam = bpy.data.objects.new("Cam", cam_data)
    bpy.context.collection.objects.link(cam)
    # Dead-on, so the medallion is a true circle. Depth comes from lighting.
    cam.location = (0.0, -4.0, 0.0)
    cam.rotation_euler = (math.radians(90), 0.0, 0.0)
    scene.camera = cam

    def area(name, loc, rot, energy, size, color):
        d = bpy.data.lights.new(name, "AREA")
        d.energy = energy
        d.size = size
        d.color = color
        o = bpy.data.objects.new(name, d)
        o.location = loc
        o.rotation_euler = rot
        bpy.context.collection.objects.link(o)

    # Key high-left, fill low-right and cool, rim from behind to pop the edge.
    area("Key", (-2.4, -3.0, 2.8), (math.radians(52), 0, math.radians(-38)), 1100, 4.0, (1.0, 0.97, 0.92))
    area("Fill", (2.6, -2.6, -1.4), (math.radians(118), 0, math.radians(44)), 320, 5.0, (0.78, 0.85, 1.0))
    area("Rim", (0.4, 2.6, 1.6), (math.radians(-52), 0, math.radians(185)), 900, 3.0, (1.0, 0.9, 0.84))
    return engine


def build_medallion(face_mat, rim_mat):
    """Coin, recessed inner face, proud rim."""
    base = cyl(1.0, 0.2, (0, 0, 0), verts=96)
    base.name = "BadgeBase"
    base.rotation_euler = (math.radians(90), 0, 0)
    bevel(base, 0.035, 4)
    smooth(base)
    base.data.materials.append(face_mat)

    # Slightly darker sunken disc so the emblem reads as struck into the coin.
    inner = cyl(0.80, 0.19, (0, -0.045, 0), verts=96)
    inner.name = "BadgeRimInner"
    inner.rotation_euler = (math.radians(90), 0, 0)
    bevel(inner, 0.02, 3)
    smooth(inner)
    inner.data.materials.append(rim_mat)

    bpy.ops.mesh.primitive_torus_add(
        major_radius=0.97, minor_radius=0.065, major_segments=96, minor_segments=20, location=(0, 0, 0)
    )
    rim = bpy.context.active_object
    rim.name = "BadgeRim"
    rim.rotation_euler = (math.radians(90), 0, 0)
    smooth(rim)
    rim.data.materials.append(rim_mat)


# -------------------------------------------------------------- the emblems

def em_page():
    page = cube((0.40, 0.07, 0.52), (0, Y, 0))
    bevel(page, 0.025, 3)
    bars = []
    for i, z in enumerate((0.28, 0.10, -0.08, -0.26)):
        w = 0.24 if i % 2 else 0.28
        b = cube((w, 0.04, 0.036), (-0.02 if i % 2 else 0.0, Y - 0.08, z))
        bars.append(b)
    return join([page] + bars)


def em_flame():
    # Cone already points up; a sphere at the base gives it the teardrop.
    f = cone(0.40, 0.0, 0.96, (0, Y, 0.12))
    smooth(f)
    ball = sphere(0.33, (0, Y, -0.26))
    ball.scale = (1.0, 0.55, 0.85)
    smooth(ball)
    return join([f, ball])


def em_heart():
    parts = []
    for sx in (-1, 1):
        s = sphere(0.27, (0.21 * sx, Y, 0.18))
        s.scale = (1.0, 0.55, 1.0)
        smooth(s)
        parts.append(s)
    # Point-down cone makes the bottom of the heart.
    tip = cone(0.48, 0.0, 0.76, (0, Y, -0.20))
    tip.rotation_euler = (math.radians(180), 0, 0)
    tip.scale = (1.0, 0.55, 1.0)
    smooth(tip)
    parts.append(tip)
    return join(parts)


def em_pin():
    needle = cone(0.24, 0.0, 0.66, (0, Y, -0.22))
    needle.rotation_euler = (math.radians(180), 0, 0)  # tip down
    smooth(needle)
    head = sphere(0.27, (0, Y, 0.28))
    smooth(head)
    return join([needle, head])


def em_boxes():
    parts = []
    for x, z, w in ((-0.05, -0.32, 0.48), (0.05, -0.04, 0.44), (-0.03, 0.24, 0.40)):
        b = cube((w, 0.08, 0.125), (x, Y, z))
        bevel(b, 0.022, 2)
        parts.append(b)
    return join(parts)


def em_megaphone():
    # Horn opens along +X, so rotate about Y to lay it on the screen plane.
    horn = cone(0.16, 0.48, 0.88, (0.10, Y, 0.02))
    horn.rotation_euler = (0, math.radians(90), 0)
    horn.rotation_euler = (0, math.radians(90), math.radians(0))
    smooth(horn)
    horn.rotation_euler = (math.radians(0), math.radians(90), math.radians(0))
    # tilt the whole thing up a little
    horn.rotation_euler = (math.radians(-22), math.radians(90), 0)
    handle = cyl(0.075, 0.34, (-0.26, Y, -0.30))
    handle.rotation_euler = (math.radians(-22), 0, math.radians(18))
    smooth(handle)
    return join([horn, handle])


def em_plug():
    """The signature badge.

    A South African Type M plug: three round pins in a triangle, big earth pin
    on top. The two-pin version I tried first read as a face — two eyes and a
    mouth — which is the sort of thing you only see once you have rendered it.
    The local plug is both unambiguous and the app's own name.
    """
    parts = []
    housing = cyl(0.56, 0.16, (0, Y + 0.06, 0), verts=64)
    housing.rotation_euler = (math.radians(90), 0, 0)
    bevel(housing, 0.05, 4)
    smooth(housing)
    parts.append(housing)
    pins = ((0.0, 0.26, 0.115), (-0.23, -0.17, 0.095), (0.23, -0.17, 0.095))
    for x, z, r in pins:
        pin = cyl(r, 0.30, (x, Y - 0.10, z), verts=28)
        pin.rotation_euler = (math.radians(90), 0, 0)
        bevel(pin, 0.022, 3)
        smooth(pin)
        parts.append(pin)
    return join(parts)


def em_bolt():
    outline = [
        (0.12, 0.56), (-0.32, 0.04), (-0.05, 0.04),
        (-0.18, -0.56), (0.32, 0.02), (0.04, 0.02),
    ]
    b = prism(outline, 0.18, "Bolt")
    b.location = (0, Y + 0.09, 0)
    bevel(b, 0.018, 2)
    return b


def em_trophy():
    parts = []
    # Cup: narrow at the bottom, wide at the top, opening upward.
    cup = cone(0.22, 0.40, 0.46, (0, Y, 0.20))
    smooth(cup)
    parts.append(cup)
    for sx in (-1, 1):
        bpy.ops.mesh.primitive_torus_add(
            major_radius=0.15, minor_radius=0.038, major_segments=28, minor_segments=12,
            location=(0.42 * sx, Y, 0.26),
        )
        h = bpy.context.active_object
        h.rotation_euler = (math.radians(90), 0, 0)
        smooth(h)
        parts.append(h)
    stem = cyl(0.075, 0.24, (0, Y, -0.14))  # vertical
    smooth(stem)
    parts.append(stem)
    foot = cyl(0.30, 0.09, (0, Y, -0.30))
    bevel(foot, 0.02, 3)
    smooth(foot)
    parts.append(foot)
    return join(parts)


def em_globe():
    """Dark sphere, gold latitude bands and a meridian outline.

    The first version put both rings on the same axis, so the tilted one sat
    entirely inside the sphere and never showed — leaving a gold ball that
    read as a gem. Bands parallel to the view plane stay visible from a
    face-on camera, which is what actually says 'globe'.
    """
    body = sphere(0.42, (0, Y - 0.04, 0))
    smooth(body)
    body.data.materials.clear()
    body.data.materials.append(mat("globe_body", DARK, 0.9, 0.34))

    rings = []
    # Meridian: faces the camera, so it draws the outline circle.
    bpy.ops.mesh.primitive_torus_add(
        major_radius=0.44, minor_radius=0.028, major_segments=64, minor_segments=12,
        location=(0, Y - 0.04, 0),
    )
    m = bpy.context.active_object
    m.rotation_euler = (math.radians(90), 0, 0)
    smooth(m)
    rings.append(m)
    # Latitudes: lie flat, so from here they read as horizontal bands.
    for z, rad in ((0.0, 0.44), (0.24, 0.355), (-0.24, 0.355)):
        bpy.ops.mesh.primitive_torus_add(
            major_radius=rad, minor_radius=0.024, major_segments=56, minor_segments=10,
            location=(0, Y - 0.04, z),
        )
        r = bpy.context.active_object
        smooth(r)
        rings.append(r)

    gold = mat("globe_rings", GOLD, 0.95, 0.2)
    for r in rings:
        r.data.materials.clear()
        r.data.materials.append(gold)

    return join([body] + rings)


def em_brain():
    parts = []
    pts = ((-0.28, 0.22), (0.26, 0.28), (0.32, -0.20), (-0.24, -0.28), (0.0, 0.0))
    for x, z in pts:
        s = sphere(0.135, (x, Y - 0.05, z), segs=24)
        smooth(s)
        parts.append(s)
    for i in range(4):
        x1, z1 = pts[i]
        x2, z2 = pts[4]
        mx, mz = (x1 + x2) / 2, (z1 + z2) / 2
        length = math.hypot(x2 - x1, z2 - z1)
        c = cyl(0.032, length, (mx, Y - 0.05, mz), verts=14)
        c.rotation_euler = (0, math.atan2(x2 - x1, z2 - z1), 0)
        smooth(c)
        parts.append(c)
    return join(parts)


# ------------------------------------------------------------------ recipes

BRONZE = (0.42, 0.22, 0.10)
SILVER = (0.70, 0.73, 0.78)
GOLD = (0.85, 0.62, 0.17)
IOL_RED = (0.74, 0.06, 0.10)
DARK = (0.075, 0.07, 0.085)
BONE = (0.93, 0.93, 0.95)

BADGES = [
    ("first-read", em_page, BRONZE, DARK, BONE),
    ("reader-10", em_brain, SILVER, DARK, GOLD),
    ("reader-50", em_flame, GOLD, DARK, BONE),
    ("first-like", em_heart, BRONZE, DARK, BONE),
    ("liker-25", em_heart, GOLD, DARK, BONE),
    ("first-save", em_pin, BRONZE, DARK, BONE),
    ("saver-15", em_boxes, SILVER, DARK, GOLD),
    ("first-share", em_megaphone, BRONZE, DARK, BONE),
    ("sharer-10", em_plug, IOL_RED, GOLD, BONE),   # signature
    ("streak-3", em_bolt, SILVER, DARK, GOLD),
    ("streak-7", em_trophy, GOLD, DARK, BONE),
    ("topics-5", em_globe, SILVER, DARK, GOLD),
]


def render_all():
    os.makedirs(OUT_DIR, exist_ok=True)
    engine = build_stage()
    made = []
    for key, emblem_fn, face, inner, emb in BADGES:
        for o in list(bpy.data.objects):
            if o.name.startswith(("BadgeBase", "BadgeRim", "Emblem", "Bolt", "Prism")):
                bpy.data.objects.remove(o, do_unlink=True)

        build_medallion(
            mat(f"face_{key}", face, 1.0, 0.26),
            mat(f"inner_{key}", inner, 1.0, 0.40),
        )
        e = emblem_fn()
        # Some emblems are multi-material by design; do not flatten those.
        if len(e.data.materials) <= 1:
            e.data.materials.clear()
            e.data.materials.append(mat(f"emb_{key}", emb, 0.85, 0.22))

        bpy.context.scene.render.filepath = os.path.join(OUT_DIR, f"{key}.png")
        bpy.ops.render.render(write_still=True)
        made.append(f"{key}.png")
    return {"engine": engine, "count": len(made)}


purge()
RESULT = render_all()
print(RESULT)
