import {entity, PrimaryKey, Reference, uuid, UUID} from "@deepkit/type";
import {User} from "./user";


@entity.name('user_skills')
export class UserSkill {
    id: UUID & PrimaryKey = uuid();

    user: User & Reference;
    /** dynamic system
    name: string;
    exp: number;
    */

    intelligence: number = 0; //Intelligenz
    dexterity: number = 0; //Geschicklichkeit
    bruteForce: number = 0; //Fähigkeit, Passwörter oder Sicherheitscodes durch wiederholtes Ausprobieren zu knacken.
    codeCracking: number = 0; //Fähigkeit, komplexe Codes oder Verschlüsselungen zu entschlüsseln und zu verstehen.
    socialEngineering: number = 0; //Fähigkeit, Menschen zu manipulieren oder zu täuschen, um Zugriff auf Informationen oder Systeme zu erhalten.
    phishing: number = 0; //Fähigkeit, gefälschte E-Mails oder Websites zu erstellen, um persönliche Daten oder Zugangsdaten zu stehlen.
    networkPenetration: number = 0; //Fähigkeit, in Netzwerke einzudringen und Sicherheitslücken auszunutzen.
    exploit: number = 0; //Fähigkeit, Schwachstellen in Software oder Systemen zu identifizieren und eigene Exploits zu entwickeln.
    anonymity: number = 0; //Fähigkeit, die eigene Identität online zu verbergen und Spuren zu verwischen.
    dataTheft: number = 0; //Fähigkeit, sensible Daten aus gesicherten Systemen zu extrahieren.
    DenialOfService: number = 0; //(DoS): Fähigkeit, Netzwerke oder Websites durch Überlastung oder gezielte Angriffe lahmzulegen.
    systemAdministration: number = 0; //Fähigkeit, Netzwerke oder Server zu verwalten und Schwachstellen zu schließen.
}