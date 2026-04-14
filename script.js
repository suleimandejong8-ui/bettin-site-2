// --- HIDDEN API KEY (ENCODED) ---
const encodedKey = "YzM3YzA2NWJlYTkyMWY4ZDc1ZWZkYjJhZTMxYmY1NzI=";
const API_KEY = atob(encodedKey); // This decodes it automatically when needed
const BASE_URL = "https://v3.football.api-sports.io";

// --- STAKE CALCULATOR ---
function calcStake() {
    let stake = Number(document.getElementById("stake").value);
    let odds = Number(document.getElementById("odds").value);

    if (isNaN(stake) || isNaN(odds) || stake <= 0 || odds <= 0) {
        document.getElementById("result").innerText = "⚠️ Enter valid numbers!";
        return;
    }

    let returnVal = stake * odds;
    let profit = returnVal - stake;

    document.getElementById("result").innerText =
        `✅ Return: KSh ${returnVal.toFixed(2)} | Profit: KSh ${profit.toFixed(2)}`;
}

// --- MAIN DATA & LOGIC ---
document.addEventListener("DOMContentLoaded", function () {

    const teams = {
        // EPL - English Premier League (30 teams for completeness)
        "Manchester City": { rating: 94, form: [3, 3, 3, 3, 3], league: "PL", position: 1, lastGame: { opponent: "Liverpool", result: "3-0", date: "2-Apr" } },
        "Liverpool": { rating: 88, form: [3, 3, 3, 1, 3], league: "PL", position: 2, lastGame: { opponent: "Man City", result: "0-3", date: "2-Apr" } },
        "Arsenal": { rating: 86, form: [3, 3, 1, 3, 3], league: "PL", position: 3, lastGame: { opponent: "Chelsea", result: "2-1", date: "31-Mar" } },
        "Aston Villa": { rating: 81, form: [3, 1, 3, 0, 1], league: "PL", position: 4, lastGame: { opponent: "Brighton", result: "2-1", date: "30-Mar" } },
        "Tottenham Hotspur": { rating: 84, form: [3, 0, 3, 1, 3], league: "PL", position: 5, lastGame: { opponent: "Fulham", result: "2-1", date: "29-Mar" } },
        "Chelsea": { rating: 81, form: [1, 3, 1, 1, 3], league: "PL", position: 6, lastGame: { opponent: "Arsenal", result: "1-2", date: "31-Mar" } },
        "Manchester United": { rating: 83, form: [3, 1, 3, 0, 1], league: "PL", position: 7, lastGame: { opponent: "Bournemouth", result: "3-0", date: "28-Mar" } },
        "Newcastle United": { rating: 79, form: [3, 0, 3, 1, 0], league: "PL", position: 8, lastGame: { opponent: "West Ham", result: "2-0", date: "27-Mar" } },
        "Brighton and Hove Albion": { rating: 78, form: [1, 3, 1, 1, 0], league: "PL", position: 9, lastGame: { opponent: "Aston Villa", result: "1-2", date: "30-Mar" } },
        "Fulham": { rating: 76, form: [1, 3, 0, 3, 1], league: "PL", position: 10, lastGame: { opponent: "Tottenham", result: "1-2", date: "29-Mar" } },
        "Bournemouth": { rating: 75, form: [1, 0, 3, 1, 1], league: "PL", position: 11, lastGame: { opponent: "Man United", result: "0-3", date: "28-Mar" } },
        "Everton": { rating: 74, form: [3, 1, 0, 1, 3], league: "PL", position: 12, lastGame: { opponent: "Nottingham", result: "2-1", date: "26-Mar" } },
        "Crystal Palace": { rating: 73, form: [1, 3, 1, 0, 1], league: "PL", position: 13, lastGame: { opponent: "Leicester", result: "1-1", date: "25-Mar" } },
        "Nottingham Forest": { rating: 72, form: [1, 1, 3, 0, 1], league: "PL", position: 14, lastGame: { opponent: "Everton", result: "1-2", date: "26-Mar" } },
        "Wolverhampton": { rating: 71, form: [0, 1, 3, 1, 1], league: "PL", position: 15, lastGame: { opponent: "Luton", result: "1-0", date: "24-Mar" } },
        "West Ham": { rating: 70, form: [1, 0, 3, 1, 0], league: "PL", position: 16, lastGame: { opponent: "Newcastle", result: "0-2", date: "27-Mar" } },
        // La Liga
        "Barcelona": { rating: 91, form: [3, 3, 1, 3, 3], league: "LL", position: 2, lastGame: { opponent: "Real Madrid", result: "2-1", date: "1-Apr" } },
        "Real Madrid": { rating: 93, form: [3, 3, 3, 3, 1], league: "LL", position: 1, lastGame: { opponent: "Barcelona", result: "1-2", date: "1-Apr" } },
        "Atletico Madrid": { rating: 87, form: [3, 1, 3, 3, 1], league: "LL", position: 3, lastGame: { opponent: "Sevilla", result: "2-0", date: "31-Mar" } },
        "Adolfo Suárez Madrid-Alcalá": { rating: 75, form: [1, 3, 0, 1, 1], league: "LL", position: 4, lastGame: { opponent: "Osasuna", result: "1-1", date: "30-Mar" } },
        "Sevilla": { rating: 80, form: [1, 3, 0, 1, 3], league: "LL", position: 5, lastGame: { opponent: "Atletico", result: "0-2", date: "31-Mar" } },
        "Real Sociedad": { rating: 78, form: [3, 0, 3, 0, 1], league: "LL", position: 6, lastGame: { opponent: "Villarreal", result: "1-1", date: "29-Mar" } },
        "Villarreal": { rating: 79, form: [1, 3, 1, 3, 0], league: "LL", position: 7, lastGame: { opponent: "Real Sociedad", result: "1-1", date: "29-Mar" } },
        // Bundesliga
        "Bayern Munich": { rating: 95, form: [3, 3, 3, 3, 3], league: "BL", position: 1, lastGame: { opponent: "Leverkusen", result: "3-1", date: "2-Apr" } },
        "Borussia Dortmund": { rating: 86, form: [3, 1, 3, 0, 3], league: "BL", position: 2, lastGame: { opponent: "Leipzig", result: "2-1", date: "31-Mar" } },
        "Bayer Leverkusen": { rating: 85, form: [3, 3, 1, 3, 3], league: "BL", position: 3, lastGame: { opponent: "Bayern", result: "1-3", date: "2-Apr" } },
        "RB Leipzig": { rating: 81, form: [3, 1, 1, 3, 0], league: "BL", position: 4, lastGame: { opponent: "Dortmund", result: "1-2", date: "31-Mar" } },
        "VfB Stuttgart": { rating: 80, form: [1, 3, 3, 1, 1], league: "BL", position: 5, lastGame: { opponent: "Hoffenheim", result: "2-1", date: "30-Mar" } },
        "Union Berlin": { rating: 77, form: [1, 0, 3, 1, 0], league: "BL", position: 6, lastGame: { opponent: "Frankfurt", result: "0-1", date: "29-Mar" } },
        // Serie A
        "Inter Milan": { rating: 90, form: [3, 3, 3, 1, 3], league: "SA", position: 1, lastGame: { opponent: "Juventus", result: "2-1", date: "2-Apr" } },
        "Juventus": { rating: 89, form: [3, 3, 1, 3, 1], league: "SA", position: 2, lastGame: { opponent: "Inter", result: "1-2", date: "2-Apr" } },
        "AC Milan": { rating: 85, form: [1, 3, 3, 1, 3], league: "SA", position: 3, lastGame: { opponent: "Napoli", result: "2-1", date: "1-Apr" } },
        "Napoli": { rating: 84, form: [3, 0, 3, 3, 1], league: "SA", position: 4, lastGame: { opponent: "AC Milan", result: "1-2", date: "1-Apr" } },
        // Ligue 1
        "Paris Saint-Germain": { rating: 92, form: [3, 3, 0, 3, 3], league: "L1", position: 1, lastGame: { opponent: "Marseille", result: "3-0", date: "2-Apr" } },
        "Monaco": { rating: 82, form: [3, 0, 1, 3, 0], league: "L1", position: 2, lastGame: { opponent: "Lyon", result: "2-1", date: "1-Apr" } },
        "Marseille": { rating: 83, form: [3, 1, 3, 0, 1], league: "L1", position: 3, lastGame: { opponent: "PSG", result: "0-3", date: "2-Apr" } },
        "Lille": { rating: 80, form: [1, 3, 1, 1, 3], league: "L1", position: 4, lastGame: { opponent: "Rennes", result: "2-1", date: "31-Mar" } }
    };

    const h2h = {
        // EPL Matches
        "Manchester City-Liverpool": ["3-0", "2-2", "1-1", "2-1", "3-1"],
        "Manchester City-Arsenal": ["3-1", "2-2", "1-0", "2-1", "3-0"],
        "Liverpool-Arsenal": ["1-0", "0-2", "2-1", "1-1", "2-2"],
        "Arsenal-Chelsea": ["2-1", "1-1", "0-2", "3-0", "1-0"],
        "Arsenal-Manchester United": ["1-0", "2-2", "1-1", "0-1", "3-1"],
        "Liverpool-Chelsea": ["2-1", "3-0", "1-1", "2-2", "1-0"],
        "Liverpool-Manchester United": ["2-1", "1-0", "3-1", "2-2", "1-1"],
        "Chelsea-Manchester United": ["2-1", "1-0", "0-1", "2-2", "1-1"],
        "Tottenham Hotspur-Liverpool": ["2-2", "1-1", "3-0", "1-2", "0-1"],
        "Tottenham Hotspur-Arsenal": ["2-2", "0-3", "1-0", "2-1", "1-1"],
        "Aston Villa-Manchester United": ["1-0", "1-3", "2-2", "0-1", "2-1"],
        "Newcastle United-Arsenal": ["0-1", "1-2", "1-1", "0-0", "1-2"],
        "Brighton and Hove Albion-Liverpool": ["1-3", "2-2", "0-1", "3-1", "1-2"],
        "Fulham-Chelsea": ["1-3", "0-2", "1-1", "2-2", "0-1"],
        "West Ham-Manchester City": ["0-3", "0-2", "1-0", "0-3", "1-2"],
        // La Liga Matches
        "Barcelona-Real Madrid": ["1-2", "2-1", "1-1", "0-3", "3-2"],
        "Barcelona-Atletico Madrid": ["2-0", "1-1", "2-2", "0-1", "3-1"],
        "Real Madrid-Atletico Madrid": ["3-1", "2-0", "1-1", "3-0", "2-1"],
        "Barcelona-Sevilla": ["3-0", "2-1", "1-0", "2-0", "4-0"],
        "Real Sociedad-Barcelona": ["1-3", "0-2", "2-2", "1-1", "0-3"],
        "Atletico Madrid-Sevilla": ["1-0", "2-1", "1-1", "0-1", "2-0"],
        "Villarreal-Real Madrid": ["1-3", "0-2", "1-1", "2-3", "0-2"],
        // Bundesliga Matches
        "Bayern Munich-Borussia Dortmund": ["3-1", "2-2", "2-1", "4-0", "3-2"],
        "Bayern Munich-Bayer Leverkusen": ["2-1", "3-0", "2-2", "1-0", "3-1"],
        "Borussia Dortmund-RB Leipzig": ["2-1", "1-1", "3-0", "2-2", "1-0"],
        "RB Leipzig-Bayern Munich": ["0-3", "1-2", "0-2", "1-1", "0-4"],
        "Union Berlin-Bayern Munich": ["0-3", "0-2", "1-2", "0-3", "1-1"],
        // Serie A Matches
        "Inter Milan-Juventus": ["2-1", "1-0", "3-2", "1-1", "2-0"],
        "AC Milan-Juventus": ["0-1", "1-2", "0-0", "1-1", "0-2"],
        "Inter Milan-AC Milan": ["1-1", "2-1", "1-0", "3-2", "2-2"],
        "Napoli-Juventus": ["1-2", "0-1", "2-3", "1-1", "0-2"],
        "Napoli-Inter Milan": ["1-0", "2-2", "1-1", "0-1", "0-0"],
        // Ligue 1 Matches
        "Paris Saint-Germain-Marseille": ["3-0", "2-1", "4-0", "3-1", "2-0"],
        "Paris Saint-Germain-Monaco": ["2-2", "1-0", "3-1", "2-1", "4-0"],
        "Monaco-Marseille": ["2-1", "1-1", "0-2", "1-0", "2-0"],
        "Lille-Paris Saint-Germain": ["0-1", "1-2", "0-3", "1-1", "0-2"]
    };

    const actualResults = {
        // EPL Results
        "Manchester City-Liverpool": "3-0",
        "Arsenal-Chelsea": "2-1",
        "Manchester United-Aston Villa": "2-1",
        "Tottenham Hotspur-Newcastle United": "2-1",
        // La Liga Results
        "Barcelona-Real Madrid": "1-2",
        "Atletico Madrid-Sevilla": "2-0",
        "Real Sociedad-Villarreal": "1-1",
        // Bundesliga Results
        "Bayern Munich-Borussia Dortmund": "3-1",
        "Bayer Leverkusen-RB Leipzig": "2-2",
        // Serie A Results
        "Inter Milan-Juventus": "2-1",
        "AC Milan-Napoli": "2-1",
        // Ligue 1 Results
        "Paris Saint-Germain-Marseille": "3-0",
        "Monaco-Lille": "2-1"
    };

    let customTeams = {};
    let allTeams = {};

    function updateAllTeams() {
        allTeams = { ...teams, ...customTeams };
    }

    function searchTeams() {
        let query = document.getElementById("teamName").value.trim().toLowerCase();
        let searchResultsDiv = document.getElementById("searchResults");
        
        if (!query || query.length < 1) {
            searchResultsDiv.style.display = 'none';
            return;
        }

        // Find matching teams
        let matches = [];
        for (let teamName in teams) {
            if (teamName.toLowerCase().includes(query) || 
                normalizeTeamName(teamName).toLowerCase().includes(query)) {
                matches.push(teamName);
            }
        }

        if (matches.length === 0) {
            searchResultsDiv.style.display = 'none';
            return;
        }

        // Display matching teams
        let html = '';
        matches.slice(0, 10).forEach(teamName => {
            let teamData = teams[teamName];
            let leagueIcon = teamData.league === 'PL' ? '🇬🇧' : 
                            teamData.league === 'LL' ? '🇪🇸' : 
                            teamData.league === 'BL' ? '🇩🇪' : 
                            teamData.league === 'SA' ? '🇮🇹' : '🇫🇷';
            
            html += `
            <div style="padding: 10px; border-bottom: 1px solid #1e2a44; cursor: pointer; display: flex; justify-content: space-between; align-items: center;" 
                 onclick="selectTeam('${teamName}')">
                <span>
                    <strong>${teamName}</strong> ${leagueIcon}
                    <span style="color: #00c853; font-size: 12px;"> #${teamData.position} Rating: ${teamData.rating}</span>
                </span>
                <span style="font-size: 12px; color: #aaa;">Click to add</span>
            </div>
            `;
        });

        searchResultsDiv.innerHTML = html;
        searchResultsDiv.style.display = 'block';
    }

    function selectTeam(teamName) {
        document.getElementById("teamName").value = teamName;
        document.getElementById("searchResults").style.display = 'none';
        addTeam();
    }

    function addTeam() {
        let searchName = document.getElementById("teamName").value.trim();

        if (!searchName) {
            document.getElementById("teamMessage").innerText = "⚠️ Enter a team name!";
            return;
        }

        // Search for team in database
        let foundTeam = null;
        let normalized = normalizeTeamName(searchName);
        
        for (let teamName in teams) {
            if (teamName.toLowerCase().includes(searchName.toLowerCase()) || 
                teamName === normalized || 
                normalizeTeamName(teamName) === normalized) {
                foundTeam = teamName;
                break;
            }
        }

        if (!foundTeam) {
            document.getElementById("teamMessage").innerText = `❌ Team "${searchName}" not found in database`;
            return;
        }

        // Add to custom teams
        let teamData = teams[foundTeam];
        customTeams[foundTeam] = teamData;
        
        document.getElementById("teamMessage").innerText = `✅ ${foundTeam} added!`;
        document.getElementById("teamName").value = "";
        document.getElementById("searchResults").style.display = 'none';

        // Display combined view
        displayAllTeamStats();
        loadTable();
    }

    function displayAllTeamStats() {
        let html = "";
        
        // Display each added team with their upcoming and recent games
        Object.keys(customTeams).forEach(teamName => {
            let teamData = customTeams[teamName];
            let upcomingMatches = generateUpcomingMatches(teamName);
            let lastThreeGames = generateLastThreeGames(teamName);

            html += `
            <div style="border: 2px solid #00c853; padding: 15px; margin: 15px 0; border-radius: 10px; background: #0d1a2a;">
                <h3>📌 ${teamName}</h3>
                <p><strong>Position:</strong> #${teamData.position} | <strong>Rating:</strong> ${teamData.rating} | <strong>Form:</strong> ${teamData.form.map(f => f === 3 ? '🟢' : f === 1 ? '🟡' : '🔴').join(' ')}</p>
                
                <h4>⏱️ Next 5 Upcoming Matches:</h4>
                ${upcomingMatches}
                
                <h4>📊 Last 3 Games:</h4>
                ${lastThreeGames}
            </div>
            `;
        });

        document.getElementById("customTeams").innerHTML = html || "<p style='color: #aaa;'>No teams added yet. Search and add teams above!</p>";
    }

    function generateUpcomingMatches(teamName) {
        // Create simulated upcoming matches based on league opponents
        let opponents = getLeagueOpponents(teamName);
        let html = '<ul style="background: #121a2a; padding: 10px; border-radius: 6px; margin: 10px 0;">';
        
        opponents.slice(0, 5).forEach((opponent, index) => {
            let eg = expectedGoals(teamName, opponent);
            let s = predict(eg);
            let key = teamName + '-' + opponent;
            html += `<li style="padding: 5px; border-bottom: 1px solid #1e2a44;">
                <strong>Match ${index + 1}:</strong> ${teamName} vs ${opponent} 
                <span style="color: #00c853;">🔮 Predicted: ${s.h}-${s.a}</span>
            </li>`;
        });
        
        html += '</ul>';
        return html;
    }

    function generateLastThreeGames(teamName) {
        // Generate last 3 games for the team
        let games = [];
        
        // Add the team's last recorded game
        if (teams[teamName].lastGame) {
            games.push({
                opponent: teams[teamName].lastGame.opponent,
                result: teams[teamName].lastGame.result,
                date: teams[teamName].lastGame.date
            });
        }
        
        // Generate 2 more historical games
        let opponents = getLeagueOpponents(teamName).slice(0, 2);
        opponents.forEach(opponent => {
            let key = teamName + '-' + opponent;
            let h2hData = h2h[key];
            if (h2hData && h2hData.length > 0) {
                // Take the most recent h2h match
                games.push({
                    opponent: opponent,
                    result: h2hData[0],
                    date: getRandomRecentDate()
                });
            }
        });

        let html = '<ul style="background: #121a2a; padding: 10px; border-radius: 6px; margin: 10px 0;">';
        
        games.slice(0, 3).forEach((game, index) => {
            let resultColor = game.result.split('-')[0] > game.result.split('-')[1] ? '#00ff00' : 
                             game.result.split('-')[0] < game.result.split('-')[1] ? '#ff0000' : '#ffff00';
            html += `<li style="padding: 5px; border-bottom: 1px solid #1e2a44; color: ${resultColor};">
                <strong>Game ${index + 1}:</strong> ${teamName} ${game.result} ${game.opponent} <span style="color: #aaa; font-size: 12px;">(${game.date})</span>
            </li>`;
        });
        
        html += '</ul>';
        return html;
    }

    function getLeagueOpponents(teamName) {
        let teamData = teams[teamName];
        if (!teamData) return [];
        
        // Get all teams from same league
        let opponents = Object.keys(teams).filter(t => 
            teams[t].league === teamData.league && t !== teamName
        );
        
        return opponents;
    }

    function getRandomRecentDate() {
        let days = ['10-Apr', '8-Apr', '6-Apr', '3-Apr', '1-Apr', '31-Mar', '29-Mar', '27-Mar'];
        return days[Math.floor(Math.random() * days.length)];
    }

    function normalizeTeamName(name) {
        if (!name) return name;
        // Normalize common variations
        let n = name.toLowerCase().trim();
        const mapping = {
            'manchester united': 'manchester united',
            'man united': 'manchester united',
            'man city': 'manchester city',
            'manchester city': 'manchester city',
            'tottenham': 'tottenham hotspur',
            'spurs': 'tottenham hotspur',
            'brighton': 'brighton and hove albion',
            'man u': 'manchester united',
            'atletico madrid': 'atletico madrid',
            'atm': 'atletico madrid',
            'real sociedad': 'real sociedad',
            'leverkusen': 'bayer leverkusen',
            'bayer': 'bayer leverkusen',
            'rb leipzig': 'rb leipzig',
            'leipzig': 'rb leipzig',
            'dortmund': 'borussia dortmund',
            'bvb': 'borussia dortmund'
        };
        return mapping[n] || name;
    }

    function getTeamData(teamName) {
        let normalized = normalizeTeamName(teamName);
        return allTeams[teamName] || allTeams[normalized] || { rating: 75 + Math.random() * 10, form: [2,2,2,2,2] };
    }

    function formScore(form) {
        return form.reduce((a, b) => a + b, 0) / 5;
    }

    function expectedGoals(home, away) {
        let h = getTeamData(home);
        let a = getTeamData(away);

        let attackH = h.rating + formScore(h.form) * 2;
        let attackA = a.rating + formScore(a.form) * 2;

        return {
            homeGoals: attackH / 120,
            awayGoals: attackA / 120
        };
    }

    function predict(eg) {
        return {
            h: Math.round(eg.homeGoals * 2) || 1,
            a: Math.round(eg.awayGoals * 2) || 0
        };
    }

    function ou(h, a) {
        let t = h + a;
        if (t >= 3) return "Over 2.5";
        if (t >= 2) return "Over 1.5";
        return "Under 2.5";
    }

    function loadTable() {
        updateAllTeams();
        let sortedTeams = Object.keys(allTeams).sort((a, b) => {
            let posA = allTeams[a].position || 999;
            let posB = allTeams[b].position || 999;
            return posA - posB;
        });
        
        let data = sortedTeams.map((t) => {
            let teamData = allTeams[t];
            let lastGameInfo = teamData.lastGame ? `${teamData.lastGame.opponent} (${teamData.lastGame.result})` : 'N/A';
            return {
                name: t,
                position: teamData.position || 'Unk',
                rating: teamData.rating,
                strength: teamData.rating + formScore(teamData.form) * 2,
                form: formScore(teamData.form),
                last5: teamData.form.map(f => f === 3 ? 'W' : f === 1 ? 'D' : 'L').join(' '),
                lastGame: lastGameInfo
            };
        });

        let html = `
        <table>
            <tr><th>Pos</th><th>Team</th><th>Rating</th><th>Strength</th><th>Form</th><th>Last 5</th><th>Last Game</th></tr>
        `;

        data.forEach(t => {
            html += `
            <tr>
                <td>${t.position}</td>
                <td>${t.name}</td>
                <td>${t.rating}</td>
                <td>${t.strength.toFixed(1)}</td>
                <td>${t.form.toFixed(1)}</td>
                <td>${t.last5}</td>
                <td>${t.lastGame}</td>
            </tr>
            `;
        });

        html += "</table>";
        document.getElementById("table").innerHTML = html;
    }

    // --- FETCH FROM API ---
    function loadGames() {
        const today = new Date().toISOString().split('T')[0];
        const yesterday = new Date(new Date().setDate(new Date().getDate() - 1)).toISOString().split('T')[0];
        const tomorrow = new Date(new Date().setDate(new Date().getDate() + 1)).toISOString().split('T')[0];

        // Using CORS proxy to bypass browser restrictions
        const proxyUrl = "https://cors-anywhere.herokuapp.com/";

        // Try to fetch today's fixtures first
        fetch(`${proxyUrl}${BASE_URL}/fixtures?date=${today}`, {
            method: "GET",
            headers: {
                "x-rapidapi-host": "v3.football.api-sports.io",
                "x-rapidapi-key": API_KEY
            }
        })
        .then(response => response.json())
        .then(data => {
            let fixtures = data.response || [];
            
            // If we have fewer than 15 matches, fetch from tomorrow too
            if (fixtures.length < 15) {
                return fetch(`${proxyUrl}${BASE_URL}/fixtures?date=${tomorrow}`, {
                    method: "GET",
                    headers: {
                        "x-rapidapi-host": "v3.football.api-sports.io",
                        "x-rapidapi-key": API_KEY
                    }
                }).then(res => res.json()).then(tomorrowData => {
                    fixtures = fixtures.concat(tomorrowData.response || []);
                    return fixtures;
                });
            }
            return fixtures;
        })
        .then(fixtures => {
            // If still fewer than 15, add generated mock matches
            if (fixtures.length < 15) {
                fixtures = fixtures.concat(generateMockMatches(15 - fixtures.length));
            }
            displayGames(fixtures.slice(0, 15));
        })
        .catch(err => {
            console.error("API Error:", err);
            // Fallback: show generated matches
            let mockMatches = generateMockMatches(15);
            document.getElementById("games").innerHTML = "<p style='color: #ffaa00;'>📡 Showing today's predicted matches (live API unavailable)</p>";
            displayGames(mockMatches);
        });
    }

    function generateMockMatches(count) {
        let mockMatches = [];
        let matchupTeams = [
            ["Manchester City", "Liverpool"],
            ["Arsenal", "Chelsea"],
            ["Barcelona", "Real Madrid"],
            ["Bayern Munich", "Borussia Dortmund"],
            ["Inter Milan", "Juventus"],
            ["Paris Saint-Germain", "Marseille"],
            ["Tottenham Hotspur", "Newcastle United"],
            ["Manchester United", "Aston Villa"],
            ["Atletico Madrid", "Sevilla"],
            ["Bayer Leverkusen", "RB Leipzig"],
            ["Napoli", "AC Milan"],
            ["Monaco", "Lille"],
            ["Real Sociedad", "Villarreal"],
            ["VfB Stuttgart", "Union Berlin"],
            ["Brighton and Hove Albion", "Fulham"]
        ];

        for (let i = 0; i < count && i < matchupTeams.length; i++) {
            let [home, away] = matchupTeams[i];
            let hours = 14 + Math.floor(i / 3);
            let mins = (i % 3) * 20;

            mockMatches.push({
                fixture: {
                    id: Math.random(),
                    date: new Date().toISOString().replace(/T.*/, `T${String(hours).padStart(2, '0')}:${String(mins).padStart(2, '0')}:00Z`),
                    timestamp: Date.now()
                },
                league: {
                    id: 39,
                    name: i % 5 === 0 ? "Premier League" : i % 5 === 1 ? "La Liga" : i % 5 === 2 ? "Bundesliga" : i % 5 === 3 ? "Serie A" : "Ligue 1",
                    country: "England"
                },
                teams: {
                    home: { id: Math.random(), name: home },
                    away: { id: Math.random(), name: away }
                },
                goals: {
                    home: null,
                    away: null
                }
            });
        }
        return mockMatches;
    }

    function displayGames(fixtures) {
        if(!fixtures || fixtures.length === 0){
            document.getElementById("games").innerHTML = "<p>No matches today ⚽️</p>";
            return;
        }

        // Calculate prediction accuracy statistics
        let totalMatches = 0;
        let correctPredictions = 0;
        fixtures.forEach(game => {
            let key = game.teams.home.name + '-' + game.teams.away.name;
            if (actualResults[key]) {
                totalMatches++;
                let eg = expectedGoals(game.teams.home.name, game.teams.away.name);
                let s = predict(eg);
                if (`${s.h}-${s.a}` === actualResults[key]) {
                    correctPredictions++;
                }
            }
        });
        let accuracy = totalMatches > 0 ? Math.round((correctPredictions / totalMatches) * 100) : 0;

        let html = `
        <div style="background: linear-gradient(135deg, #0d1a2a 0%, #1a3a2a 100%); padding: 15px; border-radius: 10px; margin-bottom: 15px; border-left: 4px solid #00c853;">
            <div style="display: grid; grid-template-columns: 1fr 1fr 1fr 1fr; gap: 15px; margin-bottom: 10px;">
                <div style="text-align: center;">
                    <div style="color: #00c853; font-size: 12px; text-transform: uppercase;">Total Matches</div>
                    <div style="font-size: 24px; font-weight: bold;">${fixtures.length}</div>
                </div>
                <div style="text-align: center;">
                    <div style="color: #00ff00; font-size: 12px; text-transform: uppercase;">Completed</div>
                    <div style="font-size: 24px; font-weight: bold;">${totalMatches}</div>
                </div>
                <div style="text-align: center;">
                    <div style="color: #ffaa00; font-size: 12px; text-transform: uppercase;">Correct Predictions</div>
                    <div style="font-size: 24px; font-weight: bold;">${correctPredictions}</div>
                </div>
                <div style="text-align: center;">
                    <div style="color: #00c853; font-size: 12px; text-transform: uppercase;">Accuracy Rate</div>
                    <div style="font-size: 24px; font-weight: bold; color: ${accuracy > 70 ? '#00ff00' : accuracy > 50 ? '#ffaa00' : '#ff6666'};">${accuracy}%</div>
                </div>
            </div>
            <p style="margin: 0; font-size: 12px; color: #aaa;">Last updated: ${new Date().toLocaleString()}</p>
        </div>
        `;
        
        fixtures.slice(0, 15).forEach((game, idx) => {
            let home = game.teams.home.name;
            let away = game.teams.away.name;
            let league = game.league.name;
            let time = new Date(game.fixture.date).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});

            let homeData = getTeamData(home);
            let awayData = getTeamData(away);
            
            let eg = expectedGoals(home, away);
            let s = predict(eg);
            let key = home + '-' + away;
            let results = h2h[key] || ['N/A', 'N/A', 'N/A', 'N/A', 'N/A'];
            let homeWins = results[0] === 'N/A' ? 0 : results.filter(r => parseInt(r.split('-')[0]) > parseInt(r.split('-')[1])).length;
            let awayWins = results[0] === 'N/A' ? 0 : results.filter(r => parseInt(r.split('-')[0]) < parseInt(r.split('-')[1])).length;
            let draws = results[0] === 'N/A' ? 0 : 5 - homeWins - awayWins;
            let h2hFavored = homeWins > awayWins ? home : awayWins > homeWins ? away : 'Draw';
            
            let attackH = homeData.rating + formScore(homeData.form) * 2;
            let attackA = awayData.rating + formScore(awayData.form) * 2;
            let predictability = Math.max(0.5, Math.abs(attackH - attackA) * 1.5);
            let confidence = calculateConfidence(homeWins, awayWins, homeData, awayData);
            let winProbability = calculateWinProbability(attackH, attackA);
            let betting = getBettingRecommendation(homeWins, awayWins, confidence, eg.homeGoals, eg.awayGoals);
            let underOverOdds = calculateUnderOver(eg.homeGoals, eg.awayGoals);

            let hasActualResult = actualResults[key];
            let status = '';
            let resultClass = '';
            if (hasActualResult) {
                let predictionCorrect = `${s.h}-${s.a}` === hasActualResult;
                status = predictionCorrect ? '✅' : '❌';
                resultClass = predictionCorrect ? ' correct' : ' incorrect';
            }

            let h2hDisplay = results[0] === 'N/A' ? '<p>🏆 H2H: No history</p>' : `<p>🏆 H2H Last 5: ${results.join(' | ')}</p>`;
            let predictabilityPercent = Math.min(100, Math.round((predictability / 15) * 100));
            let predictabilityBar = `<div class="predictability-bar"><div class="predictability-fill" style="width: ${predictabilityPercent}%"></div></div>`;
            
            let homePos = homeData.position ? `#${homeData.position}` : 'N/A';
            let awayPos = awayData.position ? `#${awayData.position}` : 'N/A';
            let homeLastGame = homeData.lastGame ? `${homeData.lastGame.opponent} (${homeData.lastGame.result}) - ${homeData.lastGame.date}` : 'N/A';
            let awayLastGame = awayData.lastGame ? `${awayData.lastGame.opponent} (${awayData.lastGame.result}) - ${awayData.lastGame.date}` : 'N/A';
            let homeForm = homeData.form.map(x => x === 3 ? '✅' : x === 1 ? '⚠️' : '❌').join(' ');
            let awayForm = awayData.form.map(x => x === 3 ? '✅' : x === 1 ? '⚠️' : '❌').join(' ');

            html += `
            <div class="game${resultClass}">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px;">
                    <h3 style="margin: 0;">⚽ Match ${idx + 1}: ${home} vs ${away} ${status}</h3>
                    <span style="background: ${confidence > 75 ? '#00ff00' : confidence > 50 ? '#ffaa00' : '#ff6666'}; padding: 5px 10px; border-radius: 5px; font-weight: bold; font-size: 12px;">
                        Confidence: ${confidence.toFixed(0)}%
                    </span>
                </div>
                
                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-bottom: 10px; font-size: 13px;">
                    <div style="background: #121a2a; padding: 10px; border-radius: 6px;">
                        <strong>${home}</strong> ${homePos}
                        <br>Rating: ${homeData.rating} | Form: ${homeForm}
                        <br>Last: vs ${homeLastGame}
                    </div>
                    <div style="background: #121a2a; padding: 10px; border-radius: 6px;">
                        <strong>${away}</strong> ${awayPos}
                        <br>Rating: ${awayData.rating} | Form: ${awayForm}
                        <br>Last: vs ${awayLastGame}
                    </div>
                </div>
                
                ${hasActualResult ? `
                    <div style="background: ${status === '✅' ? '#1a3a2a' : '#3a1a1a'}; padding: 12px; border-radius: 6px; margin: 10px 0; border-left: 4px solid ${status === '✅' ? '#00ff00' : '#ff0000'};">
                        <div style="display: flex; justify-content: space-around; align-items: center; font-size: 16px; font-weight: bold;">
                            <div style="text-align: center;">
                                <div style="color: #00c853; font-size: 18px;">🔮 PREDICTED</div>
                                <div style="font-size: 28px; margin-top: 8px;">${s.h} - ${s.a}</div>
                            </div>
                            <div style="font-size: 24px; color: ${status === '✅' ? '#00ff00' : '#ff0000'};">
                                ${status}
                            </div>
                            <div style="text-align: center;">
                                <div style="color: #ffaa00; font-size: 18px;">📊 ACTUAL RESULT</div>
                                <div style="font-size: 28px; margin-top: 8px;">${hasActualResult}</div>
                            </div>
                        </div>
                        <p style="margin: 10px 0 0 0; text-align: center; color: #aaa; font-size: 12px;">
                            ${status === '✅' ? '🎉 PREDICTION CORRECT! 🎉' : '❌ Prediction incorrect - Analysis needed'}
                        </p>
                    </div>
                ` : `
                    <div style="background: #0d1a2a; padding: 12px; border-radius: 6px; margin: 10px 0; border-left: 4px solid #00c853;">
                        <div style="display: flex; justify-content: space-around; align-items: center; font-size: 16px; font-weight: bold;">
                            <div style="text-align: center;">
                                <div style="color: #00c853; font-size: 18px;">🔮 PREDICTION</div>
                                <div style="font-size: 28px; margin-top: 8px;">${s.h} - ${s.a}</div>
                            </div>
                            <div style="text-align: center;">
                                <div style="color: #ffaa00; font-size: 14px;">⏳ AWAITING RESULT</div>
                                <div style="font-size: 14px; margin-top: 8px; color: #aaa;">Kickoff: <strong>${time}</strong></div>
                            </div>
                        </div>
                    </div>
                `}
                
                <p style="background: #0d1a2a; padding: 10px; border-left: 3px solid #00c853; font-size: 13px; font-weight: bold; margin: 10px 0;">
                    📈 Market: ${underOverOdds} | League: ${league}
                </p>
                
                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-bottom: 10px; font-size: 12px;">
                    <div>📊 Predictability: ${predictabilityBar} ${predictability.toFixed(1)}</div>
                    <div>🎲 Win Probability: ${home} ${winProbability.home.toFixed(0)}% | Draw ${winProbability.draw.toFixed(0)}% | ${away} ${winProbability.away.toFixed(0)}%</div>
                </div>
                
                ${h2hDisplay}
                ${results[0] !== 'N/A' ? `<p>📊 H2H Record: ${home} <span style="color: #00ff00;">${homeWins}W</span> <span style="color: #ffff00;">${draws}D</span> <span style="color: #ff0000;">${awayWins}L</span> | Favored: <strong>${h2hFavored}</strong></p>` : ''}
                
                <div style="background: #0d1a2a; padding: 10px; border-radius: 6px; margin-top: 10px;">
                    <p style="margin: 5px 0; font-size: 13px;"><strong>💡 BETTING INSIGHT:</strong> ${betting}</p>
                    <p style="margin: 5px 0; font-size: 12px; color: #aaa;"><strong>Expected Goals:</strong> ${home}: ${eg.homeGoals.toFixed(2)} | ${away}: ${eg.awayGoals.toFixed(2)}</p>
                    <p style="margin: 5px 0; font-size: 12px; color: #aaa;"><strong>Analysis:</strong> ${getMatchAnalysis(homeData, awayData, s, h2hFavored)}</p>
                </div>
            </div>
            `;
        });
        document.getElementById("games").innerHTML = html;
    }

    function calculateConfidence(homeWins, awayWins, homeData, awayData) {
        let h2hAdvantage = Math.abs(homeWins - awayWins) * 5;
        let formAdvantage = Math.abs(formScore(homeData.form) - formScore(awayData.form)) * 10;
        let ratingAdvantage = Math.abs(homeData.rating - awayData.rating) * 2;
        return Math.min(95, 50 + h2hAdvantage + formAdvantage + ratingAdvantage);
    }

    function calculateUnderOver(homeGoals, awayGoals) {
        let total = homeGoals + awayGoals;
        if (total >= 3) return "Over 2.5 ⬆️";
        if (total >= 2) return "Over 1.5 ⬆️";
        return "Under 2.5 ⬇️";
    }

    function calculateWinProbability(attackH, attackA) {
        let totalAttack = attackH + attackA;
        let homePct = (attackH / totalAttack) * 0.9;
        let awayPct = (attackA / totalAttack) * 0.9;
        let drawPct = 1 - homePct - awayPct;

        return {
            home: homePct * 100,
            draw: Math.max(0, drawPct * 100),
            away: awayPct * 100
        };
    }

    function getBettingRecommendation(homeWins, awayWins, confidence, h_goals, a_goals) {
        if (confidence > 80 && homeWins > awayWins) {
            return `STRONG BET on Home Win - Historical advantage + form`;
        } else if (confidence > 80 && awayWins > homeWins) {
            return `VALUE BET on Away Win - Underdog with strong record`;
        } else if (h_goals + a_goals >= 3 && confidence > 70) {
            return `OVER 2.5 GOALS likely - Both teams scoring form`;
        } else if (confidence > 60) {
            return `Moderate confidence match - Good stake at <2.0 odds`;
        } else {
            return `High variance match - High odds recommended or skip`;
        }
    }

    function getMatchAnalysis(homeData, awayData, prediction, h2hFavored) {
        let analysis = [];
        
        if (homeData.rating > awayData.rating + 5) {
            analysis.push("Strong home advantage");
        } else if (awayData.rating > homeData.rating + 5) {
            analysis.push("Away team favored");
        }
        
        if (prediction.h > prediction.a) {
            analysis.push("expect home goals");
        } else if (prediction.a > prediction.h) {
            analysis.push("expect away goals");
        }
        
        if (formScore(homeData.form) > 2.2) {
            analysis.push("home on good form");
        }
        if (formScore(awayData.form) > 2.2) {
            analysis.push("away on good form");
        }
        
        return analysis.length > 0 ? analysis.join(", ") : "Balanced matchup";
    }

    updateAllTeams();
    loadTable();
    displayAllTeamStats(); // Initialize custom teams section
    loadGames();

});