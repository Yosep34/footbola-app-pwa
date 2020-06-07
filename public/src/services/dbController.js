
class DBService {
	async init(){
		this.instance = await idb.open('footbola', 1, (upgradeDb) => {
			upgradeDb.createObjectStore('team', {keyPath: 'id'});
		});
	}

	async putTeam(team) {
		const tx = this.instance.transaction('team', 'readwrite');
		const store = tx.objectStore('team');
		await store.put(team);
		return tx.complete;
		}
		
		async getTeam (team) {
			const tx =this.instance.transaction('team', 'readonly');
			const store = tx.objectStore('team');
			return store.get(team)
		}
		
		async getAllTeams() {
			const tx = this.instance.transaction('team', 'readonly');
			const store = tx.objectStore('team')
			return store.getAll();
		}
		
		async deleteTeam(teamId) {
			const tx = this.instance.transaction('team', 'readwrite');
			const store = tx.objectStore('team');
			return store.delete(teamId);
		}

}






