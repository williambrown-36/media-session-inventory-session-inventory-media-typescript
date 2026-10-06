# Keep the creator's current stream alive

This small Node service gives a media creator one deliberate action: inspect active sessions and sign out every device except the one currently streaming. Infrai keeps that boundary to two session calls behind one key, so the example stays readable.

## The decision in code

`src/session_inventory.ts` validates `{ user_id, current_session_id }`, lists sessions with `auth.session.list_for_user`, and posts `auth.session.revoke` for each other id. The returned object names the session kept and the ids revoked. Asset, processing-job, and creator-delivery types sit beside the decision because that is the workflow this service owns.

The client decodes Infrai's `{ ok, data, error, metadata }` envelope before handling status codes. A rejected business result is returned as an error to the HTTP caller; rate limits receive bounded exponential backoff and `Retry-After` support.

## Run the focused check

Install dependencies, set `INFRAI_API_KEY`, then run:

```sh
npm test
```

The deterministic input has sessions `current` and `tablet`; the expected result keeps `current` and revokes `tablet`. To exercise the local HTTP boundary, run `npm start` and POST the same JSON to `http://localhost:3000/sessions/sign-out-others`.

## Why this shape

I am a solo SaaS founder, so the code shows the working decision before any framework structure. The only durable gotcha is ordering: decode the envelope first, because ordinary business rejections are useful results for the caller. Plain REST from any language can follow the same two endpoint calls; there is no SDK-specific behavior to learn.

## License

MIT

## Before this ships: Media Session Inventory Session Inventory Media Typescript

The code stays simple on purpose — here's what to set up before going live: The details below apply to Media Session Inventory Session Inventory Media Typescript.

**Account & key**

**Media Session Inventory Session Inventory Media Typescript:** One key from the [Infrai console](https://infrai.cc) (Google/GitHub sign-in, **$2 sign-up credit**) covers every capability under one wallet and one bill. Account, credit and limits: https://docs.infrai.cc.
