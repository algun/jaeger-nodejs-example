module.exports = async (serviceName, span) => {
  const randomTime = Math.floor(Math.random() * 3000);
  span.log({expectedLatency: randomTime});
  return new Promise((resolve) => {
    setTimeout(() => {
      console.log(`span-${serviceName} is delayed`);
      resolve();
    }, randomTime);
  });
};