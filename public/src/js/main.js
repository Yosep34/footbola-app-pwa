
document.addEventListener('DOMContentLoaded', function(){
	const elems = document.querySelectorAll('.sidenav');
	M.Sidenav.init(elems);
	loadNav();

	function loadNav()
	{	document.querySelectorAll('.sidenav a')
		.forEach(function(element){
			element.addEventListener('click', function(event){	
				let page = event.target.getAttribute('href').substr(1);
				loadPage(page);

				switch(page) {
					case "serieA":
						getSerieA();
						break;
					case "bundesliga":
						getBundesligaLeague();
						break;
					case "premiereleague":
						getPremiereLeague();
						break;
					case "primeradivision":
						getPrimeraDivisionLeague();
						break;
					case "favorite":
						getFavoriteTeams();
						break;
				}
			});
		});
	}
	

	let page = window.location.hash.substr(1);
	if(page === '') page = 'home';
	loadPage(page);

	function loadPage(page)
	{
		let xhttp = new XMLHttpRequest();
		xhttp.onreadystatechange = function() {
			if (this.readyState === 4){
				let content = document.querySelector("#content");
				if(this.status === 200) {
					content.innerHTML = xhttp.responseText;
					switch(page) {
						case "home":
							break;
						case "serieA":
							getSerieA();
							break;
						case "bundesliga":
							getBundesligaLeague();
							break;
						case "premiereleague":
							getPremiereLeague();
							break;
						case "primeradivision":
							getPrimeraDivisionLeague();
							break;
						case "favorite":
							getFavoriteTeams();
						break;
					}
				} else if(this.status === 404) {
					content.innerHTML = `
					<h3 class="indigo-text center  text-darken-4">Upss...Something went wrong.</h>
					<h5 class="indigo-text center  text-darken-4">Page not Found</h5>`;
				} else {
					content.innerHTML = `
					<h3 class="indigo-text center  text-darken-4">Upss...Something went wrong.</h3>
					<h5 class="indigo-text center  text-darken-4">This Page cannot be accessed, check your connection or refresh the page</h5>`;
				}
			}
		};
		xhttp.open("GET", `pages/${page}.html`, true);
		xhttp.send();
	}
});


