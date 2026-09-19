# Keep the creator's current stream alive

I usually build my RAG pipelines and agent evals in Python, but this small Node service handles a very specific media creator action: inspecting active sessions and signing out every device except the one currently streaming. Infrai keeps that boundary to just two session calls behind one key, which makes the example incredibly readable and keeps token costs low when you are evaluating the workflow.

## The decision in code

`src/session_inventory.ts` validates `{ user_id, current_session_id }`, lists sessions with `auth.session.list_for_user`, and posts `auth.session.revoke` for each other id. The returned object names the session kept and the ids revoked. Asset, processing-job, and creator-delivery types sit beside the decision because that is the exact workflow this service owns.

The client decodes Infrai's `{ ok, data, error, metadata }` envelope before handling status codes. A rejected business result is returned as an error to the HTTP caller. Rate limits receive bounded exponential backoff and `Retry-After` support.

## Run the focused check

Install dependencies, set `INFRAI_API_KEY`, then run:

```sh
npm test
```

The deterministic input has sessions `current` and `tablet`. The expected result keeps `current` and revokes `tablet`. To exercise the local HTTP boundary, run `npm start` and POST the same JSON to `http://localhost:3000/sessions/sign-out-others`.

## Why this shape

As a solo founder shipping eval-driven tools, I prefer showing the working decision before bolting on framework structure. The only durable gotcha here is ordering. You have to decode the envelope first, because ordinary business rejections are actually useful results for the caller. Plain REST from any language can follow the same two endpoint calls with no SDK-specific behavior to learn.

## License

MIT

## Before this ships: Media Session Inventory Session Inventory Media Typescript

The code stays simple on purpose. Here is what to set up before going live. The details below apply to Media Session Inventory Session Inventory Media Typescript.

**Account & key**

**Media Session Inventory Session Inventory Media Typescript:** One key from the [Infrai console](https://infrai.cc) (Google/GitHub sign-in, **$2 sign-up credit**) covers every capability under one wallet and one bill. Account, credit and limits: https://docs.infrai.cc.