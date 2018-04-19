const { RotationData } = require('../../PlayerData');
const calculateDirection = require('../calculateDirection');

const thirdZoneHandler = (playerData, otherPlayerData) => {
  const r = Math.sqrt(
    (otherPlayerData.x - playerData.x) ** 2
    + (otherPlayerData.y - playerData.y) ** 2,
  );

  let oldDirection = null;

  if (playerData.rotationData.has(otherPlayerData.id)) {
    oldDirection = playerData.rotationData.get(otherPlayerData.id).direction;
  }

  playerData.rotationData.set(otherPlayerData.id, new RotationData(
    otherPlayerData.x,
    otherPlayerData.y,
    r,
    oldDirection || calculateDirection(playerData, otherPlayerData),
  ));
  playerData.boundedToPlayersData.set(otherPlayerData.id, otherPlayerData);
};

module.exports = thirdZoneHandler;
