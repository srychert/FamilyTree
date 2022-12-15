<template>
  <div id="game">
    <Player name="Oponent" id="oponent" :playerBarWidth="100"></Player>
    <Player name="Gracz" id="player" :playerBarWidth="100"></Player>
    <Controls></Controls>
  </div>
</template>

<script>
import Player from "./Player.vue";
import Controls from "./Controls.vue";

export default {
  name: "Game",
  components: {
    Player,
    Controls,
  },
  data() {
    return {
      round: 1,
      playerHealth: 10,
      opponentHealth: 10,
      basic: [1, 2, 3],
      extended: [4, 5],
      playerBarWidth: 100,
      opponentBarWidth: 100,
      dataLog: {},
    };
  },
  methods: {
    addToDataLog(playerLog, opponentLog) {
      const currentRound = `Round_${this.round}`;
      let data = {};
      data[currentRound] = {
        player: { name: "Gracz", attack: playerLog.attack, heal: playerLog.heal },
        opponent: { name: "Przeciwnik", attack: opponentLog.attack, heal: opponentLog.heal },
      };
      this.dataLog = { ...this.dataLog, ...data };
    },
    nextRound() {
      // setTimeout(() => {}, 10000);
      this.round += 1;
    },
    attack() {
      const index = getRandomValue(0, this.basic.length);
      return this.basic[index];
    },
    attackPlus() {
      const index = getRandomValue(0, this.basic.length + this.extended.length);
      return [...this.basic, ...this.extended][index];
    },
    heal() {
      const healValue = getRandomValue(this.basic[this.basic.length - 1], this.extended[this.extended.length - 1] + 1);
      return healValue;
    },
    clear() {
      this.round = 1;
      this.playerHealth = initialHealth;
      this.opponentHealth = initialHealth;
      this.dataLog = {};
    },
    playerAttack() {
      const playerA = this.attack();
      const opponentA = this.attack();

      this.playerHealth -= opponentA;
      this.opponentHealth -= playerA;

      this.addToDataLog({ attack: playerA }, { attack: opponentA });
      this.nextRound();
    },
    playerAttackPlus() {
      const playerA = this.attackPlus();
      const opponentA = this.attack();

      this.playerHealth -= opponentA;
      this.opponentHealth -= playerA;

      this.addToDataLog({ attack: playerA }, { attack: opponentA });
      this.nextRound();
    },
    playerHeal() {
      const playerH = this.heal();
      const opponentA = this.attack();

      this.playerHealth += opponentA;

      this.addToDataLog({ heal: playerH }, { attack: opponentA });
      this.nextRound();
    },
    playerResign() {
      alert("Kapitulacja :(");
      this.clear();
    },
  },
  computed: {
    attackPlusAllowed() {
      return this.round % 3 === 0;
    },
    healAllowed() {
      return this.round % 5 === 0;
    },
  },
};
</script>
