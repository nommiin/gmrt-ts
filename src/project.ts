
import { 
    GMResource,
    GMResourceEntry_factory,
    GMProject, GMProject_factory,
    GMRoom, GMRoom_factory,
    GMScript, GMScript_factory,
    GMMainOptions, GMMainOptions_factory,
    GMWindowsOptions, GMWindowsOptions_factory
} from "./gamemaker";
import { JSON5, Glob } from "bun";
import { dirname, join, basename } from "path";
import { existsSync, readFileSync } from "fs";

class GameMakerResource {
    public get resourceType(): string {
        return this.data.resourceType;
    }

    public data: GMResource;
    constructor(data: GMResource) {
        this.data = data;
    }

    public async save(path: string, root: string): Promise<boolean> {
        // stub, replaced by anything that needs to write files
        // (ie: scripts, creation code, events.. anything that isn't the .yy file)
        return true;
    }
}

class GameMakerRoom extends GameMakerResource {
    public declare data: GMRoom;
    public creation_code?: string;
    constructor(project: GameMakerProject, data: GMRoom) {
        super({...GMRoom_factory(project.name, data.name), ...data});

        // note: as mentioned below, wanna use async for this
        const root = project.root;
        if (root != "" && this.data.creationCodeFile != "") {
            const file = join(root, this.data.creationCodeFile);
            if (!existsSync(file)) {
                throw new Error(`could not load room, creation code file does not exist: ${file}`);
            }
            this.creation_code = readFileSync(file, "utf-8");
        }
    }

    public override async save(path: string, root: string): Promise<boolean> {
        if (this.creation_code) {
            await Bun.write(join(root, this.data.creationCodeFile), this.creation_code);
        }
        return true;
    }
}

class GameMakerScript extends GameMakerResource {
    public declare data: GMScript;
    public script_code?: string;
    constructor(project: GameMakerProject, path: string, data: GMScript) {
        super({...GMScript_factory(project.name, data.name), ...data});

        // note: this isn't great, ideally want to avoid sync IO and just use native bun offering; will need to be moved out of constructor
        if (project.root != "") {
            const file = join(dirname(path), (this.data?.scriptSource ?? `${this.data.name}.gml`));
            if (existsSync(file)) {
                this.script_code = readFileSync(file, "utf-8");
            }
        }
    }

    public override async save(path: string): Promise<boolean> {
        if (this.script_code) {
            const file = join(path, (this.data?.scriptSource ?? `${this.data.name}.gml`));
            await Bun.write(file, this.script_code);
        }
        return true;
    }
}

class GameMakerMainOptions extends GameMakerResource {
    public declare data: GMMainOptions;
    constructor(data: GMMainOptions) {
        super({...GMMainOptions_factory(), ...data});
    }
}

class GameMakerWindowsOptions extends GameMakerResource {
    public declare data: GMWindowsOptions;
    constructor(project: GameMakerProject, data: GMWindowsOptions) {
        super({...GMWindowsOptions_factory(project.name), ...data});
    }
}

export class GameMakerProject {
    public get name(): string {
        if (!this.data) {
            throw new Error(`could not get name, no project loaded`);
        }
        return this.data.name;
    }

    public root: string = "";
    private data?: GMProject;
    private resources?: Map<string, GameMakerResource>;

    public create(name: string): boolean {
        if (this.data) {
            throw new Error(`could not create project, project already loaded: ${this.name}`);
        }

        // create blank project in memory
        this.data = GMProject_factory(name, false);
        this.resources = new Map();
        this.resources.set("Room1", new GameMakerRoom(this, GMRoom_factory(name, "Room1")));
        this.resources.set("Main", new GameMakerMainOptions(GMMainOptions_factory()));
        this.resources.set("Windows", new GameMakerWindowsOptions(this, GMWindowsOptions_factory(name)));
        
        return true;
    }

    private async load_resource(name: string, path: string): Promise<boolean> {
        if (!this.data || !this.resources) {
            throw new Error(`could not load resource, no project loaded: ${name}`);
        }

        const file = Bun.file(path);
        if (!await file.exists()) {
            throw new Error(`could not load resource, file does not exist: ${path}`);
        }

        const content = JSON5.parse(await file.text()) as GMResource;
        switch (content.resourceType) {
            case "GMRoom": {
                this.resources.set(name, new GameMakerRoom(this, content as GMRoom));
                break;
            }

            case "GMScript": {
                this.resources.set(name, new GameMakerScript(this, path, content as GMScript));
                break;
            }

             case "GMMainOptions": {
                this.resources.set(content.name, new GameMakerWindowsOptions(this, content as GMWindowsOptions));
                break;
            }

            case "GMWindowsOptions": {
                this.resources.set(content.name, new GameMakerWindowsOptions(this, content as GMWindowsOptions));
                break;
            }

            default: {
                console.warn(`# could not parse resource as type is unhandled, loading as generic (${path})`);
                this.resources.set(content.name, new GameMakerResource(content));
            }
        }

        return true;
    }

    public async load(path: string): Promise<boolean> {

        const file = Bun.file(path);
        if (!await file.exists()) {
            throw new Error(`could not load project, file does not exist: ${path}`);
        } else {
            console.log(`- loaded project: ${path}`);
        }

        // load yyp
        const content = JSON5.parse(await file.text()) as GMProject;
        this.data = {...GMProject_factory(content.name), ...content};
        this.resources = new Map();

        // load resources
        this.root = dirname(path);
        for(const {name, path} of this.data.resources.map(e => e.id)) {
            await this.load_resource(name, join(this.root, path));
        }

        // load options
        const options = Array.from(new Glob("options/*/*.yy").scanSync(this.root));
        for(const file of options) {
            await this.load_resource(basename(file), join(this.root, file));
        }
        return true;
    }

    private static type_to_folder: Record<string, string> = {
        "GMAnimCurve": "animcurves",
        "GMExtension": "extensions",
        "GMFont": "fonts",
        "GMNotes": "notes",
        "GMObject": "objects",
        "GMParticleSystem": "particles",
        "GMPath": "paths",
        "GMRoom": "rooms",
        "GMScript": "scripts",
        "GMSequence": "sequences",
        "GMShader": "shaders",
        "GMSound": "sounds",
        "GMSprite": "sprites",
        "GMTileSet": "tilesets",
        "GMTimeline": "timelines",
        "GMMainOptions": "options/main",
        "GMWindowsOptions": "options/windows",
        "GMtvOSOptions": "options/tvos",
        "GMRedditOptions": "options/reddit",
        "GMOperaGXOptions": "options/operagx",
        "GMMacOptions": "options/mac",
        "GMLinuxOptions": "options/linux",
        "GMiOSOptions": "options/ios",
        "GMHtml5Options": "options/html5",
        "GMAndroidOptions": "options/android"
    }

    private normalize(path: string): string {
        return path.replaceAll("\\", "/");
    }

    public async save(path: string, test: boolean = false): Promise<boolean> {
        if (!this.data || !this.resources) {
            throw new Error(`could not save project, no project loaded: ${path}`);
        }

        const root = join(dirname(path), test ? "_TEST" : ""), name = this.name;

        // save resources & options
        this.data.resources = [];
        for(const [name, resource] of this.resources) {
            const folder = GameMakerProject.type_to_folder[resource.resourceType];
            if (!folder) {
                throw new Error(`could not save project, failed to determine path for asset: ${name}`);
            }

            if (resource.resourceType.endsWith("Options")) {
                const option = name.toLowerCase(), dir = join(root, folder);
                await Bun.write(join(dir, `options_${option}.yy`), JSON.stringify(resource.data, undefined, 4));
                continue;    
            }

            const dir = join(root, folder), file = join(dir, name, `${name}.yy`);
            await Bun.write(file, JSON.stringify(resource.data, undefined, 4));
            await resource.save(join(dir, name), root);
            this.data.resources.push(GMResourceEntry_factory(name, this.normalize(file.slice(root.length + 1))));

        }

        // save yyp
        const yyp = join(root, name + ".yyp");
        await Bun.write(yyp, JSON.stringify(this.data, undefined, 4));
        console.log(`- successfully saved project: ${yyp}`);
        return true;
    }

}