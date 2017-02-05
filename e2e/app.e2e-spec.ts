import { Auth0WithFirebasePage } from './app.po';

describe('auth0-with-firebase App', function() {
  let page: Auth0WithFirebasePage;

  beforeEach(() => {
    page = new Auth0WithFirebasePage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
