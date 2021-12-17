<script>
    import { onMount } from "svelte";

    let daysOfWeek = [
        "Poniedziałek",
        "Wtorek",
        "Środa",
        "Czwartek",
        "Piątek",
        "Sobota",
        "Niedziela",
    ];
    const months = [
        "Styczeń",
        "Luty",
        "Marzec",
        "Kwiecień",
        "Maj",
        "Czerwiec",
        "Lipiec",
        "Sierpień",
        "Wrzesień",
        "Październik",
        "Listopad",
        "Grudzień",
    ];
    let hours = generateHours();
    let plans = [
        ["2021-12-17", "12:54", "2021-12-19", "23:59", "nic nie robienie"],
        ["2021-12-13", "5:00", "2021-12-14", "10:00", "Też nic nie robienie"],
        ["2021-12-16", "4:00", "2021-12-16", "13:00", "bruh"],
    ];
    let t = "2021-12-26";
    let g = "20:54";

    const monday = getMonday(new Date());
    const nextMonday = addDays(monday, 7);
    $: days = Array.from({ length: 7 }, () => []);

    onMount(() => {
        ShowPlans(EachWeek());
        document.getElementsByClassName("week")[0].style.height =
            document.getElementsByClassName("hours")[0].offsetHeight -
            20 +
            "px";
    });
    function EachWeek() {
        return plans.filter(
            (plan) =>
                new Date(plan[0]) >= monday && new Date(plan[2]) <= nextMonday
        );
    }
    function ShowPlans(plans) {
        plans.forEach(([startDate, startTime, endDate, endTime, text]) => {
            const start = new Date(startDate + " " + startTime);
            const end = new Date(endDate + " " + endTime);
            const h = document.querySelector(".hours").offsetHeight;
            const top = getHeight(start) * h;
            let i = start.getDay() - 1;
            const current = new Date(start);
            const afterEnd = new Date(end);
            afterEnd.setDate(afterEnd.getDate() + 1);
            do {
                days[i].push({
                    top: current.getDate() == start.getDate() ? top : 0,
                    bottom:
                        current.getDate() == end.getDate()
                            ? h * (1 - getHeight(end))
                            : 0,
                    text,
                });
                current.setDate(current.getDate() + 1);
                i++;
            } while (current.getDate() != afterEnd.getDate());
            days = days;
        });
    }

    function generateHours() {
        const hours = [];
        for (let i = 0; i < 24; i++) {
            hours.push(i > 12 ? i - 12 + ` PM` : i + ` AM`);
        }
        return hours;
    }

    function getHeight(date) {
        const hours = date.getHours();
        const minutes = date.getMinutes();
        return hours / 24 + minutes / 1440;
    }

    function getMonday(date) {
        const day = date.getDay();
        return new Date(
            date.getFullYear(),
            date.getMonth(),
            date.getDate() - day + 1
        );
    }

    function addDays(date, days) {
        const copy = new Date(date);
        copy.setDate(date.getDate() + days);
        return copy;
    }

    function displayDate(date) {
        const day = date.getDate();
        const month = months[date.getMonth()];
        return `${day} ${month}`;
    }
</script>

<h1>Hello world!</h1>
<div class="calendar">
    <div style="display: flex; flex-direction: row">
        <div class="headerCalendar">
            {displayDate(monday)}<br />
            {displayDate(nextMonday)}
        </div>
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
        {#each days as day}
            <div class="day">
                {#each day as plan}
                    <div
                        class="plan"
                        style="top: {plan.top}px; bottom: {plan.bottom}px"
                    >
                        {plan.text}
                    </div>
                {/each}
            </div>
        {/each}
    </div>
</div>
<input type="date" id="s" bind:value={t} />
<input type="time" id="g" bind:value={g} />

<style>
    .hour {
        margin: 5px;
        padding: 3px;
    }
    .calendar {
        position: relative;
        width: 100%;
        overflow: hidden;
    }
    .hours {
        float: left;
        width: 100px;
    }
    .day {
        border: 1px solid black;
        height: 99%;
        width: 20vw;
        text-align: center;
        margin: 2px;
        padding: 10px;
        position: relative;
    }
    :global(.plan) {
        background-color: aqua;
        position: absolute;
    }
    .week {
        display: flex;
    }
    .headerCalendar {
        width: 20vw;
        padding: 10px;
        margin: 2px;
        border: 1px solid black;
    }
    .headerCalendar:first-of-type {
        border: 0px;
        min-width: 100px;
        max-width: 100px;
        padding: 0px;
        margin: 0px;
    }
</style>
