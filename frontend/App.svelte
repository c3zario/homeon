<script type="ts">
    import Calendar from "./components/Calendar.svelte";
    import { Router, Link, Route } from "svelte-routing";

    import Authorization from "./components/Authorization.svelte";
    import List from "./components/list.svelte";

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

{#await fetch("/checkLogin").then(response => response.json()) then user}
{#if !user.login}
    <Authorization />
{:else}
    {user.login}
    <button on:click={() => { fetch("/logout"); window.location.reload() }}>Wyloguj</button>
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
        <nav>
            <Route path="/test">
                <List />
            </Route>
        </nav>
        <Route>
            <p>404 Not Found</p>
        </Route>
    </Router>
{/if}
{/await}

<style>
    :global(*, ::before, ::after) {
        box-sizing: border-box;
    }
</style>
