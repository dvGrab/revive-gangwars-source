import { TeamIds } from "./team";

class ModelInfo{
    name : string;
    team : number;

    constructor(name : string, team : number)
    {
        this.name = name;
        this.team = team;
    }
};

class PlayerModels{
    Peds : any = [];

    addModelForTeam(modelname : string, team : number) 
    {
         this.Peds.push(new ModelInfo(modelname, team));
    }

    getTeamModels(team : number)
    {
        var returnValue : any = [];

        this.Peds.forEach((element : ModelInfo) => {
            if(team == element.team)
                returnValue.push(element.name);
        });

        return returnValue;
    }

    getTeamModelsAsJSON(team : number)
    {
        var returnValue : any = [];

        this.Peds.forEach((element : ModelInfo)=> {
            if(team == element.team)
                returnValue.push(element.name);
        });

        return JSON.stringify({model: returnValue});
    }
}

export var TeamModels = new PlayerModels();

TeamModels.addModelForTeam("g_f_y_families_01", TeamIds.Grove);
TeamModels.addModelForTeam("g_m_y_famdnf_01", TeamIds.Grove);
TeamModels.addModelForTeam("g_m_y_famca_01", TeamIds.Grove);
TeamModels.addModelForTeam("g_m_y_famfor_01", TeamIds.Grove);

TeamModels.addModelForTeam("g_f_y_ballas_01", TeamIds.Ballas);
TeamModels.addModelForTeam("g_m_y_ballasout_01", TeamIds.Ballas);
TeamModels.addModelForTeam("g_m_y_ballaorig_01", TeamIds.Ballas);
TeamModels.addModelForTeam("g_m_y_ballaeast_01", TeamIds.Ballas);

TeamModels.addModelForTeam("g_m_y_mexgoon_02", TeamIds.Vagos);
TeamModels.addModelForTeam("g_m_y_mexgoon_03", TeamIds.Vagos);
TeamModels.addModelForTeam("g_m_y_mexgoon_01", TeamIds.Vagos);
TeamModels.addModelForTeam("g_f_y_vagos_01", TeamIds.Vagos);

TeamModels.addModelForTeam("ig_claypain", TeamIds.Bloods);
TeamModels.addModelForTeam("u_m_m_partytarget", TeamIds.Bloods);
TeamModels.addModelForTeam("s_m_y_prismuscl_01", TeamIds.Bloods);
TeamModels.addModelForTeam("ig_tanisha", TeamIds.Bloods);
