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
    let email = "";

    async function submit() {
        info = await postJson("/register", { login, password, email });
    }
</script>
<h2>Rejestracja</h2>
<form class="form" on:submit|preventDefault={submit}>
    Login <input type="text" bind:value={login} required /><br>
    Hasło <input type="password" bind:value={password} required /><br>
    Email <input type="email" bind:value={email} required /><br>

    <p>{info}</p><br>
    <button type="submit">Zarejestruj</button>
</form>
