import config from '../../config';
import MovementHandlerRegistry from './movement-handler/MovementHandlerRegistry';
import Storage from '../../server/storage';

class InteractionZoneSwitcher {
  private storage: Storage;
  private movementHandlerRegistry: MovementHandlerRegistry;

  constructor(storage: Storage, movementHandlerRegistry: MovementHandlerRegistry) {
    this.storage = storage;
    this.movementHandlerRegistry = movementHandlerRegistry;
  }

  public checkZoneSwitch(playerData) {
    const { playersData } = this.storage.worldData;

    for (const otherPlayerData of (Object as any).values(playersData)) {
      if (otherPlayerData.id === playerData.id) {
        continue;
      }

      const interactionZonePlayerIntoOtherPlayer = this._getInteractionZone(
        playerData,
        otherPlayerData
      );

      const interactionZoneOtherPlayerIntoPlayer = this._getInteractionZone(
        otherPlayerData,
        playerData
      );

      if (interactionZonePlayerIntoOtherPlayer <= interactionZoneOtherPlayerIntoPlayer) {
        const interactionZoneMovementHandler = this.movementHandlerRegistry
          .getInteractionZoneMovementHandler(interactionZonePlayerIntoOtherPlayer)
        ;

        // TODO
        if (interactionZoneMovementHandler) {
          interactionZoneMovementHandler.updateMovementHandlerData(playerData, otherPlayerData);
        }
      }
    }
  }

  // First zone is closest to player circle
  private _getInteractionZone(playerData, otherPlayerData) {
    // Check is first zone.
    let i = 0;

    for (const RofZone of config.relativeZonesSizes) {
      i++;
      const { x, y, r } = otherPlayerData;
      const circle = { x, y, r: RofZone * r };

      if (this._circleContain(circle, playerData.x, playerData.y)) {
        return i;
      }
    }

    return 4;
  }

  private _circleContain(circle, x, y) {
    const right = circle.x + circle.r;
    const left = circle.x - circle.r;
    const top = circle.y - circle.r;
    const bottom = circle.y + circle.r;

    if (x >= left && x <= right && y >= top && y <= bottom) {
      const dx = (circle.x - x) * (circle.x - x);
      const dy = (circle.y - y) * (circle.y - y);

      return (dx + dy) <= (circle.r * circle.r);
    }

    return false;
  }
}

export default InteractionZoneSwitcher;