
function getModsString(mods) {
    let modString = "";
    if (mods & 1) modString += "NoFail ";
    if (mods & 2) modString += "Easy ";
    if (mods & 4) modString += "TouchDevice ";
    if (mods & 8) modString += "Hidden ";
    if (mods & 16) modString += "HardRock ";
    if (mods & 32) modString += "SuddenDeath ";
    if (mods & 64) modString += "DoubleTime ";
    if (mods & 128) modString += "Relax ";
    if (mods & 256) modString += "HalfTime ";
    if (mods & 512) modString += "Nightcore ";
    if (mods & 1024) modString += "Flashlight ";
    if (mods & 2048) modString += "Autoplay ";
    if (mods & 4096) modString += "SpunOut ";
    if (mods & 8192) modString += "Relax2 ";
    if (mods & 16384) modString += "Perfect ";
    if (mods & 32768) modString += "Key4 ";
    if (mods & 65536) modString += "Key5 ";
    if (mods & 131072) modString += "Key6 ";
    if (mods & 262144) modString += "Key7 ";
    if (mods & 524288) modString += "Key8 ";
    if (mods & 1048576) modString += "FadeIn ";
    if (mods & 2097152) modString += "Random ";
    if (mods & 4194304) modString += "Cinema ";
    if (mods & 8388608) modString += "Target ";
    if (mods & 16777216) modString += "Key9 ";
    if (mods & 33554432) modString += "KeyCoop ";
    if (mods & 67108864) modString += "Key1 ";
    if (mods & 134217728) modString += "Key3 ";
    if (mods & 268435456) modString += "Key2 ";
    if (mods & 536870912) modString += "ScoreV2 ";
    if (mods & 1073741824) modString += "Mirror ";
    
    return modString.trim();
  }


async function getUserData(userId){

    let headersList = {
        "Accept": "*/*",
        "User-Agent": "Thunder Client (https://www.thunderclient.com)"
    }
    
    let response = await fetch(`https://osutrack-api.ameo.dev/hiscores?user=${userId}&mode=0&from=2000-00-00`, { 
        method: "GET",
        headers: headersList
    });

    let data = await response.text();

    return JSON.parse(data);
}

function get_beatmaps(userId, nearby) {
    getUserData(userId).then(data => {
        let filteredLength = 0;

        let tableElement = document.createElement("table");
        tableElement.style.borderCollapse = "collapse";

        let headerRow = document.createElement("tr");
        headerRow.style.border = "1px solid black";
        let beatmapHeader = document.createElement("th");
        beatmapHeader.textContent = "Beatmap";
        beatmapHeader.style.border = "1px solid black";
        headerRow.appendChild(beatmapHeader);
        let ppHeader = document.createElement("th");
        ppHeader.textContent = "PP";
        ppHeader.style.border = "1px solid black";
        headerRow.appendChild(ppHeader);
        let rankHeader = document.createElement("th");
        rankHeader.textContent = "Rank";
        rankHeader.style.border = "1px solid black";
        headerRow.appendChild(rankHeader);
        let modsHeader = document.createElement("th");
        modsHeader.textContent = "Mods";
        modsHeader.style.border = "1px solid black";
        headerRow.appendChild(modsHeader);
        let daysBetweenHeader = document.createElement("th");
        daysBetweenHeader.textContent = "Days since new top";
        daysBetweenHeader.style.border = "1px solid black";
        headerRow.appendChild(daysBetweenHeader);
        let dateHeader = document.createElement("th");
        dateHeader.textContent = "Date";
        dateHeader.style.border = "1px solid black";
        headerRow.appendChild(dateHeader);
        tableElement.appendChild(headerRow);

        let currentTop = 0;
        let currentTopDate = null;
        for(let key in data) {
            let rowElement = document.createElement("tr");
            rowElement.style.border = "1px solid black";

            if(data[key].pp > (currentTop * nearby)) { // if within 90% of top play
                filteredLength++;
                if(data[key].pp > currentTop) { // if new top play
                    currentTop = data[key].pp;
                    currentTopDate = new Date(data[key].score_time);
                }

                let timeDiff = Math.abs(new Date(data[key].score_time).getTime() - currentTopDate.getTime());
                let dayDiff = Math.ceil(timeDiff / (1000 * 60 * 60 * 24));

                let beatmapLink = document.createElement("a");
                beatmapLink.href = `https://osu.ppy.sh/beatmaps/${data[key].beatmap_id}`;
                beatmapLink.textContent = `LINK TO BEATMAP`;

                let ppElement = document.createElement("td");
                ppElement.textContent = data[key].pp;
                ppElement.style.border = "1px solid black";

                let rankElement = document.createElement("td");
                rankElement.textContent = data[key].rank;
                rankElement.style.border = "1px solid black";

                let modsElement = document.createElement("td");
                modsElement.textContent = getModsString(data[key].mods);
                modsElement.style.border = "1px solid black";

                let dateElement = document.createElement("td");
                dateElement.textContent = new Date(data[key].score_time).toLocaleString();
                dateElement.style.border = "1px solid black";

                let daysBetweenElement = document.createElement("td");
                daysBetweenElement.textContent = dayDiff;
                daysBetweenElement.style.border = "1px solid black";

                if(data[key].pp === currentTop) {
                    rowElement.style.backgroundColor = "lightgreen";
                }

                rowElement.appendChild(document.createElement("td").appendChild(beatmapLink));
                rowElement.appendChild(ppElement);
                rowElement.appendChild(rankElement);
                rowElement.appendChild(modsElement);
                rowElement.appendChild(daysBetweenElement);
                rowElement.appendChild(dateElement);
                

                tableElement.appendChild(rowElement);
            }
        }

        document.getElementById("main").innerHTML = "";
        let totalElement = document.createElement("div");
        totalElement.textContent = `Beatmaps in list: ${filteredLength} (filtered from ${data.length})`;
        document.getElementById("main").appendChild(totalElement);
        document.getElementById("main").appendChild(tableElement);
    });
}













let myForm = document.getElementById("myForm");
let userIdInput = document.getElementById("userid");
let nearby = document.getElementById("nearby");

myForm.addEventListener("submit", function(event) {
    event.preventDefault();
    // call your function here
    get_beatmaps(userIdInput.value, nearby.value);
  });

