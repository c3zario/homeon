<script type="ts">
    const months = [
        "stycznia",
        "lutego",
        "marca",
        "kwietnia",
        "maja",
        "czerwca",
        "lipca",
        "sierpnia",
        "września",
        "października",
        "listopada",
        "grudnia",
    ];

    export let date: Date;
    $: day = date.getDate();
    $: month = months[date.getMonth()];
</script>

{day} {month}
