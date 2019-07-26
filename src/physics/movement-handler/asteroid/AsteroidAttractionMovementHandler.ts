import MovementHandlerInterface from '../MovementHandlerInterface';
import Storage from '../../../storage/Storage';
import config from '../../../config';
import performGravityAttraction from '../../utils/performGravityAttraction';
import isCirclesIntersect from '../../utils/isCirclesIntersect';
import Player from '../../../player/Player';
import CircleInterface from '../../CircleInterface';

class AsteroidAttractionMovementHandler implements MovementHandlerInterface {
  private storage: Storage;

  public constructor(storage: Storage) {
    this.storage = storage;
  }

  public handle(player: Player): void {
    const playerData = player.playerData;

    for (const asteroidData of Object.values(this.storage.worldData.asteroidsData)) {
      if (asteroidData.r > playerData.r) {
        const intersectCircle = this.createResizedCircle(asteroidData, config.asteroidAttractionRadiusMultiplier);

        if (!isCirclesIntersect(playerData, intersectCircle)) {
          continue;
        }

        performGravityAttraction(playerData, asteroidData);
      } else {
        const intersectCircle = this.createResizedCircle(playerData, config.relativeZonesSizes[0]);

        if (!isCirclesIntersect(asteroidData, intersectCircle)) {
          continue;
        }

        performGravityAttraction(asteroidData, playerData);
      }
    }
  }

  private createResizedCircle(circe: CircleInterface, multiplier: number) {
    return {
      x: circe.x,
      y: circe.y,
      r: circe.r * multiplier,
    };
  }
}

export default AsteroidAttractionMovementHandler;
