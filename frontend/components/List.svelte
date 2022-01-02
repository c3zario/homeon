<script type="ts">
    import { onMount } from 'svelte';
    interface item{
        id:Number,
        count: Number,
        text: String,
    }
    let List:item[] = [];
    onMount(async () => {
        const rawResponse = await fetch("/test", {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            }
        });
        List = await rawResponse.json();
        console.log(List);
    });
    function DeleteItem(e)
    {  
        console.log(e);
    }
</script>
{#each List as item}
    <div class="card">
        <div class="num-display">
            {item.id}
        </div>
        <div class="close" on:click={() => DeleteItem(item.id)}>X</div>
        <p class="text-display">
            {item.text}
            <br>
            Ilość:
            {item.count} 
        </p>
    </div>
{/each}

<style>

    .num-display {
        position: absolute;
        top: -10px;
        left: -10px;
        width: 50px;
        height: 50px;
        background: #ff6a95;
        color: #fff;
        border: 1px #eee solid;
        border-radius: 50%;
        padding: 10px;
        text-align: center;
        font-size: 19px;
    }

    .close {
        position: absolute;
        top: 10px;
        right: 20px;
        cursor: pointer;
        background: none;
        border: none;
    }
    .card
    {
        background-color: rgb(121, 3, 121);
        color: rgb(233, 233, 255);
        border-radius: 15px;
        padding: 40px 50px;
        margin: 20px 0;
        position: relative;
    }
</style>
