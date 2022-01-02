<script type="ts">


    (async () => {
        const rawResponse = await fetch("/test", {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            }
        });
        const content = await rawResponse.json();
        console.log(content);
    })();
</script>

Elo

<style>

</style>
