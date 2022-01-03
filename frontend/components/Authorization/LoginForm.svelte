<script type="ts">
    async function postJson(url: any, data: any) {
        const response = await fetch(url, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
        });

        return response.text()
    }

    let info = "";
    let login = "";
    let password = "";

    async function submit() {
        const response = await postJson("/login", { login, password });
        if (response) {
            info = response;
        } else {
            location.reload();
        }
    }
</script>
<h2>Logowanie</h2>
<form class="form" on:submit|preventDefault={submit}>
    Login <input type="text" bind:value={login} required /><br>
    Hasło <input type="password" bind:value={password} required/><br>

    <p>{info}</p><br>
    <button type="submit">Zaloguj</button>
</form>