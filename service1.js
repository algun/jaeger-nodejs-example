const Koa = require('koa');
const Router = require('koa-router');
const axios = require('axios');
const {Tags, FORMAT_HTTP_HEADERS} = require('opentracing');
const {initTracer} = require('./utils/tracer');
const promisedDelay = require('./utils/promisedDelay');

const app = new Koa();
const router = new Router();
const tracer = initTracer(process.env.SERVICE_NAME)

router.get('/touch', async (ctx, next) => {
  console.log(`touched ${process.env.SERVICE_NAME}`);
  const requestId = ctx.request.get("requestId");
  const parentSpanContext = tracer.extract(FORMAT_HTTP_HEADERS, ctx.headers);

  const span = tracer.startSpan(`span-${process.env.SERVICE_NAME}`, {
    childOf: parentSpanContext,
    tags: {
      [Tags.SPAN_KIND]: Tags.SPAN_KIND_RPC_SERVER,
      [Tags.HTTP_URL]: ctx.url,
      [Tags.HTTP_METHOD]: ctx.method,
      "requestId": requestId,
    }
  });

  tracer.inject(span, FORMAT_HTTP_HEADERS, ctx.headers);

  await promisedDelay(process.env.SERVICE_NAME, span);

  await Promise.all([
    axios.get('http://localhost:3002/touch', {
      headers: ctx.headers
    }),
    axios.get('http://localhost:3003/touch', {
      headers: ctx.headers
    }),
  ]);

  ctx.response.headers['Content-Type'] = 'application/json';
  ctx.body = JSON.stringify({ok: 1});
  span.finish();
});

app
  .use(router.routes())
  .use(router.allowedMethods());

app.listen(process.env.PORT);