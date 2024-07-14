const events = [
    { id: '333', name: '3x3x3 Cube', shortName: '3x3' },
    { id: '222', name: '2x2x2 Cube', shortName: '2x2' },
    { id: '444', name: '4x4x4 Cube', shortName: '4x4' },
    { id: '555', name: '5x5x5 Cube', shortName: '5x5' },
    { id: '666', name: '6x6x6 Cube', shortName: '6x6' },
    { id: '777', name: '7x7x7 Cube', shortName: '7x7' },
    { id: '888', name: '8x8x8 Cube', shortName: '8x8' },
    { id: '999', name: '9x9x9 Cube', shortName: '9x9' },
    { id: '24r', name: '2x2x2-4x4x4 Relay', shortName: '234' },
    { id: '25r', name: '2x2x2-5x5x5 Relay', shortName: '2345' },
    { id: '26r', name: '2x2x2-6x6x6 Relay', shortName: '23456' },
    { id: '27r', name: '2x2x2-7x7x7 Relay', shortName: '234567' },
    { id: '333fm', name: '3x3x3 Fewest Moves', shortName: 'FMC' },
    { id: '333oh', name: '3x3x3 One-Handed', shortName: '3OH' },
    { id: '222oh', name: '2x2x2 One-Handed', shortName: '2OH' },
    { id: 'minx', name: 'Megaminx', shortName: 'Mega' },
    { id: 'pyram', name: 'Pyraminx', shortName: 'Pyra' },
    { id: 'clock', name: 'Clock', shortName: 'Clock' },
    { id: 'skewb', name: 'Skewb', shortName: 'Skewb' },
    { id: 'sq1', name: 'Square-1', shortName: 'Squan' },
    { id: '333mrb', name: '3x3x3 Mirror Blocks', shortName: 'Mirror' },
];

let selectedEvents = [];
let competitors = [];
let competitionData = {};

function selectAllEventCheckboxes() {
    var ele = document.getElementsByName('event-checkbox');
    for (var i = 0; i < ele.length; i++) {
        if (ele[i].type == 'checkbox') {
            ele[i].checked = true;
        }
    }
}

function deselectAllEventCheckboxes() {
    var ele = document.getElementsByName('event-checkbox');
    for (var i = 0; i < ele.length; i++) {
        if (ele[i].type == 'checkbox') {
            ele[i].checked = false;
        }
    }
}

function setupCompetition() {
    const competitionName = document.getElementById('competition-name').value;
    const maxCompetitors = document.getElementById('max-competitors').value;

    if (competitionName && maxCompetitors) {
        competitionData.name = competitionName;
        competitionData.maxCompetitors = parseInt(maxCompetitors);

        document.getElementById('competition-setup').style.display = 'none';
        document.getElementById('event-selection').style.display = 'block';

        const eventCheckboxes = document.getElementById('event-checkboxes');
        eventCheckboxes.innerHTML = ''; // Clear previous checkboxes if any
        events.forEach(event => {
            const checkbox = document.createElement('input');
            checkbox.type = 'checkbox';
            checkbox.id = event.id;
            checkbox.value = event.id;
            checkbox.name = 'event-checkbox'

            const label = document.createElement('label');
            label.htmlFor = event.id;
            label.textContent = event.name;

            const div = document.createElement('div');
            div.appendChild(checkbox);
            div.appendChild(label);
            div.classList += 'inline-checkbox'

            eventCheckboxes.appendChild(div);
        });
    }
}

function selectEvents() {
    const checkboxes = document.querySelectorAll('#event-checkboxes input:checked');
    selectedEvents = Array.from(checkboxes).map(checkbox => checkbox.value);

    if (selectedEvents.length > 0) {
        competitionData.events = selectedEvents;

        document.getElementById('event-selection').style.display = 'none';
        document.getElementById('competitor-setup').style.display = 'block';
        updateCompetitorForm();
    }
}

function updateCompetitorForm() {
    const competitorForm = document.getElementById('competitor-form');
    competitorForm.innerHTML = '';

    const nameInput = document.createElement('input');
    nameInput.type = 'text';
    nameInput.id = 'competitor-name';
    nameInput.placeholder = 'Competitor Name';

    competitorForm.appendChild(nameInput);

    selectedEvents.forEach(eventId => {
        const event = events.find(e => e.id === eventId);
        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.id = `event-${event.id}`;
        checkbox.value = event.id;
        checkbox.name = 'event-checkbox'

        const label = document.createElement('label');
        label.htmlFor = `event-${event.id}`;
        label.textContent = event.shortName;

        const div = document.createElement('div');
        div.appendChild(checkbox);
        div.appendChild(label);
        div.className += 'inline-checkbox';

        competitorForm.appendChild(div);
    });
}

function addCompetitor() {
    const name = document.getElementById('competitor-name').value;
    if (!name) return;

    const eventCheckboxes = document.querySelectorAll('#competitor-form input[type="checkbox"]:checked');
    const events = Array.from(eventCheckboxes).map(checkbox => checkbox.value);

    const competitor = {
        id: competitors.length + 1,
        name,
        events,
        groupAssignments: {} // Initialize group assignments for each event
    };

    competitors.push(competitor);
    displayCompetitors();
}

function displayCompetitors() {
    const competitorList = document.getElementById('competitor-list');
    competitorList.innerHTML = '';

    competitors.forEach(competitor => {
        const div = document.createElement('div');
        div.className = 'competitor-item';

        const idSpan = document.createElement('span');
        idSpan.textContent = competitor.id + ' ';

        const nameSpan = document.createElement('span');
        nameSpan.textContent = competitor.name + ': ';

        const eventsSpan = document.createElement('span');
        eventsSpan.textContent = competitor.events.join(', ');

        div.appendChild(idSpan);
        div.appendChild(nameSpan);
        div.appendChild(eventsSpan);

        competitorList.appendChild(div);
    });

    updateCompetitorForm();
}

function finalizeCompetitors() {
    competitionData.competitors = competitors;

    document.getElementById('competitor-setup').style.display = 'none';
    document.getElementById('grouping-results').style.display = 'block';

    generateGroups();
}

function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

function generateGroups() {
    const maxCompetitors = competitionData.maxCompetitors;
    const groupingOutput = document.getElementById('grouping-output');
    groupingOutput.innerHTML = '';

    competitionData.groups = {};

    selectedEvents.forEach(eventId => {
        const eventCompetitors = competitors.filter(c => c.events.includes(eventId));
        shuffleArray(eventCompetitors);
        const numGroups = Math.ceil(eventCompetitors.length / maxCompetitors);
        const eventGroups = [];

        for (let i = 0; i < numGroups; i++) {
            eventGroups.push({
                competitors: [],
                judges: [],
                scramblers: []
            });
        }

        eventCompetitors.forEach(competitor => {
            // Find the first group that still needs more competitors
            const groupIndex = eventGroups.findIndex(group => group.competitors.length < maxCompetitors);
            eventGroups[groupIndex].competitors.push(competitor);

            // Assign the competitor to this group for this event
            competitor.groupAssignments[eventId] = groupIndex + 1; // Groups are 1-indexed
        });

        // Assign judges and scramblers
        eventGroups.forEach((group, groupIndex) => {
            // Assign scramblers: competitors not in this group but in the event
            const availableScramblers = competitors.filter(c =>
                c.events.includes(eventId) &&
                c.groupAssignments[eventId] !== (groupIndex + 1) &&
                !group.judges.includes(c)
            );

            if (availableScramblers.length > 0) {
                group.scramblers = [availableScramblers[0]]; // Only 1 scrambler per group
            }

            // Assign judges: competitors not in this group
            const availableJudges = competitors.filter(c =>
                c.groupAssignments[eventId] !== (groupIndex + 1) &&
                !group.judges.includes(c) &&
                !group.scramblers.includes(c)
            );

            group.judges = availableJudges.slice(0, group.competitors.length);
        });

        competitionData.groups[eventId] = eventGroups;

        const event = events.find(e => e.id === eventId);
        const eventDiv = document.createElement('div');
        eventDiv.className = 'event-group';

        const eventTitle = document.createElement('h3');
        eventTitle.textContent = event.name;

        eventDiv.appendChild(eventTitle);

        eventGroups.forEach((group, groupIndex) => {
            const groupDiv = document.createElement('div');
            groupDiv.className = 'group';

            const groupTitle = document.createElement('h4');
            groupTitle.textContent = `Group ${groupIndex + 1}`;

            groupDiv.appendChild(groupTitle);

            group.competitors.forEach(competitor => {
                const competitorDiv = document.createElement('div');
                competitorDiv.textContent = `${competitor.id}: ${competitor.name}`;

                groupDiv.appendChild(competitorDiv);
            });

            const judgesDiv = document.createElement('div');
            judgesDiv.textContent = `Judges: ${group.judges.map(j => j.name).join(', ')}`;

            groupDiv.appendChild(judgesDiv);

            const scramblersDiv = document.createElement('div');
            scramblersDiv.textContent = `Scramblers: ${group.scramblers.map(s => s.name).join(', ')}`;

            groupDiv.appendChild(scramblersDiv);

            eventDiv.appendChild(groupDiv);
        });

        groupingOutput.appendChild(eventDiv);
    });
}

