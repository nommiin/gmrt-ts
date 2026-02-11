
import { GMResource, GMProject, GMProject_factory, GMScript, GMScript_factory, GMRoom, GMRoom_factory } from "./gamemaker";
import { JSON5 } from "bun";
import { dirname, join } from "path";
import { existsSync, readFileSync } from "fs";

class GameMakerResource {
    public data: GMResource;
    constructor(data: GMResource) {
        this.data = data;
    }
}

class GameMakerRoom extends GameMakerResource {
    public declare data: GMRoom;
    public creation_code?: string;
    constructor(project: GameMakerProject, path: string, data: GMRoom) {
        super({...GMRoom_factory(project.name, data.name), ...data});

        // note: as mentioned below, wanna use async for this
        if (this.data.creationCodeFile != "") {
            const file = join(project.root, this.data.creationCodeFile);
            if (!existsSync(file)) {
                throw new Error(`could not load room, creation code file does not exist: ${file}`);
            }
            this.creation_code = readFileSync(file, "utf-8");
        }

    }
}

class GameMakerScript extends GameMakerResource {
    public declare data: GMScript;
    public script_code: string;
    constructor(project: GameMakerProject, path: string, data: GMScript) {
        super({...GMScript_factory(project.name, data.name), ...data});

        // note: this isn't great, ideally want to avoid sync IO and just use native bun offering
        const file = join(dirname(path), (this.data?.scriptSource ?? `${this.data.name}.gml`));
        if (!existsSync(file)) {
            throw new Error(`could not load script, file does not exist: ${file}`);
        }
        this.script_code = readFileSync(file, "utf-8");

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
                this.resources.set(name, new GameMakerRoom(this, path, content as GMRoom));
                break;
            }

            case "GMScript": {
                this.resources.set(name, new GameMakerScript(this, path, content as GMScript));
                break;
            }

            default: {
                throw new Error(`could not load resource, unhandled resource type: ${content.resourceType}`);
            }
        }

        return true;
    }
    
    public async load(path: string): Promise<boolean> {
        const file = Bun.file(path);
        if (!await file.exists()) {
            throw new Error(`could not load project, file does not exist: ${path}`);
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
        
        return true;
    }

}