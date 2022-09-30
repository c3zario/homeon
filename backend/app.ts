import express from "express";
import path from "path";
import { getDatabase } from "./database";
import bcrypt from "bcryptjs";
import { nanoid } from "nanoid";
import cookieSession from "cookie-session";
import http from "http";
import { Server } from "socket.io";
import axios from "axios";
import dotenv from "dotenv";
import * as routes from "./routes";
import { addApi } from "./api";

dotenv.config();

main();

async function main() {
    const app = express();
    const server = http.createServer(app);
    const io = new Server(server);

    io.on("connection", (socket) => {
        socket.on("newGroup", (newGroup) => {
            handleErrors(async () => {
                socket.rooms.forEach((room) => {
                    socket.leave(room);
                });
                socket.join(newGroup?.token);
            });
        });
        socket.on(
            "newPosition",
            ({ user: { login, email }, position, time, group: { token } }) => {
                handleErrors(async () => {
                    const street = await getStreet(
                        process.env.OPEN_CAGE_DATA_API_KEY
                    );
                    await database.users.updateOne(
                        { login, email },
                        {
                            $set: {
                                position,
                                time,
                                street: street,
                            },
                        }
                    );
                    io.to(token).emit("position", await getPositions(token));

                    async function getStreet(apiKey: string | undefined) {
                        if (apiKey === undefined) return "";
                        const url = `https://api.opencagedata.com/geocode/v1/json?q=${position.x}+${position.y}&key=${apiKey}`;
                        return (await axios.get(url)).data.results[0].formatted;
                    }
                });
            }
        );
        socket.on("getPositions", (group) => {
            handleErrors(async () => {
                io.to(group.token).emit(
                    "position",
                    await getPositions(group.token)
                );
            });
        });
        socket.on("setHome", (obj) => {
            handleErrors(async () => {
                await database.groups.updateOne(
                    { token: obj.group.token },
                    { $set: { home: { x: obj.lat, y: obj.lng } } }
                );
            });
        });
    });
    async function getPositions(token: string) {
        interface Position {
            x: number;
            y: number;
        }

        interface Pos {
            login: string;
            position: Position;
            street: string;
            time: number;
        }

        let users = await database.users.find({ groups: token }).toArray();
        let positions: Pos[] = [];
        for (const user of users) {
            positions.push({
                position: user?.position,
                login: user?.login,
                street: user?.street,
                time: user?.time,
            });
        }

        return positions;
    }

    app.use(express.static("frontend/public"));
    app.use(express.text());
    app.use(express.json());
    app.use(
        cookieSession({
            name: "session",
            keys: [process.env.SESSION_SECRET ?? "secret"],
        })
    );
    const database = await getDatabase();
    if ((await database.lastId.countDocuments()) === 0) {
        await database.lastId.insertOne({ id: 0 });
    }

    async function updateRooms(token: string) {
        io.to(token).emit("Group", await database.groups.findOne({ token }));
    }

    app.get("/api/checkLogin", (req, res) => {
        res.send(req.session?.user ?? {});
    });

    // authorization
    app.post("/register", (req, res) => {
        handleErrors(async () => {
            res.send(await register(req));
        });
    });

    app.post("/login", (req, res) => {
        handleErrors(async () => {
            res.send(await login(req));
        });
    });

    app.get("/logout", (req, res) => {
        if (req.session) {
            req.session.user = {};
        }
        res.send();
    });

    addApi(app, {
        groups: routes.groups(database),
        "add-group": routes.addGroup(database),
        "leave-group": routes.leaveGroup(database),
    });

    app.post("/api/add-plan", (req, res) => {
        handleErrors(async () => {
            const { token, plan } = req.body;
            await database.groups.updateOne(
                { token },
                {
                    $push: {
                        plans: {
                            id: nanoid(),
                            ...plan,
                        },
                    },
                }
            );
            await updateRooms(token);
            res.send();
        });
    });

    app.get("/group/:token", (req, res, next) => {
        handleErrors(async () => {
            await database.users.updateOne(
                { login: req.session?.user.login },
                { $push: { groups: req.params.token } }
            );
            next();
        });
    });

    app.get("*", (req, res) => {
        res.sendFile(path.resolve("frontend/public/index.html"));
    });

    app.post("/shopping-list", (req, res) => {
        handleErrors(async () => {
            let group = await database.groups.findOne({
                token: req.body.token,
            });
            res.send(group?.list);
        });
    });

    app.post("/updateList", (req, res) => {
        handleErrors(async () => {
            let group = JSON.parse(req.body);
            //group = group.group;
            //if (JSON.parse(req.body).length > 0)
            await database.groups.updateOne(
                { token: group.group.token },
                { $set: { list: group.group.list } }
            );
            await updateRooms(group.group.token);
            res.send();
        });
    });

    app.post("/api/remove-plan", (req, res) => {
        handleErrors(async () => {
            const { token, id } = req.body;
            await database.groups.updateOne(
                { token },
                { $pull: { plans: { id } } }
            );
            await updateRooms(token);
            res.send();
        });
    });

    // lights
    app.post("/get-lights", (req, res) => {
        handleErrors(async () => {
            const { lights } =
                (await database.groups.findOne({ token: req.body })) ?? {};
            res.send(lights);
        });
    });

    app.post("/api/add-light", (req, res) => {
        handleErrors(async () => {
            const { token } = req.body;
            await database.lastId.updateOne({}, { $inc: { id: 1 } });
            const { id } = (await database.lastId.findOne()) ?? {};
            if (!id) {
                throw new Error("No id");
            }
            io.send("0|SET|" + id);
            await database.groups.updateOne(
                { token },
                {
                    $push: {
                        lights: {
                            id,
                            name: "new",
                            work: false,
                        },
                    },
                }
            );
            res.send();
        });
    });

    app.post("/api/switch-light", (req, res) => {
        handleErrors(async () => {
            const { id, work, token } = req.body;
            io.send(id + "|" + (work ? "ON" : "OFF"));
            await database.groups.updateOne(
                { token, "lights.id": id },
                { $set: { "lights.$.work": work } }
            );
            res.send();
        });
    });

    app.post("/api/remove-light", (req, res) => {
        handleErrors(async () => {
            const { token, id } = req.body;
            io.send(id + "|SET|0");
            await database.groups.updateOne(
                { token },
                { $pull: { lights: { id } } }
            );
            res.send();
        });
    });

    app.post("/api/edit-light", (req, res) => {
        handleErrors(async () => {
            let { id, name, token } = req.body;

            await database.groups.updateOne(
                { token, "lights.id": id },
                { $set: { "lights.$.name": name } }
            );
            res.send();
        });
    });

    app.post("/api/reset-all", (req, res) => {
        handleErrors(async () => {
            io.send("RESET");
            await database.groups.updateMany({}, { $set: { lights: [] } });
            res.send();
        });
    });

    server.listen(process.env.PORT || 8080);

    async function register(req: any) {
        const { login, email, password } = req.body;

        if (
            await database.users.findOne({
                email,
            })
        )
            return "Podany adres email został już zarejestrowany";

        if (
            await database.users.findOne({
                login,
            })
        )
            return "Podany login jest już zajęty";

        const personalGroupToken = nanoid();

        await Promise.all([
            database.users.insertOne({
                login,
                password: await bcrypt.hash(password, 10),
                email,
                groups: [personalGroupToken],
                position: { x: 0, y: 0 },
                time: 0,
                street: "",
            }),
            database.groups.insertOne({
                name: "Osobiste",
                token: personalGroupToken,
                plans: [],
                list: [],
                home: null,
                lights: [],
            }),
        ]);

        req.session.user = {
            login,
            email,
        };

        return "";
    }

    async function login(req: any) {
        const { login, password } = req.body;
        const user = await database.users.findOne({
            login,
        });
        if (user === null) return "Konto o podanym loginie nie istnieje";

        const passwordHash = await bcrypt.compare(password, user.password);

        if (!passwordHash) return "Niepoprawne hasło";

        req.session.user = {
            login: user.login,
            email: user.email,
        };

        return "";
    }
}

async function handleErrors(callback: () => Promise<void>) {
    try {
        await callback();
    } catch (error) {
        console.error(error instanceof Error ? error.message : error);
    }
}
