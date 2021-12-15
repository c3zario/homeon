<style>
    .hour
    {
        margin: 5px;
        padding: 3px;
        
    }
    .calendar
    {
        position: relative;
        width: 100%;
        overflow: hidden;
    }
    .hours
    {
        display: inline-block;
    }
    .day
    {
        border: 1px solid black;
        height: 99%;
        width: 20%;
        text-align: center;
        margin: 2px;
        padding: 10px;
    }
    :global(.plan)
    {
        border: 1px solid black;
        background-color: aqua;
        position: absolute;
        border-radius: 10%;
    }
    .week
    {
        display: -webkit-inline-box;
        position: fixed;
    }
</style>
<h1>Hello world!</h1>
<div class="calendar">
    <div class="hours">
    {#each hours as hour}
    <div class="hour">{hour}</div>
    {/each}
    </div>
    <div class="week">
        {#each daysOfWeek as d}
            <div class="day">
                {d}
            </div>
        {/each}
    </div>
</div>
<input type="date" id="s" bind:value={t}>
<input type="time" id="g" bind:value={g}> 
<script>
    let daysOfWeek = ['Poniedziałek', 'Wtorek', "Środa", 'Czwartek', 'Piątek', "Sobota", "Niedziela"];
    let hours = [];
    let plans = [['2021-12-29', "10:54", '2021-12-29', "11:54", "nic nie robienie"], ['2021-12-26', "17:54", '2021-12-26', "21:54", "Też nic nie robienie"]]
    let t = '2021-12-26';
    let g = '20:54';
    //$: console.log(g);
    //$: console.log(t);
    for(let i=0;i<24;i++)
    {
        hours.push(i > 12 ? i-12 + ` PM` : i + ` AM`);
    }
    const d = new Date();
    let day = d.getDay();

    window.addEventListener("DOMContentLoaded", () => {
        ShowPlans(plans);
    })

    function ShowPlans(plans)
    {
        plans.forEach(plans => {
            let day = document.getElementsByClassName("day")[new Date(plans[2]).getDay()];
            let plan = document.createElement("div");
            let h = day.offsetHeight;
            h = document.querySelector(".hours").offsetHeight;
            let hours = Number.parseInt(plans[1].substr(0, 2));
            let minutes = Number.parseInt(plans[1].substr(3, 2));
            let top = hours / 24 + minutes / 1440;
            top *= h;

            let end_hours = Number.parseInt(plans[3].substr(0, 2));
            let end_minutes = Number.parseInt(plans[3].substr(3, 2));
            let height = end_hours / 24 + end_minutes / 1440;
            height *= h;
            height -= top;

            plan.style.top = top + "px";
            plan.style.height = height + "px";
            plan.classList.add("plan");
            plan.textContent = plans[4];
            day.appendChild(plan);
        });
    }
</script>