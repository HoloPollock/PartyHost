function end()
{
    alert("party ended");
}

function playlist()
{
    document.documentElement.style.overflow = "hidden";
    document.getElementById("overlay").style.display = "block";
    document.getElementById("popup").style.display = "block";
    document.getElementById("playlist").style.display = "block";
}

function code()
{
    document.documentElement.style.overflow = "hidden";
    document.getElementById("overlay").style.display = "block";
    document.getElementById("popup").style.display = "block";
    document.getElementById("partycode").style.display = "block";
}

function partyName()
{
    document.documentElement.style.overflow = "hidden";
    document.getElementById("overlay").style.display = "block";
    document.getElementById("popup").style.display = "block";
    document.getElementById("name").style.display = "block";
}

function closePopup()
{
    document.documentElement.style.overflow = "scroll";
    document.getElementById("overlay").style.display = "none";
    document.getElementById("popup").style.display = "none";
    document.getElementById("playlist").style.display = "none";
    document.getElementById("partycode").style.display = "none";
    document.getElementById("name").style.display = "none";
}