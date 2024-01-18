/*
エレシュキガル
*/

/*
    Terragroup Knight mod.
    Copyright (C) 2024 Ereshkigal

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

import { DependencyContainer } from "tsyringe";

//SPT Imports
import type { IPreAkiLoadMod } from "@spt-aki/models/external/IPreAkiLoadMod";
import type { ILogger } from "@spt-aki/models/spt/utils/ILogger";
import type { DynamicRouterModService } from "@spt-aki/services/mod/dynamicRouter/DynamicRouterModService";
import type { StaticRouterModService } from "@spt-aki/services/mod/staticRouter/StaticRouterModService";
import { GameController } from "@spt-aki/controllers/GameController";
import { ProfileController } from "@spt-aki/controllers/ProfileController";


//TGS Imports
import { checkLabsLock } from "../functions/checkLabsLock";
import { raiderInvasion } from "../functions/raiderInvasion";
import { applyHealthModifications } from "../functions/applyHealthModifications";
import { applyMetabolismModifications } from "../functions/applyMetabolismModifications";
import { dataFileGenerator } from "../functions/dataFileGenerator";


export class InitCallbacks {

    static initAll(container: DependencyContainer) {
        const logger = container.resolve<ILogger>("WinstonLogger");
        const dynamicRouterModService = container.resolve<DynamicRouterModService>("DynamicRouterModService");
        const staticRouterModService = container.resolve<StaticRouterModService>("StaticRouterModService");
        const profileController = container.resolve<ProfileController>("ProfileController");



        staticRouterModService.registerStaticRouter(
            "StaticTGSrouteKeepalive",
            [
                {
                    url: "/client/game/keepalive",
                    action: (url, info, sessionId, output) => {
                        logger.info("client/game/keepalive callback from TGS called")
                        let profile = profileController.getCompleteProfile(sessionId)
                        checkLabsLock.check(container, profile[0])

                        return output;
                    }
                }
            ],
            "aki"
        );

        staticRouterModService.registerStaticRouter(
            "StaticTGSrouteStart",
            [
                {
                    url: "/client/game/start",
                    action: (url, info, sessionId, output) => {
                        logger.info("client/game/start callback from TGS called")
                        dataFileGenerator.createFiles(container,sessionId)
                        let profile = profileController.getCompleteProfile(sessionId)
                        checkLabsLock.check(container, profile[0])
                        applyHealthModifications.apply(container, profile[0], sessionId)
                        applyMetabolismModifications.apply(container, profile[0], sessionId)

                        return output;
                    }
                }
            ],
            "aki"
        );

        staticRouterModService.registerStaticRouter(
            "StaticTGSrouteLogout",
            [
                {
                    url: "/client/game/logout",
                    action: (url, info, sessionId, output) => {
                        logger.info("client/game/logout callback from TGS called")
                        let profile = profileController.getCompleteProfile(sessionId)
                        applyHealthModifications.restore(container, profile[0], sessionId)
                        applyMetabolismModifications.restore(container, profile[0], sessionId)
                        return output;
                    }
                }
            ],
            "aki"
        );
        staticRouterModService.registerStaticRouter(
            "StaticTGSrouteBotGen",
            [
                {
                    url: "/client/game/bot/generate",
                    action: (url, info, sessionId, output) => {
                        logger.info("client/game/bot/degenerate callback from TGS called")
                        let profile = profileController.getCompleteProfile(sessionId)
                        raiderInvasion.invade(container, info)
                        info = raiderInvasion.newOutput()
                        /*if (raiderInvasion.canInvade(container,profile[0])) {
                            raiderInvasion.invade(container, output)
                            if(raiderInvasion.newOutput()){
                            info = raiderInvasion.newOutput()}
                        }*/
                        return output;
                    }
                }
            ],
            "aki"
        );
    }
}