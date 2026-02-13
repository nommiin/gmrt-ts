export interface GMResource {
    "%Name": string;
    name: string;
    resourceType: string;
    resourceVersion: string;
}

interface GMAudioGroup extends GMResource {
    $GMAudioGroup: string;
    exportDir: string;
    targets: number;
}

export function GMAudioGroup_factory(name: string): GMAudioGroup {
    return {
        $GMAudioGroup: "v1",
        "%Name": name,
        exportDir: "",
        name,
        resourceType: "GMAudioGroup",
        resourceVersion: "2.0",
        targets: -1
    }
}

interface GMConfig {
    children: GMConfig[];
    name: string;
}

export function GMConfig_factory(name: string): GMConfig {
    return {
        children: [],
        name
    }
}

interface GMFolder extends GMResource {
    folderPath: string;
}

interface GMFolderPath {
    name: string;
    path: string;
}

interface GMIncludedFile extends GMResource {
    $GMIncludedFile: string;
    CopyToMask: number;
    filePath: string;
}

export interface GMResourceEntry {
    id: {
        name: string;
        path: string;
    }
}

export function GMResourceEntry_factory(name: string, path: string): GMResourceEntry {
    return {
        id: {
            name,
            path: path
        }
    }
}

interface GMRoomOrderNode {
    roomId: {
        name: string;
        path: string;
    }
}

export function GMRoomOrderNode_factory(name: string): GMRoomOrderNode {
    return {
        roomId: {
            name,
            path: `rooms/${name}/${name}.yy`
        }
    }
}

interface GMTextureGroup extends GMResource {
    $GMTextureGroup: string;
    autocrop: boolean;
    border: number;
    compressFormat: string;
    customOptions: string;
    directory: string;
    groupParent: {name: string, path: string} | null;
    isScaled: boolean;
    loadType: string;
    mipsToGenerate: number;
    targets: number;
}

export function GMTextureGroup_factory(name: string): GMTextureGroup {
    return {
        $GMTextureGroup: "",
        "%Name": name,
        autocrop: true,
        border: 2,
        compressFormat: "bz2",
        customOptions: "",
        directory: "",
        groupParent: null,
        isScaled: true,
        loadType: "default",
        mipsToGenerate: 0,
        name,
        resourceType: "GMTextureGroup",
        resourceVersion: "2.0",
        targets: -1
    }
}

export interface GMProject extends GMResource {
    $GMProject: string;
    AudioGroups: GMAudioGroup[];
    configs: GMConfig;
    defaultScriptType: number;
    Folders: [];
    ForcedPrefabProjectReferences: any[]; // ???
    IncludedFiles: GMIncludedFile[];
    isEcma: boolean;
    LibraryEmitters: any[]; // ???
    MetaData: {
        IDEVersion?: string;
    }
    resources: GMResourceEntry[];
    RoomOrderNodes: GMRoomOrderNode[];
    templateType: string | null;
    TextureGroups: GMTextureGroup[];
}

export function GMProject_factory(name: string, empty: boolean = true): GMProject {
    return {
        $GMProject: "v1",
        "%Name": name,
        AudioGroups: (empty ? [] : [GMAudioGroup_factory("audiogroup_default")]),
        configs: GMConfig_factory("Default"),
        defaultScriptType: 1,
        Folders: [],
        ForcedPrefabProjectReferences: [],
        IncludedFiles: [],
        isEcma: false,
        LibraryEmitters: [],
        MetaData: {},
        name,
        resources: [],
        resourceType: "GMProject",
        resourceVersion: "2.0",
        RoomOrderNodes: [],
        templateType: "game",
        TextureGroups: (empty ? [] : [GMTextureGroup_factory("Default")])
    }
}

export interface GMScript extends GMResource {
    $GMScript: string;
    isCompatibility: boolean;
    isDnD: boolean;
    parent: GMFolderPath,
    scriptSource?: string;
}

export function GMScript_factory(project: string, name: string): GMScript {
    return {
        $GMScript: "v1",
        "%Name": name,
        isCompatibility: false,
        isDnD: false,
        name,
        parent: {
            name: project,
            path: project + ".yyp"
        },
        resourceType: "GMScript",
        resourceVersion: "2.0"
    }
}

interface GMRLayer extends GMResource {
    depth: number;
    effectEnabled: boolean;
    effectType: any | null;
    gridX: number;
    gridY: number;
    hierarchyFrozen: boolean;
    inheritLayerDepth: boolean;
    inheritLayerSettings: boolean;
    inheritSubLayers: boolean;
    inheritVisibility: boolean;
    layers: any[]; // not defined
    properties: any[] // not defined
    userdefinedDepth: boolean;
    visible: boolean;
}

function GMRLayer_factory(name: string): GMRLayer {
    return {
        "%Name": name,
        depth: 0,
        effectEnabled: true,
        effectType: null,
        gridX: 32,
        gridY: 32,
        hierarchyFrozen: false,
        inheritLayerDepth: false,
        inheritLayerSettings: false,
        inheritSubLayers: true,
        inheritVisibility: true,
        layers: [],
        name,
        properties: [],
        resourceType: "GMRLayer",
        resourceVersion: "2.0",
        userdefinedDepth: false,
        visible: true
    };
}

interface GMRInstanceLayer extends GMRLayer {
    $GMRInstanceLayer: string;
    instances: any[]; // not defined
}

function GMRInstanceLayer_factory(name: string, instances: any[] = []): GMRInstanceLayer {
    return {...GMRLayer_factory(name),
        $GMRInstanceLayer: "",
        instances,
        resourceType: "GMRInstanceLayer",
        resourceVersion: "2.0"
    };
}

interface GMRBackgroundLayer extends GMRLayer {
    $GMRBackgroundLayer: string;
    animationFPS: number;
    animationSpeedType: number;
    colour: number;
    hspeed: number;
    htiled: boolean;
    spriteId: any | null;
    stretch: boolean;
    userdefinedAnimFPS: boolean;
    vspeed: number;
    vtiled: boolean;
    x: number;
    y: number;
}

function GMRBackgroundLayer_factory(name: string, colour: number = 4294936981): GMRBackgroundLayer {
    // NOTE: default "colour" argument differs from editor default, more of a cornflower blue
    return {...GMRLayer_factory(name),
        $GMRBackgroundLayer: "",
        animationFPS: 15,
        animationSpeedType: 0,
        colour,
        depth: 100,
        hspeed: 0,
        htiled: false,
        vspeed: 0,
        vtiled: false,
        resourceType: "GMRBackgroundLayer",
        resourceVersion: "2.0",
        spriteId: null,
        stretch: false,
        userdefinedAnimFPS: false,
        x: 0,
        y: 0
    };
}

interface GMRoomView {
    hborder: number;
    hport: number;
    hspeed: number;
    hview: number;
    inherit: boolean;
    objectId: any | null;
    vborder: number;
    visible: boolean;
    vspeed: number;
    wport: number;
    wview: number;
    xport: number;
    xview: number;
    yport: number;
    yview: number;
}

function GMRoomView_factory(width: number = 1366, height: number = 768): GMRoomView {
    return {
        hborder: 32,
        hport: height,
        hspeed: -1,
        hview: height,
        inherit: false,
        objectId: null,
        vborder: 32,
        visible: false,
        vspeed: -1,
        wport: width,
        wview: width,
        xport: 0,
        xview: 0,
        yport: 0,
        yview: 0
    }
}

export interface GMRoom extends GMResource {
    $GMRoom: string;
    creationCodeFile: string;
    inheritCode: boolean;
    inheritCreationOrder: boolean;
    inheritLayers: boolean;
    instanceCreationOrder: any[]; // not defined
    isDnd: boolean;
    layers: GMRLayer[];
    parent: GMFolderPath;
    parentRoom: any | null; // not defined
    physicsSettings: {
        inheritPhysicsSettings: boolean;
        PhysicsWorld: boolean;
        PhysicsWorldGravityX: number;
        PhysicsWorldGravityY: number;
        PhysicsWorldPixToMetres: number;
    }
    roomSettings: {
        inheritRoomSettings: boolean;
        persistent: boolean;
        Width: number;
        Height: number;
    }
    sequenceId: any | null; // not defined
    views: GMRoomView[];
    viewSettings: {
        clearDisplayBuffer: boolean;
        clearViewBackground: boolean;
        enableViews: boolean;
        inheritViewSettings: boolean;
    }
    volume: number;
}

export function GMRoom_factory(project: string, name: string, width: number = 1366, height:number = 768): GMRoom {
    return {
        $GMRoom: "v1",
        "%Name": name,
        creationCodeFile: "",
        inheritCode: false,
        inheritCreationOrder: false,
        inheritLayers: false,
        instanceCreationOrder: [],
        isDnd: false,
        layers: [
            GMRInstanceLayer_factory("Instances"),
            GMRBackgroundLayer_factory("Background")
        ],
        name,
        parent: {
            name: project,
            path: project + ".yyp"
        },
        parentRoom: null,
        physicsSettings: {
            inheritPhysicsSettings: false,
            PhysicsWorld: false,
            PhysicsWorldGravityX: 0,
            PhysicsWorldGravityY: 10,
            PhysicsWorldPixToMetres: 0.1
        },
        resourceType: "GMRoom",
        resourceVersion: "2.0",
        roomSettings: {
            Height: height,
            inheritRoomSettings: false,
            persistent: false,
            Width: width
        },
        sequenceId: null,
        views: Array.from({length: 8}).map(_ => GMRoomView_factory(width, height)),
        viewSettings: {
            clearDisplayBuffer: true,
            clearViewBackground: true,
            enableViews: false,
            inheritViewSettings: false
        },
        volume: 1
    }
}

export interface GMMainOptions extends GMResource {
    $GMMainOptions: string;
    option_allow_instance_change: boolean;
    option_audio_error_behaviour: boolean;
    option_author: string;
    option_collision_compatibility: boolean;
    option_copy_on_write_enabled: boolean;
    option_draw_colour: number;
    option_gameguid: string;
    option_gameid: string;
    option_game_speed: number;
    option_legacy_json_parsing: boolean;
    option_legacy_number_conversion: boolean;
    option_legacy_other_behaviour: boolean;
    option_legacy_primitive_drawing: boolean;
    option_mips_for_3d_textures: boolean;
    option_remove_unused_assets: boolean;
    option_sci_usesci: boolean;
    option_spine_licence: boolean;
    option_steam_app_id: string;
    option_template_description: string | null;
    option_template_icon: string;
    option_template_image: string;
    option_window_colour: number;
}

export function GMMainOptions_factory(author: string = "", game_speed: number = 60, colour: number = 4294967295): GMMainOptions {
    return {
        $GMMainOptions: "v5",
        "%Name": "Main",
        name: "Main",
        option_allow_instance_change: false,
        option_audio_error_behaviour: false,
        option_author: author,
        option_collision_compatibility: false,
        option_copy_on_write_enabled: false,
        option_draw_colour: colour,
        option_gameguid: crypto.randomUUID(),
        option_gameid: "0",
        option_game_speed: game_speed,
        option_legacy_json_parsing: false,
        option_legacy_number_conversion: false,
        option_legacy_other_behaviour: false,
        option_legacy_primitive_drawing: false,
        option_mips_for_3d_textures: false,
        option_remove_unused_assets: true,
        option_sci_usesci: false,
        option_spine_licence: false,
        option_steam_app_id: "0",
        option_template_description: null,
        option_template_icon: "${base_options_dir}/main/template_icon.png",
        option_template_image: "${base_options_dir}/main/template_image.png",
        option_window_colour: 255,
        resourceType: "GMMainOptions",
        resourceVersion: "2.0"
    }
}

export interface GMWindowsOptions extends GMResource {
    $GMWindowsOptions: string;
    option_windows_allow_fullscreen_switching: boolean;
    option_windows_borderless: boolean;
    option_windows_company_info: string;
    option_windows_copyright_info: string;
    option_windows_copy_exe_to_dest: boolean;
    option_windows_d3dswapeffectdiscard: boolean;
    option_windows_description_info: string;
    option_windows_disable_sandbox: boolean;
    option_windows_display_cursor: boolean;
    option_windows_display_name: string;
    option_windows_enable_steam: boolean;
    option_windows_executable_name: string;
    option_windows_icon: string;
    option_windows_installer_finished: string;
    option_windows_installer_header: string;
    option_windows_interpolate_pixels: boolean;
    option_windows_license: string;
    option_windows_nsis_file: string;
    option_windows_product_info: string;
    option_windows_resize_window: boolean;
    option_windows_save_location: number;
    option_windows_scale: number;
    option_windows_sleep_margin: number;
    option_windows_splash_screen: string;
    option_windows_start_fullscreen: boolean;
    option_windows_steam_use_alternative_launcher: boolean;
    option_windows_texture_page: string;
    option_windows_use_raw_mouse: boolean;
    option_windows_use_splash: boolean;
    option_windows_version: string;
    option_windows_vsync: boolean;
}

export function GMWindowsOptions_factory(display_name: string): GMWindowsOptions {
    /* NOTE: this makes some changes to the default GMWindowsOptions you'd get from the editor
        option_windows_allow_fullscreen_switching: false -> true
                  option_windows_description_info: (ADDED) " - Using gmrt-ts"
                      option_windows_display_name: ${display_name}
                option_windows_interpolate_pixels: true -> false
                     option_windows_resize_window: false -> true
    */
    return {
        $GMWindowsOptions: "v2",
        "%Name": "Windows",
        name: "Windows",
        option_windows_allow_fullscreen_switching: true,
        option_windows_borderless: false,
        option_windows_company_info: "YoYo Games Ltd",
        option_windows_copyright_info: "",
        option_windows_copy_exe_to_dest: false,
        option_windows_d3dswapeffectdiscard: false,
        option_windows_description_info: "A GameMaker Game - Using gmrt-ts",
        option_windows_disable_sandbox: false,
        option_windows_display_cursor: true,
        option_windows_display_name: display_name,
        option_windows_enable_steam: false,
        option_windows_executable_name: "${project_name}.exe",
        option_windows_icon: "${base_options_dir}/windows/icons/icon.ico",
        option_windows_installer_finished: "${base_options_dir}/windows/installer/finished.bmp",
        option_windows_installer_header: "${base_options_dir}/windows/installer/header.bmp",
        option_windows_interpolate_pixels: false,
        option_windows_license: "${base_options_dir}/windows/installer/license.txt",
        option_windows_nsis_file: "${base_options_dir}/windows/installer/nsis_script.nsi",
        option_windows_product_info: "${project_name}",
        option_windows_resize_window: true,
        option_windows_save_location: 0,
        option_windows_scale: 0,
        option_windows_sleep_margin: 10,
        option_windows_splash_screen: "${base_options_dir}/windows/splash/splash.png",
        option_windows_start_fullscreen: false,
        option_windows_steam_use_alternative_launcher: false,
        option_windows_texture_page: "2048x2048",
        option_windows_use_raw_mouse: false,
        option_windows_use_splash: false,
        option_windows_version: "1.0.0.0",
        option_windows_vsync: true,
        resourceType: "GMWindowsOptions",
        resourceVersion: "2.0"
    }
}