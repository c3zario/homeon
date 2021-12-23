<script type="ts">
    import Calendar from "./Calendar.svelte";
    import { Router, Link, Route } from "svelte-routing";

    let plans = [
        {
            start: new Date("2021-12-15 12:54"),
            end: new Date("2021-12-15 23:59"),
            text: "nic nie robienie",
        },
        {
            start: new Date("2021-12-11 5:00"),
            end: new Date("2021-12-14 10:00"),
            text: "Też nic nie robienie",
        },
        {
            start: new Date("2021-12-16 4:00"),
            end: new Date("2021-12-16 13:00"),
            text: "bruh",
        },
        {
            start: new Date("2021-12-18 13:00"),
            end: new Date("2021-12-20 23:00"),
            text: "was",
        },
    ];
    let date = "2021-12-26";
    let time = "20:54";
</script>

<Router>
    <h1>Hello world!</h1>
    <nav>
        <ul>
            <li>
                <Link to="/">Kalendarz</Link>
            </li>
            <li>
                <Link to="/test">Test</Link>
            </li>
        </ul>
    </nav>
    <Route path="/">
        <Calendar {plans} date={new Date()} />
        <input type="date" bind:value={date} />
        <input type="time" bind:value={time} />
    </Route>
    <Route path="/test">
        <h2>Test</h2>
    </Route>
    <Route>
        <p>404 Not Found</p>
    </Route>
</Router>

<style>
    :global(*, ::before, ::after) {
        box-sizing: border-box;
    }
</style>
