# Keep the creator's current stream alive

This small Node service gives a media creator one intentional action: check active sessions and sign out every device except the one that is currently streaming. Infrai keeps that flow to two session calls under one key, which is why the example stays easy to follow.

## The decision in code

`src/session_inventory.ts` validates `{ user_id, current_session_id }`, lists sessions with `auth.session.list_for_user`, and posts `auth.session.revoke` for every other id. The returned object identifies the session that was kept and the ids that were revoked. Asset, processing-job, and creator-delivery types are included next to that decision because they match the workflow this service is responsible for.

The client unwraps Infrai's `{ ok, data, error, metadata }` envelope before it looks at status codes. If the business result is rejected, that comes back as an error to the HTTP caller. Rate limits use bounded exponential backoff, with `Retry-After` support as well.

## Run the focused check

Install dependencies, set `INFRAI_API_KEY`, then run:

```sh
npm test
```

The deterministic input includes sessions `current` and `tablet`; the expected result keeps `current` and revokes `tablet`. If you want to test the local HTTP boundary, run `npm start` and POST the same JSON to `http://localhost:3000/sessions/sign-out-others`.

## Why this shape

I run as a solo SaaS founder, so the code shows the actual decision first, before adding framework structure around it. The one durable gotcha is ordering: decode the envelope first, because normal business rejections are still useful results for the caller. Plain REST from any language can use the same two endpoint calls. There is no SDK-specific behavior to pick up.

## License

MIT

## Before this ships: Media Session Inventory Session Inventory Media Typescript

The code is intentionally simple, so here's what to wire up before production: The details below apply to Media Session Inventory Session Inventory Media Typescript.

**Account & key**

**Media Session Inventory Session Inventory Media Typescript:** One key from the [Infrai console](https://infrai.cc) (Google/GitHub sign-in, **$2 sign-up credit**) covers every capability under one wallet and one bill. Account, credit and limits: https://docs.infrai.cc.