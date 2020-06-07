const handleError = (error) => {
	if (error.message === 'Failed to fetch') {
		return M.toast({
			html: 'Can\'t connect to the internet or API request limit reached',
		});
	} else if (error.errorCode === 403) {
		return M.toast({html: '403 Cannot access the resource'});
	}
	return M.toast({html: error.message});
};
const getFavoriteTeams = async () => {
	try{
		const db = new DBService();
		await db.init()
		const database = await db.getAllTeams();
		setTimeout(() => {
			showFavorite(database)
		}, 1000);
	} catch (error) {
		handleError(error);
	}
};
const showFavorite = (database) => {
	let favoritesElement = document.getElementById('showFavorites');
	let bannerElement = document.getElementById('bannerContent');
	const totalFavorite = `${database.length} team${database.length > 1 ? 's' : ''}`

	bannerElement.innerHTML = `
	<span class="card-title truncate">Favorited Teams</span>
		<p>
			<span>You have favored</span>
				<b>${totalFavorite}</b>
		</p>`

	favoritesElement.innerHTML = `
	${database.map((item, index) => {
		return `
			<div key="${index}">
				<div class="card  team-card horizontal">
					<div class="card-image">
						<img 
							class="team-logo lazyload"
							src="${item.crestUrl.replace(/^http:\/\//i, 'https://')}"
							alt="${item.name} logo" 
						/>
					</div>
					<div class="card-stacked">
						<div class="team-content">
							<h5><b>${item.name}</b></h5>
							<h6>${item.shortName}/<b>${item.tla}</b></h6>
							<div style="margin: 5px 0">
								<span>founded</span>
								<span class="badge">${item.founded || '-'}</span>
							</div>
							<div style="margin: 5px 0">
								<small><i class="material-icons">public</i></small>
								<span class="badge">
									<a href=${item.website}>
										${item.website.replace(/(^\w+:|^)\/\//, '') || '-'}
									</a>
								</span>
							</div>
							<div style="margin: 5px 0">
								<small><i class="material-icons">event_seat</i></small>
								<span class="badge">${item.venue || '-'}</span>
							</div>
						</div>
						<div class="card-action">
							<a 
								id="delBtn"
								style="float: right;"
								data-id=${item.id}
								class="btn-floating waves-effect waves-light red" >
								<i class="large material-icons">clear</i>
							</a>
						</div>
					</div>
				</div>
			</div>
		`}).join("")
	}
	`
	initDeleteTeam(database);
};
const initDeleteTeam= (data) => {
	Array.from(document.querySelectorAll("#delBtn")).forEach(elem => {
		elem.addEventListener('click', async() => {
			const attrValue = elem.getAttribute('data-id');
			const team = data.find(t => t.id === Number(attrValue));
			const db = new DBService();
			await db.init();
			db.deleteTeam(Number(attrValue));
			M.toast({
				html: `${team.shortName} deleted from favorite`, 
				classes: 'rounded',
				completeCallback: function() {
					setTimeout(() => {
						getFavoriteTeams();
					}, 1000);
				}
				});
		})
	})
}