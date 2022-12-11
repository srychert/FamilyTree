const getRandomValue = (min, max) => {
	return Math.floor(Math.random() * (max - min)) + min;
};

const initialHealth = 10;

const app = Vue.createApp({
	data() {
		return {
			round: 1,
			playerHealth: initialHealth,
			opponentHealth: initialHealth,
			basic: [1, 2, 3],
			extended: [4, 5],
			playerBarWidth: 100,
			opponentBarWidth: 100,
			dataLog: {},
		};
	},
	watch: {
		// whenever round changes, this function will run
		playerHealth(newHealth, _oldHealth) {
			let newBarWidth = (newHealth / initialHealth) * 100;
			newBarWidth = newBarWidth < 0 ? 0 : newBarWidth;
			this.playerBarWidth = (newHealth / initialHealth) * 100;
		},
		opponentHealth(newHealth, _oldHealth) {
			let newBarWidth = (newHealth / initialHealth) * 100;
			newBarWidth = newBarWidth < 0 ? 0 : newBarWidth;
			this.opponentBarWidth = newBarWidth;
		},
		round(_newRound, _oldRound) {
			console.log(this.playerHealth, this.opponentHealth);
			if (this.playerHealth < 1 && this.opponentHealth < 1) {
				alert("Remis");
				this.clear();
				return;
			}

			if (this.playerHealth < 1) {
				alert("Przegrałeś!");
				this.clear();
				return;
			}

			if (this.opponentHealth < 1) {
				alert("Wygrałeś!");
				this.clear();
				return;
			}
		},
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
			// change bars
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
});

app.mount("#game");
