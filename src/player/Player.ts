import config from '../config';
import PlayerData from '../storage/PlayerData';
import InteractionZoneSwitcher from '../physics/movement-handler/interaction-zone/InteractionZoneSwitcher';
import MovementHandlerRegistry from '../physics/movement-handler/MovementHandlerRegistry';

class Player {
  public playerData: PlayerData;
  private interactionZoneSwitcher: InteractionZoneSwitcher;
  private movementHandlerRegistry: MovementHandlerRegistry;

  constructor(
    playerData: PlayerData,
    interactionZoneSwitcher: InteractionZoneSwitcher,
    movementHandlerRegistry: MovementHandlerRegistry,
  ) {
    this.playerData = playerData;
    this.interactionZoneSwitcher = interactionZoneSwitcher;
    this.movementHandlerRegistry = movementHandlerRegistry;
  }

  public setAcceleration({ aX, aY }, isAttenuation: boolean = false, isAccelerating: boolean = false) {
    this.playerData.aX = aX;
    this.playerData.aY = aY;
    this.playerData.isAttenuation = isAttenuation;
    this.playerData.isAccelerating = isAccelerating;
  }

  public isStoppedX() {
    return this.playerData.vX === config.minSpeed;
  }

  public isStoppedY() {
    return this.playerData.vY === config.minSpeed;
  }

  public updateData() {
    this.interactionZoneSwitcher.checkZoneSwitch(this.playerData);

    for (const movementHandler of this.movementHandlerRegistry.movementHandlers.values()) {
      movementHandler.updatePlayerData(this.playerData);
    }
  }
}

export default Player;
