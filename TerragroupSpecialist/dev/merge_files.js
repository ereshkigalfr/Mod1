/*
エレシュキガル
*/

/*
    SPT-AKI TerragroupSpecialist mod.
    Copyright (C) 2022  Ereshkigal

    This program is free software: you can redistribute it and/or modify
    it under the terms of the GNU Affero General Public License as
    published by the Free Software Foundation, either version 3 of the
    License, or (at your option) any later version.

    This program is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU Affero General Public License for more details.

    You should have received a copy of the GNU Affero General Public License
    along with this program.  If not, see <http://www.gnu.org/licenses/>.
*/

"use strict";

class Merging
{
    static mergeFiles()
    {
        const mod = require("../package.json");
        const db = Merging.LoopThroughThatBith(`${ModLoader.getModPath(`${mod.author}-${mod.name}`)}/dev/db/`);

        let localeOneFile = {};
        //Adding translations
        for (let lang in db.locales)
        {
            localeOneFile[lang] = db.locales[lang];
            for (let cats in db.locales[lang])
            {
                localeOneFile[lang][cats] = db.locales[lang][cats];
                for (let data in db.locales[lang][cats])
                {
                    localeOneFile[lang][cats][data] = db.locales[lang][cats][data];
                    if (typeof db.locales[lang][cats][data] === "string")
                    {
                        const toAdd = JsonUtil.deserialize(VFS.readFile(db.locales[lang][cats][data]));
                        localeOneFile[lang][cats][data] = toAdd;
                    }
                    else if (typeof db.locales[lang][cats][data] === "object")
                    {
                        for (let extraNode in db.locales[lang][cats][data])
                        {
                            const toAddExtra = JsonUtil.deserialize(VFS.readFile(db.locales[lang][cats][data][extraNode]));
                            localeOneFile[lang][cats][data][extraNode] = toAdd;
                        }
                    }
                }
            }
        }

        VFS.writeFile("./locales.json", JsonUtil.serialize(localeOneFile, true));

        let FuckThatMessyStructure = {};
        let oneFile = {};

        //Adding map loots
        for (let map in db.locations)
        {
            oneFile[map] = db.locations[map];
            for (let loot in db.locations[map])
            {
                for (let type in db.locations[map][loot])
                {
                    oneFile[map][type] = [];

                    for (let lootNode in db.locations[map][loot][type])
                    {
                        for (let lootData in db.locations[map][loot][type][lootNode])
                        {
                            let loots = JsonUtil.deserialize(VFS.readFile(db.locations[map][loot][type][lootNode][lootData]));
                            FuckThatMessyStructure = {
                                "Id": loots.Id,
                                "data": [loots]
                            };
                            VFS.writeFile("./loot.json", JsonUtil.serialize(oneFile, true));
                            oneFile[map][type].push(FuckThatMessyStructure);
                        }
                    }
                }
            }
        }

        for (const bruh in oneFile)
        {
            delete oneFile[bruh].loot;
        }


        VFS.writeFile("./loot.json", JsonUtil.serialize(oneFile, true));

    }
    static LoopThroughThatBith(filepath)
    {
        const fs = require("fs");
        let baseNode = {};
        let directories = this.getDirList(filepath);
        let files = fs.readdirSync(filepath);

        // remove all directories from files
        for (let directory of directories)
        {
            for (let file in files)
            {
                if (files[file] === directory)
                {
                    files.splice(file, 1);
                }
            }
        }

        // make sure to remove the file extention
        for (let node in files)
        {
            let fileName = files[node].split(".").slice(0, -1).join(".");
            baseNode[fileName] = filepath + files[node];
        }

        // deep tree search
        for (let node of directories)
        {
            baseNode[node] = this.LoopThroughThatBith(filepath + node + "/");
        }

        return baseNode;
    }

    static getDirList(path)
    {
        const fs = require("fs");
        return fs.readdirSync(path).filter(function (file)
        {
            return fs.statSync(path + "/" + file).isDirectory();
        });
    }

}

module.exports = Merging;