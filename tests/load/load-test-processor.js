module.exports = {
  $randomNumber,
  beforeScenario,
  afterScenario,
};

function $randomNumber(context, events, done) {
  return Math.floor(Math.random() * 10000);
}

function beforeScenario(context, events, done) {
  context.vars.userAgent = 'Artillery Load Test';
  return done();
}

function afterScenario(context, events, done) {
  return done();
}
