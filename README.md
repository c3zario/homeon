# Home ON
## Home ON – Smart Home System

A comprehensive smart home management system built with a 3-person team. The system combines custom-built hardware (eSwitch devices) with a mobile app to give users full control over their home from any device.

**Key features:**
- Remote control of lighting and devices via 433MHz radio signal
- Daily schedule planning and task lists
- Geolocation-based automation (auto turn off when leaving home)
- Available on Android (Google Play) and any browser

> 🥉 3rd place · School Science Picnic 2022

## Photos
<img width="720" height="294" alt="image" src="https://github.com/user-attachments/assets/301dd6dd-c2ac-4298-aea9-c3e88eb6432d" />
<img width="343" height="364" alt="image" src="https://github.com/user-attachments/assets/51f8b3a2-3271-45de-b4a3-30bb7d008a95" />
<img width="181" height="386" alt="image" src="https://github.com/user-attachments/assets/6075f7fc-d93f-4d66-9459-40fba3f957e3" />
<img width="145" height="309" alt="image" src="https://github.com/user-attachments/assets/5926ac77-e5d7-4d31-aa08-f936a432b071" />
<img width="144" height="238" alt="image" src="https://github.com/user-attachments/assets/54035b07-77a3-4a7d-a790-f072910e3a35" />

## Setup
1. `npm i`
2. Create file .env with: `SESSION_SECRET=<secret>`, where `<secret>` is an unguessable secret string
## Development
1. Make sure you have MongoDB running
2. `npm run dev`
3. Open `localhost:8080` in the browser

## Python generate App
`auto-py-to-exe`

## Database

#### list
`
"id": ,
"text": ,
"count": ,
`

### light

#### check
`
"name": "check",
"check": false,
"isset": false
`

#### light
`
"name": "lights",
"lights": [
  {
    "name": "salon",
    "work": true
  },
  {
    "name": "kuchnia",
    "work": false
  },
  {
    "name": "sypialnia",
    "work": false
  },
  {
    "name": "łazienka",
    "work": true
  }
]
`

## Adding a POST endpoint to the typed API
1. Create file `backend/routes/my-endpoint.ts`:
```ts
import { z } from "zod";
import { makePostEndpoint } from "./route";

export function myEndpoint(/* pass objects like database here */) {
    return {
        post: makePostEndpoint({
            schema: z.object({
                // example begin
                name: z.string(),
                id: z.number(),
                // example end
            }),
            async handle({ /* params from schema */ }, { login, email }) {
                // DO STUFF HERE
                // return value is sent to the client as JSON
            },
        });
    };
}
```
2. Add this to `backend/routes/index.ts`:
```ts
export * from "./my-endpoint";
```
3. Add this to `app.ts` inside the `addApi` call:
```ts
    "my-endpoint": routes.myEndpoint(/* pass objects like database here */),
```
4. Use the endpoint in frontend code:
```ts
import * as typedApi from "../util/typed-api";

// in an async function
const json = await typedApi.post("my-endpoint", {
    // example begin
    name: "Volper",
    id: 1,
    // example end
});
```
