<script type="ts">
    import LoginForm from "./Authorization/LoginForm.svelte";
    import RegisterForm from "./Authorization/RegisterForm.svelte";

    let buttonSwitch = true;
    let buttonSwitchValue = "Mam już konto";

    function toggle() {
        buttonSwitch = !buttonSwitch;
        buttonSwitchValue = buttonSwitch ? "Mam już konto" : "Utwórz konto";
    }
</script>

<div class="authorization">
    <div class="app-logo">
        <div>Home ON</div>
        <div>Inteligentny Dom</div>
    </div>
    <div class="profile">
        <div>
            {#if buttonSwitch}<RegisterForm />{/if}
            {#if !buttonSwitch}<LoginForm />{/if}
            <button type="button" on:click={toggle}>{buttonSwitchValue}</button>
        </div>
    </div>
</div>

<style lang="scss">
    @import "../styles/variables.scss";

    .authorization {
        height: 100%;
        background-color: $p-color;

        display: flex;
        flex-flow: column;

        .app-logo {
            flex: 1;

            display: flex;
            flex-flow: column;
            align-items: center;
            justify-content: center;

            color: white;

            > div {
                &:nth-child(1) {
                    font-size: 11vmin;
                }

                &:nth-child(2) {
                    font-size: 5vmin;
                }
            }
        }

        .profile {
            flex: 1.5;

            display: flex;
            justify-content: center;

            color: white;

            div {
                display: flex;
                flex-flow: column;
                align-items: center;
                justify-content: space-between;
                padding-bottom: 4vmin;
            }

            button {
                border: none;
                border-radius: 2vmin;

                padding: 3vmin 7.5vmin;
                margin: 1vmin;

                box-shadow: -0.5vmin -0.5vmin 1vmin 0vmin #00000040,
                    0.5vmin 0.5vmin 1vmin 0vmin #00000040;

                background-color: $s-color-dark;
                color: #ffffffe6;
                font-size: 4vmin;
            }
        }
    }
</style>
