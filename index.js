const Koa = require('koa');
const Router = require('koa-router');
const axios = require('axios');
const {Tags, FORMAT_HTTP_HEADERS} = require('opentracing');
const {initTracer} = require('./utils/tracer');
const promisedDelay = require('./utils/promisedDelay');

const app = new Koa();
const router = new Router();
const tracer = initTracer(process.env.SERVICE_NAME)

router.get('/', async (ctx, next) => {
  const span = tracer.startSpan('init-span');
  const requestId = Date.now().toString();
  span.setTag(Tags.HTTP_URL, ctx.url);
  span.setTag(Tags.HTTP_METHOD, ctx.method);
  span.setTag(Tags.SPAN_KIND, Tags.SPAN_KIND_RPC_CLIENT);
  span.setTag("requestId", requestId);
  // Send span context via request headers (parent id etc.)
  tracer.inject(span, FORMAT_HTTP_HEADERS, ctx.headers);

  await promisedDelay(process.env.SERVICE_NAME, span);

  const response = await axios.get('http://localhost:3001/touch', {
    headers: {
      ...ctx.headers,
      requestId
    }
  });

  ctx.status = response.status;

  span.setTag(Tags.HTTP_STATUS_CODE, response.status)
  let responseBody;
  if (response.status === 200) {
    responseBody = {ok: 1};
  } else {
    responseBody = {ok: 0};
  }
  ctx.response.headers['Content-Type'] = 'application/json';
  ctx.body = JSON.stringify(responseBody);
  span.finish();
});

app
  .use(router.routes())
  .use(router.allowedMethods());

app.listen(process.env.PORT);