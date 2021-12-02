import { Player } from "../account/player";

class helperTranslator {
    name : string;
    german: string;
    english: string;
    russian: string;

    constructor(name : string, german: string, english: string, russian: string) {
        this.name = name;
        this.german = german;
        this.english = english;
        this.russian = russian;
    }
}

class Translator {

    list: helperTranslator[] = [];

    add(name : string, german : string, english : string, russian : string)
    {
        var translation = this.list.find(element => element.name == name);

        if(!translation)
            this.list.push(new helperTranslator(name, german, english, russian));
        else
        {
            translation.german = german;
            translation.english = english;
            translation.russian = russian;
        }
    }

    get(name : string, language : number) : string
    {
        if(language == undefined)
            return "unknown translation";

        var translation = this.list.find(element => element.name == name);

        if(translation)
        {
            if(language == 0)
                return translation.german;
            else if(language == 1)
                return translation.english;
            else if(language == 2)
                return translation.russian;
            else
                return translation.german;
        }
        else    
            return "unknown translation.";
    }


    globalTranslationPush(translation : string)
    {
        mp.players.forEach((element : Player) => {
            element.outputChatBox(Translation.get(translation, element.language));
        });
    }
   
}

export var Translation = new Translator();

