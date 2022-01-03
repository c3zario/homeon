import express from "express";
import path from "path";
import { Find, Insert } from './Database';
import cookieSession from "cookie-session"

import bcrypt from "bcryptjs"
import { nanoid } from "nanoid"


const app = express();
app.use(express.static("frontend/public"));
app.use(express.json())
app.use(cookieSession({
    name: 'session',
    keys: ['a'],
}))


Main();
async function Main() 
{
    app.get("/", (req, res) => {
        res.sendFile(path.resolve("frontend/public/index.html"));
    });

    app.listen(process.env.PORT || 3000);
}

app.get("/checkLogin", (req: any, res) => {
    res.send(req.session.user ? req.session.user : {})
});



// authorization
app.post("/register", async (req: any, res) => {
    res.send(await register(req))
})

app.post("/login", async (req: any, res) => {
    res.send(await login(req))
})

app.get("/logout", async (req: any, res) => {
    req.session.user = {}
    res.send()
})

async function register(req: any) {
    const [email]: any = await Find("Users", { email: req.body.email })
    if(email) return "Podany adres email został już zarejestrowany"

    const [login]: any = await Find("Users", { login: req.body.login })
    if(login) return "Podany login jest już zajęty"
    
    await Insert(
        "Users",
        {
            login: req.body.login,
            password: await bcrypt.hash(req.body.password, 10),
            email: req.body.email,
            registered: 0,
            hash: nanoid()
        }
    )

    return "Konto zostało utworzone! Dokończ rejestrację klikając w link wysłany na podany adres email"
}

async function login(req: any) {
    const [user]: any = await Find("Users", { login: req.body.login })

    if(!user) return "Konto o podanym loginie nie istnieje"

    const passwordHash = await bcrypt.compare(req.body.password, user.password)
    
    if(!passwordHash) return "Niepoprawne hasło"

    if(user.confirmEmailToken) return "Dokończ rejestrację klikając w link wysłany na podany adres email"

    req.session.user = {
        login: user.login,
        email: user.email
    }

    return ""
}