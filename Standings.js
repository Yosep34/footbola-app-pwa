import React, { Component } from 'react';
import spinner from '../../../src/loading.gif';
import api from '../../services/api';
import 'materialize-css/dist/css/materialize.min.css';
import './teamStyle.css';

class Standings extends Component {
	constructor(props) {
		super(props)
		
		this._isMounted = false;
		this.state = {
			 competition: [],
			 standings: [],
			 loading: true,
		}
		this.getStandingColor = this.getStandingColor.bind(this);
	}
	
	getStandingColor(param) {
		if(param === 1) {
			return 'orange lighten-1';
		} else if(param === 2) {
			return 'blue-grey lighten-1';
		} else if(param === 3) {
			return 'brown darken-1';
		} else{
			return 'indigo darken-1';
		}
	}

	componentDidMount() {
		this._isMounted = true;
		setTimeout(() => {
			this.setState({loading : false})
		}, 2000)
		api.getStandings(this.props.leagueId)
		.then(response => {
			this.setState({
				competition: response.data.competition,
				standings: response.data.standings[0].table
			})
		})
		.catch(error => {
			console.log(error);
		});
	}

	componentWillUnmount() {
		this._isMounted = false;
	}

	render() {
		let data;
		const { 
			loading, 
			standings, 
			competition,
		} = this.state;

		const updated = new Date(competition.lastUpdated);

		if (loading) {
			data =
			<div className="container center">
				<div style={{marginTop: "20%"}}>
					<img src={spinner} alt="Loading Spinner" />
				</div>
			</div>
		} else {
			data =
			<div>
				<div className="card banner red lighten-5">
					<div className="card-image">
						<img className="banner-logo" src={this.props.logo} alt="bundesliga logo"/>
					</div>
					<div className="card-content">
						<span className="card-title truncate">{competition.name}</span>
						<p>
							<span>Last Updated</span>
								<b style={{marginLeft: "0.5rem"}}>{updated.toDateString()}</b>
							<span className="badge white">{competition.area.name}</span>
						</p>
					</div>
				</div> 			
				<article className="standing-wrapper">
						{standings.map((item, index) => (
								<div
								key={index}
								>
									<div className="team-item waves-effect" >
										<img 
											src={item.team.crestUrl.replace(/^http:\/\//i, 'https://')}
											alt={`${item.team.name} logo`} 
										/>
										<div className="team-item-content">
											<span className={`badge ${this.getStandingColor(item.position)} white-text`}>
												{item.position}
											</span>
											<span>{item.team.name}</span>
										<hr />
											<div>
												<span className="stat cyan-text">
													{item.won}<span>won</span>
												</span>
												<span className="stat orange-text">
													{item.draw}<span>draw</span>
												</span>
												<span className="stat pink-text">
													{item.lost}<span>lost</span>
												</span>
												<span className="badge stat">
													{item.points}<span>pts</span>
												</span>
											</div>
										</div>
									</div>
								</div>
							))
						}
				</article>
			</div>
		}

		return (
			<div>
				{data}
			</div>
		)
	}
}

export default Standings;
