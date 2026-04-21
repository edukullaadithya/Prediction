document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('prediction-form');
    const team1Select = document.getElementById('team1');
    const team2Select = document.getElementById('team2');
    const tossWinnerSelect = document.getElementById('tossWinner');
    const venueSelect = document.getElementById('venue');
    const tossDecisionSelect = document.getElementById('tossDecision');
    const spinner = document.getElementById('spinner');
    const predictBtn = document.querySelector('.predict-btn');
    const resultSection = document.getElementById('result-section');
    const winnerName = document.getElementById('winner-name');
    const resetBtn = document.getElementById('reset-btn');

    // Team names mapping
    const teamNames = {
        'CSK': 'Chennai Super Kings',
        'DC': 'Delhi Capitals',
        'GT': 'Gujarat Titans',
        'KKR': 'Kolkata Knight Riders',
        'LSG': 'Lucknow Super Giants',
        'MI': 'Mumbai Indians',
        'PBKS': 'Punjab Kings',
        'RR': 'Rajasthan Royals',
        'RCB': 'Royal Challengers Bengaluru',
        'SRH': 'Sunrisers Hyderabad'
    };

    // Team colors mapping for background changes
    const teamColors = {
        'CSK': 'rgba(252, 211, 77, 0.7)',   // Yellow
        'MI': 'rgba(59, 130, 246, 0.7)',     // Blue
        'GT': 'rgba(100, 149, 237, 0.7)',    // Cornflower Blue
        'KKR': 'rgba(139, 0, 255, 0.7)',     // Purple
        'LSG': 'rgba(6, 182, 212, 0.7)',     // Cyan
        'PBKS': 'rgba(239, 68, 68, 0.7)',    // Red
        'RR': 'rgba(236, 72, 153, 0.7)',     // Pink
        'RCB': 'rgba(185, 0, 0, 0.85)',      // Deep Crimson Red
        'SRH': 'rgba(249, 115, 22, 0.7)',    // Orange
        'DC': 'rgba(37, 99, 235, 0.7)'       // Blue
    };

    // Secondary accent colors per team for richer gradient
    const teamColors2 = {
        'CSK': 'rgba(180, 130, 0, 0.5)',
        'MI': 'rgba(0, 30, 100, 0.7)',
        'GT': 'rgba(30, 30, 80, 0.7)',
        'KKR': 'rgba(50, 0, 100, 0.7)',
        'LSG': 'rgba(0, 80, 120, 0.7)',
        'PBKS': 'rgba(120, 0, 0, 0.7)',
        'RR': 'rgba(100, 0, 80, 0.7)',
        'RCB': 'rgba(0, 0, 0, 0.9)',         // Black (RCB is red & black)
        'SRH': 'rgba(120, 50, 0, 0.7)',
        'DC': 'rgba(0, 0, 100, 0.7)'
    };

    // Team logos from local assets folder to prevent hotlink breaking
    const teamLogos = {
        'CSK': 'assets/CSK.png',
        'MI': 'assets/MI.png',
        'RCB': 'assets/RCB.png',
        'KKR': 'assets/KKR.png',
        'DC': 'assets/DC.png',
        'PBKS': 'assets/PBKS.png',
        'RR': 'assets/RR.png',
        'SRH': 'assets/SRH.png',
        'GT': 'assets/GT.png',
        'LSG': 'assets/LSG.png'
    };

    // Update Toss Winner options when teams are selected
    function updateTossWinnerOptions() {
        const t1 = team1Select.value;
        const t2 = team2Select.value;

        tossWinnerSelect.innerHTML = '<option value="" disabled selected>Select Toss Winner</option>';

        if (t1) {
            const opt1 = document.createElement('option');
            opt1.value = t1;
            opt1.textContent = teamNames[t1];
            tossWinnerSelect.appendChild(opt1);
        }
        if (t2) {
            const opt2 = document.createElement('option');
            opt2.value = t2;
            opt2.textContent = teamNames[t2];
            tossWinnerSelect.appendChild(opt2);
        }
    }

    // Prevent selecting the same team twice
    function handleTeamSelection(changedSelect, otherSelect) {
        const selectedValue = changedSelect.value;
        Array.from(otherSelect.options).forEach(option => {
            if (option.value === selectedValue && selectedValue !== "") {
                option.disabled = true;
            } else {
                option.disabled = false;
            }
        });
        updateTossWinnerOptions();
    }

    team1Select.addEventListener('change', () => handleTeamSelection(team1Select, team2Select));
    team2Select.addEventListener('change', () => handleTeamSelection(team2Select, team1Select));

    // Base Team Strengths (Simulated Data)
    const teamStrengths = {
        'CSK': 85, 'MI': 83, 'GT': 82, 'KKR': 80, 'RR': 78,
        'RCB': 75, 'LSG': 76, 'SRH': 74, 'DC': 70, 'PBKS': 68
    };

    // Home venue advantage mapping
    const homeVenues = {
        'CSK': 'Chepauk',
        'MI': 'Wankhede',
        'RCB': 'Chinnaswamy',
        'KKR': 'EdenGardens',
        'GT': 'NarendraModi',
        'DC': 'ArunJaitley',
        'SRH': 'RajivGandhi',
        'RR': 'SawaiMansingh',
        'PBKS': 'PCA',
        'LSG': 'Ekana'
    };

    // Form Submit Handler
    form.addEventListener('submit', (e) => {
        e.preventDefault();

        // Show spinner
        spinner.style.display = 'inline-block';
        predictBtn.disabled = true;
        predictBtn.style.opacity = '0.8';

        // Simulate network request / complex calculation time
        setTimeout(() => {
            const t1 = team1Select.value;
            const t2 = team2Select.value;
            const venue = venueSelect.value;
            const tossWinner = tossWinnerSelect.value;
            const decision = tossDecisionSelect.value;

            const winner = predictWinner(t1, t2, venue, tossWinner, decision);

            // Hide form, show result
            form.classList.add('hidden');
            spinner.style.display = 'none';
            predictBtn.disabled = false;
            predictBtn.style.opacity = '1';

            // Change background color to match winner - using two-tone gradient per team
            const bgOverlay = document.querySelector('.background-overlay');
            bgOverlay.style.background = `linear-gradient(135deg, ${teamColors2[winner]} 0%, ${teamColors[winner]} 50%, ${teamColors2[winner]} 100%)`;

            // Update Head to Head Pie Chart
            const h2h = getH2HStats(t1, t2);
            const pieChart = document.getElementById('pie-chart');
            const color1 = teamColors[t1].replace(/0\.\d+\)/, '1)'); // Make colors solid
            const color2 = teamColors[t2].replace(/0\.\d+\)/, '1)');
            
            pieChart.style.background = `conic-gradient(${color1} 0% ${h2h.pct1}%, ${color2} ${h2h.pct1}% 100%)`;
            
            // Update Labels
            document.getElementById('stat-t1-color').style.background = color1;
            document.getElementById('stat-t1-name').textContent = teamNames[t1];
            document.getElementById('stat-t1-pct').textContent = `${h2h.pct1}%`;
            
            document.getElementById('stat-t2-color').style.background = color2;
            document.getElementById('stat-t2-name').textContent = teamNames[t2];
            document.getElementById('stat-t2-pct').textContent = `${h2h.pct2}%`;

            // Update Avg Scores
            document.getElementById('avg-t1-name').textContent = teamNames[t1];
            document.getElementById('avg-t1-score').textContent = h2h.avg1;
            document.getElementById('avg-t2-name').textContent = teamNames[t2];
            document.getElementById('avg-t2-score').textContent = h2h.avg2;

            // Update Total Matches
            document.getElementById('total-matches').textContent = h2h.total;

            // Update Wins Count
            document.getElementById('wins-t1-name').textContent = teamNames[t1];
            document.getElementById('wins-t1-count').textContent = h2h.wins1;
            document.getElementById('wins-t2-name').textContent = teamNames[t2];
            document.getElementById('wins-t2-count').textContent = h2h.wins2;
            document.getElementById('wins-t1-badge').style.borderColor = color1;
            document.getElementById('wins-t2-badge').style.borderColor = color2;

            const winnerSymbol = document.getElementById('winner-symbol');
            winnerSymbol.src = teamLogos[winner];
            winnerSymbol.style.display = 'inline-block';
            
            winnerName.textContent = teamNames[winner];
            resultSection.classList.remove('hidden');
            document.getElementById('predictor-subtext').classList.add('hidden');

            // Add confetti effect or extra animation here if desired

        }, 1500);
    });

    // Reset Handler
    resetBtn.addEventListener('click', () => {
        resultSection.classList.add('hidden');
        form.classList.remove('hidden');
        document.getElementById('predictor-subtext').classList.remove('hidden');
        form.reset();
        
        // Reset background
        const bgOverlay = document.querySelector('.background-overlay');
        bgOverlay.style.background = 'linear-gradient(135deg, rgba(15, 23, 42, 0.9) 0%, rgba(59, 130, 246, 0.4) 50%, rgba(249, 115, 22, 0.4) 100%)';

        // Reset disabled options
        Array.from(team1Select.options).forEach(opt => opt.disabled = false);
        Array.from(team2Select.options).forEach(opt => opt.disabled = false);
        tossWinnerSelect.innerHTML = '<option value="" disabled selected>Select Toss Winner</option>';
    });

    // Prediction Algorithm
    function predictWinner(t1, t2, venue, tossWinner, decision) {
        let score1 = teamStrengths[t1];
        let score2 = teamStrengths[t2];

        // 1. Home Advantage (Boost of 5 points)
        if (homeVenues[t1] === venue) score1 += 5;
        if (homeVenues[t2] === venue) score2 += 5;

        // 2. Toss Advantage
        // Generally, chasing (Bowling first) has a slight edge in T20s, especially at certain grounds like Chinnaswamy
        let tossBonus = 0;
        if (decision === 'Bowl') {
            tossBonus = 3; // General chasing advantage
            if (venue === 'Chinnaswamy' || venue === 'Wankhede' || venue === 'PCA' || venue === 'SawaiMansingh') {
                tossBonus = 6; // Heavy chasing advantage due to dew/small boundaries
            }
        } else {
            // Batting first advantage at spin tracks
            if (venue === 'Chepauk' || venue === 'Ekana') {
                tossBonus = 5; // Slow tracks, defending is easier
            }
        }

        if (tossWinner === t1) {
            score1 += tossBonus;
        } else {
            score2 += tossBonus;
        }

        // 3. Add a small random factor to simulate unpredictability of T20 cricket (-3 to +3)
        score1 += (Math.random() * 6) - 3;
        score2 += (Math.random() * 6) - 3;

        // Determine winner based on final scores
        return score1 > score2 ? t1 : t2;
    }

    // Generate consistent simulated H2H stats based on teams
    function getH2HStats(teamA, teamB) {
        // Sort to ensure consistency regardless of which is team1/team2
        const teams = [teamA, teamB].sort();
        const hashStr = teams[0] + teams[1];
        let hash = 0;
        for (let i = 0; i < hashStr.length; i++) {
            hash = ((hash << 5) - hash) + hashStr.charCodeAt(i);
            hash |= 0;
        }
        
        // Use hash for variance + strength diff for realism
        const strengthDiff = teamStrengths[teamA] - teamStrengths[teamB];
        let pctA = 50 + (Math.abs(hash) % 21 - 10) + (strengthDiff * 0.8);
        
        pctA = Math.max(20, Math.min(80, Math.round(pctA)));

        // Total matches: simulate based on hash (between 15 and 35 matches)
        const totalMatches = 15 + (Math.abs(hash) % 21);
        const wins1 = Math.round((pctA / 100) * totalMatches);
        const wins2 = totalMatches - wins1;

        // Simulate Average Scores based on strengths and hash
        let baseAvg = 160 + (Math.abs(hash) % 30);
        let avgA = Math.round(baseAvg + (teamStrengths[teamA] - 75) * 0.8);
        let avgB = Math.round(baseAvg + (teamStrengths[teamB] - 75) * 0.8);

        return { pct1: pctA, pct2: 100 - pctA, avg1: avgA, avg2: avgB, total: totalMatches, wins1, wins2 };
    }

    // History Modal Logic
    const historyBtn = document.getElementById('history-btn');
    const historyModal = document.getElementById('history-modal');
    const closeBtn = document.querySelector('.close-btn');
    const capsTableBody = document.querySelector('#caps-table tbody');

    const capsData = [
        { year: 2025, orange: "Virat Kohli (RCB)", purple: "Prasidh Krishna (RCB)" },
        { year: 2024, orange: "Virat Kohli (RCB)", purple: "Harshal Patel (PBKS)" },
        { year: 2023, orange: "Shubman Gill (GT)", purple: "Mohammed Shami (GT)" },
        { year: 2022, orange: "Jos Buttler (RR)", purple: "Yuzvendra Chahal (RR)" },
        { year: 2021, orange: "Ruturaj Gaikwad (CSK)", purple: "Harshal Patel (RCB)" },
        { year: 2020, orange: "KL Rahul (PBKS)", purple: "Kagiso Rabada (DC)" },
        { year: 2019, orange: "David Warner (SRH)", purple: "Imran Tahir (CSK)" },
        { year: 2018, orange: "Kane Williamson (SRH)", purple: "Andrew Tye (PBKS)" },
        { year: 2017, orange: "David Warner (SRH)", purple: "Bhuvneshwar Kumar (SRH)" },
        { year: 2016, orange: "Virat Kohli (RCB)", purple: "Bhuvneshwar Kumar (SRH)" },
        { year: 2015, orange: "David Warner (SRH)", purple: "Dwayne Bravo (CSK)" },
        { year: 2014, orange: "Robin Uthappa (KKR)", purple: "Mohit Sharma (CSK)" },
        { year: 2013, orange: "Michael Hussey (CSK)", purple: "Dwayne Bravo (CSK)" },
        { year: 2012, orange: "Chris Gayle (RCB)", purple: "Morne Morkel (DC)" },
        { year: 2011, orange: "Chris Gayle (RCB)", purple: "Lasith Malinga (MI)" },
        { year: 2010, orange: "Sachin Tendulkar (MI)", purple: "Pragyan Ojha (DC)" },
        { year: 2009, orange: "Matthew Hayden (CSK)", purple: "R. P. Singh (DC)" },
        { year: 2008, orange: "Shaun Marsh (PBKS)", purple: "Sohail Tanvir (RR)" }
    ];

    function populateCapsTable() {
        capsTableBody.innerHTML = '';
        capsData.forEach(data => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${data.year}</td>
                <td class="orange-text">${data.orange}</td>
                <td class="purple-text">${data.purple}</td>
            `;
            capsTableBody.appendChild(row);
        });
    }

    historyBtn.addEventListener('click', () => {
        populateCapsTable();
        historyModal.classList.remove('hidden');
    });

    closeBtn.addEventListener('click', () => {
        historyModal.classList.add('hidden');
    });

    // Close modal if clicked outside of content
    window.addEventListener('click', (e) => {
        if (e.target === historyModal) {
            historyModal.classList.add('hidden');
        }
    });
});
