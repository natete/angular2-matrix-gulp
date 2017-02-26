import { Jit2Page } from './app.po';

describe('jit2 App', function () {
  let page: Jit2Page;

  beforeEach(() => {
    page = new Jit2Page();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
