const baseUrl = 'https://api.football-data.org/v2/';
const apiKey = 'bb5e198850fd4c6e96b02121412554e8';
const serieA = `${baseUrl}competitions/2019/teams`;
const bundesliga = `${baseUrl}competitions/2002/teams`;
const premiereLeague = `${baseUrl}competitions/2021/teams`;
const primeraDivision = `${baseUrl}competitions/2014/teams`;

const fetchAPI = url => {
	return fetch(url, {
		method: "GET",
		headers: {
			'X-Auth-Token': apiKey
		},
	})
	.then(res => {
			if (res.status !== 200) {
					console.log("Error: " + res.status);
					return Promise.reject(new Error(res.statusText));
			} else {
					return Promise.resolve(res);
			}
	})
	.then(res => res.json())
	.catch(error => {
			console.log(error)
	})
};
const getSerieA = () => {
	if ("caches" in window) {
		caches.match(serieA).then(function (response) {
				if (response) {
						response.json().then(function (data) {
								setTimeout(() => {
										showTeams(data);
								}, 1000);
						})
				}
		})
	};
	fetchAPI(serieA)
		.then(data => {
			setTimeout(() => {
				showTeams(data);
			}, 1000)
		})
		.catch(error => {
			console.log(error);
		})
};
const getBundesligaLeague = () => {
	if ("caches" in window) {
		caches.match(bundesliga).then(function (response) {
				if (response) {
						response.json().then(function (data) {
								setTimeout(() => {
										showTeams(data);
								}, 1000);
						})
				}
		})
	};
	fetchAPI(bundesliga)
		.then(data => {
			setTimeout(() => {
				showTeams(data);
			}, 1000)
		})
		.catch(error => {
			console.log(error);
		})
};
const getPremiereLeague = () => {
	if ("caches" in window) {
		caches.match(premiereLeague).then(function (response) {
				if (response) {
						response.json().then(function (data) {
								setTimeout(() => {
									showTeams(data);
								}, 1000);
						})
				}
		})
	};
	fetchAPI(premiereLeague)
		.then(data => {
			setTimeout(() => {
				showTeams(data);
			}, 1000)
		})
		.catch(error => {
			console.log(error);
		})
};
const getPrimeraDivisionLeague = () => {
	if ("caches" in window) {
		caches.match(primeraDivision).then(function (response) {
				if (response) {
						response.json().then(function (data) {
							setTimeout(() => {
								showTeams(data);
						}, 1000);
						})
				}
		})
	};
	fetchAPI(primeraDivision)
		.then(data => {
			setTimeout(() => {
				showTeams(data);
			}, 1000)
		})
		.catch(error => {
			console.log(error);
		})
};
const showTeams = (data) => {
	let teamsElement = document.getElementById('showTeams');
	let bannerElement = document.getElementById('bannerContent');
	const competition = data.competition;
	const teams = data.teams;
	const updated = new Date(competition.lastUpdated).toDateString();
	
	// loadingElement = document.getElementById("loading");

	bannerElement.innerHTML = `
	<span class="card-title truncate">${competition.name}</span>
	<p>
		<span>Last Updated</span>
			<b>${updated}</b>
		<span class="badge indigo white-text">${competition.area.name}</span>
	</p>
`
	teamsElement.innerHTML = `
	${teams.map((item, index) => {
		return `
		<div key="${index}">
			<div class="card  team-card horizontal">
				<div class="card-image">
					<img 
						class="team-logo lazyload"
						src="/assets/football.png"
						data-src="${item.crestUrl.replace(/^http:\/\//i, 'https://')}"
						alt="${item.name} logo" 
						onerror="this.src = '/icons/logo192.png'"
					/>
				</div>
				<div class="card-stacked">
					<div class="team-content">
						<h5><b>${item.name}</b></h5>
						<h6>${item.shortName}/<b>${item.tla}</b></h6>
						<div style="margin: 5px 0">
							<span>founded</span>
							<span class="badge indigo white-text">${item.founded || '-'}</span>
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
							id="favBtn"
							style="float: right;"
							data-id=${item.id}
							class="btn-floating waves-effect waves-light red" >
							<i class="large material-icons">favorite</i>
						</a>
					</div>
				</div>
			</div>
		</div>
			`
		}).join("")
	}
	`
	
	checkFavorite(teams);
	initFavBtn(teams);
};

// Check if teams has been favored
const checkFavorite = async () => {
	Array.from(document.querySelectorAll('#favBtn')).forEach(async (elem) => {
		const attrValue = elem.getAttribute('data-id');
		const db = new DBService();
		await db.init();
		const database = await db.getAllTeams();
		const contains = database.find(v => v.id === Number(attrValue));
		if (contains) {
			elem.classList.add('disabled')
		}
	})
}
//  Save to Favorite
const initFavBtn = (data) => {
	Array.from(document.querySelectorAll('#favBtn')).forEach(element => {
		element.addEventListener('click', async (event) => {
			const attrValue = element.getAttribute('data-id');
			const team = data.find(t => t.id === Number(attrValue));
			const db = new DBService();
			await db.init();
			db.putTeam(team);
			M.toast({
				html: `${team.shortName} added to your favorite`,
				classes: 'rounded'
			});
			element.classList.add('disabled')
		});
	});	
};

