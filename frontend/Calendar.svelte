<script type="ts">
    import DateText from "./DateText.svelte";

    export let plans: {
        start: Date;
        end: Date;
        text: string;
    }[];
    export let date: Date;

    $: plansForThisWeek = plans.filter(
        ({ start, end }) =>
            (start >= monday && start <= nextMonday) ||
            (end >= monday && end <= nextMonday) ||
            (start <= monday && end >= nextMonday)
    );

    const hours = generateHours();
    const monday = getMonday(date);
    const nextMonday = addDays(monday, 7);

    let days = Array.from({ length: 7 }, () => []);

    $: for (const { start, end, text } of plansForThisWeek) {
        let i = start <= monday ? 0 : start.getDay() - 1;
        let current: Date;
        do {
            current = addDays(monday, i);
            days[i].push({
                top: isSameDate(current, start)
                    ? getFractionOfDayPassed(start)
                    : 0,
                bottom: isSameDate(current, end)
                    ? 1 - getFractionOfDayPassed(end)
                    : 0,
                text,
            });
            ++i;
        } while (!isSameDate(current, end) && i < 7);
        days = days;
    }

    const daysOfWeek = [
        "Poniedziałek",
        "Wtorek",
        "Środa",
        "Czwartek",
        "Piątek",
        "Sobota",
        "Niedziela",
    ];

    function generateHours() {
        const hours = [];
        for (let i = 0; i < 24; i++) {
            hours.push(i > 12 ? i - 12 + ` PM` : i + ` AM`);
        }
        return hours;
    }

    function getFractionOfDayPassed(date: Date) {
        const hours = date.getHours();
        const minutes = date.getMinutes();
        return (hours + minutes / 60) / 24;
    }

    function getMonday(date: Date) {
        return new Date(
            date.getFullYear(),
            date.getMonth(),
            date.getDate() - date.getDay() + 1
        );
    }

    function addDays(date: Date, days: number) {
        const copy = new Date(date);
        copy.setDate(date.getDate() + days);
        return copy;
    }

    function isSameDate(first: Date, second: Date) {
        return (
            first.getFullYear() == second.getFullYear() &&
            first.getMonth() == second.getMonth() &&
            first.getDate() == second.getDate()
        );
    }
</script>

<div class="calendar">
    <div style="display: flex; flex-direction: row">
        <div class="date-texts">
            <DateText date={monday} />
            <br />
            <DateText date={nextMonday} />
        </div>
        {#each daysOfWeek as day}
            <div class="day-header">{day}</div>
        {/each}
    </div>
    <div class="calendar__body">
        <div class="hours">
            {#each hours as hour}
                <div class="hour">{hour}</div>
            {/each}
        </div>
        <div class="week">
            {#each days as day}
                <div class="day">
                    {#each day as { top, bottom, text }}
                        <div
                            class="plan"
                            style="top: {top * 100}%; bottom: {bottom * 100}%"
                        >
                            {text}
                        </div>
                    {/each}
                </div>
            {/each}
        </div>
    </div>
</div>

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

    .calendar__body {
        display: flex;
    }

    .hours {
        width: 100px;
    }

    .day {
        border: 1px solid black;
        height: 100%;
        width: 100%;
        text-align: center;
        margin-left: 2px;
        margin-right: 2px;
        padding: 10px;
        position: relative;
    }

    .plan {
        background-color: aqua;
        position: absolute;
    }

    .week {
        flex: 1 0;
        display: flex;
    }

    .day-header {
        width: 100%;
        padding: 10px;
        margin: 2px;
        border: 1px solid black;
    }

    .date-texts {
        min-width: 100px;
    }
</style>
