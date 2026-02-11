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

interface GMResourceEntry {
    id: {
        name: string;
        path: string;
    }
}

function GMResourceEntry_factory(name: string, folder: string): GMResourceEntry {
    return {
        id: {
            name,
            path: `${folder}/${name}/${name}.yy`
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

function GMRBackgroundLayer_factory(name: string, colour: number = 4278190080): GMRBackgroundLayer {
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
        views: new Array(8).map(_ => GMRoomView_factory(width, height)),
        viewSettings: {
            clearDisplayBuffer: true,
            clearViewBackground: true,
            enableViews: false,
            inheritViewSettings: false
        },
        volume: 1
    }
}
