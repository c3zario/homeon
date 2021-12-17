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
        float: left;
        /*width: 7vw;*/
        width: 100px;
    }
    .day
    {
        border: 1px solid black;
        height: 99%;
        width: 20vw;
        text-align: center;
        margin: 2px;
        padding: 10px;
        position: relative;
    }
    :global(.plan)
    {
        background-color: aqua;
        position: absolute;
    }
    .week
    {
        /*display: -webkit-inline-box;
        position: fixed;*/
        display: flex;
    }
    .headerCalendar
    {
        width: 20vw;
        padding: 10px;
        margin: 2px;
        border: 1px solid black;
    }
    .headerCalendar:first-of-type
    {
        border: 0px;
        /*width: 7vw;*/
        min-width: 100px;
        max-width: 100px;
        padding: 0px;
        margin: 0px;
    }
</style>
<h1>Hello world!</h1>
<div class="calendar">
    <div style="display: flex; flex-direction: row">
        {#each daysOfWeek as d}
            <div class="headerCalendar">{d}</div>
        {/each}
    </div>
    <div class="hours">
    {#each hours as hour}
    <div class="hour">{hour}</div>
    {/each}
    </div>
    <div class="week">
        {#each Array(7) as i}
            <div class="day">
                
            </div>
        {/each}
    </div>
</div>
<input type="date" id="s" bind:value={t}>
<input type="time" id="g" bind:value={g}> 
<script>
    let daysOfWeek = ['', 'Poniedziałek', 'Wtorek', "Środa", 'Czwartek', 'Piątek', "Sobota", "Niedziela"];
    const month = ["Styczeń","Luty","Marzec","Kwiecień","Maj","Czerwiec","Lipiec","Sierpień","Wrzesień","Październik","Listopad","Grudzień"];
    let hours = [];
    let plans = [['2021-12-17', "12:54", '2021-12-19', "24:00", "nic nie robienie"], ['2021-12-13', "0:00", '2021-12-14', "13:00", "Też nic nie robienie"]]
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
        ShowPlans(EachWeek());
        document.getElementsByClassName("week")[0].style.height = (document.getElementsByClassName("hours")[0].offsetHeight-20) + "px";
    })
    function EachWeek()
    {
        const d = new Date();
        let day = d.getDay();
        d.setDate(d.getDate() - day + 1);
        d.setHours(0, 0, 0, 0);
        let mon = d.getDate() + " " + (month[d.getMonth()]);
        let monSec = d.getTime();
        d.setDate(d.getDate() + 7);
        d.setHours(0, 0, 0, 0);
        console.log(d);
        let sun =  d.getDate() + " " + (month[d.getMonth()]);
        let sunSec = d.getTime();
        document.querySelector(".headerCalendar").innerHTML = mon + "<br>" + sun;
        let actualisedPlans = [];
        plans.forEach(plan => {
            if(new Date(plan[0]).getTime() >= monSec && new Date(plan[2]).getTime() <= sunSec)//plan[0] > monSec && plan[0] < sunSec || plan[2] > monSec && plan[2] < sunSec
                actualisedPlans.push(plan);
        });
        return actualisedPlans;
    }
    function ShowPlans(plans)
    {
        plans.forEach(plans => {
            let day = document.getElementsByClassName("day")[new Date(plans[0]).getDay()-1];
            let plan = document.createElement("div");
            let h = document.querySelector(".hours").offsetHeight;
            let hours = Number.parseInt(plans[1].substr(0, 2));
            let minutes = Number.parseInt(plans[1].substr(3, 2));
            let top = hours / 24 + minutes / 1440;
            top *= h;
            let i = new Date(plans[0]).getDay()// + 1;
            if(plans[0] != plans[2])
            {
                let height = h - top;

                plan.style.top = top + "px";
                plan.style.height = height + "px";
                plan.classList.add("plan");
                plan.textContent = plans[4];
                day.appendChild(plan);
                let d = new Date(plans[0]);
                do
                {
                    let p = document.createElement("div");
                    p.style.top = 0 + "px";
                    p.style.height = h + "px";
                    p.classList.add("plan");
                    p.textContent = plans[4];
                    d.setDate(d.getDate() + 1);
                    if(d.getDate() == (new Date(plans[2])).getDate())
                    {
                        let hours = Number.parseInt(plans[3].substr(0, 2));
                        let minutes = Number.parseInt(plans[3].substr(3, 2));
                        let height = hours / 24 + minutes / 1440;
                        p.style.height = (height*h) + "px";
                    }
                    document.querySelectorAll(".day")[i].appendChild(p);
                    i++;
                }
                while(d.getDate() != (new Date(plans[2])).getDate())

            }
            else
            {

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
            }
        });
    }
</script>