<script type="ts">
    import DateText from "./DateText.svelte";
    import { addDays } from "../util/date";

    export let plans: Plans;

    type Plans = Plan[];

    type Plan = {
        start: Date;
        end: Date;
        text: string;
    };

    export let date: Date;

    $: monday = getMonday(date);
    $: nextMonday = addDays(monday, 7);
    $: dayPlans = generateDayPlans(plans, monday, nextMonday);

    function generateDayPlans(plans: Plans, weekBegin: Date, weekEnd: Date) {
        const dayPlans: DayPlan[][] = Array.from({ length: 7 }, () => []);
        for (const { start, end, text } of plans.filter(isThisWeek)) {
            let i = start <= monday ? 0 : start.getDay() - 1;
            let current: Date;
            do {
                current = addDays(monday, i);
                dayPlans[i].push({
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
        }
        return dayPlans;

        function isThisWeek({ start, end }: Plan) {
            return (
                (start >= weekBegin && start <= weekEnd) ||
                (end >= weekBegin && end <= weekEnd) ||
                (start <= weekBegin && end >= weekEnd)
            );
        }

        type DayPlan = {
            top: number;
            bottom: number;
            text: string;
        };
    }

    function generateHours() {
        const hours: string[] = [];
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

    function isSameDate(first: Date, second: Date) {
        return (
            first.getFullYear() == second.getFullYear() &&
            first.getMonth() == second.getMonth() &&
            first.getDate() == second.getDate()
        );
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
</script>

<div class="calendar">
    <div class="calendar-header">
        <div class="date-texts">
            <DateText date={monday} />
            <br />
            <DateText date={nextMonday} />
        </div>
        <div class="days-header">
        {#each daysOfWeek as day}
            <div class="day-header">{day}</div>
        {/each}
        </div>
    </div>
    <div class="calendar__body">
        <div class="hours">
            {#each generateHours() as hour}
                <div class="hour">{hour}</div>
            {/each}
        </div>
        <div class="week">
            {#each dayPlans as plan}
                <div class="day">
                    {#each plan as { top, bottom, text }}
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
        width: 100%;
    }

    .calendar__body {
        display: grid;
        grid-template-columns: 100px;
    }

    .hours {
        
        grid-column-start: 1;
        grid-column-end: 1;
    }
    .calendar-header
    {
        display: grid;
        grid-template-columns: 100px;
    }

    .day {
        border: 1px solid black;
        height: 100%;
        width: 100%;
        text-align: center;
        margin-left: 2px;
        margin-right: 2px;
        padding: 10px;
    }

    .plan {
        background-color: aqua;
    }

    .week {
        grid-column-start: 2;
        grid-column-end: 2;
        display: grid;
        grid-template-columns: repeat(7, 1fr);
    }

    .day-header {
        width: 100%;
        padding: 10px;
        margin: 2px;
        border: 1px solid black;
    }
    .days-header{
        grid-column-start: 2;
        display: grid;
        grid-template-columns: repeat(7, 1fr);
    }

    .date-texts {
        min-width: 100px;
    }
</style>
