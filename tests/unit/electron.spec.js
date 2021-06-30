import testWithSpectron from 'vue-cli-plugin-electron-builder/lib/testWithSpectron';
import chai from 'chai';
import chaiAsPromised from 'chai-as-promised';
// eslint-disable-next-line no-undef
const spectron = __non_webpack_require__('spectron');

chai.should();
chai.use(chaiAsPromised);

describe('Application launch', () => {
  this.timeout(30000);

  beforeEach(() => testWithSpectron(spectron).then((instance) => {
    this.app = instance.app;
    this.stopServe = instance.stopServe;
  }));

  beforeEach(() => {
    chaiAsPromised.transferPromiseness = this.app.transferPromiseness;
  });

  afterEach(() => {
    if (this.app && this.app.isRunning()) {
      return this.stopServe();
    }
  });

  it('opens a window', () => Promise.all([
    this.app.client.getWindowCount().should.eventually.have.at.least(1),
    this.app.client.browserWindow.isMinimized().should.eventually.be.false,
    this.app.client.browserWindow.isVisible().should.eventually.be.true,
    this.app.client.browserWindow
      .getBounds()
      .should.eventually.have.property('width')
      .and.be.above(0),
    this.app.client.browserWindow
      .getBounds()
      .should.eventually.have.property('height')
      .and.be.above(0),
  ]));
});
