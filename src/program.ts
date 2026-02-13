
import { GameMakerProject } from "./project";
import { Glob } from "bun";

interface Parameters {
    init?: boolean;  // --init <project.yyp>
    run?: boolean;   // --run <project.yyp>
}

/*
  |
  |> gmrt-ts --init test.yyp
  |_________________________________________________________________________
  |                                                                         |
  |         creates gmconfig.json, tsconfig.json, and buildgraph.xml        |
  |                                                                         |
  |=========================================================================*
  |
  |> gmrt-ts --run test.yyp
  |_________________________________________________________________________
  |                                                                         |
  |  runs the given project, requires gmconfig.json to be present at least  |
  |     NOTE: when gmrt-ts is ran without arguments, --run will perform     |
  |                                                                         |
  *=========================================================================*

  |>  NOTE: if no .yyp file is provided, gmrt-ts will attempt to find any   |
  |  file ending in .yyp in the top level of the current working directory  |
  
*/

export class Program {
    public static async main(args: Parameters, positionals: string[]): Promise<number> {

        let project_file = positionals.find(e => e.toLowerCase().endsWith(".yyp"));
        if (!project_file) {
            const project_recent = Bun.file(".gmrecent");
            if (await project_recent.exists()) {
                project_file = await project_recent.text();
            } else {
                project_file = Array.from(new Glob("*.yyp").scanSync(".")).at(0);
            }
        }

        if (project_file && (await Bun.file(project_file).exists())) {
            const project = new GameMakerProject();

            await project.load(project_file);
            
            await project.save(project_file, true);

        } else {
            throw new Error(`could not load project: ${project_file ?? "<none>"}`);
        }

        return 0;
    }
}